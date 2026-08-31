import {
  DEFAULT_OPERATIONS_CONFIG,
  RESOURCE_PROFILES,
  calculateOperatingCost,
  simulateOperations,
} from "./model.mjs";

const SVG_NS = "http://www.w3.org/2000/svg";
const byId = (id) => document.getElementById(id);
const money = (value) => `$${value.toFixed(2)}/MWh`;
const number = (value, digits = 1) => value.toFixed(digits);
const formatHour = (hour) => {
  if (hour === 0) return "Midnight";
  if (hour === 12) return "Noon";
  return hour < 12 ? `${hour} a.m.` : `${hour - 12} p.m.`;
};

function element(name, className, text) {
  const node = document.createElement(name);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function svgElement(name, attributes = {}, text = "") {
  const node = document.createElementNS(SVG_NS, name);
  for (const [key, value] of Object.entries(attributes)) {
    node.setAttribute(key, String(value));
  }
  if (text) node.textContent = text;
  return node;
}

// Resource comparison
const resourceA = byId("resource-a");
const resourceB = byId("resource-b");
for (const [key, resource] of Object.entries(RESOURCE_PROFILES)) {
  resourceA.append(new Option(resource.name, key));
  resourceB.append(new Option(resource.name, key));
}
resourceA.value = "combinedCycle";
resourceB.value = "battery";

const comparisonRows = [
  ["Category", "category"],
  ["Available output", "output"],
  ["Response", "response"],
  ["Endurance", "energy"],
  ["Primary uncertainty", "uncertainty"],
  ["Cost intuition", "cost"],
  ["Common grid role", "role"],
];

function renderComparison() {
  const first = RESOURCE_PROFILES[resourceA.value];
  const second = RESOURCE_PROFILES[resourceB.value];
  const comparison = byId("comparison");
  comparison.replaceChildren();
  comparison.append(
    element("div", "attribute", "Attribute"),
    (() => {
      const node = element("div", "resource-head");
      node.append(element("strong", "", first.name), element("span", "", "Resource A"));
      return node;
    })(),
    (() => {
      const node = element("div", "resource-head");
      node.append(element("strong", "", second.name), element("span", "", "Resource B"));
      return node;
    })(),
  );
  for (const [label, key] of comparisonRows) {
    comparison.append(
      element("div", "attribute", label),
      element("div", "", first[key]),
      element("div", "", second[key]),
    );
  }
}
resourceA.addEventListener("change", renderComparison);
resourceB.addEventListener("change", renderComparison);
renderComparison();

// Short-run cost calculator
const costControls = {
  heatRateMMBtuPerMWh: ["heat-rate", "heat-rate-output", (v) => `${v.toFixed(1)} MMBtu/MWh`],
  fuelPricePerMMBtu: ["fuel-price", "fuel-price-output", (v) => `$${v.toFixed(2)}/MMBtu`],
  variableOMPerMWh: ["variable-om", "variable-om-output", money],
  emissionsPerMWh: ["emissions-cost", "emissions-cost-output", money],
};

function renderCost() {
  const inputs = {};
  for (const [key, [inputId, outputId, formatter]] of Object.entries(costControls)) {
    inputs[key] = Number(byId(inputId).value);
    byId(outputId).value = formatter(inputs[key]);
  }
  const result = calculateOperatingCost(inputs);
  byId("total-cost").textContent = money(result.totalPerMWh);
  byId("cost-equation").textContent =
    `${inputs.heatRateMMBtuPerMWh.toFixed(1)} MMBtu/MWh × $${inputs.fuelPricePerMMBtu.toFixed(2)}/MMBtu + $${inputs.variableOMPerMWh.toFixed(2)} + $${inputs.emissionsPerMWh.toFixed(2)}`;

  const components = [
    ["Fuel", result.fuelCostPerMWh, "fuel"],
    ["Variable O&M", result.variableOMPerMWh, "vom"],
    ["Emissions + other", result.emissionsPerMWh, "emissions"],
  ];
  const bar = byId("cost-bar");
  const legend = byId("cost-legend");
  bar.replaceChildren();
  legend.replaceChildren();
  for (const [label, value, className] of components) {
    const segment = element("span", className);
    segment.style.width = `${result.totalPerMWh > 0 ? (value / result.totalPerMWh) * 100 : 0}%`;
    segment.title = `${label}: ${money(value)}`;
    bar.append(segment);
    const item = element("span");
    item.append(document.createTextNode(label), element("b", "", money(value)));
    legend.append(item);
  }
}
for (const [inputId] of Object.values(costControls)) byId(inputId).addEventListener("input", renderCost);
renderCost();

// Operations simulator
const operationControls = {
  demandAdderGW: ["demand-adder", "demand-adder-output", (v) => `${v} GW`],
  solarCapacityGW: ["solar-capacity", "solar-capacity-output", (v) => `${v} GW`],
  windCapacityGW: ["wind-capacity", "wind-capacity-output", (v) => `${v} GW`],
  batteryPowerGW: ["battery-power", "battery-power-output", (v) => `${v} GW`],
  batteryDurationHours: ["battery-duration", "battery-duration-output", (v) => `${v} h`],
  peakerCommitHour: ["peaker-commit", "peaker-commit-output", (v) => formatHour(v)],
  combinedCycleOutageGW: ["outage-size", "outage-size-output", (v) => `${v} GW`],
  outageStartHour: ["outage-start", "outage-start-output", (v) => formatHour(v)],
  outageDurationHours: ["outage-duration", "outage-duration-output", (v) => `${v} h`],
};
const presets = {
  base: {},
  load: { demandAdderGW: 15 },
  outage: { combinedCycleOutageGW: 20 },
  stress: { demandAdderGW: 15, combinedCycleOutageGW: 20 },
};
let selectedHour = 17;
let operationsResult;

function setOperationControls(config) {
  for (const [key, [inputId]] of Object.entries(operationControls)) byId(inputId).value = config[key];
}
function readOperationControls() {
  return Object.fromEntries(Object.entries(operationControls).map(([key, [inputId]]) => [key, Number(byId(inputId).value)]));
}
function markPreset(name) {
  document.querySelectorAll("[data-preset]").forEach((button) =>
    button.setAttribute("aria-pressed", String(button.dataset.preset === name)),
  );
}
function applyPreset(name) {
  setOperationControls({ ...DEFAULT_OPERATIONS_CONFIG, ...presets[name] });
  markPreset(name);
  updateOperations();
}

function updateOperations() {
  const config = readOperationControls();
  for (const [key, [, outputId, formatter]] of Object.entries(operationControls)) byId(outputId).value = formatter(config[key]);
  operationsResult = simulateOperations(config);
  renderOperationMetrics();
  renderOperationsChart();
  renderHourDetail();
}

function renderOperationMetrics() {
  const summary = operationsResult.summary;
  byId("peak-load").textContent = `${number(summary.peakLoadGW)} GW`;
  byId("unserved-energy").textContent = `${number(summary.unservedEnergyGWh)} GWh`;
  byId("curtailed-energy").textContent = `${number(summary.curtailedEnergyGWh)} GWh`;
  byId("ending-battery").textContent = `${number(summary.endingBatterySocPct)}%`;
  const status = byId("operation-status");
  status.classList.toggle("warning", summary.shortageHours > 0 || summary.unresolvedSurplusGWh > 0);
  status.textContent = summary.shortageHours > 0
    ? `${summary.shortageHours} hours have unmet demand. Inspect the first red bar.`
    : summary.unresolvedSurplusGWh > 0
      ? "Minimum output creates surplus generation in at least one hour."
      : "All hourly demand is served within the simplified operating constraints.";
}

function renderOperationsChart() {
  const svg = byId("operations-chart");
  svg.replaceChildren();
  const width = 980, height = 420;
  const margin = { top: 18, right: 18, bottom: 50, left: 58 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const step = plotWidth / 24;
  const barWidth = step - 5;
  const generation = (hour) => Object.values(hour.units).reduce((sum, unit) => sum + unit.outputGW, 0) + hour.solarUsedGW + hour.windUsedGW + hour.batteryDischargeGW;
  const yMax = Math.ceil(Math.max(...operationsResult.hours.map((hour) => Math.max(hour.demandGW, generation(hour)))) / 25) * 25 + 25;
  const x = (hour) => margin.left + hour * step + (step - barWidth) / 2;
  const y = (value) => margin.top + plotHeight - (value / yMax) * plotHeight;

  for (let tick = 0; tick <= yMax; tick += 25) {
    svg.append(
      svgElement("line", { x1: margin.left, x2: width - margin.right, y1: y(tick), y2: y(tick), class: "grid-line" }),
      svgElement("text", { x: margin.left - 9, y: y(tick) + 4, "text-anchor": "end", class: "axis-text" }, tick),
    );
  }
  svg.append(svgElement("text", { x: 15, y: margin.top + plotHeight / 2, transform: `rotate(-90 15 ${margin.top + plotHeight / 2})`, "text-anchor": "middle", class: "axis-title" }, "Power (GW)"));

  const stacks = [
    [(h) => h.units.nuclear.outputGW, "var(--nuclear)"],
    [(h) => h.units.coal.outputGW, "var(--coal)"],
    [(h) => h.units.combinedCycle.outputGW, "var(--combined-cycle)"],
    [(h) => h.units.peaker.outputGW, "var(--peaker)"],
    [(h) => h.solarUsedGW, "var(--solar)"],
    [(h) => h.windUsedGW, "var(--wind)"],
    [(h) => h.batteryDischargeGW, "var(--battery)"],
  ];
  for (const hour of operationsResult.hours) {
    if (hour.hour === selectedHour) svg.append(svgElement("rect", { x: margin.left + hour.hour * step, y: margin.top, width: step, height: plotHeight, class: "selected-band" }));
    let total = 0;
    for (const [accessor, color] of stacks) {
      const value = accessor(hour);
      if (value <= 0) continue;
      const top = total + value;
      svg.append(svgElement("rect", { x: x(hour.hour), y: y(top), width: barWidth, height: y(total) - y(top), fill: color }));
      total = top;
    }
    if (hour.unservedGW > 0) svg.append(svgElement("rect", { x: x(hour.hour), y: y(hour.demandGW), width: barWidth, height: y(hour.servedLoadGW) - y(hour.demandGW), fill: "var(--shortage)" }));
    if (hour.hour % 3 === 0 || hour.hour === 23) svg.append(svgElement("text", { x: x(hour.hour) + barWidth / 2, y: height - 22, "text-anchor": "middle", class: "axis-text" }, hour.hour === 0 ? "12a" : hour.hour === 12 ? "12p" : `${hour.hour % 12}${hour.hour < 12 ? "a" : "p"}`));
  }
  const demandPath = operationsResult.hours.map((hour, index) => `${index ? "L" : "M"}${x(hour.hour) + barWidth / 2},${y(hour.demandGW)}`).join(" ");
  svg.append(svgElement("path", { d: demandPath, class: "demand-path" }));
  for (const hour of operationsResult.hours) {
    const hit = svgElement("rect", { x: margin.left + hour.hour * step, y: margin.top, width: step, height: plotHeight, class: "hour-hit", tabindex: 0, role: "button", "aria-label": `${formatHour(hour.hour)}, ${number(hour.demandGW)} GW demand, ${number(hour.unservedGW)} GW unserved` });
    const select = () => { selectedHour = hour.hour; renderOperationsChart(); renderHourDetail(); };
    hit.addEventListener("click", select);
    hit.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); select(); } });
    svg.append(hit);
  }
  svg.append(svgElement("text", { x: margin.left + plotWidth / 2, y: height - 2, "text-anchor": "middle", class: "axis-title" }, "Hour of day"));
}

