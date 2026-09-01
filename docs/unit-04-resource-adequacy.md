# Unit 4: Resource Adequacy

## Before we begin

Unit 3 asked a short-term question:

> Given the resources available now, which ones should operate and what is the marginal price of energy?

Unit 4 asks a different question:

> Several years from now, will the system have enough dependable capability to serve demand during unusually difficult conditions?

That is the problem of **resource adequacy**.

By the end of this lesson, you should be able to:

- distinguish resource adequacy from real-time operating reliability;
- distinguish planning reserves from operating reserves;
- calculate installed capacity and a simple planning reserve margin;
- explain why a reserve margin is an input or summary, not a complete reliability result;
- identify the major uncertainties on both the demand and supply sides;
- explain why annual energy, peak capacity, and dependable capability answer different questions;
- compare two portfolios with the same nameplate reserve margin but different reliability risks;
- explain how imports, transmission, storage duration, demand response, and correlated outages affect adequacy; and
- trace the conceptual path from a load forecast to a future capacity requirement.

This unit remains mostly deterministic. Unit 6 will introduce the probabilistic metrics and simulation needed to measure adequacy rigorously.

---

## 1. Adequacy is about having enough capability

**Resource adequacy** asks whether sufficient resources are expected to be available to serve load, including an appropriate margin for uncertainty.

Those resources may include:

- conventional generators;
- wind and solar;
- hydro;
- batteries and other storage;
- demand response;
- firm imports; and
- transmission capability that makes remote resources deliverable.

The word **expected** matters. Planning occurs before we know:

- the exact weather;
- the realized load;
- which generators will fail;
- wind and solar output;
- fuel availability;
- transmission outages; or
- whether forecast projects will enter service on time.

Adequacy is therefore a planning problem under uncertainty.

### Adequate does not mean failure is impossible

No practical system can guarantee that every possible combination of events will be served. Building enough infrastructure for literally any imaginable condition would be prohibitively expensive and may still fail to eliminate all risk.

Resource-adequacy planning chooses a reliability criterion, models uncertain conditions, and determines the resource level needed to satisfy that criterion.

This introduces an economic tradeoff:

```text
More resources and infrastructure
          ↓
Lower shortage risk
          ↓
Higher cost paid somewhere in the system
```

The challenge is not to maximize capacity without limit. It is to procure an appropriate, credible portfolio for the chosen reliability standard.

---

## 2. Adequacy is not the whole of reliability

The word **reliability** covers several related but distinct problems.

### Resource adequacy

Resource adequacy concerns whether enough capability exists across future conditions.

Examples:

- Is enough generation expected to exist three years from now?
- Can storage sustain output through the modeled risk period?
- Will demand response be available when called?
- Can imports reach the region during stressed conditions?
- Does the resource portfolio satisfy the planning criterion?

### Operating reliability

Operating reliability concerns keeping the system secure in real time and over near-term operating horizons.

Examples:

- Can the system survive the unexpected loss of a large generator or line?
- Is frequency stable?
- Are transmission facilities within limits?
- Are enough synchronized and non-synchronized reserves available?
- Can resources ramp quickly enough during the next hour?

### Transmission security

A region can have enough generation in total but still be unable to deliver it through a constrained or damaged network. Transmission planning and security analysis test whether the network can withstand specified contingencies and deliver resources to load.

### Resilience

Resilience often concerns preparing for, absorbing, recovering from, and adapting to high-impact disruptions such as severe storms, flooding, cyber incidents, or prolonged fuel failures.

The boundaries are not perfect, but the distinction prevents a common mistake:

> Passing a resource-adequacy study does not prove that every generator, transmission line, fuel system, and distribution feeder will operate reliably in real time.

---

## 3. Planning reserves are not operating reserves

Both use the word **reserve**, but they operate on different timescales.

### Planning reserve margin

A planning reserve margin is a long-term quantity above forecast peak load.

It addresses uncertainty such as:

- forced outages;
- unusually high weather-driven demand;
- forecast error;
- maintenance;
- resource performance; and
- other modeled risks.

