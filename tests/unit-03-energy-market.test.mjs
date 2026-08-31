import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateTwoSettlement,
  clearSupplyStack,
  solveTwoZone,
} from "../apps/unit-03-energy-market/model.mjs";

const closeTo = (actual, expected, tolerance = 0.02) =>
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} ≉ ${expected}`);

test("the Unit 3 merit-order examples clear at the marginal accepted offer", () => {
  assert.equal(clearSupplyStack(7).clearingPricePerMWh, 10);
  assert.equal(clearSupplyStack(16).clearingPricePerMWh, 35);
  assert.equal(clearSupplyStack(18).clearingPricePerMWh, 45);
  assert.equal(clearSupplyStack(22).clearingPricePerMWh, 100);
});

test("18 GW dispatch accepts only 2 GW of coal and no gas turbine", () => {
  const result = clearSupplyStack(18);
  const dispatch = Object.fromEntries(
    result.dispatch.map((resource) => [resource.id, resource]),
  );
  assert.equal(dispatch.wind.clearedGW, 3);
  assert.equal(dispatch.nuclear.clearedGW, 5);
  assert.equal(dispatch.combinedCycle.clearedGW, 8);
  assert.equal(dispatch.coal.clearedGW, 2);
  assert.equal(dispatch.peaker.clearedGW, 0);
  assert.equal(dispatch.coal.marginal, true);
});

test("uniform-price gross margins equal revenue minus simplified variable cost", () => {
  const result = clearSupplyStack(18);
  assert.equal(result.totalRevenuePerHour, 810_000);
  assert.equal(result.totalProductionCostPerHour, 420_000);
  assert.equal(result.totalGrossMarginPerHour, 390_000);
});

test("a positive real-time deviation is purchased at the real-time price", () => {
  const result = calculateTwoSettlement({
    scheduledMWh: 80,
    dayAheadPricePerMWh: 35,
    actualMWh: 86,
    realTimePricePerMWh: 70,
  });
  assert.equal(result.dayAheadSettlement, 2_800);
  assert.equal(result.realTimeSettlement, 420);
  assert.equal(result.totalSettlement, 3_220);
  closeTo(result.effectivePricePerMWh, 37.44186, 0.0001);
});

test("a negative deviation sells the excess schedule back at real-time price", () => {
  const result = calculateTwoSettlement({
    scheduledMWh: 80,
    dayAheadPricePerMWh: 35,
    actualMWh: 74,
    realTimePricePerMWh: 20,
  });
  assert.equal(result.deviationMWh, -6);
  assert.equal(result.realTimeSettlement, -120);
  assert.equal(result.totalSettlement, 2_680);
});

test("a binding 8 GW path separates west and east LMPs", () => {
  const result = solveTwoZone({
    westLoadGW: 6,
    eastLoadGW: 16,
    lineLimitGW: 8,
  });
  assert.equal(result.feasible, true);
  closeTo(result.flowGW, 8);
  closeTo(result.westLMP, 35);
  closeTo(result.eastLMP, 48);
  closeTo(result.congestionDifferencePerMWh, 13);
});

test("sufficient transmission makes marginal prices converge", () => {
  const result = solveTwoZone({
    westLoadGW: 6,
    eastLoadGW: 16,
    lineLimitGW: 16,
  });
  assert.equal(result.feasible, true);
  assert.equal(result.atLimit, false);
  closeTo(result.westLMP, result.eastLMP);
});

test("with no transfer capability each zone clears from local supply", () => {
  const result = solveTwoZone({
    westLoadGW: 6,
    eastLoadGW: 16,
    lineLimitGW: 0,
  });
  assert.equal(result.flowGW, 0);
  closeTo(result.westLMP, 12);
  closeTo(result.eastLMP, 105);
});

