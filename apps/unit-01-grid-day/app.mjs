import { DEFAULT_CONFIG, simulateGrid } from "./model.mjs";

const SVG_NS = "http://www.w3.org/2000/svg";

const controlDefinitions = {
  steadyCapacityGW: {
    input: "steady-capacity",
    output: "steady-capacity-output",
    format: (value) => `${value} GW`,
  },
  flexibleCapacityGW: {
    input: "flexible-capacity",
    output: "flexible-capacity-output",
    format: (value) => `${value} GW`,
  },
  solarCapacityGW: {
    input: "solar-capacity",
    output: "solar-capacity-output",
    format: (value) => `${value} GW`,
  },
  windCapacityGW: {
    input: "wind-capacity",
    output: "wind-capacity-output",
    format: (value) => `${value} GW`,
  },
  batteryPowerGW: {
    input: "battery-power",
    output: "battery-power-output",
    format: (value) => `${value} GW`,
  },
  batteryDurationHours: {
    input: "battery-duration",
    output: "battery-duration-output",
    format: (value) => `${value} ${Number(value) === 1 ? "hour" : "hours"}`,
  },
  batteryInitialSocPct: {
    input: "battery-soc",
    output: "battery-soc-output",
    format: (value) => `${value}%`,
  },
  dataCenterLoadGW: {
    input: "data-center-load",
    output: "data-center-load-output",
    format: (value) => `${value} GW`,
  },
  dataCenterStartHour: {
    input: "data-center-start",
    output: "data-center-start-output",
    format: (value) => formatHour(Number(value)),
  },
  outageSizeGW: {
    input: "outage-size",
    output: "outage-size-output",
    format: (value) => `${value} GW`,
  },
  outageStartHour: {
    input: "outage-start",
    output: "outage-start-output",
    format: (value) => formatHour(Number(value)),
  },
  outageDurationHours: {
    input: "outage-duration",
    output: "outage-duration-output",
    format: (value) => `${value} ${Number(value) === 1 ? "hour" : "hours"}`,
  },
};

const presets = {
  balanced: {},
  "data-center": { dataCenterLoadGW: 12, dataCenterStartHour: 0 },
  outage: { outageSizeGW: 20, outageStartHour: 17, outageDurationHours: 4 },
  compound: {
    dataCenterLoadGW: 12,
    dataCenterStartHour: 0,
    outageSizeGW: 20,
    outageStartHour: 17,
    outageDurationHours: 4,
  },
};

const controls = Object.fromEntries(
  Object.entries(controlDefinitions).map(([key, definition]) => [
    key,
    {
      ...definition,
      inputElement: document.getElementById(definition.input),
      outputElement: document.getElementById(definition.output),
    },
  ]),
);

let selectedHour = 17;
let activePreset = "balanced";
let currentResult = simulateGrid();

function formatHour(hour) {
  const normalizedHour = ((hour % 24) + 24) % 24;
  if (normalizedHour === 0) return "Midnight";
  if (normalizedHour === 12) return "Noon";
  if (normalizedHour < 12) return `${normalizedHour} a.m.`;
  return `${normalizedHour - 12} p.m.`;
}

function formatNumber(value, digits = 1) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

function svgElement(name, attributes = {}, text = "") {
  const element = document.createElementNS(SVG_NS, name);
  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, String(value));
  }
  if (text) element.textContent = text;
  return element;
}

function readConfig() {
  return Object.fromEntries(
    Object.entries(controls).map(([key, control]) => [
      key,
      Number(control.inputElement.value),
    ]),
  );
}

function setControls(config) {
  for (const [key, control] of Object.entries(controls)) {
    control.inputElement.value = config[key];
    control.outputElement.value = control.format(config[key]);
  }
}

function markPreset(name) {
  activePreset = name;
  for (const button of document.querySelectorAll("[data-preset]")) {
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.preset === activePreset),
    );
  }
}

