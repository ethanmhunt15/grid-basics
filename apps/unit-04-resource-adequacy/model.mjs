import {
  BASE_LOAD_GW,
  SOLAR_CAPACITY_FACTOR,
} from "../unit-01-grid-day/model.mjs";

export const PORTFOLIOS = Object.freeze({
  dependable: {
    id: "dependable",
    name: "Portfolio A",
    subtitle: "Thermal + hydro + demand response",
    thermalGW: 100,
    hydroGW: 10,
    demandResponseGW: 10,
    nameplateGW: 120,
  },
  timeDependent: {
    id: "timeDependent",
    name: "Portfolio B",
    subtitle: "Thermal + solar + four-hour battery",
    thermalGW: 50,
    solarGW: 60,
    batteryPowerGW: 10,
    nameplateGW: 120,
  },
});

export const DEFAULT_ADEQUACY_CONFIG = Object.freeze({
  forecastPeakGW: 100,
  flatNewLoadGW: 0,
  loadForecastErrorPct: 0,
  thermalUnavailablePct: 5,
  outageStartHour: 16,
  outageDurationHours: 6,
  solarPerformancePct: 100,
  batteryDurationHours: 4,
  batteryInitialSocPct: 100,
  firmImportsGW: 0,
});

const clamp = (value, minimum, maximum) =>
  Math.min(maximum, Math.max(minimum, Number(value)));

export function planningReserveMarginPct(installedCapacityGW, forecastPeakGW) {
  const peak = Number(forecastPeakGW);
  if (peak <= 0) return 0;
  return ((Number(installedCapacityGW) - peak) / peak) * 100;
}

export function requiredInstalledCapacityGW(forecastPeakGW, reserveMarginPct) {
  return Number(forecastPeakGW) * (1 + Number(reserveMarginPct) / 100);
}

function normalizeConfig(overrides = {}) {
  const config = { ...DEFAULT_ADEQUACY_CONFIG, ...overrides };
  return {
    forecastPeakGW: clamp(config.forecastPeakGW, 60, 140),
    flatNewLoadGW: clamp(config.flatNewLoadGW, 0, 30),
    loadForecastErrorPct: clamp(config.loadForecastErrorPct, -10, 20),
    thermalUnavailablePct: clamp(config.thermalUnavailablePct, 0, 50),
    outageStartHour: Math.round(clamp(config.outageStartHour, 0, 23)),
    outageDurationHours: Math.round(clamp(config.outageDurationHours, 0, 24)),
    solarPerformancePct: clamp(config.solarPerformancePct, 0, 120),
    batteryDurationHours: clamp(config.batteryDurationHours, 0, 16),
    batteryInitialSocPct: clamp(config.batteryInitialSocPct, 0, 100),
    firmImportsGW: clamp(config.firmImportsGW, 0, 25),
  };
}

function eventIsActive(hour, startHour, durationHours) {
  if (durationHours <= 0) return false;
  return (hour - startHour + 24) % 24 < durationHours;
}

function demandProfile(config) {
  return BASE_LOAD_GW.map(
    (load) =>
      (load / 150) *
        config.forecastPeakGW *
        (1 + config.loadForecastErrorPct / 100) +
      config.flatNewLoadGW,
  );
}

function summarize(hours) {
  const unservedEnergyGWh = hours.reduce(
    (total, hour) => total + hour.unservedGW,
    0,
  );
  const shortageHours = hours.filter((hour) => hour.unservedGW > 1e-9).length;
  const critical = hours.reduce((worst, hour) =>
    hour.marginGW < worst.marginGW ? hour : worst,
  );
  return {
    unservedEnergyGWh,
    shortageHours,
    criticalHour: critical.hour,
    worstMarginGW: critical.marginGW,
    peakDemandGW: Math.max(...hours.map((hour) => hour.demandGW)),
  };
}

