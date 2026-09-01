import {
  DEFAULT_SYSTEM_CONFIG,
  runTwoUnitTrials,
  simulateReliability,
  twoUnitStateSpace,
} from "./model.mjs";

const SVG_NS = "http://www.w3.org/2000/svg";
const byId = (id) => document.getElementById(id);
const integer = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const svgElement = (name, attributes = {}, text = "") => {
  const node = document.createElementNS(SVG_NS, name);
  for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, value);
  if (text) node.textContent = text;
  return node;
};
const linePath = (points) => points.map(([x, y], index) => `${index ? "L" : "M"}${x},${y}`).join(" ");

let coinTrialCount = 0;
let coinResult = null;

function readCoinConfig() {
  return {
    unitCapacityMW: 60,
    availabilityPct: Number(byId("unit-availability").value),
    loadMW: Number(byId("coin-load").value),
  };
}

function updateCoinExperiment() {
  const config = readCoinConfig();
  const seed = Number(byId("coin-seed").value);
  const analytical = twoUnitStateSpace(config);
  coinResult = runTwoUnitTrials(config, coinTrialCount, seed);
  byId("unit-availability-output").value = `${config.availabilityPct}%`;
  byId("coin-load-output").value = `${config.loadMW} MW`;
  renderStates(analytical);
  renderCoinMetrics(coinResult);
  drawCoinConvergence(coinResult);
  renderOutcomeCounts(coinResult);
}

function renderStates(analytical) {
  const container = byId("state-space");
  container.replaceChildren();
  for (const state of analytical.states) {
    const card = document.createElement("article");
    card.className = `state-card ${state.lossOfLoad ? "shortage" : "served"}`;
    card.innerHTML = `<div><span>${state.label}</span><strong>${(state.probability * 100).toFixed(1)}%</strong></div><div class="unit-icons" aria-hidden="true">${Array.from({ length: 2 }, (_, index) => `<i class="${index < state.availableUnits ? "up" : "down"}"></i>`).join("")}</div><p>${state.availableMW} MW available · ${state.shortageMW ? `${state.shortageMW} MW short` : "load served"}</p><div class="probability-bar"><i style="width:${state.probability * 100}%"></i></div>`;
    container.append(card);
  }
}

function renderCoinMetrics(result) {
  byId("trial-count").textContent = integer.format(result.trials);
  byId("sample-lolp").textContent = result.trials ? `${(result.sampleLolp * 100).toFixed(2)}%` : "—";
  byId("sample-eue").textContent = result.trials ? `${result.sampleEueMWh.toFixed(2)} MWh` : "—";
  byId("analytical-lolp").textContent = `analytical: ${(result.analytical.lolp * 100).toFixed(2)}%`;
  byId("analytical-eue").textContent = `analytical: ${result.analytical.eueMWh.toFixed(2)} MWh`;
}

function renderOutcomeCounts(result) {
  const container = byId("outcome-counts");
  container.replaceChildren();
  for (const state of result.analytical.states) {
    const count = result.counts[state.id];
    const observed = result.trials ? count / result.trials * 100 : 0;
    const row = document.createElement("div");
    row.innerHTML = `<span>${state.label}</span><strong>${integer.format(count)}</strong><div><i style="width:${observed}%"></i></div><small>${result.trials ? `${observed.toFixed(1)}% observed` : "no trials yet"}</small>`;
    container.append(row);
  }
}

