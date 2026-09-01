import assert from "node:assert/strict";
import test from "node:test";

import {
  planningReserveMarginPct,
  requiredInstalledCapacityGW,
  simulateAdequacy,
} from "../apps/unit-04-resource-adequacy/model.mjs";

const closeTo = (actual, expected, tolerance = 1e-8) =>
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} ≉ ${expected}`);

test("reserve-margin formulas reproduce the Unit 4 examples", () => {
  assert.equal(planningReserveMarginPct(132, 110), 20);
  closeTo(requiredInstalledCapacityGW(165, 18), 194.7);
  closeTo(requiredInstalledCapacityGW(160, 25), 200);
});

test("both teaching portfolios begin with the same 20 percent nameplate margin", () => {
  const result = simulateAdequacy();
  assert.equal(result.dependable.portfolio.nameplateGW, 120);
  assert.equal(result.timeDependent.portfolio.nameplateGW, 120);
  assert.equal(result.nameplateReserveMarginPct, 20);
});

test("equal nameplate margins can produce different deterministic outcomes", () => {
  const result = simulateAdequacy();
  assert.equal(result.dependable.summary.unservedEnergyGWh, 0);
  assert.ok(result.timeDependent.summary.unservedEnergyGWh > 0);
  assert.ok(result.timeDependent.summary.shortageHours > 0);
});

test("served load plus unserved load equals demand in every hour", () => {
  const result = simulateAdequacy({
    flatNewLoadGW: 10,
    loadForecastErrorPct: 5,
    thermalUnavailablePct: 20,
  });
  for (const simulation of [result.dependable, result.timeDependent]) {
    for (const hour of simulation.hours) {
      closeTo(hour.servedGW + hour.unservedGW, hour.demandGW);
      assert.ok(hour.unservedGW >= 0);
    }
  }
});

test("one flat GW adds one GW to stressed peak", () => {
  const base = simulateAdequacy();
  const increased = simulateAdequacy({ flatNewLoadGW: 1 });
  closeTo(
    increased.dependable.summary.peakDemandGW -
      base.dependable.summary.peakDemandGW,
    1,
  );
});

test("more battery duration cannot increase unserved energy", () => {
  const shortBattery = simulateAdequacy({ batteryDurationHours: 2 });
  const longBattery = simulateAdequacy({ batteryDurationHours: 10 });
  assert.ok(
    longBattery.timeDependent.summary.unservedEnergyGWh <=
      shortBattery.timeDependent.summary.unservedEnergyGWh,
  );
});

test("firm imports cannot increase unserved energy", () => {
  const withoutImports = simulateAdequacy({ firmImportsGW: 0 });
  const withImports = simulateAdequacy({ firmImportsGW: 15 });
  for (const key of ["dependable", "timeDependent"]) {
    assert.ok(
      withImports[key].summary.unservedEnergyGWh <=
        withoutImports[key].summary.unservedEnergyGWh,
    );
  }
});

test("thermal unavailability applies only during the event window", () => {
  const result = simulateAdequacy({
    thermalUnavailablePct: 20,
    outageStartHour: 16,
    outageDurationHours: 4,
  });
  assert.equal(result.dependable.hours[15].thermalAvailableGW, 100);
  for (const hour of result.dependable.hours.slice(16, 20)) {
    assert.equal(hour.thermalAvailableGW, 80);
  }
  assert.equal(result.dependable.hours[20].thermalAvailableGW, 100);
});

test("battery state of charge remains bounded", () => {
  const result = simulateAdequacy({
    batteryDurationHours: 8,
    batteryInitialSocPct: 35,
  });
  assert.ok(
    result.timeDependent.hours.every(
      (hour) => hour.batterySocPct >= 0 && hour.batterySocPct <= 100,
    ),
  );
});

