export const SINGLE_NODE_RESOURCES = Object.freeze([
  { id: "wind", name: "Wind", capacityGW: 3, offerPerMWh: 0 },
  { id: "nuclear", name: "Nuclear", capacityGW: 5, offerPerMWh: 10 },
  { id: "combinedCycle", name: "Combined cycle", capacityGW: 8, offerPerMWh: 35 },
  { id: "coal", name: "Coal", capacityGW: 4, offerPerMWh: 45 },
  { id: "peaker", name: "Gas turbine", capacityGW: 5, offerPerMWh: 100 },
]);

export const WEST_RESOURCES = Object.freeze([
  { id: "westWind", name: "West wind", capacityGW: 4, offerPerMWh: 0 },
  { id: "westNuclear", name: "West nuclear", capacityGW: 6, offerPerMWh: 12 },
  { id: "westCombinedCycle", name: "West combined cycle", capacityGW: 10, offerPerMWh: 35 },
  { id: "westPeaker", name: "West gas turbine", capacityGW: 6, offerPerMWh: 110 },
]);

export const EAST_RESOURCES = Object.freeze([
  { id: "eastNuclear", name: "East nuclear", capacityGW: 2, offerPerMWh: 15 },
  { id: "eastCombinedCycle", name: "East combined cycle", capacityGW: 8, offerPerMWh: 48 },
  { id: "eastPeaker", name: "East gas turbine", capacityGW: 12, offerPerMWh: 105 },
]);

const EPSILON = 1e-9;
const clamp = (value, minimum, maximum) =>
  Math.min(maximum, Math.max(minimum, Number(value)));

export function clearSupplyStack(
  demandGW,
  resources = SINGLE_NODE_RESOURCES,
) {
  const demand = Math.max(0, Number(demandGW));
  const sorted = [...resources].sort(
    (left, right) => left.offerPerMWh - right.offerPerMWh,
  );
  let remainingGW = demand;
  let clearingPricePerMWh = 0;

  const dispatch = sorted.map((resource) => {
    const clearedGW = Math.min(resource.capacityGW, remainingGW);
    remainingGW -= clearedGW;
    if (clearedGW > EPSILON) clearingPricePerMWh = resource.offerPerMWh;
    return { ...resource, clearedGW };
  });

  const servedGW = demand - Math.max(0, remainingGW);
  const unservedGW = Math.max(0, remainingGW);
  const totalProductionCostPerHour = dispatch.reduce(
    (total, resource) =>
      total + resource.clearedGW * 1000 * resource.offerPerMWh,
    0,
  );
  const totalRevenuePerHour = dispatch.reduce(
    (total, resource) =>
      total + resource.clearedGW * 1000 * clearingPricePerMWh,
    0,
  );

  return {
    demandGW: demand,
    servedGW,
    unservedGW,
    clearingPricePerMWh: unservedGW > EPSILON ? null : clearingPricePerMWh,
    dispatch: dispatch.map((resource) => {
      const revenuePerHour =
        resource.clearedGW * 1000 * (clearingPricePerMWh ?? 0);
      const variableCostPerHour =
        resource.clearedGW * 1000 * resource.offerPerMWh;
      return {
        ...resource,
        revenuePerHour,
        variableCostPerHour,
        grossMarginPerHour: revenuePerHour - variableCostPerHour,
        accepted: resource.clearedGW > EPSILON,
        marginal:
          unservedGW <= EPSILON &&
          resource.clearedGW > EPSILON &&
          resource.offerPerMWh === clearingPricePerMWh,
      };
    }),
    totalProductionCostPerHour,
    totalRevenuePerHour,
    totalGrossMarginPerHour:
      totalRevenuePerHour - totalProductionCostPerHour,
  };
}