It is commonly discussed as a percentage of forecast peak demand.

### Operating reserves

Operating reserves are capabilities held ready during actual system operation. They respond over seconds or minutes when:

- a generator trips;
- load rises unexpectedly;
- renewable output changes; or
- another contingency occurs.

### The distinction

```text
Planning reserve margin
Years ahead · portfolio sufficiency · usually a capacity quantity

Operating reserves
Seconds to minutes · immediate response · an operating capability
```

A system may satisfy its long-term planning requirement but carry insufficient operating reserves in a particular interval. Conversely, operators may carry adequate reserves today while the future resource outlook is inadequate.

---

## 4. The simple planning reserve margin

The most basic deterministic calculation is:

```text
Planning reserve margin
= (Installed capacity − Forecast peak load)
  ÷ Forecast peak load
```

Suppose:

- forecast peak load is 150 GW; and
- installed capacity is 180 GW.

Then:

```text
(180 GW − 150 GW) ÷ 150 GW = 20%
```

The system has 30 GW of nameplate capacity above forecast peak, equal to a 20% installed reserve margin.

### Solving for required capacity

If the target reserve margin is known, required installed capacity is:

```text
Required installed capacity
= Forecast peak load × (1 + Reserve margin)
```

At a 150 GW peak and 20% margin:

```text
150 GW × 1.20 = 180 GW
```

### Solving for the load that a fleet can support

If installed capacity is 180 GW and the required reserve margin is 20%:

```text
Supported forecast peak
= Installed capacity ÷ (1 + Reserve margin)
= 180 GW ÷ 1.20
= 150 GW
```

These are useful accounting relationships. They are not yet a reliability simulation.

---

## 5. Why the simple margin is not enough

The formula treats every installed MW as if it were equally dependable. Unit 2 showed that this is false.

Consider two fictional systems. Both have:

- forecast peak load of 100 GW;
- installed capacity of 120 GW; and
- a 20% nameplate reserve margin.

### System A

- 100 GW of fuel-secure dispatchable generation
- 10 GW of hydro
- 10 GW of demand response
- independent forced-outage risks
- peak risk spread across several hours

### System B

- 50 GW of dispatchable generation
- 60 GW of solar
- 10 GW of four-hour batteries
- peak risk concentrated after sunset
- batteries may begin the event partially discharged

The equal reserve margins do not imply equal reliability.

System B's 60 GW of solar contributes no output after sunset. Its batteries have both a power limit and an energy limit. System A has its own outage and fuel risks, but its nameplate portfolio aligns differently with the critical period.

The example does not prove that one technology is always superior. It proves that **portfolio composition and risk timing matter**.

### Expected available capacity is still not enough

We might improve the calculation by multiplying each generator by an average availability rate. But averages can still hide:

- correlated winter failures;
- extreme-weather derates;
- long-duration storage depletion;
- fuel interruptions;
- seasonal renewable patterns; and
- the coincidence between load and resource availability.

Reliability depends on the joint distribution of conditions, not only average values.

---

## 6. Peak demand is a forecast, not a known number

Future peak load depends on several uncertain drivers:

- weather;
- economic activity;
- population and household formation;
- energy efficiency;
- electrification of vehicles and heating;
- industrial activity;
- behind-the-meter generation and storage;
- demand response; and
- large new loads such as data centers.

### Weather normalization

An observed historical peak reflects the weather that actually occurred. A planning forecast tries to separate underlying demand trends from unusually mild or extreme weather.

PJM publishes a central peak forecast and also models load uncertainty. A central forecast should not be read as a guarantee that actual demand will be lower.

### Coincident peak

The sum of every zone's individual peak can exceed the system peak because zones do not necessarily peak at the same moment.

```text
Sum of noncoincident zonal peaks
may be greater than
PJM coincident peak
```

For system planning, timing across locations matters.

### Gross load and net load

**Gross load** describes customer consumption before certain behind-the-meter production is subtracted.

**Net load** is the demand the bulk system must serve after subtracting applicable variable or behind-the-meter output.

At a simplified system level:

```text
Net load = Gross load − Variable generation serving that load
```

The hour with the highest gross load may not be the hour with the highest net load or greatest shortage risk.

---

## 7. Annual energy and peak capability answer different questions

Suppose a system consumes 800 TWh per year. That tells us the total energy requirement, but not the maximum instantaneous power requirement or the shape of critical periods.

Two systems can consume the same annual energy while having different peaks:

- System X has steady industrial and data-center demand.
- System Y has lower demand most of the year but a sharp weather-driven peak.

System Y may require more rarely used peak capability even with identical annual energy consumption.

The reverse is also possible: a high-load-factor data center can add enormous annual energy while increasing peak demand by only its maximum MW.

Keep three questions separate:

```text
Energy adequacy:
Is enough fuel, water, sunlight, wind, or stored energy available over time?

Capacity adequacy:
Can resources provide enough power during the critical hours?

Deliverability:
Can the network move that power to the load?
```

A portfolio can pass one question and fail another.

---

## 8. The demand side of adequacy

Resource adequacy is not only about power plants.

### Demand response

Demand response can reduce load during system stress. Its dependable contribution depends on:

- how quickly customers respond;
- maximum reduction;
- event duration;
- event frequency;
- notification requirements;
- measurement against a baseline;
- customer fatigue; and
- rebound consumption later.

### Energy efficiency

Efficiency can reduce the underlying load forecast, but its effect must be measured and separated from other trends.

### Flexible load

Some consumption can move across time without being eliminated. Examples might include:

- industrial processes with storage buffers;
- managed electric-vehicle charging;
- water heating;
- battery charging; and
- computing workloads with flexible deadlines.

Load shifted out of a risk hour can have similar immediate balancing value to generation added in that hour. But the deferred work may create load later, so chronology matters.

### Firm versus interruptible service

A data center seeking firm service creates a different planning obligation from a load contractually willing and technically able to curtail under specified conditions.

Calling a load "flexible" is not enough. The reduction must be measurable, controllable, durable, and available during actual system risk.

---

## 9. The supply side of adequacy

Each resource class brings a different combination of uncertainty and constraint.

### Thermal generation

Relevant factors include:

- forced-outage probability;
- planned maintenance;
- ambient-temperature derates;
- startup and minimum-run constraints;
- fuel availability; and
- correlated failures during extreme weather.

### Wind and solar

Relevant factors include:

- output during risk hours;
- geographic and weather correlation;
- forecast uncertainty;
- seasonal patterns; and
- how the existing portfolio changes the hours of greatest risk.

### Storage

Relevant factors include:

- MW discharge limit;
- MWh energy capacity;
- starting state of charge;
- efficiency;
- opportunity to recharge;
- event duration; and
- how storage is dispatched across consecutive risk hours.

### Hydro

Relevant factors include:

- water availability;
- reservoir energy;
- seasonal hydrology;
- environmental and downstream constraints; and
- coordination across a prolonged event.

### New projects and retirements

A forecast fleet is uncertain too. Projects can be:

- delayed;
- cancelled;
- blocked by interconnection or permitting;
- unable to secure equipment or fuel;
- completed with a different capability than expected; or
- offset by unexpected retirements.

Counting every proposed project as certain supply can overstate future adequacy.

---

## 10. Imports are resources only when they are available and deliverable

Interregional transfers can improve reliability by sharing diverse resources and weather conditions.

But an assumed import depends on:

- neighboring regions having surplus capability at the same time;
- transmission paths being available;
- transfer limits;
- contracts or market access;
- simultaneous import assumptions; and
- the same extreme weather not stressing every region together.

A neighboring system may export during an ordinary peak but be unable to help during a widespread cold event.

Transmission can therefore change resource adequacy in two ways:

1. It makes remote generation deliverable within PJM.
2. It enables imports from neighboring systems.

Neither benefit should be counted beyond credible transfer capability.

---

## 11. The critical hour may not be the peak-load hour

It is natural to focus on the year's highest demand. Yet shortage risk depends on both load and available supply.

Consider:

```text
Summer peak hour
Load:               150 GW
Available supply:   165 GW
Margin:              15 GW

Winter stress hour
Load:               142 GW
Available supply:   140 GW
Margin:              −2 GW
```

The winter hour has lower demand but higher risk because generator outages, fuel constraints, renewable output, or weather derates reduce supply.

This is central to the SemiAnalysis model's public argument: the hours that determine reliability may be defined by correlated supply failures rather than by the absolute annual load peak.

### Net-load shape can move risk

Adding solar may reduce midday net load and move the critical period later into the evening. Adding four-hour storage may cover an evening peak but not a multiday winter event. Adding firm generation may reduce risk across many hours but still depend on fuel during extreme cold.

The portfolio changes the identity of the critical hours.

---

## 12. From forecast peak to capacity requirement

A simplified planning chain is:

```text
Forecast future hourly load
          ↓
Represent weather and load uncertainty
          ↓
Build the assumed resource portfolio
          ↓
Model outages, derates, variable output, storage, demand response, and imports
          ↓
Measure shortage risk
          ↓
Adjust supported load or resources until the reliability criterion is met
          ↓
Translate the physical requirement into capacity accounting and obligations
```

The simple reserve-margin formula appears at both ends:

- before the probabilistic study, it offers intuition; and
- after the study, the solved result can be expressed as an Installed Reserve Margin.

The important direction of reasoning is:

> PJM does not choose a reserve margin merely because a round percentage sounds prudent. The modeled resource and load risks determine the reserve level associated with the reliability criterion.

Later units will examine how this physical requirement becomes an accredited capacity quantity and then a capacity-market demand curve.

---

## 13. A deterministic stress test

Before building a probabilistic simulation, we can learn from transparent scenarios.

Assume:

- forecast peak load: 150 GW;
- installed nameplate capacity: 180 GW; and
- nameplate reserve margin: 20%.

Now apply one stress scenario:

- 12 GW of thermal generation is on forced outage;
- 8 GW of gas generation is fuel-limited;
- 40 GW of solar nameplate produces 4 GW during the evening risk hour;
- a 10 GW battery has only 20 GWh remaining before the hour; and
- demand is 4 GW above the central forecast because of extreme weather.

The original 20% reserve-margin headline cannot answer whether the system succeeds. We must know the fleet composition and avoid double counting:

- Is the 40 GW solar already part of the 180 GW?
- Is the battery's 10 GW also included?
- How long does the event last?
- Are the thermal outage and fuel limitation overlapping?
- Can demand response reduce the 154 GW load?
- Are imports available?
- Can transmission deliver the remaining resources?

The exercise reveals a modeling discipline:

> Every MW must have a definition, time basis, location, availability assumption, and place in the accounting boundary.

---

## 14. Deterministic scenarios versus probabilistic adequacy

A deterministic stress test asks:

> What happens under this selected combination of assumptions?

It is useful for:

- intuition;
- transparent sensitivities;
- emergency planning;
- identifying weak assumptions; and
- communicating a concrete event.

But it does not tell us how often the scenario occurs.

A probabilistic study asks:

> Across many plausible weather, load, outage, and resource conditions, how frequently and deeply does supply fail to serve demand?

That requires probability distributions, correlations, chronological simulation, and reliability metrics. Unit 6 introduces LOLP, LOLE, and EUE.

Resource-adequacy planning normally needs both:

- probabilistic analysis to measure risk consistently; and
- deterministic scenarios to understand specific vulnerabilities the average metric may obscure.

---

## 15. The bridge to a capacity market

Suppose a study concludes that the future system needs 160 GW of dependable capacity, but only 150 GW is committed.

The physical conclusion is:

```text
Dependable-capacity shortfall = 10 GW
```

That does not yet determine:

- which technologies should close the gap;
- where they should be located;
- how much nameplate capacity is required;
- what they will cost;
- what capacity price will clear; or
- whether transmission or flexible load is a better solution.

Those are procurement and market-design questions.

PJM's capacity market is one mechanism for securing future resource commitments. Unit 5 will explain what it buys and why the auction quantity, demand curve, and clearing price are distinct from the underlying reliability study.

