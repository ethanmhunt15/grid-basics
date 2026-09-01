import {
  DEFAULT_ADEQUACY_CONFIG,
  planningReserveMarginPct,
  simulateAdequacy,
} from "./model.mjs";

const SVG_NS = "http://www.w3.org/2000/svg";
const byId = (id) => document.getElementById(id);
const formatHour = (hour) => hour === 0 ? "Midnight" : hour === 12 ? "Noon" : hour < 12 ? `${hour} a.m.` : `${hour - 12} p.m.`;
const svgElement = (name, attributes = {}, text = "") => {
  const node = document.createElementNS(SVG_NS, name);
  Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value));
  if (text) node.textContent = text;
  return node;
};

function renderCalculator() {
  const capacity = Number(byId("calc-capacity").value);
  const peak = Number(byId("calc-peak").value);
  const margin = planningReserveMarginPct(capacity, peak);
  byId("calc-capacity-output").value = `${capacity} GW`;
  byId("calc-peak-output").value = `${peak} GW`;
  byId("calc-margin").textContent = `${margin.toFixed(1)}%`;
  byId("calc-equation").textContent = `(${capacity} − ${peak}) ÷ ${peak}`;
}
byId("calc-capacity").addEventListener("input", renderCalculator);
byId("calc-peak").addEventListener("input", renderCalculator);
renderCalculator();

const controls = {
  forecastPeakGW: ["forecast-peak", "forecast-peak-output", (v) => `${v} GW`],
  flatNewLoadGW: ["new-load", "new-load-output", (v) => `${v} GW`],
  loadForecastErrorPct: ["forecast-error", "forecast-error-output", (v) => `${v > 0 ? "+" : ""}${v}%`],
  thermalUnavailablePct: ["thermal-unavailable", "thermal-unavailable-output", (v) => `${v}%`],
  outageStartHour: ["outage-start", "outage-start-output", formatHour],
  outageDurationHours: ["outage-duration", "outage-duration-output", (v) => `${v} h`],
  solarPerformancePct: ["solar-performance", "solar-performance-output", (v) => `${v}%`],
  batteryDurationHours: ["battery-duration", "battery-duration-output", (v) => `${v} h`],
  batteryInitialSocPct: ["battery-charge", "battery-charge-output", (v) => `${v}%`],
  firmImportsGW: ["imports", "imports-output", (v) => `${v} GW`],
};
const presets = {
  base: {},
  forecast: { loadForecastErrorPct: 10 },
  cold: { thermalUnavailablePct: 25, solarPerformancePct: 30, outageStartHour: 16, outageDurationHours: 8 },
  "data-center": { flatNewLoadGW: 10 },
};
let selectedHour = 19;
let result;

