import {
  SINGLE_NODE_RESOURCES,
  calculateTwoSettlement,
  clearSupplyStack,
  solveTwoZone,
} from "./model.mjs";

const SVG_NS = "http://www.w3.org/2000/svg";
const byId = (id) => document.getElementById(id);
const dollars = (value, digits = 0) =>
  value === null ? "Unavailable" : `$${value.toFixed(digits)}`;
const formatMoney = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
const svgElement = (name, attrs = {}, text = "") => {
  const node = document.createElementNS(SVG_NS, name);
  Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
  if (text) node.textContent = text;
  return node;
};
const resourceColors = {
  wind: "var(--wind)",
  nuclear: "var(--nuclear)",
  combinedCycle: "var(--combined)",
  coal: "var(--coal)",
  peaker: "var(--peaker)",
};

function renderStack() {
  const demand = Number(byId("demand").value);
  const result = clearSupplyStack(demand);
  byId("demand-output").value = `${demand.toFixed(1)} GW`;
  byId("clearing-price").textContent = result.clearingPricePerMWh === null
    ? "Shortage"
    : `${dollars(result.clearingPricePerMWh)}/MWh`;
  byId("served-energy").textContent = `${result.servedGW.toFixed(1)} GWh`;
  byId("gross-margin").textContent = formatMoney(result.totalGrossMarginPerHour);
  const marginal = result.dispatch.find((resource) => resource.marginal);
  byId("marginal-message").textContent = result.unservedGW > 0
    ? `${result.unservedGW.toFixed(1)} GW cannot be served by this stack.`
    : demand === 0
      ? "No resource is needed at zero demand."
      : `${marginal.name} supplies the marginal accepted block.`;

  const cards = byId("dispatch-cards");
  cards.replaceChildren();
  for (const resource of result.dispatch) {
    const card = document.createElement("div");
    card.className = `dispatch-card${resource.marginal ? " marginal" : ""}${resource.accepted ? "" : " off"}`;
    card.innerHTML = `<strong>${resource.name}</strong><span>${resource.clearedGW.toFixed(1)} / ${resource.capacityGW} GW cleared</span><span>${formatMoney(resource.grossMarginPerHour)} gross margin</span>`;
    cards.append(card);
  }

  const svg = byId("stack-chart");
  svg.replaceChildren();
  const width = 760, height = 400;
  const margin = { top: 24, right: 22, bottom: 52, left: 65 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const x = (gw) => margin.left + (gw / 26) * plotWidth;
  const y = (price) => margin.top + plotHeight - (price / 120) * plotHeight;
  for (const tick of [0, 25, 50, 75, 100]) {
    svg.append(svgElement("line", { x1: margin.left, x2: width - margin.right, y1: y(tick), y2: y(tick), class: "grid-line" }), svgElement("text", { x: margin.left - 9, y: y(tick) + 4, "text-anchor": "end", class: "axis-text" }, `$${tick}`));
  }
  let cumulative = 0;
  for (const resource of SINGLE_NODE_RESOURCES) {
    const start = cumulative;
    cumulative += resource.capacityGW;
    svg.append(
      svgElement("rect", { x: x(start), y: y(resource.offerPerMWh), width: x(cumulative) - x(start) - 1, height: y(0) - y(resource.offerPerMWh), fill: resourceColors[resource.id], opacity: .9 }),
      svgElement("line", { x1: x(start), x2: x(cumulative), y1: y(resource.offerPerMWh), y2: y(resource.offerPerMWh), stroke: "var(--ink)", "stroke-width": 2 }),
      svgElement("text", { x: (x(start) + x(cumulative)) / 2, y: Math.max(margin.top + 12, y(resource.offerPerMWh) - 7), "text-anchor": "middle", class: "chart-label" }, resource.name),
    );
  }
  svg.append(svgElement("line", { x1: x(demand), x2: x(demand), y1: margin.top, y2: y(0), class: "demand-line" }), svgElement("text", { x: x(demand), y: margin.top - 7, "text-anchor": demand > 22 ? "end" : "middle", class: "chart-label" }, `${demand.toFixed(1)} GW demand`));
  if (result.clearingPricePerMWh !== null && demand > 0) svg.append(svgElement("line", { x1: margin.left, x2: x(demand), y1: y(result.clearingPricePerMWh), y2: y(result.clearingPricePerMWh), class: "price-line" }));
  for (const tick of [0, 5, 10, 15, 20, 25]) svg.append(svgElement("text", { x: x(tick), y: height - 23, "text-anchor": "middle", class: "axis-text" }, tick));
  svg.append(svgElement("text", { x: margin.left + plotWidth / 2, y: height - 2, "text-anchor": "middle", class: "axis-title" }, "Cumulative offered capacity (GW)"), svgElement("text", { x: 16, y: margin.top + plotHeight / 2, transform: `rotate(-90 16 ${margin.top + plotHeight / 2})`, "text-anchor": "middle", class: "axis-title" }, "Offer ($/MWh)"));
}
byId("demand").addEventListener("input", renderStack);
renderStack();

function renderSettlement() {
  const values = {
    scheduledMWh: Number(byId("scheduled").value),
    dayAheadPricePerMWh: Number(byId("day-ahead-price").value),
    actualMWh: Number(byId("actual").value),
    realTimePricePerMWh: Number(byId("real-time-price").value),
  };
  byId("scheduled-output").value = `${values.scheduledMWh} MWh`;
  byId("actual-output").value = `${values.actualMWh} MWh`;
  byId("day-ahead-price-output").value = `${dollars(values.dayAheadPricePerMWh)}/MWh`;
  byId("real-time-price-output").value = `${dollars(values.realTimePricePerMWh)}/MWh`;
  const result = calculateTwoSettlement(values);
  const sign = result.deviationMWh >= 0 ? "+" : "−";
  byId("settlement-formula").textContent = `${values.scheduledMWh} MWh × ${dollars(values.dayAheadPricePerMWh)} + (${result.deviationMWh} MWh × ${dollars(values.realTimePricePerMWh)})`;
  byId("day-ahead-settlement").textContent = formatMoney(result.dayAheadSettlement);
  byId("real-time-settlement").textContent = `${sign}${formatMoney(Math.abs(result.realTimeSettlement))}`;
  byId("total-settlement").textContent = formatMoney(result.totalSettlement);
  byId("effective-price").textContent = `Effective average energy price: ${dollars(result.effectivePricePerMWh, 2)}/MWh. The ${Math.abs(result.deviationMWh)} MWh ${result.deviationMWh >= 0 ? "shortfall was bought" : "excess schedule was sold back"} at the real-time price.`;
}
["scheduled", "day-ahead-price", "actual", "real-time-price"].forEach((id) => byId(id).addEventListener("input", renderSettlement));
renderSettlement();

function renderDispatch(containerId, dispatch) {
  const container = byId(containerId);
  container.replaceChildren();
  for (const resource of dispatch) {
    const row = document.createElement("div");
    row.className = "resource-row";
    row.innerHTML = `<span>${resource.name} · ${dollars(resource.offerPerMWh)}/MWh</span><b>${resource.clearedGW.toFixed(1)} GW</b>`;
    container.append(row);
  }
}

function renderLocations() {
  const eastLoadGW = Number(byId("east-load").value);
  const lineLimitGW = Number(byId("line-limit").value);
  byId("east-load-output").value = `${eastLoadGW.toFixed(1)} GW`;
  byId("line-limit-output").value = `${lineLimitGW.toFixed(1)} GW`;
  const result = solveTwoZone({ westLoadGW: 6, eastLoadGW, lineLimitGW });
  if (!result.feasible) return;
  const roundedWest = Math.round(result.westLMP * 100) / 100;
  const roundedEast = Math.round(result.eastLMP * 100) / 100;
  const spread = roundedEast - roundedWest;
  byId("west-lmp").textContent = `${dollars(roundedWest, 2)}/MWh`;
  byId("east-lmp").textContent = `${dollars(roundedEast, 2)}/MWh`;
  byId("west-detail").textContent = `${result.westGenerationGW.toFixed(1)} GW generated · 6.0 GW load`;
  byId("east-detail").textContent = `${result.eastGenerationGW.toFixed(1)} GW generated · ${eastLoadGW.toFixed(1)} GW load`;
  byId("flow-label").textContent = `${result.flowGW.toFixed(1)} GW west → east`;
  byId("flow-fill").style.width = lineLimitGW > 0 ? `${Math.min(100, Math.abs(result.flowGW / lineLimitGW) * 100)}%` : "0%";
  const congested = spread > .1;
  byId("line-status").textContent = lineLimitGW === 0 ? "No transfer capability" : result.atLimit ? "Path fully used" : "Spare transfer capability";
  byId("congestion-explanation").textContent = congested
    ? `The path is economically congested. Serving the next eastern MWh costs ${dollars(roundedEast, 2)}, ${dollars(spread, 2)}/MWh more than in the west, because additional low-cost western power cannot cross the binding line.`
    : `The marginal prices converge because the line has enough useful capacity for the next increment. In this lossless two-zone model, there is no congestion price separation.`;
  renderDispatch("west-dispatch", result.westDispatch);
  renderDispatch("east-dispatch", result.eastDispatch);
}
byId("east-load").addEventListener("input", renderLocations);
byId("line-limit").addEventListener("input", renderLocations);
renderLocations();

