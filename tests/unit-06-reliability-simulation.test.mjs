import assert from "node:assert/strict";
import test from "node:test";

import {
  createSeededRandom,
  runTwoUnitTrials,
  simulateReliability,
  twoUnitStateSpace,
} from "../apps/unit-06-reliability-simulation/model.mjs";

const closeTo = (actual, expected, tolerance = 1e-10) =>
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} ≉ ${expected}`);

test("two-unit analytical result reproduces the lesson", () => {
  const result = twoUnitStateSpace();
  closeTo(result.states[0].probability, 0.81);
  closeTo(result.states[1].probability, 0.18);
  closeTo(result.states[2].probability, 0.01);
  closeTo(result.lolp, 0.19);
  closeTo(result.eueMWh, 8.2);
  closeTo(result.expectedAvailableMW, 108);
});

test("seeded random draws are reproducible", () => {
  const first = createSeededRandom(42);
  const second = createSeededRandom(42);
  assert.deepEqual(Array.from({ length: 10 }, first), Array.from({ length: 10 }, second));
});

test("trial counts reconcile with the requested sample", () => {
  const result = runTwoUnitTrials({}, 1000, 5);
  assert.equal(Object.values(result.counts).reduce((sum, count) => sum + count, 0), 1000);
  assert.equal(result.shortageTrials, result.counts.one + result.counts.neither);
});

test("large two-unit sample approaches the analytical values", () => {
  const result = runTwoUnitTrials({}, 100_000, 9);
  assert.ok(Math.abs(result.sampleLolp - result.analytical.lolp) < 0.005);
  assert.ok(Math.abs(result.sampleEueMWh - result.analytical.eueMWh) < 0.3);
});

test("system simulation is reproducible for a fixed seed", () => {
  const config = { trials: 80, seed: 77, studyDays: 10 };
  const first = simulateReliability(config);
  const second = simulateReliability(config);
  assert.equal(first.loleDaysPerYear, second.loleDaysPerYear);
  assert.equal(first.eueGWhPerYear, second.eueGWhPerYear);
  assert.deepEqual(first.histogram, second.histogram);
});

test("annualized shortage days cannot exceed shortage hours", () => {
  const result = simulateReliability({ trials: 120, seed: 3, studyDays: 10 });
  assert.ok(result.loleDaysPerYear <= result.lolhHoursPerYear);
  assert.ok(result.loleDaysPerYear >= 0);
  assert.ok(result.eueGWhPerYear >= 0);
});

test("additional flat load cannot reduce EUE with identical random draws", () => {
  const config = { trials: 150, seed: 12, studyDays: 10 };
  const base = simulateReliability(config);
  const addedLoad = simulateReliability({ ...config, dataCenterGW: 10 });
  assert.ok(addedLoad.eueGWhPerYear >= base.eueGWhPerYear);
  assert.ok(addedLoad.loleDaysPerYear >= base.loleDaysPerYear);
});

test("more demand response cannot increase EUE with identical random draws", () => {
  const config = { trials: 150, seed: 18, studyDays: 10, dataCenterGW: 8 };
  const low = simulateReliability({ ...config, demandResponseGW: 0 });
  const high = simulateReliability({ ...config, demandResponseGW: 10 });
  assert.ok(high.eueGWhPerYear <= low.eueGWhPerYear);
});

test("more battery duration cannot increase EUE with identical random draws", () => {
  const config = { trials: 150, seed: 22, studyDays: 10, dataCenterGW: 8 };
  const short = simulateReliability({ ...config, batteryDurationHours: 2 });
  const long = simulateReliability({ ...config, batteryDurationHours: 10 });
  assert.ok(long.eueGWhPerYear <= short.eueGWhPerYear);
});
