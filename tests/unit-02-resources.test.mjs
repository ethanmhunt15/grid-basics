import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateCapacityFactor,
  calculateOperatingCost,
  simulateOperations,
} from "../apps/unit-02-resources/model.mjs";

const closeTo = (actual, expected, tolerance = 1e-8) =>
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} ≉ ${expected}`);

test("capacity factor uses energy divided by nameplate times hours", () => {
  assert.equal(
    calculateCapacityFactor({
      nameplateMW: 400,
      generationMWh: 210_240,
      hours: 720,
    }),
    73,
  );
});

test("the operating-cost calculator reproduces the Unit 2 example", () => {
  const result = calculateOperatingCost({
    heatRateMMBtuPerMWh: 7.5,
    fuelPricePerMMBtu: 3.6,
    variableOMPerMWh: 3,
    emissionsPerMWh: 1.5,
  });
  assert.equal(result.fuelCostPerMWh, 27);
  assert.equal(result.totalPerMWh, 31.5);
});

test("the default fleet serves the worked-example day", () => {
  const result = simulateOperations();
  assert.equal(result.hours.length, 24);
  assert.equal(result.summary.peakLoadGW, 150);
  assert.equal(result.summary.unservedEnergyGWh, 0);
  assert.equal(result.summary.unresolvedSurplusGWh, 0);
});

test("hourly customer-load balance is conserved", () => {
  const result = simulateOperations({
    demandAdderGW: 15,
    combinedCycleOutageGW: 20,
  });
  for (const hour of result.hours) {
    const thermalGW = Object.values(hour.units).reduce(
      (sum, unit) => sum + unit.outputGW,
      0,
    );
    const suppliedGW =
      thermalGW +
      hour.renewableUsedForLoadGW +
      hour.batteryDischargeGW +
      hour.unservedGW;
    const forcedExcessGW = Math.max(0, thermalGW - hour.demandGW);
    closeTo(suppliedGW, hour.demandGW + forcedExcessGW);
  }
});

test("thermal output respects ramp limits on a day without outages", () => {
  const result = simulateOperations({ demandAdderGW: 10 });
  for (let index = 1; index < result.hours.length; index += 1) {
    for (const [id, unit] of Object.entries(result.hours[index].units)) {
      const prior = result.hours[index - 1].units[id];
      assert.ok(
        Math.abs(unit.outputGW - prior.outputGW) <= unit.rampGWPerHour + 1e-8,
        `${id} exceeded its ramp at hour ${index}`,
      );
    }
  }
});

test("the gas turbine cannot operate until its startup delay has elapsed", () => {
  const result = simulateOperations({
    demandAdderGW: 25,
    peakerCommitHour: 17,
  });
  for (const hour of result.hours.slice(0, 18)) {
    assert.equal(hour.units.peaker.committed, false);
    assert.equal(hour.units.peaker.outputGW, 0);
  }
  assert.equal(result.hours[18].units.peaker.committed, true);
  assert.ok(result.hours[18].units.peaker.outputGW > 0);
});

test("battery discharge cannot exceed either power or stored energy", () => {
  const result = simulateOperations({
    demandAdderGW: 30,
    batteryPowerGW: 5,
    batteryDurationHours: 2,
    batteryInitialSocPct: 100,
    peakerCommitHour: 23,
  });
  const dischargedGWh = result.hours.reduce(
    (sum, hour) => sum + hour.batteryDischargeGW,
    0,
  );
  assert.ok(result.hours.every((hour) => hour.batteryDischargeGW <= 5));
  assert.ok(dischargedGWh <= 10 + 1e-8);
  assert.ok(result.hours.every((hour) => hour.batterySocPct >= 0));
});

test("a combined-cycle outage reduces available capacity only during its window", () => {
  const result = simulateOperations({
    combinedCycleOutageGW: 20,
    outageStartHour: 17,
    outageDurationHours: 4,
  });
  assert.equal(result.hours[16].units.combinedCycle.availableCapacityGW, 45);
  for (const hour of result.hours.slice(17, 21)) {
    assert.equal(hour.units.combinedCycle.availableCapacityGW, 25);
  }
  assert.equal(result.hours[21].units.combinedCycle.availableCapacityGW, 45);
});