Keep the layers separate:

```text
Resource-adequacy model:
How much dependable capability is needed?

Accreditation:
How much dependable capacity credit does each resource receive?

Capacity market:
Which offered commitments clear, and at what price?
```

---

## 16. The data-center connection

Data centers affect both sides of the adequacy equation.

### Forecast peak

A 1 GW campus operating near continuously can add close to 1 GW to the relevant peak if it is fully energized and not curtailed.

### Forecast uncertainty

The planning problem is not merely how much announced load exists. It includes:

- probability of completion;
- energization date;
- phased ramp;
- utilization;
- duplicated service requests;
- onsite generation;
- contractual curtailment; and
- whether power availability itself delays the project.

### Resource timing

A data center can be built faster than major generation or transmission in some cases. A load forecast that rises before credible resources enter service increases adequacy risk.

### Geographic concentration

Even if PJM is adequate in aggregate, a cluster of large loads can require local transmission upgrades. System adequacy does not guarantee immediate site-level deliverability.

### Economic asymmetry

Underforecasting can leave inadequate supply or require expensive emergency measures. Overforecasting can cause customers to pay for resources and infrastructure that later prove unnecessary.

This is why accurate large-load forecasting can have enormous economic value.

---

## 17. Common misconceptions

### "A 20% reserve margin means 20% of the fleet is sitting idle"

The percentage compares installed capacity with forecast peak. During actual conditions, some capacity may be unavailable, variable output may be below nameplate, and other resources may be operating or held for reserves.

### "Planning reserves and operating reserves are interchangeable"

Planning reserve margin addresses long-term portfolio sufficiency. Operating reserves are response capability held during actual operation.

### "The highest-load hour is automatically the riskiest hour"

Risk depends on available supply as well as load. A lower-load winter hour can be riskier if outages and fuel constraints are severe.

### "Enough annual energy means enough capacity"

Annual MWh can be ample while insufficient MW is available during a critical hour—or while energy-limited resources deplete during a prolonged event.

### "Every proposed generator should count as future supply"

Projects face development, interconnection, financing, permitting, equipment, and construction risk. A credible planning portfolio must state which projects are assumed and why.

### "Imports are guaranteed because neighboring regions have generators"

Neighbors may be stressed simultaneously, and transmission or contractual limits may restrict imports.

### "A capacity shortfall tells us exactly how much nameplate generation to build"

The conversion depends on technology, accreditation, duration, location, and portfolio effects. Ten GW of dependable need does not necessarily equal ten GW of every resource type.

---

## 18. Readiness check

Try these without opening the answer key.

### Question 1

A system has 132 GW of installed capacity and a forecast peak of 110 GW. What is its nameplate reserve margin?

### Question 2

Forecast peak is 165 GW and the target installed reserve margin is 18%. How much installed capacity does the simple formula require?

### Question 3

A fleet has 200 GW of installed capacity and uses a 25% reserve-margin requirement. What forecast peak can it support under the simple formula?

### Question 4

Explain the difference between a 15% planning reserve margin and 15 GW of synchronized operating reserves.

### Question 5

Two portfolios each have 120 GW of nameplate capacity against a 100 GW peak. Give three reasons they might have different shortage risk.

### Question 6

System load peaks at 150 GW in summer with 162 GW available. During a winter event, load is only 142 GW but available supply is 139 GW. Which hour is inadequate, and why does peak load alone fail to identify it?

### Question 7

A 1 GW / 4 GWh battery starts an eight-hour emergency fully charged. Ignoring losses, how long can it provide 1 GW? How much average power could it provide evenly across all eight hours?

### Question 8

Why should a planner be cautious about counting 5 GW of imports during a region-wide cold event?

### Question 9

A data-center pipeline contains four proposed 1 GW campuses. Why is adding exactly 4 GW to every future load forecast potentially wrong in both directions?

### Question 10

Put these in conceptual order: capacity auction, load forecast, accreditation, reliability study, resource commitments.

<details>
<summary>Answer key</summary>

