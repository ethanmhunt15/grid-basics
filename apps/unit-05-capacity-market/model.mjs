export const DEFAULT_SUPPLY_BLOCKS = Object.freeze([
  Object.freeze({ id: "nuclear", name: "Existing nuclear", capacityGW: 20, offerPerMWDay: 40 }),
  Object.freeze({ id: "coal", name: "Existing coal", capacityGW: 15, offerPerMWDay: 80 }),
  Object.freeze({ id: "cc", name: "Combined-cycle gas", capacityGW: 25, offerPerMWDay: 120 }),
  Object.freeze({ id: "dr", name: "Demand response", capacityGW: 5, offerPerMWDay: 150 }),
  Object.freeze({ id: "new-gas", name: "New gas entry", capacityGW: 15, offerPerMWDay: 220 }),
]);

export const DEFAULT_DEMAND = Object.freeze({
  targetGW: 60,
  netConePerMWDay: 180,
  widthPct: 20,
});

const finiteNonnegative = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, number) : 0;
};

export function demandCurvePoints({ targetGW, netConePerMWDay, widthPct }) {
  const target = Math.max(0.001, finiteNonnegative(targetGW));
  const netCone = finiteNonnegative(netConePerMWDay);
  const width = Math.min(0.45, Math.max(0.05, finiteNonnegative(widthPct) / 100));
  return {
    lowerQuantityGW: target * (1 - width),
    upperQuantityGW: target * (1 + width),
    maximumPricePerMWDay: netCone * 2,
    targetGW: target,
    netConePerMWDay: netCone,
    widthPct: width * 100,
  };
}

export function demandPriceAtQuantity(quantityGW, demand) {
  const points = demandCurvePoints(demand);
  const quantity = finiteNonnegative(quantityGW);
  if (quantity <= points.lowerQuantityGW) return points.maximumPricePerMWDay;
  if (quantity >= points.upperQuantityGW) return 0;
  return points.maximumPricePerMWDay *
    (points.upperQuantityGW - quantity) /
    (points.upperQuantityGW - points.lowerQuantityGW);
}

export function demandQuantityAtPrice(pricePerMWDay, demand) {
  const points = demandCurvePoints(demand);
  const price = finiteNonnegative(pricePerMWDay);
  if (price >= points.maximumPricePerMWDay) return points.lowerQuantityGW;
  if (price <= 0) return points.upperQuantityGW;
  return points.upperQuantityGW -
    (price / points.maximumPricePerMWDay) *
      (points.upperQuantityGW - points.lowerQuantityGW);
}

export function annualCapacityPayment(mw, pricePerMWDay, days = 365) {
  return finiteNonnegative(mw) * finiteNonnegative(pricePerMWDay) * finiteNonnegative(days);
}

export function clearCapacityAuction(supplyBlocks, demand = DEFAULT_DEMAND) {
  const blocks = supplyBlocks
    .map((block, index) => ({
      id: block.id ?? `block-${index}`,
      name: block.name ?? `Block ${index + 1}`,
      capacityGW: finiteNonnegative(block.capacityGW),
      offerPerMWDay: finiteNonnegative(block.offerPerMWDay),
      originalIndex: index,
    }))
    .filter((block) => block.capacityGW > 0)
    .sort((a, b) => a.offerPerMWDay - b.offerPerMWDay || a.originalIndex - b.originalIndex);

  let cumulativeGW = 0;
  let clearingPricePerMWDay = 0;
  let marginalBlockId = null;
  let exhaustedSupply = false;
  const clearedBlocks = [];

  for (const block of blocks) {
    const startGW = cumulativeGW;
    const endGW = startGW + block.capacityGW;
    const demandAtStart = demandPriceAtQuantity(startGW, demand);
    const demandAtEnd = demandPriceAtQuantity(endGW, demand);

    if (block.offerPerMWDay > demandAtStart) {
      clearingPricePerMWDay = demandAtStart;
      break;
    }

    if (block.offerPerMWDay <= demandAtEnd) {
      clearedBlocks.push({ ...block, startGW, endGW, clearedGW: block.capacityGW, accepted: true });
      cumulativeGW = endGW;
      clearingPricePerMWDay = demandAtEnd;
      marginalBlockId = block.id;
      continue;
    }

    const intersectionGW = Math.min(endGW, Math.max(startGW, demandQuantityAtPrice(block.offerPerMWDay, demand)));
    const clearedGW = Math.max(0, intersectionGW - startGW);
    if (clearedGW > 0) {
      clearedBlocks.push({ ...block, startGW, endGW, clearedGW, accepted: true });
      cumulativeGW = intersectionGW;
      clearingPricePerMWDay = block.offerPerMWDay;
      marginalBlockId = block.id;
    }
    break;
  }

  const totalSupplyGW = blocks.reduce((sum, block) => sum + block.capacityGW, 0);
  if (blocks.length && Math.abs(cumulativeGW - totalSupplyGW) < 1e-9 && demandPriceAtQuantity(totalSupplyGW, demand) > blocks.at(-1).offerPerMWDay) {
    exhaustedSupply = true;
    clearingPricePerMWDay = demandPriceAtQuantity(totalSupplyGW, demand);
  }

  const acceptedById = new Map(clearedBlocks.map((block) => [block.id, block.clearedGW]));
  const orderedBlocks = blocks.map((block) => ({
    ...block,
    clearedGW: acceptedById.get(block.id) ?? 0,
    accepted: acceptedById.has(block.id),
  }));
  const clearedMW = cumulativeGW * 1000;

  return {
    demand: demandCurvePoints(demand),
    blocks: orderedBlocks,
    clearedBlocks,
    clearedQuantityGW: cumulativeGW,
    clearingPricePerMWDay,
    grossAnnualPayment: annualCapacityPayment(clearedMW, clearingPricePerMWDay),
    totalSupplyGW,
    marginalBlockId,
    exhaustedSupply,
    quantityVersusTargetGW: cumulativeGW - demandCurvePoints(demand).targetGW,
  };
}

export function resourceRevenue({
  nameplateMW,
  accreditationPct,
  clearingPricePerMWDay,
  annualEnergyGWh,
  energyMarginPerMWh,
}) {
  const accreditedMW = finiteNonnegative(nameplateMW) * Math.min(100, finiteNonnegative(accreditationPct)) / 100;
  const capacityRevenue = annualCapacityPayment(accreditedMW, clearingPricePerMWDay);
  const energyMargin = finiteNonnegative(annualEnergyGWh) * 1000 * finiteNonnegative(energyMarginPerMWh);
  const total = capacityRevenue + energyMargin;
  return {
    accreditedMW,
    capacityRevenue,
    energyMargin,
    total,
    capacitySharePct: total > 0 ? capacityRevenue / total * 100 : 0,
  };
}