export function calculateTwoSettlement({
  scheduledMWh,
  dayAheadPricePerMWh,
  actualMWh,
  realTimePricePerMWh,
}) {
  const schedule = Math.max(0, Number(scheduledMWh));
  const actual = Math.max(0, Number(actualMWh));
  const dayAheadPrice = Number(dayAheadPricePerMWh);
  const realTimePrice = Number(realTimePricePerMWh);
  const deviationMWh = actual - schedule;
  const dayAheadSettlement = schedule * dayAheadPrice;
  const realTimeSettlement = deviationMWh * realTimePrice;
  const totalSettlement = dayAheadSettlement + realTimeSettlement;

  return {
    scheduledMWh: schedule,
    actualMWh: actual,
    deviationMWh,
    dayAheadSettlement,
    realTimeSettlement,
    totalSettlement,
    effectivePricePerMWh: actual > 0 ? totalSettlement / actual : 0,
  };
}

function curveCost(resources, generationGW) {
  const result = clearSupplyStack(generationGW, resources);
  return result.unservedGW > EPSILON ? Infinity : result.totalProductionCostPerHour;
}

function totalCapacity(resources) {
  return resources.reduce((total, resource) => total + resource.capacityGW, 0);
}

function solveTwoZoneCore({ westLoadGW, eastLoadGW, lineLimitGW }) {
  const westLoad = Math.max(0, Number(westLoadGW));
  const eastLoad = Math.max(0, Number(eastLoadGW));
  const lineLimit = Math.max(0, Number(lineLimitGW));
  const westCapacity = totalCapacity(WEST_RESOURCES);
  const eastCapacity = totalCapacity(EAST_RESOURCES);
  const minimumFlowGW = Math.max(-lineLimit, -westLoad, eastLoad - eastCapacity);
  const maximumFlowGW = Math.min(lineLimit, eastLoad, westCapacity - westLoad);

  if (minimumFlowGW > maximumFlowGW + EPSILON) {
    return { feasible: false, costPerHour: Infinity };
  }

  const stepGW = 0.01;
  let best = null;
  const steps = Math.ceil((maximumFlowGW - minimumFlowGW) / stepGW);
  for (let index = 0; index <= steps; index += 1) {
    const flowGW = Math.min(maximumFlowGW, minimumFlowGW + index * stepGW);
    const westGenerationGW = westLoad + flowGW;
    const eastGenerationGW = eastLoad - flowGW;
    const westCost = curveCost(WEST_RESOURCES, westGenerationGW);
    const eastCost = curveCost(EAST_RESOURCES, eastGenerationGW);
    const costPerHour = westCost + eastCost;
    if (!best || costPerHour < best.costPerHour - 0.01) {
      best = {
        feasible: true,
        flowGW,
        westGenerationGW,
        eastGenerationGW,
        costPerHour,
      };
    }
  }
  return best;
}

export function solveTwoZone({
  westLoadGW = 6,
  eastLoadGW = 16,
  lineLimitGW = 8,
}) {
  const inputs = {
    westLoadGW: clamp(westLoadGW, 0, 26),
    eastLoadGW: clamp(eastLoadGW, 0, 22),
    lineLimitGW: clamp(lineLimitGW, 0, 20),
  };
  const base = solveTwoZoneCore(inputs);
  if (!base.feasible) return { ...inputs, ...base };

  const incrementGW = 0.01;
  const westIncrement = solveTwoZoneCore({
    ...inputs,
    westLoadGW: inputs.westLoadGW + incrementGW,
  });
  const eastIncrement = solveTwoZoneCore({
    ...inputs,
    eastLoadGW: inputs.eastLoadGW + incrementGW,
  });
  const marginal = (incrementResult) =>
    incrementResult.feasible
      ? (incrementResult.costPerHour - base.costPerHour) /
        (incrementGW * 1000)
      : null;
  const westLMP = marginal(westIncrement);
  const eastLMP = marginal(eastIncrement);
  const atLimit = Math.abs(Math.abs(base.flowGW) - inputs.lineLimitGW) < 0.011;

  return {
    ...inputs,
    ...base,
    westLMP,
    eastLMP,
    congestionDifferencePerMWh:
      westLMP === null || eastLMP === null ? null : eastLMP - westLMP,
    atLimit,
    westDispatch: clearSupplyStack(
      base.westGenerationGW,
      WEST_RESOURCES,
    ).dispatch,
    eastDispatch: clearSupplyStack(
      base.eastGenerationGW,
      EAST_RESOURCES,
    ).dispatch,
  };
}

