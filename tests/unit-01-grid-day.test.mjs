import assert from "node:assert/strict";
import test from "node:test";

import {
  BASE_LOAD_GW,
  DEFAULT_CONFIG,
  simulateGrid,
} from "../apps/unit-01-grid-day/model.mjs";

const approximatelyEqual = (actual, expected, tolerance = 1e-8) => {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `Expected ${actual} to be within ${tolerance} of ${expected}`,
  );
};

test("the base load matches the Unit 1 worked example", () => {
  assert.equal(BASE_LOAD_GW.length, 24);
  assert.equal(BASE_LOAD_GW.reduce((total, load) => total + load, 0), 2820);
  assert.equal(Math.max(...BASE_LOAD_GW), 150);

  const result = simulateGrid();
  assert.equal(result.summary.dailyEnergyGWh, 2820);
  assert.equal(result.summary.peakLoadGW, 150);
  assert.equal(result.summary.averageLoadGW, 117.5);
  approximatelyEqual(result.summary.loadFactorPct, 78.33333333333333);
  assert.equal(result.summary.unservedEnergyGWh, 0);
});

test("a constant 1 GW data center adds 24 GWh and 1 GW to peak load", () => {
  const base = simulateGrid();
  const withDataCenter = simulateGrid({ dataCenterLoadGW: 1 });

  assert.equal(
    withDataCenter.summary.dailyEnergyGWh - base.summary.dailyEnergyGWh,
    24,
  );
  assert.equal(withDataCenter.summary.peakLoadGW - base.summary.peakLoadGW, 1);
  assert.equal(withDataCenter.summary.averageLoadGW - base.summary.averageLoadGW, 1);
});

test("the hourly balance equation holds for every scenario hour", () => {
  const result = simulateGrid({
    dataCenterLoadGW: 12,
    outageSizeGW: 20,
    outageStartHour: 17,
    outageDurationHours: 4,
  });

  for (const hour of result.hours) {
    const accountedLoad =
      hour.solarUsedGW +
      hour.windUsedGW +
      hour.steadyUsedGW +
      hour.flexibleUsedGW +
      hour.batteryDischargeGW +
      hour.unservedGW;
    approximatelyEqual(accountedLoad, hour.customerLoadGW);
    assert.ok(hour.batterySocPct >= 0 && hour.batterySocPct <= 100);
  }
});

test("a four-hour battery is both power-limited and energy-limited", () => {
  const result = simulateGrid({
    steadyCapacityGW: 0,
    flexibleCapacityGW: 0,
    solarCapacityGW: 0,
    windCapacityGW: 0,
    batteryPowerGW: 10,
    batteryDurationHours: 4,
    batteryInitialSocPct: 100,
    batteryRoundTripEfficiencyPct: 100,
  });

  assert.deepEqual(
    result.hours.slice(0, 5).map((hour) => hour.batteryDischargeGW),
    [10, 10, 10, 10, 0],
  );
  assert.equal(result.hours[3].batterySocPct, 0);
});

test("an outage can wrap across midnight", () => {
  const result = simulateGrid({
    ...DEFAULT_CONFIG,
    outageSizeGW: 10,
    outageStartHour: 22,
    outageDurationHours: 4,
  });

  const outageHours = result.hours
    .filter((hour) => hour.outageActive)
    .map((hour) => hour.hour);
  assert.deepEqual(outageHours, [0, 1, 22, 23]);
  for (const hour of result.hours.filter((item) => item.outageActive)) {
    assert.equal(hour.flexibleAvailableGW, 60);
  }
});

test("renewable surplus charges the battery before it is curtailed", () => {
  const result = simulateGrid({
    steadyCapacityGW: 0,
    flexibleCapacityGW: 0,
    solarCapacityGW: 200,
    windCapacityGW: 0,
    batteryPowerGW: 20,
    batteryDurationHours: 4,
    batteryInitialSocPct: 0,
    batteryRoundTripEfficiencyPct: 100,
  });

  assert.ok(result.hours.some((hour) => hour.batteryChargeGW > 0));
  assert.ok(result.hours.some((hour) => hour.renewableCurtailmentGW > 0));
});