function simulateDependable(config, demand) {
  const portfolio = PORTFOLIOS.dependable;
  const hours = demand.map((demandGW, hour) => {
    const outageActive = eventIsActive(
      hour,
      config.outageStartHour,
      config.outageDurationHours,
    );
    const thermalAvailableGW =
      portfolio.thermalGW *
      (1 - (outageActive ? config.thermalUnavailablePct : 0) / 100);
    let remainingGW = demandGW;
    const thermalUsedGW = Math.min(thermalAvailableGW, remainingGW);
    remainingGW -= thermalUsedGW;
    const hydroUsedGW = Math.min(portfolio.hydroGW, remainingGW);
    remainingGW -= hydroUsedGW;
    const importsUsedGW = Math.min(config.firmImportsGW, remainingGW);
    remainingGW -= importsUsedGW;
    const demandResponseUsedGW = Math.min(
      portfolio.demandResponseGW,
      remainingGW,
    );
    remainingGW -= demandResponseUsedGW;
    const unservedGW = Math.max(0, remainingGW);
    const availableCapabilityGW =
      thermalAvailableGW +
      portfolio.hydroGW +
      config.firmImportsGW +
      portfolio.demandResponseGW;

    return {
      hour,
      demandGW,
      outageActive,
      thermalAvailableGW,
      thermalUsedGW,
      hydroUsedGW,
      importsUsedGW,
      demandResponseUsedGW,
      solarUsedGW: 0,
      batteryDischargeGW: 0,
      batteryChargeGW: 0,
      batterySocPct: 0,
      unservedGW,
      servedGW: demandGW - unservedGW,
      availableCapabilityGW,
      marginGW: availableCapabilityGW - demandGW,
    };
  });
  return { portfolio, hours, summary: summarize(hours) };
}

function simulateTimeDependent(config, demand) {
  const portfolio = PORTFOLIOS.timeDependent;
  const batteryEnergyGWh =
    portfolio.batteryPowerGW * config.batteryDurationHours;
  let storedEnergyGWh =
    batteryEnergyGWh * (config.batteryInitialSocPct / 100);

  const hours = demand.map((demandGW, hour) => {
    const outageActive = eventIsActive(
      hour,
      config.outageStartHour,
      config.outageDurationHours,
    );
    const thermalAvailableGW =
      portfolio.thermalGW *
      (1 - (outageActive ? config.thermalUnavailablePct : 0) / 100);
    const solarAvailableGW =
      portfolio.solarGW *
      SOLAR_CAPACITY_FACTOR[hour] *
      (config.solarPerformancePct / 100);
    const batteryAvailableGW = Math.min(
      portfolio.batteryPowerGW,
      storedEnergyGWh,
    );
    const availableCapabilityGW =
      thermalAvailableGW +
      solarAvailableGW +
      batteryAvailableGW +
      config.firmImportsGW;

    let remainingGW = demandGW;
    const solarUsedGW = Math.min(solarAvailableGW, remainingGW);
    remainingGW -= solarUsedGW;
    const thermalUsedGW = Math.min(thermalAvailableGW, remainingGW);
    remainingGW -= thermalUsedGW;
    const importsUsedGW = Math.min(config.firmImportsGW, remainingGW);
    remainingGW -= importsUsedGW;
    const batteryDischargeGW = Math.min(
      portfolio.batteryPowerGW,
      storedEnergyGWh,
      remainingGW,
    );
    storedEnergyGWh -= batteryDischargeGW;
    remainingGW -= batteryDischargeGW;
    const unservedGW = Math.max(0, remainingGW);

    const surplusSolarGW = Math.max(0, solarAvailableGW - solarUsedGW);
    const batteryRoomGWh = Math.max(0, batteryEnergyGWh - storedEnergyGWh);
    const batteryChargeGW =
      batteryDischargeGW > 0
        ? 0
        : Math.min(portfolio.batteryPowerGW, surplusSolarGW, batteryRoomGWh);
    storedEnergyGWh += batteryChargeGW;

    return {
      hour,
      demandGW,
      outageActive,
      thermalAvailableGW,
      thermalUsedGW,
      solarAvailableGW,
      solarUsedGW,
      importsUsedGW,
      hydroUsedGW: 0,
      demandResponseUsedGW: 0,
      batteryDischargeGW,
      batteryChargeGW,
      batterySocPct:
        batteryEnergyGWh > 0 ? (storedEnergyGWh / batteryEnergyGWh) * 100 : 0,
      unservedGW,
      servedGW: demandGW - unservedGW,
      availableCapabilityGW,
      marginGW: availableCapabilityGW - demandGW,
    };
  });
  return { portfolio, hours, summary: summarize(hours) };
}

export function simulateAdequacy(overrides = {}) {
  const config = normalizeConfig(overrides);
  const demand = demandProfile(config);
  const dependable = simulateDependable(config, demand);
  const timeDependent = simulateTimeDependent(config, demand);
  const nameplateReserveMarginPct = planningReserveMarginPct(
    PORTFOLIOS.dependable.nameplateGW,
    config.forecastPeakGW,
  );
  const stressedPeakGW = Math.max(...demand);

  return {
    config,
    demand,
    nameplateReserveMarginPct,
    stressedReserveMarginPct: planningReserveMarginPct(
      PORTFOLIOS.dependable.nameplateGW,
      stressedPeakGW,
    ),
    dependable,
    timeDependent,
  };
}

