import {
  clearCapacityAuction,
  DEFAULT_DEMAND,
  DEFAULT_SUPPLY_BLOCKS,
  resourceRevenue,
} from "./model.mjs";

const SVG_NS = "http://www.w3.org/2000/svg";
const byId = (id) => document.getElementById(id);
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const compactMoney = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 2 });
const supplyColors = ["#3e6672", "#9c7446", "#627c62", "#8d6e9e", "#b7554e"];

const cloneBlocks = (blocks) => blocks.map((block) => ({ ...block }));
const presets = {
  base: { demand: { ...DEFAULT_DEMAND }, blocks: cloneBlocks(DEFAULT_SUPPLY_BLOCKS) },
  "data-center": { demand: { ...DEFAULT_DEMAND, targetGW: 70 }, blocks: cloneBlocks(DEFAULT_SUPPLY_BLOCKS) },
  retirement: {
    demand: { ...DEFAULT_DEMAND },
    blocks: cloneBlocks(DEFAULT_SUPPLY_BLOCKS).map((block) => block.id === "coal" ? { ...block, capacityGW: 0 } : block),
  },
  zone: {
    demand: { targetGW: 45, netConePerMWDay: 230, widthPct: 16 },
    blocks: cloneBlocks(DEFAULT_SUPPLY_BLOCKS).map((block) => ({
      ...block,
      capacityGW: { nuclear: 12, coal: 8, cc: 18, dr: 4, "new-gas": 12 }[block.id],
    })),
  },
};

let blocks = cloneBlocks(DEFAULT_SUPPLY_BLOCKS);
let result;

function svgElement(name, attributes = {}, text = "") {
  const element = document.createElementNS(SVG_NS, name);
  for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
  if (text) element.textContent = text;
  return element;
}

function renderSupplyEditor() {
  const editor = byId("supply-editor");
  editor.replaceChildren();
  blocks.forEach((block, index) => {
    const row = document.createElement("div");
    row.className = "supply-row";
    row.innerHTML = `
      <label><i style="--block-color:${supplyColors[index]}"></i><span>${block.name}</span></label>
      <input type="number" min="0" max="50" step="1" value="${block.capacityGW}" aria-label="${block.name} capacity in GW" data-block="${index}" data-field="capacityGW" />
      <input type="number" min="0" max="500" step="5" value="${block.offerPerMWDay}" aria-label="${block.name} offer in dollars per MW-day" data-block="${index}" data-field="offerPerMWDay" />`;
    editor.append(row);
  });
  editor.querySelectorAll("input").forEach((input) => input.addEventListener("input", (event) => {
    const index = Number(event.target.dataset.block);
    blocks[index][event.target.dataset.field] = Number(event.target.value);
    markPreset("");
    update();
  }));
}

function readDemand() {
  return {
    targetGW: Number(byId("target").value),
    netConePerMWDay: Number(byId("net-cone").value),
    widthPct: Number(byId("curve-width").value),
  };
}

function setDemand(demand) {
  byId("target").value = demand.targetGW;
  byId("net-cone").value = demand.netConePerMWDay;
  byId("curve-width").value = demand.widthPct;
}