function setControls(config) {
  Object.entries(controls).forEach(([key, [inputId]]) => { byId(inputId).value = config[key]; });
}
function readControls() {
  return Object.fromEntries(Object.entries(controls).map(([key, [inputId]]) => [key, Number(byId(inputId).value)]));
}
function markPreset(name) {
  document.querySelectorAll("[data-preset]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.preset === name)));
}
function applyPreset(name) {
  setControls({ ...DEFAULT_ADEQUACY_CONFIG, ...presets[name] });
  markPreset(name);
  update();
}

function update() {
  const config = readControls();
  Object.entries(controls).forEach(([key, [, outputId, formatter]]) => { byId(outputId).value = formatter(config[key]); });
  result = simulateAdequacy(config);
  byId("headline-margin").textContent = `${result.nameplateReserveMarginPct.toFixed(1)}%`;
  byId("stressed-margin").textContent = `${result.stressedReserveMarginPct.toFixed(1)}%`;
  renderPortfolio("a", result.dependable);
  renderPortfolio("b", result.timeDependent);
  drawChart("chart-a", result.dependable);
  drawChart("chart-b", result.timeDependent);
  renderHourDetail();
}

function renderPortfolio(prefix, simulation) {
  const summary = simulation.summary;
  byId(`${prefix}-unserved`).textContent = `${summary.unservedEnergyGWh.toFixed(1)} GWh`;
  byId(`${prefix}-margin`).textContent = `${summary.worstMarginGW >= 0 ? "+" : ""}${summary.worstMarginGW.toFixed(1)} GW`;
  byId(`${prefix}-hour`).textContent = formatHour(summary.criticalHour);
  const status = byId(`${prefix}-status`);
  status.classList.toggle("warning", summary.shortageHours > 0);
  status.textContent = summary.shortageHours > 0 ? `${summary.shortageHours} shortage h` : "Serves all hours";
}

function drawChart(id, simulation) {
  const svg = byId(id);
  svg.replaceChildren();
  const width = 560, height = 300;
  const margin = { top: 14, right: 12, bottom: 40, left: 44 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const yMax = Math.ceil(Math.max(...simulation.hours.flatMap((hour) => [hour.demandGW, hour.availableCapabilityGW])) / 25) * 25 + 10;
  const x = (hour) => margin.left + (hour / 23) * plotWidth;
  const y = (value) => margin.top + plotHeight - (value / yMax) * plotHeight;
  for (let tick = 0; tick <= yMax; tick += 25) {
    svg.append(svgElement("line", { x1: margin.left, x2: width - margin.right, y1: y(tick), y2: y(tick), class: "grid-line" }), svgElement("text", { x: margin.left - 7, y: y(tick) + 3, "text-anchor": "end", class: "axis-text" }, tick));
  }
  for (const hour of simulation.hours) {
    if (hour.unservedGW > 0) {
      const barWidth = plotWidth / 24;
      svg.append(svgElement("rect", { x: x(hour.hour) - barWidth / 2, y: y(hour.demandGW), width: barWidth, height: y(hour.servedGW) - y(hour.demandGW), class: "shortage-area" }));
    }
  }
  const path = (field) => simulation.hours.map((hour, index) => `${index ? "L" : "M"}${x(hour.hour)},${y(hour[field])}`).join(" ");
  svg.append(svgElement("path", { d: path("availableCapabilityGW"), class: "capacity-path" }), svgElement("path", { d: path("demandGW"), class: "demand-path" }), svgElement("line", { x1: x(selectedHour), x2: x(selectedHour), y1: margin.top, y2: margin.top + plotHeight, class: "selected-line" }));
  for (const hour of [0, 6, 12, 18, 23]) svg.append(svgElement("text", { x: x(hour), y: height - 16, "text-anchor": hour === 0 ? "start" : hour === 23 ? "end" : "middle", class: "axis-text" }, hour === 0 ? "12a" : hour === 12 ? "12p" : `${hour % 12}${hour < 12 ? "a" : "p"}`));
  svg.append(svgElement("text", { x: 12, y: margin.top + plotHeight / 2, transform: `rotate(-90 12 ${margin.top + plotHeight / 2})`, "text-anchor": "middle", class: "axis-title" }, "GW"));
}

function renderHourDetail() {
  const a = result.dependable.hours[selectedHour];
  const b = result.timeDependent.hours[selectedHour];
  byId("selected-hour").textContent = formatHour(selectedHour);
  byId("hour-selector").value = selectedHour;
  const rows = [
    ["Demand", a.demandGW, b.demandGW],
    ["Available capability", a.availableCapabilityGW, b.availableCapabilityGW],
    ["Thermal available", a.thermalAvailableGW, b.thermalAvailableGW],
    ["Hydro / solar used", a.hydroUsedGW, b.solarUsedGW],
    ["DR / battery used", a.demandResponseUsedGW, b.batteryDischargeGW],
    ["Imports used", a.importsUsedGW, b.importsUsedGW],
    ["Unserved", a.unservedGW, b.unservedGW],
  ];
  const container = byId("hour-comparison");
  container.className = "hour-comparison";
  container.replaceChildren();
  const head = document.createElement("div"); head.className = "comparison-row"; head.innerHTML = "<span></span><b>Portfolio A</b><b>Portfolio B</b>"; container.append(head);
  for (const [label, av, bv] of rows) {
    const row = document.createElement("div"); row.className = "comparison-row"; row.innerHTML = `<span>${label}</span><b>${av.toFixed(1)} GW</b><b>${bv.toFixed(1)} GW</b>`; container.append(row);
  }
}

Object.values(controls).forEach(([inputId]) => byId(inputId).addEventListener("input", () => { markPreset(""); update(); }));
document.querySelectorAll("[data-preset]").forEach((button) => button.addEventListener("click", () => applyPreset(button.dataset.preset)));
byId("hour-selector").addEventListener("input", (event) => { selectedHour = Number(event.target.value); drawChart("chart-a", result.dependable); drawChart("chart-b", result.timeDependent); renderHourDetail(); });
setControls(DEFAULT_ADEQUACY_CONFIG);
update();

