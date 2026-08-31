import {
  BASE_LOAD_GW,
  SOLAR_CAPACITY_FACTOR,
  WIND_CAPACITY_FACTOR,
} from "../unit-01-grid-day/model.mjs";

export const RESOURCE_PROFILES = Object.freeze({
  nuclear: {
    name: "Nuclear",
    category: "Dispatchable · thermal",
    output: "Sustained output; usually operated steadily",
    response: "Slow startup; limited routine ramping",
    energy: "Long-duration with scheduled refueling",
    uncertainty: "Large unit outages and planned maintenance",
    cost: "High fixed cost; relatively low fuel cost",
    role: "Long-running energy and dependable capacity",
  },
  combinedCycle: {
    name: "Gas combined cycle",
    category: "Dispatchable · thermal",
    output: "Controllable between minimum and maximum output",
    response: "Moderate startup; generally flexible",
    energy: "Sustained while fuel is available",
    uncertainty: "Equipment, pipeline, fuel, and weather constraints",
    cost: "Fuel-sensitive; efficient among gas technologies",
    role: "Bulk energy, load following, and capacity",
  },
  combustionTurbine: {
    name: "Gas combustion turbine",
    category: "Dispatchable · thermal",
    output: "Controllable; often sits offline until needed",
    response: "Fast startup and ramping",
    energy: "Sustained while fuel and operating limits allow",
    uncertainty: "Fuel supply, weather derates, equipment outages",
    cost: "Higher heat rate and operating cost",
    role: "Peaks, contingencies, and reserves",
  },
  coal: {
    name: "Coal",
    category: "Dispatchable · thermal",
    output: "Controllable, with substantial minimum output",
    response: "Slow startup and ramping; cycling causes wear",
    energy: "Long-duration with on-site fuel inventory",
    uncertainty: "Equipment, fuel handling, and environmental limits",
    cost: "Fuel, maintenance, and environmental costs vary",
    role: "Sustained energy and capacity",
  },
  solar: {
    name: "Solar PV",
    category: "Variable · fuel-free",
    output: "Weather- and daylight-dependent; zero at night",
    response: "Can curtail quickly; cannot increase beyond sunlight",
    energy: "Daily and seasonal profile",
    uncertainty: "Clouds, temperature, location, and forecast error",
    cost: "No fuel; low short-run marginal cost",
    role: "Daytime energy; reliability contribution varies by hour",
  },
  wind: {
    name: "Wind",
    category: "Variable · fuel-free",
    output: "Weather-dependent at any hour",
    response: "Can curtail quickly; cannot command more wind",
    energy: "Not duration-limited, but weather-limited",
    uncertainty: "Wind regime, geography, and forecast error",
    cost: "No fuel; low short-run marginal cost",
    role: "Energy; reliability contribution is portfolio-dependent",
  },
  hydro: {
    name: "Reservoir hydro",
    category: "Dispatchable · energy-limited",
    output: "Highly controllable within water constraints",
    response: "Often fast-starting and fast-ramping",
    energy: "Limited by inflows, reservoir, and water obligations",
    uncertainty: "Hydrology, drought, and competing water uses",
    cost: "No fuel purchase; water has opportunity value",
    role: "Flexible energy, peaks, reserves, and capacity",
  },
  battery: {
    name: "Battery",
    category: "Dispatchable · energy-limited",
    output: "Controllable charge or discharge",
    response: "Very fast",
    energy: "Limited by MWh capacity and state of charge",
    uncertainty: "Starting charge, duration, efficiency, degradation",
    cost: "Charging energy, losses, and degradation",
    role: "Energy shifting, fast response, reserves, and capacity",
  },
  demandResponse: {
    name: "Demand response",
    category: "Load-modifying · often energy-limited",
    output: "Reduces demand instead of producing electricity",
    response: "Seconds to hours, depending on program and process",
    energy: "Limited by event length, frequency, and customer needs",
    uncertainty: "Baseline, participation, rebound, and fatigue",
    cost: "Customer interruption or process-shifting cost",
    role: "Peak reduction, reserves, and capacity",
  },
});

export const THERMAL_UNITS = Object.freeze([
  {
    id: "nuclear",
    name: "Nuclear",
    capacityGW: 55,
    minimumGW: 50,
    rampGWPerHour: 2,
    initialOutputGW: 55,
    color: "nuclear",
  },
  {
    id: "coal",
    name: "Coal",
    capacityGW: 30,
    minimumGW: 15,
    rampGWPerHour: 5,
    initialOutputGW: 20,
    color: "coal",
  },
  {
    id: "combinedCycle",
    name: "Gas combined cycle",
    capacityGW: 45,
    minimumGW: 10,
    rampGWPerHour: 15,
    initialOutputGW: 25,
    color: "combined-cycle",
  },
  {
    id: "peaker",
    name: "Gas turbine",
    capacityGW: 25,
    minimumGW: 0,
    rampGWPerHour: 25,
    initialOutputGW: 0,
    startupHours: 1,
    color: "peaker",
  },
]);

