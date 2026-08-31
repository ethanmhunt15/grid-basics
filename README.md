# Grid Basics

A learning-by-building project about electricity markets, PJM, resource adequacy, and the power demands of AI data centers.

## What we are trying to understand

Our eventual goal is to understand the modeling behind the [SemiAnalysis PJM Capacity Model](https://pjm-model.semianalysis.com/), reproduce as much of its public-data foundation as we reasonably can, and determine why its conclusions may be economically valuable to clients.

The model's central question is deceptively simple:

> Given how much electricity PJM may need—particularly as large data-center loads connect—and given the real generating fleet and its reliability characteristics, does PJM have enough dependable capacity to keep shortage risk acceptably low?

Answering it connects several domains:

```text
AI and data-center growth
          ↓
electricity demand and load forecasts
          ↓
physical generation and transmission system
          ↓
energy, ancillary-service, and capacity markets
          ↓
probabilistic reliability modeling
          ↓
infrastructure, operating, and investment decisions
```

We are not going to begin by copying formulas or charts. The public model already uses concepts such as ICAP, UCAP, ELCC, LOLE, EUE, reserve requirements, weather-year simulations, and capacity auctions. Without the physical and economic foundations, those terms quickly become alphabet soup.

The first objective is simpler: build enough intuition to look at the model and understand what every major object represents. Reproduction comes later.

This repository is educational. It is not investment advice, an operational grid tool, or an attempt to reproduce proprietary materials.

## The conceptual doorway

Imagine a fictional system with:

- 10 GW of nuclear
- 15 GW of natural gas
- 10 GW of solar
- 5 GW of wind
- 2 GW of batteries
- 32 GW of peak demand

Does it have 42 GW available when demand reaches 32 GW?

Not necessarily. Solar output may be low during the critical hour, thermal plants can be on forced outage, wind depends on weather, and batteries eventually run out.

That is the first indispensable idea:

> **Installed MW is not the same as dependable MW.**

The SemiAnalysis model goes well beyond comparing nameplate generation with peak demand. It distinguishes the physical fleet from accredited capacity and simulates whether that fleet can serve load across uncertain weather and outage conditions.

## Curriculum

The units are ordered deliberately. Units 1–7 are prerequisites for understanding PJM's Reserve Requirement Study as an engineering and statistics problem rather than a mysterious market artifact.

### Unit 1 — Electricity from first principles

[Read the Unit 1 pre-reading](docs/unit-01-electricity-fundamentals.md)

[Open the Unit 1 lab](apps/unit-01-grid-day/index.html) after starting a local
server from the repository root:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000/apps/unit-01-grid-day/`.

Run the lab's model checks with:

```bash
node --test tests/unit-01-grid-day.test.mjs
```

**Learn**

- Power versus energy
- W, kW, MW, and GW versus Wh, kWh, MWh, and GWh
- Generation, transmission, substations, distribution, and load
- Peak demand, average demand, load factor, and load curves
- Why supply and demand must balance continuously
- AC frequency and the significance of 60 Hz
- Why electricity is difficult to inventory

**Build**

- Unit-conversion exercises
- A one-day PJM-style load curve
- An interactive supply-and-demand balance visualization

**Outcome**

Follow electricity from a generator to a wall outlet and explain the difference between a MW and a MWh without relying on memorized definitions.

### Unit 2 — Power plants and grid resources

[Read the Unit 2 pre-reading](docs/unit-02-power-plants-and-grid-resources.md)

[Open the Unit 2 lab](apps/unit-02-resources/index.html) using the same local
server as Unit 1, then visit `http://localhost:8000/apps/unit-02-resources/`.

Run its model checks with:

```bash
node --test tests/unit-02-resources.test.mjs
```

**Learn**

- Nameplate capacity and capacity factor
- Marginal cost, heat rate, fuel cost, and variable operating cost
- Dispatchability, variability, ramp rates, startup times, and minimum output
- Planned and forced outages
- The operating characteristics of nuclear, gas combined-cycle, gas turbines, coal, wind, solar, hydro, batteries, and demand response
- Why storage is both power-limited and energy-limited

**Build**

- A resource comparison explorer
- A generator operating-cost calculator
- A 24-hour fleet dispatch exercise without market prices

**Outcome**

Explain why equal nameplate quantities of solar, gas, storage, and demand response are not physically interchangeable.

### Unit 3 — Wholesale energy markets

[Read the Unit 3 pre-reading](docs/unit-03-wholesale-energy-markets.md)

[Open the Unit 3 lab](apps/unit-03-energy-market/index.html) using the local
server, then visit `http://localhost:8000/apps/unit-03-energy-market/`.

Run its model checks with:

```bash
node --test tests/unit-03-energy-market.test.mjs
```

**Learn**

- Vertically integrated utilities versus organized wholesale markets
- Bids, offers, the merit order, and the marginal generator
- Market-clearing prices and producer surplus
- Day-ahead versus real-time markets
- Why transmission congestion creates different prices by location
- Locational Marginal Pricing at an intuitive level
- Scarcity pricing and the role of operating reserves

We will defer uplift, virtual bidding, financial transmission rights, and detailed settlement rules until they become useful.

**Build**

- A single-node merit-order visualization
- A three-node congestion and LMP demo
- A small day-ahead versus real-time settlement example

**Outcome**

Given a fleet, offers, network constraint, and hourly demand, identify which plants run and what sets the price.

### Unit 4 — Resource adequacy

**Learn**

- Operating reliability versus long-term resource adequacy
- Peak-load forecasts and planning reserve margins
- Why an energy-only revenue stream may not support rarely used but essential resources
- Energy as actual production versus capacity as a commitment to be available
- Why a system with more installed capacity than peak demand can still be unreliable

The key distinction is:

> **Energy market:** Which resources should operate now?
>
> **Capacity planning and markets:** Will enough dependable resources exist for unusually difficult conditions in the future?

**Build**

- A deterministic peak-demand and reserve-margin calculator
- Scenarios showing how the same reserve margin can hide very different risks

**Outcome**

Explain why installed capacity minus peak demand is a useful starting statistic but an inadequate reliability model.

### Unit 5 — Capacity markets

**Learn**

- Why some regions use capacity markets
- Capacity obligations and resource commitments
- Auction supply and demand curves
- Delivery years and forward procurement
- Clearing quantities and prices
- The Variable Resource Requirement curve
- Why prices can change dramatically when supply becomes tight
- The difference between a reliability requirement and an auction outcome

**Build**

- A toy capacity auction with editable curves
- A capacity-versus-energy revenue calculator
- Auction re-clearing exercises after changes in load or supply

**Outcome**

Explain what a capacity market buys and how a small change in quantity can sometimes cause a large change in total cost.

### Unit 6 — Reliability statistics and simulation

**Learn**

- Forced outage rates and available capacity
- Loss of Load Probability (LOLP)
- Loss of Load Expectation (LOLE)
- Expected Unserved Energy (EUE)
- The conventional one-event-in-ten-years adequacy criterion
- Weather uncertainty, correlated failures, and common-mode risks
- Why extreme cold can simultaneously increase load, reduce output, and constrain fuel
- Chronological versus non-chronological modeling
- Monte Carlo simulation and convergence

**Build**

- A coin-flip generator-outage simulation
- An hourly load-and-outage adequacy model
- LOLE and EUE visualizations
- A sensitivity explorer for load, weather, and outage assumptions

**Outcome**

Calculate reliability metrics for a toy system and explain why shortage frequency and shortage depth answer different questions.

### Unit 7 — Capacity accreditation: ICAP, UCAP, and ELCC

**Learn**

- Installed Capacity (ICAP) as the physical or nameplate fleet
- Unforced Capacity (UCAP) as accredited capacity used in market accounting
- Effective Load Carrying Capability (ELCC)
- The intuitive ELCC question: how much additional load can the system reliably serve because a resource exists?
- Average versus marginal accreditation
- Portfolio dependence and why the reliability value of the next GW may differ from the first
- Seasonal accreditation and energy-limited resources

A useful approximation is:

```text
UCAP ≈ ICAP × accreditation rate
```

The real methodology is more sophisticated, and one of our goals will be to understand exactly where this shorthand fails.

**Build**

- A simple accreditation calculator
- ELCC experiments for firm generation, solar, wind, and storage
- A visualization of declining marginal solar ELCC as risk moves into evening hours

**Outcome**

Explain how PJM converts unlike resources into a capacity-market quantity without claiming that the physical resources have become identical.

### Unit 8 — PJM as an institution and market operator

**Learn**

- The roles of utilities, generators, transmission owners, load-serving entities, RTOs/ISOs, FERC, NERC, and state regulators
- PJM's footprint, zones, and transmission system
- PJM's day-ahead and real-time energy markets
- Regulation and reserve markets
- The Reliability Pricing Model (RPM)
- Base Residual Auctions (BRAs), delivery years, and incremental auctions
- Fixed Resource Requirement (FRR) self-supply
- How whole-system planning quantities differ from the amount purchased in an auction
- Where PJM publishes manuals, forecasts, planning parameters, auction reports, and operating data

**Build**

- A PJM institutional map and market timeline
- A glossary that links each acronym to a physical or economic concept
- A historical BRA results explorer

**Outcome**

Trace the path from a PJM load forecast through reliability planning and into a capacity-auction requirement.

### Unit 9 — Data-center power demand

**Learn**

- IT load versus total facility load
- Power Usage Effectiveness (PUE)
- Utilization, redundancy, backup generation, and uptime requirements
- Constant load versus flexible or interruptible load
- Announced capacity, contracted service, phased energization, and realized coincident peak
- Geographic clustering and substation or transmission constraints
- Why a 1 GW campus running continuously consumes about 8.76 TWh per year
- Time-to-power and the mismatch between data-center and grid-development timelines

**Build**

- A data-center campus load-shape generator
- PUE and utilization sensitivities
- Phased buildout scenarios
- A flat-load versus flexible-load reliability comparison

**Outcome**

Translate a headline campus size into a defensible range of hourly and annual grid demand rather than treating the announcement as certain load.

### Unit 10 — Load forecasting and the data-center shock

**Learn**

- Traditional drivers of electricity demand
- Weather normalization and forecast uncertainty
- How large-load adjustments enter a forecast
- Duplicate requests, speculative projects, construction delays, and power-constrained development
- The costs of underforecasting and overforecasting
- Scenario analysis rather than false precision
- How load forecasts propagate into generation, transmission, capacity procurement, and customer bills

**Build**

- A project-level data-center pipeline
- Probability-weighted energization scenarios
- Forecast error and sensitivity visualizations
- An early/on-time/late/cancelled project model

**Outcome**

Explain why determining which proposed data centers will actually connect may be as important as modeling the generating fleet.

### Unit 11 — PJM's Reserve Requirement Study

**Learn**

- The annual ELCC/RRS workflow
- Installed Reserve Margin (IRM) and Forecast Pool Requirement (FPR)
- The fleet, load, weather, outage, and accreditation inputs
- How a target LOLE is converted into a solved load or reserve requirement
- Root-finding around a probabilistic simulation
- Published inputs versus transformations, calibrated values, and unavailable details
- Verification, validation, convergence, and error tolerances

PJM publishes an official [ELCC/Reserve Requirement Study](https://www.pjm.com/-/media/DotCom/planning/res-adeq/elcc/2025-pjm-elcc-rrs.pdf). We can use public study materials and source files to attempt our own simplified reconstruction even without access to SemiAnalysis's paid interactive RRS workbench.

**Build**

- A versioned source-data inventory
- A transparent resource-adequacy engine
- A solver for the load that reaches the target LOLE
- Published-result benchmark tests
- An assumption registry and discrepancy log

**Outcome**

Reproduce at least one published PJM result within a stated tolerance and account for all material discrepancies.

### Unit 12 — Reconstructing and valuing the SemiAnalysis model

**Understand and test**

- The committed fleet versus the fleet assumed in PJM's reliability studies
- ICAP-to-UCAP transformations and class accreditation
- PJM load forecasts and data-center adjustments
- Weather and outage scenario replay
- LOLE, EUE, ELCC, and required-capacity outputs
- Whole-system requirements versus FRR obligations and auction procurement
- Capacity-auction counterfactuals and dollar impacts
- Winter capability, weatherization, and correlated cold-weather risk
- Evidence lineage: published value, transformation, calibration, model result, or scenario

**Build**

- A dashboard-to-source lineage map
- Public-data reproductions of selected exhibits
- An assumption and sensitivity workbench
- An explicit comparison of our results, PJM's publications, and SemiAnalysis's public claims
- A final report describing what the model knows, estimates, assumes, and cannot establish

**Evaluate the economic value**

The question is not merely whether the dashboard is impressive. It is whether it improves a real decision.

Potential users may ask:

- **Hyperscaler:** Where can we obtain 500 MW by a target year?
- **Data-center developer:** Is a claimed power allocation credible?
- **Utility:** What happens if proposed large loads actually materialize?
- **Independent power producer:** Is a new plant economically justified?
- **Equipment manufacturer:** How much generation, transmission, or substation equipment may be ordered?
- **Investor:** Which assets benefit or suffer as the system tightens?
- **Semiconductor supplier:** Could electricity constrain accelerator deployments?

The model may be valuable if it turns scattered public files into a reliable view of where demand, infrastructure, resource adequacy, and prices are heading; exposes sensitivities that materially change a decision; or saves expert time. When the underlying decisions involve hundreds of millions or billions of dollars, a research subscription can be inexpensive—but only if its information is differentiated, timely, and decision-relevant.

Our eventual test will be:

> **What information advantage does the model create that is not already available in a usable form in PJM's public data?**

## How we will learn

Each unit follows the same loop:

1. Learn the smallest useful set of concepts.
2. Work through one example by hand.
3. Build a small simulation or visualization.
4. Compare the simplified model with real PJM data.
5. Record assumptions, surprises, limitations, and new questions.
6. Move on only when the unit outcome can be explained clearly.

The coding exercises are not decoration. They force definitions to become precise and make it easier to see where intuition breaks.

## Modeling standards

- Keep units explicit: MW, MWh, $/MWh, $/MW-day, probabilities, and delivery years.
- Preserve chronology when critical hours matter.
- Separate physical reliability, accreditation, auction accounting, and financial valuation.
- Label numbers as `SOURCE`, `ASSUMPTION`, `CALCULATED`, or `SCENARIO`.
- Record source URL, publication date, retrieval date, transformations, and checksums for important data.
- Prefer ranges and sensitivities to unjustified point estimates.
- Validate toy cases before running large simulations.
- Do not confuse recreating a chart with independently reproducing a model.

## Starting references

- [FERC Wholesale Electricity Markets: Overview and Guide](https://www.ferc.gov/wholesale-electricity-markets-overview-and-guide)
- [FERC Energy Primer](https://www.ferc.gov/media/energy-primer-handbook-energy-market-basics)
- [PJM Learning Center: Capacity Market](https://learn.pjm.com/three-priorities/buying-and-selling-energy/capacity-markets.aspx)
- [PJM Learning Center: Ancillary Services](https://learn.pjm.com/three-priorities/buying-and-selling-energy/ancillary-services-market.aspx)
- [PJM Energy Market](https://www.pjm.com/markets-and-operations/energy)
- [PJM Capacity Market (RPM)](https://www.pjm.com/markets-and-operations/rpm/)
- [PJM training resources](https://www.pjm.com/training/training-resources)
- [PJM load-forecast development](https://www.pjm.com/planning/resource-adequacy-planning/load-forecast-dev-process)
- [PJM manuals](https://www.pjm.com/library/manuals.aspx)
- [PJM 2025 ELCC/RRS](https://www.pjm.com/-/media/DotCom/planning/res-adeq/elcc/2025-pjm-elcc-rrs.pdf)
- [SemiAnalysis PJM Capacity Model methodology](https://pjm-model.semianalysis.com/methodology)
- [SemiAnalysis Energy Model](https://semianalysis.com/energy-model/)
- [SemiAnalysis Datacenter Industry Model](https://semianalysis.com/datacenter-industry-model/)

Market rules, forecasts, and source files change. Every future analysis should state its as-of date and favor primary sources.

## Expected repository structure

We will add directories only when they have a real artifact to hold.

```text
grid-basics/
├── README.md
├── docs/          # Lessons, glossary, notes, and model documentation
├── data/
│   ├── raw/       # Immutable source files
│   ├── interim/   # Cleaned and normalized data
│   └── processed/ # Model-ready inputs
├── notebooks/     # Exploratory exercises
├── src/           # Reusable model code
├── apps/          # Interactive visualizations
└── tests/         # Unit, regression, and published-benchmark tests
```

## First milestone

We will begin with **Unit 1: How the electric grid works from a power plant to a wall outlet**.

The first demo will follow a hypothetical day in PJM, with demand rising from roughly 90 GW overnight to 150 GW near the daily peak. We will use it to learn MW versus MWh, load curves, capacity factors, dispatchability, storage, and reserves—without introducing market mechanics yet.

Once that foundation is intuitive, we will add power-plant economics and build the first merit-order market visualization.