function applyPreset(name) {
  const config = { ...DEFAULT_CONFIG, ...presets[name] };
  setControls(config);
  markPreset(name);
  update();
}

function updateOutputs() {
  for (const control of Object.values(controls)) {
    control.outputElement.value = control.format(control.inputElement.value);
  }
}

function update() {
  updateOutputs();
  currentResult = simulateGrid(readConfig());
  renderSummary(currentResult);
  renderBalanceChart(currentResult);
  renderHourDetail(currentResult.hours[selectedHour]);
  renderStorageChart(currentResult);
}

function renderSummary(result) {
  const { summary } = result;
  document.getElementById("peak-load").textContent =
    `${formatNumber(summary.peakLoadGW)} GW`;
  document.getElementById("daily-energy").textContent =
    `${formatNumber(summary.dailyEnergyGWh / 1000, 2)} TWh`;
  document.getElementById("load-factor").textContent =
    `${formatNumber(summary.loadFactorPct)}%`;
  document.getElementById("unserved-energy").textContent =
    `${formatNumber(summary.unservedEnergyGWh)} GWh`;

  const reliabilitySummary = document.getElementById("reliability-summary");
  const systemStatus = document.getElementById("system-status");
  const hasShortage = summary.shortageHours > 0;
  reliabilitySummary.classList.toggle("has-shortage", hasShortage);
  systemStatus.classList.toggle("warning", hasShortage);
  systemStatus.textContent = hasShortage
    ? `${summary.shortageHours} shortage ${summary.shortageHours === 1 ? "hour" : "hours"}; the fleet cannot fully serve demand.`
    : "Demand is served in every hour, but the margin may still be thin.";
}

