export const HOURS = Array.from({ length: 24 }, (_, hour) => hour);

export const BASE_LOAD_GW = [
  94, 92, 90, 88, 87, 89, 96, 104, 116, 124, 126, 128,
  130, 131, 132, 133, 150, 150, 150, 150, 130, 120, 110, 100,
];

export const SOLAR_CAPACITY_FACTOR = [
  0, 0, 0, 0, 0, 0, 0.02, 0.1, 0.28, 0.5, 0.7, 0.86,
  0.95, 1, 0.94, 0.78, 0.55, 0.3, 0.1, 0.01, 0, 0, 0, 0,
];

export const WIND_CAPACITY_FACTOR = [
  0.52, 0.55, 0.54, 0.51, 0.49, 0.46, 0.43, 0.4, 0.38, 0.35, 0.32, 0.3,
  0.28, 0.27, 0.26, 0.28, 0.3, 0.31, 0.34, 0.38, 0.42, 0.47, 0.5, 0.52,
];

export const DEFAULT_CONFIG = Object.freeze({
  steadyCapacityGW: 65,
  flexibleCapacityGW: 70,
  solarCapacityGW: 40,
  windCapacityGW: 20,
  batteryPowerGW: 15,
  batteryDurationHours: 4,
  batteryInitialSocPct: 75,
  batteryRoundTripEfficiencyPct: 90,
  dataCenterLoadGW: 0,
  dataCenterStartHour: 0,
  outageSizeGW: 0,
  outageStartHour: 17,
  outageDurationHours: 4,
});

const EPSILON = 1e-9;

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, Number(value)));
}

function normalizeConfig(overrides = {}) {
  const merged = { ...DEFAULT_CONFIG, ...overrides };

  return {
    steadyCapacityGW: clamp(merged.steadyCapacityGW, 0, 200),
    flexibleCapacityGW: clamp(merged.flexibleCapacityGW, 0, 200),
    solarCapacityGW: clamp(merged.solarCapacityGW, 0, 200),
    windCapacityGW: clamp(merged.windCapacityGW, 0, 200),
    batteryPowerGW: clamp(merged.batteryPowerGW, 0, 100),
    batteryDurationHours: clamp(merged.batteryDurationHours, 0, 24),
    batteryInitialSocPct: clamp(merged.batteryInitialSocPct, 0, 100),
    batteryRoundTripEfficiencyPct: clamp(
      merged.batteryRoundTripEfficiencyPct,
      1,
      100,
    ),
    dataCenterLoadGW: clamp(merged.dataCenterLoadGW, 0, 50),
    dataCenterStartHour: Math.round(clamp(merged.dataCenterStartHour, 0, 23)),
    outageSizeGW: clamp(merged.outageSizeGW, 0, 100),
    outageStartHour: Math.round(clamp(merged.outageStartHour, 0, 23)),
    outageDurationHours: Math.round(clamp(merged.outageDurationHours, 0, 24)),
  };
}

function isOutageHour(hour, startHour, durationHours) {
  if (durationHours === 0) return false;
  const elapsed = (hour - startHour + 24) % 24;
  return elapsed < durationHours;
}

function allocateProportionally(totalUsed, solarAvailable, windAvailable) {
  const totalAvailable = solarAvailable + windAvailable;
  if (totalAvailable <= EPSILON) return { solarUsedGW: 0, windUsedGW: 0 };

  return {
    solarUsedGW: totalUsed * (solarAvailable / totalAvailable),
    windUsedGW: totalUsed * (windAvailable / totalAvailable),
  };
}

