import {
  BASE_LOAD_GW,
  SOLAR_CAPACITY_FACTOR,
} from "../unit-01-grid-day/model.mjs";

export const DEFAULT_TWO_UNIT_CONFIG = Object.freeze({
  unitCapacityMW: 60,
  availabilityPct: 90,
  loadMW: 100,
});

export const DEFAULT_SYSTEM_CONFIG = Object.freeze({
  trials: 1000,
  seed: 2026,
  studyDays: 30,
  peakLoadGW: 120,
  dataCenterGW: 0,
  thermalForcedOutagePct: 4,
  commonEventPct: 0.2,
  batteryDurationHours: 4,
  demandResponseGW: 5,
});

const clamp = (value, minimum, maximum) =>
  Math.min(maximum, Math.max(minimum, Number(value)));

export function createSeededRandom(seed = 1) {
  let state = (Math.trunc(Number(seed)) || 1) >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function normalizeTwoUnit(config = {}) {
  const merged = { ...DEFAULT_TWO_UNIT_CONFIG, ...config };
  return {
    unitCapacityMW: clamp(merged.unitCapacityMW, 1, 10000),
    availabilityPct: clamp(merged.availabilityPct, 0, 100),
    loadMW: clamp(merged.loadMW, 0, 20000),
  };
}

export function twoUnitStateSpace(config = {}) {
  const normalized = normalizeTwoUnit(config);
  const availability = normalized.availabilityPct / 100;
  const outage = 1 - availability;
  const states = [
    { id: "both", label: "Both available", availableUnits: 2, probability: availability ** 2 },
    { id: "one", label: "Exactly one available", availableUnits: 1, probability: 2 * availability * outage },
    { id: "neither", label: "Neither available", availableUnits: 0, probability: outage ** 2 },
  ].map((state) => {
    const availableMW = state.availableUnits * normalized.unitCapacityMW;
    const shortageMW = Math.max(0, normalized.loadMW - availableMW);
    return { ...state, availableMW, shortageMW, lossOfLoad: shortageMW > 0 };
  });

  const lolp = states.reduce((sum, state) => sum + (state.lossOfLoad ? state.probability : 0), 0);
  const eueMWh = states.reduce((sum, state) => sum + state.probability * state.shortageMW, 0);
  const expectedAvailableMW = states.reduce((sum, state) => sum + state.probability * state.availableMW, 0);
  return { config: normalized, states, lolp, eueMWh, expectedAvailableMW };
}

export function runTwoUnitTrials(config = {}, trialCount = 100, seed = 1) {
  const analytical = twoUnitStateSpace(config);
  const random = createSeededRandom(seed);
  const trials = Math.max(0, Math.round(Number(trialCount) || 0));
  const counts = { both: 0, one: 0, neither: 0 };
  let shortageTrials = 0;
  let totalUnservedMWh = 0;
  const history = [];

  for (let index = 1; index <= trials; index += 1) {
    const availableA = random() < analytical.config.availabilityPct / 100;
    const availableB = random() < analytical.config.availabilityPct / 100;
    const availableUnits = Number(availableA) + Number(availableB);
    const stateId = availableUnits === 2 ? "both" : availableUnits === 1 ? "one" : "neither";
    const availableMW = availableUnits * analytical.config.unitCapacityMW;
    const shortageMW = Math.max(0, analytical.config.loadMW - availableMW);
    counts[stateId] += 1;
    if (shortageMW > 0) shortageTrials += 1;
    totalUnservedMWh += shortageMW;

    if (index <= 20 || index % Math.max(1, Math.ceil(trials / 120)) === 0 || index === trials) {
      history.push({
        trials: index,
        sampleLolp: shortageTrials / index,
        sampleEueMWh: totalUnservedMWh / index,
      });
    }
  }

  return {
    analytical,
    trials,
    counts,
    shortageTrials,
    totalUnservedMWh,
    sampleLolp: trials ? shortageTrials / trials : 0,
    sampleEueMWh: trials ? totalUnservedMWh / trials : 0,
    history,
  };
}

function normalizeSystemConfig(config = {}) {
  const merged = { ...DEFAULT_SYSTEM_CONFIG, ...config };
  return {
    trials: Math.round(clamp(merged.trials, 1, 10000)),
    seed: Math.trunc(Number(merged.seed) || 1),
    studyDays: Math.round(clamp(merged.studyDays, 7, 90)),
    peakLoadGW: clamp(merged.peakLoadGW, 80, 180),
    dataCenterGW: clamp(merged.dataCenterGW, 0, 40),
    thermalForcedOutagePct: clamp(merged.thermalForcedOutagePct, 0, 30),
    commonEventPct: clamp(merged.commonEventPct, 0, 25),
    batteryDurationHours: clamp(merged.batteryDurationHours, 0, 16),
    demandResponseGW: clamp(merged.demandResponseGW, 0, 20),
  };
}

function simulateSystemTrial(config, random, captureHours = false) {
  const thermalUnits = 12;
  const thermalUnitGW = 13;
  const repairProbabilityPerHour = 0.08;
  const normalFailureProbability = config.thermalForcedOutagePct >= 99
    ? 1
    : (config.thermalForcedOutagePct / 100) * repairProbabilityPerHour /
      (1 - config.thermalForcedOutagePct / 100);
  const unitsAvailable = Array.from({ length: thermalUnits }, () => random() >= config.thermalForcedOutagePct / 100);
  const batteryPowerGW = 10;
  const batteryEnergyGWh = batteryPowerGW * config.batteryDurationHours;
  let storedEnergyGWh = batteryEnergyGWh;
  let shortageHours = 0;
  let unservedEnergyGWh = 0;
  const shortageDays = new Set();
  const hours = [];
  let commonEventHours = 0;

  for (let day = 0; day < config.studyDays; day += 1) {
    const commonEvent = random() < config.commonEventPct / 100;
    if (commonEvent) commonEventHours += 24;
    const windFactor = commonEvent ? 0.12 + random() * 0.08 : 0.25 + random() * 0.30;

    for (let hourOfDay = 0; hourOfDay < 24; hourOfDay += 1) {
      for (let unit = 0; unit < thermalUnits; unit += 1) {
        if (unitsAvailable[unit]) {
          const failureProbability = normalFailureProbability * (commonEvent ? 3 : 1);
          if (random() < failureProbability) unitsAvailable[unit] = false;
        } else if (random() < repairProbabilityPerHour * (commonEvent ? 0.35 : 1)) {
          unitsAvailable[unit] = true;
        }
      }

      const loadShape = BASE_LOAD_GW[hourOfDay] / 150;
      const stressLoadMultiplier = commonEvent ? 1.1 : 1;
      const loadGW = config.peakLoadGW * loadShape * stressLoadMultiplier + config.dataCenterGW;
      const onlineThermalUnits = unitsAvailable.filter(Boolean).length;
      const commonDerateGW = commonEvent ? 16 : 0;
      const thermalGW = Math.max(0, onlineThermalUnits * thermalUnitGW - commonDerateGW);
      const solarGW = 35 * SOLAR_CAPACITY_FACTOR[hourOfDay] * (commonEvent ? 0.35 : 1);
      const windGW = 20 * windFactor;
      const nonStorageSupplyGW = thermalGW + solarGW + windGW;

      let remainingGW = Math.max(0, loadGW - nonStorageSupplyGW);
      const demandResponseGW = Math.min(config.demandResponseGW, remainingGW);
      remainingGW -= demandResponseGW;
      const batteryDischargeGW = Math.min(batteryPowerGW, storedEnergyGWh, remainingGW);
      storedEnergyGWh -= batteryDischargeGW;
      remainingGW -= batteryDischargeGW;
      const unservedGW = Math.max(0, remainingGW);

      if (unservedGW > 1e-9) {
        shortageHours += 1;
        shortageDays.add(day);
        unservedEnergyGWh += unservedGW;
      }

      const surplusGW = Math.max(0, nonStorageSupplyGW - loadGW);
      const batteryRoomGWh = Math.max(0, batteryEnergyGWh - storedEnergyGWh);
      const batteryChargeGW = Math.min(batteryPowerGW, surplusGW, batteryRoomGWh / 0.9);
      storedEnergyGWh += batteryChargeGW * 0.9;

      if (captureHours) {
        hours.push({
          hour: day * 24 + hourOfDay,
          day,
          hourOfDay,
          commonEvent,
          loadGW,
          thermalGW,
          solarGW,
          windGW,
          demandResponseGW,
          batteryDischargeGW,
          batterySocPct: batteryEnergyGWh ? storedEnergyGWh / batteryEnergyGWh * 100 : 0,
          unservedGW,
        });
      }
    }
  }

  return {
    shortageHours,
    shortageDays: shortageDays.size,
    unservedEnergyGWh,
    anyShortage: shortageHours > 0,
    commonEventHours,
    hours,
  };
}

function histogram(values, requestedBins = 12) {
  const maximum = Math.max(0, ...values);
  if (maximum === 0) return [{ minimum: 0, maximum: 0, count: values.length }];
  const bins = Math.min(requestedBins, Math.max(4, Math.ceil(Math.sqrt(values.length))));
  const width = maximum / bins;
  const result = Array.from({ length: bins }, (_, index) => ({
    minimum: index * width,
    maximum: (index + 1) * width,
    count: 0,
  }));
  for (const value of values) {
    const index = Math.min(bins - 1, Math.floor(value / width));
    result[index].count += 1;
  }
  return result;
}

export function simulateReliability(config = {}) {
  const normalized = normalizeSystemConfig(config);
  const random = createSeededRandom(normalized.seed);
  const annualizationFactor = 365 / normalized.studyDays;
  let totalShortageHours = 0;
  let totalShortageDays = 0;
  let totalUnservedGWh = 0;
  let trialsWithShortage = 0;
  let worstTrial = null;
  const annualizedEueByTrial = [];
  const convergence = [];

  for (let trial = 1; trial <= normalized.trials; trial += 1) {
    const outcome = simulateSystemTrial(normalized, random, false);
    totalShortageHours += outcome.shortageHours;
    totalShortageDays += outcome.shortageDays;
    totalUnservedGWh += outcome.unservedEnergyGWh;
    if (outcome.anyShortage) trialsWithShortage += 1;
    if (!worstTrial || outcome.unservedEnergyGWh > worstTrial.unservedEnergyGWh) worstTrial = { ...outcome, trial };
    annualizedEueByTrial.push(outcome.unservedEnergyGWh * annualizationFactor);
    if (trial <= 20 || trial % Math.max(1, Math.ceil(normalized.trials / 120)) === 0 || trial === normalized.trials) {
      convergence.push({
        trials: trial,
        loleDaysPerYear: totalShortageDays / trial * annualizationFactor,
        lolhHoursPerYear: totalShortageHours / trial * annualizationFactor,
        eueGWhPerYear: totalUnservedGWh / trial * annualizationFactor,
      });
    }
  }

  const replayRandom = createSeededRandom(normalized.seed);
  let capturedWorst = null;
  for (let trial = 1; trial <= worstTrial.trial; trial += 1) {
    capturedWorst = simulateSystemTrial(normalized, replayRandom, trial === worstTrial.trial);
  }

  return {
    config: normalized,
    loleDaysPerYear: totalShortageDays / normalized.trials * annualizationFactor,
    lolhHoursPerYear: totalShortageHours / normalized.trials * annualizationFactor,
    eueGWhPerYear: totalUnservedGWh / normalized.trials * annualizationFactor,
    probabilityAnyShortagePct: trialsWithShortage / normalized.trials * 100,
    worstTrial: { ...worstTrial, hours: capturedWorst.hours },
    annualizedEueByTrial,
    histogram: histogram(annualizedEueByTrial),
    convergence,
  };
}

export { simulateSystemTrial };