export const DEFAULT_OPERATIONS_CONFIG = Object.freeze({
  demandAdderGW: 0,
  solarCapacityGW: 35,
  windCapacityGW: 20,
  batteryPowerGW: 15,
  batteryDurationHours: 4,
  batteryInitialSocPct: 75,
  peakerCommitHour: 15,
  combinedCycleOutageGW: 0,
  outageStartHour: 17,
  outageDurationHours: 4,
});

const clamp = (value, minimum, maximum) =>
  Math.min(maximum, Math.max(minimum, Number(value)));

export function calculateCapacityFactor({
  nameplateMW,
  generationMWh,
  hours,
}) {
  const maximumMWh = Number(nameplateMW) * Number(hours);
  if (maximumMWh <= 0) return 0;
  return (Number(generationMWh) / maximumMWh) * 100;
}

export function calculateOperatingCost({
  heatRateMMBtuPerMWh,
  fuelPricePerMMBtu,
  variableOMPerMWh,
  emissionsPerMWh,
  otherVariablePerMWh = 0,
}) {
  const fuelCostPerMWh =
    Number(heatRateMMBtuPerMWh) * Number(fuelPricePerMMBtu);
  const totalPerMWh =
    fuelCostPerMWh +
    Number(variableOMPerMWh) +
    Number(emissionsPerMWh) +
    Number(otherVariablePerMWh);

  return {
    fuelCostPerMWh,
    variableOMPerMWh: Number(variableOMPerMWh),
    emissionsPerMWh: Number(emissionsPerMWh),
    otherVariablePerMWh: Number(otherVariablePerMWh),
    totalPerMWh,
  };
}

function outageIsActive(hour, startHour, durationHours) {
  if (durationHours <= 0) return false;
  return (hour - startHour + 24) % 24 < durationHours;
}

function normalizedOperationsConfig(overrides = {}) {
  const config = { ...DEFAULT_OPERATIONS_CONFIG, ...overrides };
  return {
    demandAdderGW: clamp(config.demandAdderGW, 0, 40),
    solarCapacityGW: clamp(config.solarCapacityGW, 0, 120),
    windCapacityGW: clamp(config.windCapacityGW, 0, 100),
    batteryPowerGW: clamp(config.batteryPowerGW, 0, 50),
    batteryDurationHours: clamp(config.batteryDurationHours, 0, 16),
    batteryInitialSocPct: clamp(config.batteryInitialSocPct, 0, 100),
    peakerCommitHour: Math.round(clamp(config.peakerCommitHour, 0, 23)),
    combinedCycleOutageGW: clamp(config.combinedCycleOutageGW, 0, 45),
    outageStartHour: Math.round(clamp(config.outageStartHour, 0, 23)),
    outageDurationHours: Math.round(clamp(config.outageDurationHours, 0, 24)),
  };
}