export function simulateGrid(overrides = {}) {
  const config = normalizeConfig(overrides);
  const batteryEnergyCapacityGWh =
    config.batteryPowerGW * config.batteryDurationHours;
  const chargeEfficiency = Math.sqrt(
    config.batteryRoundTripEfficiencyPct / 100,
  );
  const dischargeEfficiency = chargeEfficiency;
  let storedEnergyGWh =
    batteryEnergyCapacityGWh * (config.batteryInitialSocPct / 100);

  const hours = HOURS.map((hour) => {
    const dataCenterGW =
      hour >= config.dataCenterStartHour ? config.dataCenterLoadGW : 0;
    const customerLoadGW = BASE_LOAD_GW[hour] + dataCenterGW;
    const solarAvailableGW =
      config.solarCapacityGW * SOLAR_CAPACITY_FACTOR[hour];
    const windAvailableGW =
      config.windCapacityGW * WIND_CAPACITY_FACTOR[hour];
    const renewableAvailableGW = solarAvailableGW + windAvailableGW;

    const renewableUsedGW = Math.min(renewableAvailableGW, customerLoadGW);
    const renewableAllocation = allocateProportionally(
      renewableUsedGW,
      solarAvailableGW,
      windAvailableGW,
    );

    let remainingLoadGW = customerLoadGW - renewableUsedGW;
    const steadyUsedGW = Math.min(config.steadyCapacityGW, remainingLoadGW);
    remainingLoadGW -= steadyUsedGW;

    const outageActive = isOutageHour(
      hour,
      config.outageStartHour,
      config.outageDurationHours,
    );
    const outageGW = outageActive
      ? Math.min(config.outageSizeGW, config.flexibleCapacityGW)
      : 0;
    const flexibleAvailableGW = config.flexibleCapacityGW - outageGW;
    const flexibleUsedGW = Math.min(flexibleAvailableGW, remainingLoadGW);
    remainingLoadGW -= flexibleUsedGW;

    const maximumBatteryDeliveryGW = storedEnergyGWh * dischargeEfficiency;
    const batteryDischargeGW = Math.min(
      config.batteryPowerGW,
      maximumBatteryDeliveryGW,
      remainingLoadGW,
    );
    storedEnergyGWh -= batteryDischargeGW / dischargeEfficiency;
    remainingLoadGW -= batteryDischargeGW;

    const unservedGW = Math.max(0, remainingLoadGW);
    const renewableSurplusGW = Math.max(
      0,
      renewableAvailableGW - renewableUsedGW,
    );
    const remainingBatteryRoomGWh = Math.max(
      0,
      batteryEnergyCapacityGWh - storedEnergyGWh,
    );
    const maximumChargeInputGW = remainingBatteryRoomGWh / chargeEfficiency;
    const batteryChargeGW =
      batteryDischargeGW > EPSILON
        ? 0
        : Math.min(
            config.batteryPowerGW,
            renewableSurplusGW,
            maximumChargeInputGW,
          );
    storedEnergyGWh += batteryChargeGW * chargeEfficiency;
    storedEnergyGWh = clamp(storedEnergyGWh, 0, batteryEnergyCapacityGWh);

    const renewableCurtailmentGW = Math.max(
      0,
      renewableSurplusGW - batteryChargeGW,
    );
    const servedLoadGW = customerLoadGW - unservedGW;
    const batterySocPct =
      batteryEnergyCapacityGWh > EPSILON
        ? (storedEnergyGWh / batteryEnergyCapacityGWh) * 100
        : 0;

    return {
      hour,
      baseLoadGW: BASE_LOAD_GW[hour],
      dataCenterGW,
      customerLoadGW,
      solarAvailableGW,
      windAvailableGW,
      ...renewableAllocation,
      steadyUsedGW,
      flexibleUsedGW,
      flexibleAvailableGW,
      outageGW,
      outageActive,
      batteryDischargeGW,
      batteryChargeGW,
      batterySocPct,
      storedEnergyGWh,
      renewableCurtailmentGW,
      servedLoadGW,
      unservedGW,
    };
  });

  const sum = (field) => hours.reduce((total, hour) => total + hour[field], 0);
  const dailyEnergyGWh = sum("customerLoadGW");
  const unservedEnergyGWh = sum("unservedGW");
  const curtailedEnergyGWh = sum("renewableCurtailmentGW");
  const peakLoadGW = Math.max(...hours.map((hour) => hour.customerLoadGW));
  const averageLoadGW = dailyEnergyGWh / 24;
  const loadFactorPct = peakLoadGW > 0 ? (averageLoadGW / peakLoadGW) * 100 : 0;
  const shortageHours = hours.filter((hour) => hour.unservedGW > EPSILON).length;

  return {
    config,
    hours,
    summary: {
      dailyEnergyGWh,
      peakLoadGW,
      averageLoadGW,
      loadFactorPct,
      unservedEnergyGWh,
      shortageHours,
      curtailedEnergyGWh,
      endingBatterySocPct: hours.at(-1)?.batterySocPct ?? 0,
    },
  };
}