function renderBalanceChart(result) {
  const svg = document.getElementById("balance-chart");
  svg.replaceChildren();

  const width = 960;
  const height = 420;
  const margin = { top: 20, right: 18, bottom: 52, left: 58 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const step = plotWidth / 24;
  const barWidth = Math.max(8, step - 5);
  const yMaximum =
    Math.ceil(
      Math.max(...result.hours.map((hour) => hour.customerLoadGW)) / 25,
    ) *
      25 +
    25;
  const y = (value) => margin.top + plotHeight - (value / yMaximum) * plotHeight;
  const x = (hour) => margin.left + hour * step + (step - barWidth) / 2;

  for (let tick = 0; tick <= yMaximum; tick += 25) {
    const tickY = y(tick);
    svg.append(
      svgElement("line", {
        x1: margin.left,
        x2: width - margin.right,
        y1: tickY,
        y2: tickY,
        class: "chart-grid",
      }),
      svgElement(
        "text",
        {
          x: margin.left - 10,
          y: tickY + 4,
          "text-anchor": "end",
          class: "chart-axis",
        },
        tick,
      ),
    );
  }

  svg.append(
    svgElement(
      "text",
      {
        x: 16,
        y: margin.top + plotHeight / 2,
        transform: `rotate(-90 16 ${margin.top + plotHeight / 2})`,
        "text-anchor": "middle",
        class: "chart-axis-title",
      },
      "Power (GW)",
    ),
  );

  const stackKeys = [
    ["steadyUsedGW", "var(--steady)"],
    ["solarUsedGW", "var(--solar)"],
    ["windUsedGW", "var(--wind)"],
    ["flexibleUsedGW", "var(--flexible)"],
    ["batteryDischargeGW", "var(--battery)"],
  ];

  for (const hour of result.hours) {
    if (hour.hour === selectedHour) {
      svg.append(
        svgElement("rect", {
          x: margin.left + hour.hour * step,
          y: margin.top,
          width: step,
          height: plotHeight,
          class: "selected-hour",
        }),
      );
    }

    let accumulated = 0;
    for (const [key, color] of stackKeys) {
      const value = hour[key];
      if (value <= 0) continue;
      const top = accumulated + value;
      svg.append(
        svgElement("rect", {
          x: x(hour.hour),
          y: y(top),
          width: barWidth,
          height: Math.max(0, y(accumulated) - y(top)),
          fill: color,
        }),
      );
      accumulated = top;
    }

    if (hour.unservedGW > 0) {
      svg.append(
        svgElement("rect", {
          x: x(hour.hour),
          y: y(hour.customerLoadGW),
          width: barWidth,
          height: y(hour.servedLoadGW) - y(hour.customerLoadGW),
          fill: "var(--unserved)",
        }),
      );
    }

    if (hour.hour % 3 === 0 || hour.hour === 23) {
      svg.append(
        svgElement(
          "text",
          {
            x: x(hour.hour) + barWidth / 2,
            y: height - 24,
            "text-anchor": "middle",
            class: "chart-axis",
          },
          hour.hour === 0 ? "12a" : hour.hour === 12 ? "12p" : `${hour.hour % 12}${hour.hour < 12 ? "a" : "p"}`,
        ),
      );
    }
  }

  const demandPath = result.hours
    .map((hour, index) => {
      const pointX = x(hour.hour) + barWidth / 2;
      const pointY = y(hour.customerLoadGW);
      return `${index === 0 ? "M" : "L"}${pointX},${pointY}`;
    })
    .join(" ");
  svg.append(svgElement("path", { d: demandPath, class: "demand-path" }));

  for (const hour of result.hours) {
    const centerX = x(hour.hour) + barWidth / 2;
    if (hour.hour === selectedHour) {
      svg.append(
        svgElement("circle", {
          cx: centerX,
          cy: y(hour.customerLoadGW),
          r: 4,
          class: "demand-dot",
        }),
      );
    }

    const hit = svgElement("rect", {
      x: margin.left + hour.hour * step,
      y: margin.top,
      width: step,
      height: plotHeight,
      class: "hour-hit",
      tabindex: 0,
      role: "button",
      "aria-label": `${formatHour(hour.hour)}: ${formatNumber(hour.customerLoadGW)} GW demand, ${formatNumber(hour.unservedGW)} GW unserved. Select for details.`,
    });
    const select = () => {
      selectedHour = hour.hour;
      renderBalanceChart(currentResult);
      renderHourDetail(currentResult.hours[selectedHour]);
      renderStorageChart(currentResult);
    };
    hit.addEventListener("click", select);
    hit.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        select();
      }
    });
    svg.append(hit);
  }

  svg.append(
    svgElement(
      "text",
      {
        x: margin.left + plotWidth / 2,
        y: height - 3,
        "text-anchor": "middle",
        class: "chart-axis-title",
      },
      "Hour of day",
    ),
  );
}

function renderHourDetail(hour) {
  document.getElementById("hour-title").textContent = formatHour(hour.hour);
  const status = document.getElementById("hour-balance-status");
  const hasShortage = hour.unservedGW > 0.0001;
  status.classList.toggle("warning", hasShortage);
  status.textContent = hasShortage ? "Shortage" : "Balanced";

  document.getElementById("balance-equation").textContent = hasShortage
    ? `${formatNumber(hour.customerLoadGW)} GW demand = ${formatNumber(hour.servedLoadGW)} GW served + ${formatNumber(hour.unservedGW)} GW unmet`
    : `${formatNumber(hour.customerLoadGW)} GW demand = ${formatNumber(hour.servedLoadGW)} GW served`;

  const entries = [
    ["Base load", `${formatNumber(hour.baseLoadGW)} GW`],
    ["Data-center load", `${formatNumber(hour.dataCenterGW)} GW`],
    ["Steady generation", `${formatNumber(hour.steadyUsedGW)} GW`],
    [
      "Solar generation",
      `${formatNumber(hour.solarUsedGW)} of ${formatNumber(hour.solarAvailableGW)} GW available`,
    ],
    [
      "Wind generation",
      `${formatNumber(hour.windUsedGW)} of ${formatNumber(hour.windAvailableGW)} GW available`,
    ],
    [
      "Flexible generation",
      `${formatNumber(hour.flexibleUsedGW)} of ${formatNumber(hour.flexibleAvailableGW)} GW available`,
    ],
    ["Battery discharge", `${formatNumber(hour.batteryDischargeGW)} GW`],
    ["Battery charge", `${formatNumber(hour.batteryChargeGW)} GW`],
    ["Battery state of charge", `${formatNumber(hour.batterySocPct)}%`],
    ["Renewable curtailment", `${formatNumber(hour.renewableCurtailmentGW)} GW`],
  ];
  if (hour.outageActive && hour.outageGW > 0) {
    entries.splice(6, 0, ["Flexible capacity on outage", `${formatNumber(hour.outageGW)} GW`]);
  }

  const breakdown = document.getElementById("hour-breakdown");
  breakdown.replaceChildren();
  for (const [label, value] of entries) {
    breakdown.append(
      Object.assign(document.createElement("dt"), { textContent: label }),
      Object.assign(document.createElement("dd"), { textContent: value }),
    );
  }
}