1. `(132 − 110) ÷ 110 = 20%`.
2. `165 GW × 1.18 = 194.7 GW`.
3. `200 GW ÷ 1.25 = 160 GW`.
4. The 15% planning margin is a years-ahead capacity relationship relative to forecast peak. The 15 GW operating-reserve quantity is response capability held during actual operation over specified response times. They differ in units, denominator, timing, and purpose.
5. Possible reasons include resource mix, forced-outage rates, outage correlation, solar or wind output during risk hours, storage duration and state of charge, fuel availability, demand response performance, imports, maintenance, and transmission deliverability.
6. The winter hour is inadequate by 3 GW even though its load is lower. Adequacy depends on `available supply − load`, not load alone.
7. It can provide 1 GW for four hours. Spread evenly over eight hours, it can provide `4 GWh ÷ 8 h = 0.5 GW`.
8. Neighboring regions may face the same cold-driven load and generator failures. Transfer paths, fuel constraints, or contractual limits may also prevent the imports.
9. Some projects may be duplicated, delayed, downsized, cancelled, or power-constrained, making 4 GW too high. Conversely, later phases, higher utilization, or untracked projects could make it too low. Timing and hourly shape also matter.
10. A simplified order is: load forecast → reliability study → accreditation and capacity-accounting translation → capacity auction → resource commitments. In practice, the processes iterate and existing commitments are also inputs to planning assessments.

</details>

---

## 19. Vocabulary to retain

- **Resource adequacy:** ability of the resource portfolio to serve expected demand across uncertain future conditions at the chosen reliability criterion.
- **Operating reliability:** ability to keep the actual system secure and balanced in real time and near-term operation.
- **Planning reserve margin:** installed capacity above forecast peak expressed as a percentage of forecast peak.
- **Operating reserve:** capability held ready to respond within a defined short timescale during system operation.
- **Forecast peak:** projected maximum load for a future period under stated forecast assumptions.
- **Coincident peak:** combined-system peak occurring at one common time.
- **Noncoincident peak:** sum or comparison of individual area peaks that may occur at different times.
- **Gross load:** consumption before specified behind-the-meter or variable production is subtracted.
- **Net load:** demand remaining for other system resources after applicable generation is subtracted.
- **Dependable capability:** resource contribution expected to be available under relevant reliability conditions.
- **Deliverability:** ability of the transmission system to move resource output to load.
- **Forced outage:** unexpected loss of all or part of a resource.
- **Correlated outage:** failures whose probabilities rise together because of shared conditions or causes.
- **Firm import:** external supply backed by credible capability and transfer arrangements under defined conditions.
- **Demand response:** measurable load reduction available under specified triggers and performance rules.
- **Reliability criterion:** target used to define an acceptable level of modeled shortage risk.
- **Stress test:** evaluation of a selected adverse scenario without necessarily assigning its probability.

## What comes next

The [Unit 4 interactive lab](../apps/unit-04-resource-adequacy/index.html) compares portfolios that have the same nameplate reserve margin but different hourly capabilities. It lets us alter load forecast error, outages, renewable timing, storage duration, imports, and demand response to see when a deterministic margin succeeds or fails. See the repository README for local launch instructions.

Unit 5 will introduce the capacity market: how PJM turns a future reliability need into a procurement quantity, clears offered resource commitments, and produces a capacity price.

## Optional references

- [PJM Load Forecast Development Process](https://www.pjm.com/en/planning/resource-adequacy-planning/load-forecast-dev-process)
- [PJM Resource Reports and Information](https://www.pjm.com/en/planning/resource-adequacy-planning/resource-reports-info)
- [PJM Effective Load Carrying Capability](https://www.pjm.com/planning/resource-adequacy-planning/effective-load-carrying-capability.aspx)
- [PJM manuals](https://www.pjm.com/library/manuals.aspx), especially Manual 19 for load forecasting and Manual 20A for resource-adequacy analysis
- [PJM Learning Center: Capacity Market](https://learn.pjm.com/three-priorities/buying-and-selling-energy/capacity-markets.aspx)