function markPreset(name) {
  document.querySelectorAll("[data-preset]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.preset === name)));
}

function applyPreset(name) {
  const preset = presets[name];
  blocks = cloneBlocks(preset.blocks);
  setDemand(preset.demand);
  renderSupplyEditor();
  markPreset(name);
  update();
}

function formatPayment(value) {
  return value >= 1_000_000 ? compactMoney.format(value) : money.format(value);
}

function update() {
  const demand = readDemand();
  byId("target-output").value = `${demand.targetGW} GW`;
  byId("net-cone-output").value = `$${demand.netConePerMWDay}/MW-day`;
  byId("curve-width-output").value = `±${demand.widthPct}%`;
  result = clearCapacityAuction(blocks, demand);

  byId("cleared-quantity").textContent = `${result.clearedQuantityGW.toFixed(1)} GW`;
  byId("clearing-price").textContent = `$${result.clearingPricePerMWDay.toFixed(0)}`;
  byId("annual-payment").textContent = formatPayment(result.grossAnnualPayment);
  const difference = result.quantityVersusTargetGW;
  byId("target-difference").textContent = `${difference >= 0 ? "+" : ""}${difference.toFixed(1)} GW versus target`;

  drawAuctionChart(result);
  renderOutcome(result);
  updateRevenue();
}

function drawAuctionChart(auction) {
  const svg = byId("auction-chart");
  const title = svg.querySelector("title")?.textContent;
  const description = svg.querySelector("desc")?.textContent;
  svg.replaceChildren(
    svgElement("title", {}, title),
    svgElement("desc", {}, description),
  );

  const width = 900;
  const height = 510;
  const margin = { top: 30, right: 34, bottom: 72, left: 82 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const xMax = Math.ceil(Math.max(auction.totalSupplyGW, auction.demand.upperQuantityGW) * 1.08 / 10) * 10;
  const highestOffer = Math.max(0, ...auction.blocks.map((block) => block.offerPerMWDay));
  const yMax = Math.max(100, Math.ceil(Math.max(highestOffer, auction.demand.maximumPricePerMWDay) * 1.12 / 50) * 50);
  const x = (value) => margin.left + value / xMax * plotWidth;
  const y = (value) => margin.top + plotHeight - value / yMax * plotHeight;

  const plot = svgElement("g");
  svg.append(plot);
  for (let tick = 0; tick <= xMax; tick += xMax <= 60 ? 10 : 20) {
    plot.append(svgElement("line", { x1: x(tick), x2: x(tick), y1: margin.top, y2: height - margin.bottom, class: "grid-line" }));
    plot.append(svgElement("text", { x: x(tick), y: height - margin.bottom + 24, "text-anchor": tick === 0 ? "start" : tick === xMax ? "end" : "middle", class: "axis-text" }, tick));
  }
  const yStep = yMax <= 300 ? 50 : 100;
  for (let tick = 0; tick <= yMax; tick += yStep) {
    plot.append(svgElement("line", { x1: margin.left, x2: width - margin.right, y1: y(tick), y2: y(tick), class: "grid-line" }));
    plot.append(svgElement("text", { x: margin.left - 12, y: y(tick) + 4, "text-anchor": "end", class: "axis-text" }, `$${tick}`));
  }
  plot.append(svgElement("rect", { x: margin.left, y: margin.top, width: plotWidth, height: plotHeight, class: "chart-frame" }));

  const targetX = x(auction.demand.targetGW);
  plot.append(svgElement("line", { x1: targetX, x2: targetX, y1: margin.top, y2: height - margin.bottom, class: "target-line" }));
  plot.append(svgElement("text", { x: targetX + 7, y: margin.top + 16, class: "target-label" }, `Target ${auction.demand.targetGW.toFixed(0)} GW`));

  const demandPath = [
    `M${x(0)},${y(auction.demand.maximumPricePerMWDay)}`,
    `L${x(auction.demand.lowerQuantityGW)},${y(auction.demand.maximumPricePerMWDay)}`,
    `L${x(auction.demand.upperQuantityGW)},${y(0)}`,
    `L${x(xMax)},${y(0)}`,
  ].join(" ");
  plot.append(svgElement("path", { d: demandPath, class: "demand-path" }));

  let cumulative = 0;
  let fullSupplyPath = "";
  let acceptedPath = "";
  auction.blocks.forEach((block, index) => {
    const start = cumulative;
    const end = start + block.capacityGW;
    fullSupplyPath += `${index === 0 ? "M" : "L"}${x(start)},${y(block.offerPerMWDay)} L${x(end)},${y(block.offerPerMWDay)} `;
    if (block.clearedGW > 0) {
      acceptedPath += `M${x(start)},${y(block.offerPerMWDay)} L${x(start + block.clearedGW)},${y(block.offerPerMWDay)} `;
    }
    cumulative = end;
  });
  plot.append(svgElement("path", { d: fullSupplyPath, class: "supply-path" }));
  plot.append(svgElement("path", { d: acceptedPath, class: "accepted-path" }));

  const clearX = x(auction.clearedQuantityGW);
  const clearY = y(auction.clearingPricePerMWDay);
  plot.append(svgElement("line", { x1: margin.left, x2: clearX, y1: clearY, y2: clearY, class: "clearing-guide" }));
  plot.append(svgElement("line", { x1: clearX, x2: clearX, y1: clearY, y2: height - margin.bottom, class: "clearing-guide" }));
  plot.append(svgElement("circle", { cx: clearX, cy: clearY, r: 7, class: "clearing-dot" }));

  const labelX = clearX > width * 0.72 ? clearX - 14 : clearX + 14;
  const labelAnchor = clearX > width * 0.72 ? "end" : "start";
  const labelY = Math.max(margin.top + 24, clearY - 18);
  plot.append(svgElement("text", { x: labelX, y: labelY, "text-anchor": labelAnchor, class: "clearing-label" }, `${auction.clearedQuantityGW.toFixed(1)} GW at $${auction.clearingPricePerMWDay.toFixed(0)}`));

  plot.append(svgElement("text", { x: margin.left + plotWidth / 2, y: height - 18, "text-anchor": "middle", class: "axis-title" }, "Accredited capacity (GW)"));
  plot.append(svgElement("text", { x: 19, y: margin.top + plotHeight / 2, transform: `rotate(-90 19 ${margin.top + plotHeight / 2})`, "text-anchor": "middle", class: "axis-title" }, "Capacity price ($/MW-day)"));
}

function renderOutcome(auction) {
  const marginal = auction.blocks.find((block) => block.id === auction.marginalBlockId);
  let heading;
  let detail;
  if (auction.exhaustedSupply) {
    heading = "Every offered MW clears—and demand still values more capacity.";
    detail = `The model exhausts ${auction.totalSupplyGW.toFixed(1)} GW of supply. This is a scarcity edge case, so the displayed price comes from demand at the end of the available stack.`;
  } else if (!marginal) {
    heading = "No offered block clears.";
    detail = "The first offer sits above the demand curve's willingness to pay at zero quantity.";
  } else {
    const accepted = marginal.clearedGW < marginal.capacityGW - 1e-6 ? `${marginal.clearedGW.toFixed(1)} of its ${marginal.capacityGW.toFixed(1)} GW clears` : "its full block clears";
    heading = `${marginal.name} is marginal.`;
    detail = `Its $${marginal.offerPerMWDay}/MW-day offer meets the demand curve; ${accepted}. In this simplified uniform-price auction, all ${auction.clearedQuantityGW.toFixed(1)} cleared GW receive $${auction.clearingPricePerMWDay.toFixed(0)}/MW-day.`;
  }
  byId("outcome").innerHTML = `<div><span>What set the result</span><h3>${heading}</h3></div><p>${detail}</p>`;
}

function updateRevenue() {
  const inputs = {
    nameplateMW: Number(byId("resource-nameplate").value),
    accreditationPct: Number(byId("resource-accreditation").value),
    annualEnergyGWh: Number(byId("resource-energy").value),
    energyMarginPerMWh: Number(byId("energy-margin").value),
    clearingPricePerMWDay: result?.clearingPricePerMWDay ?? 0,
  };
  byId("resource-nameplate-output").value = `${inputs.nameplateMW.toLocaleString()} MW`;
  byId("resource-accreditation-output").value = `${inputs.accreditationPct}%`;
  byId("resource-energy-output").value = `${inputs.annualEnergyGWh.toLocaleString()} GWh`;
  byId("energy-margin-output").value = `$${inputs.energyMarginPerMWh}/MWh`;
  const revenue = resourceRevenue(inputs);
  byId("revenue-total").textContent = formatPayment(revenue.total);
  byId("accredited-capacity").textContent = `${revenue.accreditedMW.toLocaleString()} accredited MW × $${inputs.clearingPricePerMWDay.toFixed(0)}/MW-day`;
  byId("capacity-revenue").textContent = formatPayment(revenue.capacityRevenue);
  byId("energy-revenue").textContent = formatPayment(revenue.energyMargin);
  byId("capacity-bar").style.width = `${revenue.capacitySharePct}%`;
  byId("energy-bar").style.width = `${100 - revenue.capacitySharePct}%`;
}

["target", "net-cone", "curve-width"].forEach((id) => byId(id).addEventListener("input", () => { markPreset(""); update(); }));
document.querySelectorAll("[data-preset]").forEach((button) => button.addEventListener("click", () => applyPreset(button.dataset.preset)));
["resource-nameplate", "resource-accreditation", "resource-energy", "energy-margin"].forEach((id) => byId(id).addEventListener("input", updateRevenue));

setDemand(DEFAULT_DEMAND);
renderSupplyEditor();
update();