function renderHourDetail() {
  const hour = operationsResult.hours[selectedHour];
  byId("selected-hour").textContent = formatHour(hour.hour);
  const message = byId("hour-message");
  message.classList.toggle("warning", hour.unservedGW > 0 || hour.unresolvedSurplusGW > 0);
  message.textContent = hour.unservedGW > 0
    ? `${number(hour.demandGW)} GW demand; ${number(hour.unservedGW)} GW cannot be served after available ramps and stored energy.`
    : hour.unresolvedSurplusGW > 0
      ? `Thermal ramp-down and minimum-output limits leave ${number(hour.unresolvedSurplusGW)} GW of unresolved surplus.`
      : `${number(hour.demandGW)} GW demand is served. Battery is ${number(hour.batterySocPct)}% charged.`;
  const details = byId("unit-details");
  details.replaceChildren();
  for (const unit of Object.values(hour.units)) {
    let suffix = `${number(unit.outputGW)} / ${number(unit.availableCapacityGW)} GW`;
    if (unit.id === "peaker" && !unit.committed) suffix = "Starting or offline";
    const row = element("div", "unit-row");
    row.append(element("span", "", unit.name), element("b", "", suffix));
    details.append(row);
  }
  for (const [label, value] of [
    ["Solar used / available", `${number(hour.solarUsedGW)} / ${number(hour.solarAvailableGW)} GW`],
    ["Wind used / available", `${number(hour.windUsedGW)} / ${number(hour.windAvailableGW)} GW`],
    ["Battery discharge", `${number(hour.batteryDischargeGW)} GW`],
    ["Battery charge", `${number(hour.batteryChargeGW)} GW`],
  ]) {
    const row = element("div", "unit-row"); row.append(element("span", "", label), element("b", "", value)); details.append(row);
  }
}

for (const [, [inputId]] of Object.entries(operationControls)) byId(inputId).addEventListener("input", () => { markPreset(""); updateOperations(); });
document.querySelectorAll("[data-preset]").forEach((button) => button.addEventListener("click", () => applyPreset(button.dataset.preset)));
setOperationControls(DEFAULT_OPERATIONS_CONFIG);
updateOperations();