export function simulateOperations(overrides = {}) {
  const config = normalizedOperationsConfig(overrides);
  const outputs = Object.fromEntries(
    THERMAL_UNITS.map((unit) => [unit.id, unit.initialOutputGW]),
  );
  const batteryEnergyCapacityGWh =
    config.batteryPowerGW * config.batteryDurationHours;
  let storedEnergyGWh =
    batteryEnergyCapacityGWh * (config.batteryInitialSocPct / 100);

  const hours = BASE_LOAD_GW.map((baseLoadGW, hour) => {
    const demandGW = baseLoadGW + config.demandAdderGW;
    const solarAvailableGW =
      config.solarCapacityGW * SOLAR_CAPACITY_FACTOR[hour];
    const windAvailableGW = config.windCapacityGW * WIND_CAPACITY_FACTOR[hour];
    const renewableAvailableGW = solarAvailableGW + windAvailableGW;
    const peakerOnline = hour >= config.peakerCommitHour + 1;
    const outageActive = outageIsActive(
      hour,
      config.outageStartHour,
      config.outageDurationHours,
    );

    const unitState = {};
    for (const unit of THERMAL_UNITS) {
      const committed = unit.id !== "peaker" || peakerOnline;
      let availableCapacityGW = committed ? unit.capacityGW : 0;
      if (unit.id === "combinedCycle" && outageActive) {
        availableCapacityGW = Math.max(
          0,
          availableCapacityGW - config.combinedCycleOutageGW,
        );
      }

      const priorOutputGW = outputs[unit.id];
      const minimumGW = committed
        ? Math.min(unit.minimumGW, availableCapacityGW)
        : 0;
      const rampFloorGW = Math.max(0, priorOutputGW - unit.rampGWPerHour);
      const floorOutputGW = Math.min(
        availableCapacityGW,
        Math.max(minimumGW, rampFloorGW),
      );
      const rampCeilingGW = Math.min(
        availableCapacityGW,
        priorOutputGW + unit.rampGWPerHour,
      );

      unitState[unit.id] = {
        ...unit,
        committed,
        availableCapacityGW,
        priorOutputGW,
        floorOutputGW,
        rampCeilingGW,
        outputGW: floorOutputGW,
      };
    }

    let thermalOutputGW = Object.values(unitState).reduce(
      (total, unit) => total + unit.outputGW,
      0,
    );
    const loadRemainingAfterFloorsGW = Math.max(0, demandGW - thermalOutputGW);
    const renewableUsedForLoadGW = Math.min(
      renewableAvailableGW,
      loadRemainingAfterFloorsGW,
    );
    let remainingDemandGW = Math.max(
      0,
      demandGW - thermalOutputGW - renewableUsedForLoadGW,
    );

    for (const id of ["nuclear", "combinedCycle", "coal", "peaker"]) {
      const unit = unitState[id];
      const headroomGW = Math.max(0, unit.rampCeilingGW - unit.outputGW);
      const increaseGW = Math.min(headroomGW, remainingDemandGW);
      unit.outputGW += increaseGW;
      thermalOutputGW += increaseGW;
      remainingDemandGW -= increaseGW;
    }

    const batteryDischargeGW = Math.min(
      config.batteryPowerGW,
      storedEnergyGWh,
      remainingDemandGW,
    );
    storedEnergyGWh -= batteryDischargeGW;
    remainingDemandGW -= batteryDischargeGW;
    const unservedGW = Math.max(0, remainingDemandGW);

    const forcedSurplusGW = Math.max(0, thermalOutputGW - demandGW);
    const renewableSurplusGW = Math.max(
      0,
      renewableAvailableGW - renewableUsedForLoadGW,
    );
    const batteryRoomGWh = Math.max(
      0,
      batteryEnergyCapacityGWh - storedEnergyGWh,
    );
    const batteryChargeGW =
      batteryDischargeGW > 0
        ? 0
        : Math.min(
            config.batteryPowerGW,
            renewableSurplusGW + forcedSurplusGW,
            batteryRoomGWh,
          );
    storedEnergyGWh += batteryChargeGW;
    const curtailedRenewableGW = Math.max(
      0,
      renewableSurplusGW - Math.max(0, batteryChargeGW - forcedSurplusGW),
    );
    const unresolvedSurplusGW = Math.max(0, forcedSurplusGW - batteryChargeGW);

    for (const [id, unit] of Object.entries(unitState)) {
      outputs[id] = unit.outputGW;
    }

    const renewableShare =
      renewableAvailableGW > 0
        ? renewableUsedForLoadGW / renewableAvailableGW
        : 0;
    const solarUsedGW = solarAvailableGW * renewableShare;
    const windUsedGW = windAvailableGW * renewableShare;

    return {
      hour,
      baseLoadGW,
      demandGW,
      solarAvailableGW,
      windAvailableGW,
      solarUsedGW,
      windUsedGW,
      renewableUsedForLoadGW,
      curtailedRenewableGW,
      batteryDischargeGW,
      batteryChargeGW,
      batterySocPct:
        batteryEnergyCapacityGWh > 0
          ? (storedEnergyGWh / batteryEnergyCapacityGWh) * 100
          : 0,
      storedEnergyGWh,
      unservedGW,
      unresolvedSurplusGW,
      peakerOnline,
      outageActive,
      units: unitState,
      servedLoadGW: demandGW - unservedGW,
    };
  });

  const total = (field) => hours.reduce((sum, hour) => sum + hour[field], 0);
  return {
    config,
    hours,
    summary: {
      unservedEnergyGWh: total("unservedGW"),
      shortageHours: hours.filter((hour) => hour.unservedGW > 1e-9).length,
      curtailedEnergyGWh: total("curtailedRenewableGW"),
      unresolvedSurplusGWh: total("unresolvedSurplusGW"),
      peakLoadGW: Math.max(...hours.map((hour) => hour.demandGW)),
      thermalStarts: config.peakerCommitHour < 23 ? 1 : 0,
      endingBatterySocPct: hours.at(-1)?.batterySocPct ?? 0,
    },
  };
}