function renderStorageChart(result) {
  const svg = document.getElementById("storage-chart");
  svg.replaceChildren();

  const width = 440;
  const height = 190;
  const margin = { top: 14, right: 12, bottom: 34, left: 42 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const x = (hour) => margin.left + (hour / 23) * plotWidth;
  const y = (soc) => margin.top + plotHeight - (soc / 100) * plotHeight;

  for (const tick of [0, 50, 100]) {
    svg.append(
      svgElement("line", {
        x1: margin.left,
        x2: width - margin.right,
        y1: y(tick),
        y2: y(tick),
        class: "chart-grid",
      }),
      svgElement(
        "text",
        {
          x: margin.left - 8,
          y: y(tick) + 4,
          "text-anchor": "end",
          class: "chart-axis",
        },
        `${tick}%`,
      ),
    );
  }

  const linePoints = result.hours
    .map((hour) => `${x(hour.hour)},${y(hour.batterySocPct)}`)
    .join(" L");
  const linePath = `M${linePoints}`;
  const areaPath = `${linePath} L${x(23)},${y(0)} L${x(0)},${y(0)} Z`;
  svg.append(
    svgElement("path", { d: areaPath, class: "soc-area" }),
    svgElement("path", { d: linePath, class: "soc-path" }),
  );

  for (const hour of [0, 6, 12, 18, 23]) {
    svg.append(
      svgElement(
        "text",
        {
          x: x(hour),
          y: height - 9,
          "text-anchor": hour === 0 ? "start" : hour === 23 ? "end" : "middle",
          class: "chart-axis",
        },
        hour === 0 ? "12a" : hour === 12 ? "12p" : `${hour % 12}${hour < 12 ? "a" : "p"}`,
      ),
    );
  }

  const selected = result.hours[selectedHour];
  svg.append(
    svgElement("line", {
      x1: x(selectedHour),
      x2: x(selectedHour),
      y1: margin.top,
      y2: margin.top + plotHeight,
      stroke: "var(--accent)",
      "stroke-dasharray": "3 3",
    }),
    svgElement("circle", {
      cx: x(selectedHour),
      cy: y(selected.batterySocPct),
      r: 4,
      fill: "var(--surface)",
      stroke: "var(--battery)",
      "stroke-width": 2,
    }),
  );
}

for (const control of Object.values(controls)) {
  control.inputElement.addEventListener("input", () => {
    markPreset("");
    update();
  });
}

for (const button of document.querySelectorAll("[data-preset]")) {
  button.addEventListener("click", () => applyPreset(button.dataset.preset));
}

document
  .getElementById("reset-button")
  .addEventListener("click", () => applyPreset("balanced"));

setControls(DEFAULT_CONFIG);
update();
