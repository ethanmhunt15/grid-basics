import assert from "node:assert/strict";
import test from "node:test";

import {
  annualCapacityPayment,
  clearCapacityAuction,
  DEFAULT_DEMAND,
  DEFAULT_SUPPLY_BLOCKS,
  demandPriceAtQuantity,
  demandQuantityAtPrice,
  resourceRevenue,
} from "../apps/unit-05-capacity-market/model.mjs";

const closeTo = (actual, expected, tolerance = 1e-8) =>
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} ≉ ${expected}`);

test("the teaching demand curve passes through Net CONE at its target", () => {
  assert.equal(demandPriceAtQuantity(60, DEFAULT_DEMAND), 180);
  assert.equal(demandPriceAtQuantity(48, DEFAULT_DEMAND), 360);
  assert.equal(demandPriceAtQuantity(72, DEFAULT_DEMAND), 0);
});

test("demand price and quantity functions invert one another on the slope", () => {
  for (const price of [25, 120, 180, 275, 340]) {
    closeTo(demandPriceAtQuantity(demandQuantityAtPrice(price, DEFAULT_DEMAND), DEFAULT_DEMAND), price);
  }
});

test("default auction partially clears demand response at its offer", () => {
  const result = clearCapacityAuction(DEFAULT_SUPPLY_BLOCKS, DEFAULT_DEMAND);
  assert.equal(result.clearingPricePerMWDay, 150);
  assert.equal(result.marginalBlockId, "dr");
  closeTo(result.clearedQuantityGW, 62);
  closeTo(result.blocks.find((block) => block.id === "dr").clearedGW, 2);
  assert.equal(result.blocks.find((block) => block.id === "new-gas").clearedGW, 0);
});

test("raising the target moves the clearing point into new gas", () => {
  const result = clearCapacityAuction(DEFAULT_SUPPLY_BLOCKS, { ...DEFAULT_DEMAND, targetGW: 70 });
  assert.equal(result.marginalBlockId, "new-gas");
  assert.equal(result.clearingPricePerMWDay, 220);
  assert.ok(result.clearedQuantityGW > 65);
});

test("offers are cleared in price order even if input rows are rearranged", () => {
  const normal = clearCapacityAuction(DEFAULT_SUPPLY_BLOCKS, DEFAULT_DEMAND);
  const reversed = clearCapacityAuction([...DEFAULT_SUPPLY_BLOCKS].reverse(), DEFAULT_DEMAND);
  closeTo(reversed.clearedQuantityGW, normal.clearedQuantityGW);
  closeTo(reversed.clearingPricePerMWDay, normal.clearingPricePerMWDay);
});

test("an auction with insufficient supply flags exhaustion", () => {
  const result = clearCapacityAuction([
    { id: "only", name: "Only resource", capacityGW: 40, offerPerMWDay: 10 },
  ], DEFAULT_DEMAND);
  assert.equal(result.exhaustedSupply, true);
  assert.equal(result.clearedQuantityGW, 40);
  assert.equal(result.clearingPricePerMWDay, 360);
});

test("capacity payment arithmetic matches the lesson examples", () => {
  assert.equal(annualCapacityPayment(500, 150), 27_375_000);
  assert.equal(annualCapacityPayment(1000, 200), 73_000_000);
});

test("resource revenue separates accredited capacity from energy margin", () => {
  const result = resourceRevenue({
    nameplateMW: 500,
    accreditationPct: 80,
    clearingPricePerMWDay: 150,
    annualEnergyGWh: 1000,
    energyMarginPerMWh: 10,
  });
  assert.equal(result.accreditedMW, 400);
  assert.equal(result.capacityRevenue, 21_900_000);
  assert.equal(result.energyMargin, 10_000_000);
  closeTo(result.total, 31_900_000);
});