function drawCoinConvergence(result) {
  const svg = byId("coin-convergence");
  svg.replaceChildren();
  const width = 720, height = 320, margin = { top: 22, right: 24, bottom: 52, left: 66 };
  const plotW = width - margin.left - margin.right, plotH = height - margin.top - margin.bottom;
  const analyticalPct = result.analytical.lolp * 100;
  const values = result.history.map((point) => point.sampleLolp * 100);
  const yMax = Math.max(25, Math.ceil(Math.max(analyticalPct, ...values, 1) / 10) * 10);
  const xMax = Math.max(10, result.trials);
  const x = (value) => margin.left + value / xMax * plotW;
  const y = (value) => margin.top + plotH - value / yMax * plotH;
  drawAxes(svg, { width, height, margin, xMax, yMax, xTicks: 4, yTicks: 4, xLabel: "Trials", yLabel: "Sample LOLP (%)" });
  svg.append(svgElement("line", { x1: margin.left, x2: width - margin.right, y1: y(analyticalPct), y2: y(analyticalPct), class: "benchmark-line" }));
  svg.append(svgElement("text", { x: width - margin.right - 4, y: y(analyticalPct) - 7, "text-anchor": "end", class: "benchmark-label" }, `Analytical ${analyticalPct.toFixed(1)}%`));
  if (result.history.length) {
    svg.append(svgElement("path", { d: linePath(result.history.map((point) => [x(point.trials), y(point.sampleLolp * 100)])), class: "sample-path" }));
    const last = result.history.at(-1);
    svg.append(svgElement("circle", { cx: x(last.trials), cy: y(last.sampleLolp * 100), r: 5, class: "sample-dot" }));
  }
}

function drawAxes(svg, { width, height, margin, xMax, yMax, xTicks, yTicks, xLabel, yLabel, xFormatter = integer.format }) {
  const plotW = width - margin.left - margin.right, plotH = height - margin.top - margin.bottom;
  const x = (value) => margin.left + value / xMax * plotW;
  const y = (value) => margin.top + plotH - value / yMax * plotH;
  for (let index = 0; index <= xTicks; index += 1) {
    const value = xMax * index / xTicks;
    svg.append(svgElement("line", { x1: x(value), x2: x(value), y1: margin.top, y2: height - margin.bottom, class: "grid-line" }));
    svg.append(svgElement("text", { x: x(value), y: height - margin.bottom + 21, "text-anchor": index === 0 ? "start" : index === xTicks ? "end" : "middle", class: "axis-text" }, xFormatter(value)));
  }
  for (let index = 0; index <= yTicks; index += 1) {
    const value = yMax * index / yTicks;
    svg.append(svgElement("line", { x1: margin.left, x2: width - margin.right, y1: y(value), y2: y(value), class: "grid-line" }));
    svg.append(svgElement("text", { x: margin.left - 9, y: y(value) + 4, "text-anchor": "end", class: "axis-text" }, Number.isInteger(value) ? value : value.toFixed(1)));
  }
  svg.append(svgElement("rect", { x: margin.left, y: margin.top, width: plotW, height: plotH, class: "chart-frame" }));
  svg.append(svgElement("text", { x: margin.left + plotW / 2, y: height - 9, "text-anchor": "middle", class: "axis-title" }, xLabel));
  svg.append(svgElement("text", { x: 16, y: margin.top + plotH / 2, transform: `rotate(-90 16 ${margin.top + plotH / 2})`, "text-anchor": "middle", class: "axis-title" }, yLabel));
}

document.querySelectorAll("[data-add-trials]").forEach((button) => button.addEventListener("click", () => {
  coinTrialCount += Number(button.dataset.addTrials);
  updateCoinExperiment();
}));
byId("reset-trials").addEventListener("click", () => { coinTrialCount = 0; updateCoinExperiment(); });
["unit-availability", "coin-load", "coin-seed"].forEach((id) => byId(id).addEventListener("input", () => { coinTrialCount = 0; updateCoinExperiment(); }));

const systemControlMap = {
  peakLoadGW: ["peak-load", "peak-load-output", (value) => `${value} GW`],
  dataCenterGW: ["data-center-load", "data-center-load-output", (value) => `${value} GW`],
  thermalForcedOutagePct: ["forced-outage", "forced-outage-output", (value) => `${value}%`],
  commonEventPct: ["common-event", "common-event-output", (value) => `${value}%`],
  batteryDurationHours: ["battery-duration", "battery-duration-output", (value) => `${value} h`],
  demandResponseGW: ["demand-response", "demand-response-output", (value) => `${value} GW`],
  trials: ["system-trials", "system-trials-output", (value) => integer.format(value)],
  seed: ["system-seed", null, String],
};
const systemPresets = {
  base: { ...DEFAULT_SYSTEM_CONFIG },
  "data-center": { ...DEFAULT_SYSTEM_CONFIG, dataCenterGW: 10 },
  correlated: { ...DEFAULT_SYSTEM_CONFIG, thermalForcedOutagePct: 8, commonEventPct: 5 },
  flexible: { ...DEFAULT_SYSTEM_CONFIG, dataCenterGW: 10, batteryDurationHours: 8, demandResponseGW: 12 },
};
let systemResult;

function setSystemControls(config) {
  for (const [key, [inputId]] of Object.entries(systemControlMap)) byId(inputId).value = config[key];
  updateSystemOutputs();
}

function readSystemControls() {
  return Object.fromEntries(Object.entries(systemControlMap).map(([key, [inputId]]) => [key, Number(byId(inputId).value)]));
}

function updateSystemOutputs() {
  for (const [, [inputId, outputId, formatter]] of Object.entries(systemControlMap)) {
    if (outputId) byId(outputId).value = formatter(Number(byId(inputId).value));
  }
}

function markSystemPreset(name) {
  document.querySelectorAll("[data-system-preset]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.systemPreset === name)));
}

function runSystem() {
  const button = byId("run-system");
  button.disabled = true;
  button.textContent = "Simulating…";
  requestAnimationFrame(() => requestAnimationFrame(() => {
    systemResult = simulateReliability(readSystemControls());
    renderSystemResult(systemResult);
    byId("stale-note").hidden = true;
    button.disabled = false;
    button.textContent = "Run simulation";
  }));
}

function renderSystemResult(result) {
  byId("system-lole").textContent = result.loleDaysPerYear.toFixed(3);
  byId("system-lolh").textContent = result.lolhHoursPerYear.toFixed(2);
  byId("system-eue").textContent = result.eueGWhPerYear.toFixed(1);
  const status = result.loleDaysPerYear <= 0.1 ? "meets" : "exceeds";
  byId("risk-summary").innerHTML = `<strong>${result.probabilityAnyShortagePct.toFixed(1)}%</strong> of simulated 30-day periods contain at least one shortage. The annualized LOLE <strong>${status}</strong> the 0.1 day/year reference in this teaching model.`;
  drawSystemConvergence(result);
  drawEueHistogram(result);
  drawWorstDay(result);
}

function drawSystemConvergence(result) {
  const svg = byId("system-convergence");
  svg.replaceChildren();
  const width = 590, height = 330, margin = { top: 20, right: 22, bottom: 52, left: 66 };
  const plotW = width - margin.left - margin.right, plotH = height - margin.top - margin.bottom;
  const yMax = Math.max(0.2, Math.ceil(Math.max(...result.convergence.map((point) => point.loleDaysPerYear), 0.1) * 5) / 5);
  const xMax = result.config.trials;
  const x = (value) => margin.left + value / xMax * plotW;
  const y = (value) => margin.top + plotH - value / yMax * plotH;
  drawAxes(svg, { width, height, margin, xMax, yMax, xTicks: 4, yTicks: 4, xLabel: "Simulated 30-day periods", yLabel: "Annualized LOLE (days/year)" });
  svg.append(svgElement("line", { x1: margin.left, x2: width - margin.right, y1: y(0.1), y2: y(0.1), class: "benchmark-line" }));
  svg.append(svgElement("text", { x: width - margin.right - 4, y: Math.max(margin.top + 12, y(0.1) - 6), "text-anchor": "end", class: "benchmark-label" }, "0.1 reference"));
  svg.append(svgElement("path", { d: linePath(result.convergence.map((point) => [x(point.trials), y(point.loleDaysPerYear)])), class: "sample-path" }));
}

function drawEueHistogram(result) {
  const svg = byId("eue-histogram");
  svg.replaceChildren();
  const width = 590, height = 330, margin = { top: 20, right: 22, bottom: 52, left: 66 };
  const plotW = width - margin.left - margin.right, plotH = height - margin.top - margin.bottom;
  const xMax = Math.max(1, result.histogram.at(-1).maximum);
  const yMax = Math.max(1, ...result.histogram.map((bin) => bin.count));
  const x = (value) => margin.left + value / xMax * plotW;
  const y = (value) => margin.top + plotH - value / yMax * plotH;
  drawAxes(svg, { width, height, margin, xMax, yMax, xTicks: 4, yTicks: 4, xLabel: "Annualized unserved energy in one trial (GWh)", yLabel: "Trial count", xFormatter: (value) => value >= 1000 ? `${(value / 1000).toFixed(1)}k` : integer.format(value) });
  for (const bin of result.histogram) {
    const barX = x(bin.minimum) + 1;
    const barWidth = Math.max(1, x(bin.maximum) - x(bin.minimum) - 2);
    svg.append(svgElement("rect", { x: barX, y: y(bin.count), width: barWidth, height: height - margin.bottom - y(bin.count), class: "histogram-bar" }));
  }
}

function drawWorstDay(result) {
  const hours = result.worstTrial.hours;
  const dayTotals = new Map();
  for (const hour of hours) dayTotals.set(hour.day, (dayTotals.get(hour.day) ?? 0) + hour.unservedGW);
  const [worstDay, worstDayEue] = [...dayTotals.entries()].sort((a, b) => b[1] - a[1])[0] ?? [0, 0];
  const dayHours = hours.filter((hour) => hour.day === worstDay);
  const event = dayHours.some((hour) => hour.commonEvent);
  byId("worst-day-title").textContent = `Day ${worstDay + 1} of the highest-EUE trial`;
  byId("worst-day-description").textContent = `${worstDayEue.toFixed(1)} GWh unserved${event ? " during a common stress event" : ""}. The gold gap shows shortage after demand response and battery discharge.`;
  const svg = byId("worst-day-chart");
  svg.replaceChildren();
  const width = 900, height = 320, margin = { top: 22, right: 24, bottom: 52, left: 66 };
  const plotW = width - margin.left - margin.right, plotH = height - margin.top - margin.bottom;
  const values = dayHours.flatMap((hour) => [hour.loadGW, hour.thermalGW + hour.solarGW + hour.windGW + hour.demandResponseGW + hour.batteryDischargeGW]);
  const yMax = Math.max(20, Math.ceil(Math.max(...values, 1) / 25) * 25);
  const x = (value) => margin.left + value / 23 * plotW;
  const y = (value) => margin.top + plotH - value / yMax * plotH;
  drawAxes(svg, { width, height, margin, xMax: 23, yMax, xTicks: 4, yTicks: 4, xLabel: "Hour of day", yLabel: "GW", xFormatter: (value) => `${Math.round(value)}:00` });
  for (const hour of dayHours) {
    if (hour.unservedGW > 0) {
      const available = hour.loadGW - hour.unservedGW;
      svg.append(svgElement("rect", { x: x(hour.hourOfDay) - plotW / 48, y: y(hour.loadGW), width: plotW / 24, height: y(available) - y(hour.loadGW), class: "shortage-bar" }));
    }
  }
  const capability = (hour) => hour.thermalGW + hour.solarGW + hour.windGW + hour.demandResponseGW + hour.batteryDischargeGW;
  svg.append(svgElement("path", { d: linePath(dayHours.map((hour) => [x(hour.hourOfDay), y(capability(hour))])), class: "capability-path" }));
  svg.append(svgElement("path", { d: linePath(dayHours.map((hour) => [x(hour.hourOfDay), y(hour.loadGW)])), class: "load-path" }));
}

for (const [, [inputId]] of Object.entries(systemControlMap)) byId(inputId).addEventListener("input", () => {
  updateSystemOutputs();
  markSystemPreset("");
  byId("stale-note").hidden = false;
});
document.querySelectorAll("[data-system-preset]").forEach((button) => button.addEventListener("click", () => {
  setSystemControls(systemPresets[button.dataset.systemPreset]);
  markSystemPreset(button.dataset.systemPreset);
  runSystem();
}));
byId("run-system").addEventListener("click", runSystem);
byId("new-seed").addEventListener("click", () => { byId("system-seed").value = Number(byId("system-seed").value) + 1; markSystemPreset(""); runSystem(); });

updateCoinExperiment();
setSystemControls(DEFAULT_SYSTEM_CONFIG);
runSystem();
