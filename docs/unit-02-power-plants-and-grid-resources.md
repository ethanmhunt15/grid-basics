# Unit 2: Power Plants and Grid Resources

## Before we begin

Unit 1 treated generation as a set of colored blocks that could serve demand. Now we open those blocks and ask what they can actually do.

Our guiding question is:

> If two resources are both labeled 1,000 MW, why might the grid use and value them very differently?

By the end of this lesson, you should be able to:

- distinguish nameplate capacity, available capacity, generation, and capacity factor;
- explain the difference between dispatchable, variable, and energy-limited resources;
- describe ramp rates, minimum output, startup time, and minimum run time;
- distinguish planned outages, forced outages, and derates;
- calculate a thermal generator's approximate short-run operating cost from its heat rate and fuel price;
- compare the physical roles of nuclear, coal, gas, hydro, wind, solar, batteries, and demand response; and
- build a plausible resource schedule for a simplified 24-hour load curve.

The costs and operating parameters in examples are intentionally simplified. They are teaching assumptions, not current offers from actual PJM generators.

---

## 1. A generator has more than one important number

Suppose a power plant is described as a 500 MW facility. That number is useful, but it does not tell us:

- whether the plant is available today;
- how much it is producing now;
- how quickly it can change output;
- how long it takes to start;
- whether it has fuel;
- what it costs to produce one more MWh;
- whether its output changes with weather; or
- how much energy it produced during the year.

We need several concepts to describe the plant properly.

### Nameplate capacity

**Nameplate capacity** is a resource's rated maximum power output under specified conditions.

A 500 MW nameplate plant cannot normally produce more than 500 MW, but it may produce anything from zero to its maximum depending on availability, operating constraints, and instructions.

For a wind or solar project, nameplate capacity describes the maximum output of the installed equipment under suitable conditions. It does not mean the resource produces that quantity continuously.

### Available capacity

**Available capacity** is how much the resource could produce under current conditions.

A 500 MW plant might have only 430 MW available because:

- one component is out of service;
- hot weather reduces equipment performance;
- a fuel limitation exists; or
- the plant has reported a temporary derate.

For wind and solar, current weather is a major determinant of available output. A 500 MW solar fleet has zero available solar output at night, even though its nameplate capacity remains 500 MW.

### Actual generation

**Generation** is what the resource is producing now.

A plant can be available but not generating. For example, a 200 MW gas turbine may be ready to start but remain at zero because the system does not currently need its energy.

This gives us three distinct statements:

```text
Nameplate capacity: 500 MW
Available now:      430 MW
Generating now:     300 MW
```

None contradicts the others.

### Capacity factor

**Capacity factor** compares actual energy production with the maximum energy the resource could have produced by operating at nameplate power for the entire interval:

```text
Capacity factor
= Actual energy produced
  ÷ (Nameplate capacity × Hours in interval)
```

Suppose a 500 MW plant produces 306,600 MWh during a 30-day month:

```text
Maximum possible energy = 500 MW × 30 days × 24 h/day
                        = 360,000 MWh

Capacity factor = 306,600 MWh ÷ 360,000 MWh
                = 85.2%
```

A lower capacity factor does not automatically mean a resource performed badly. A peaking generator may be intentionally used only during a few high-demand hours. A solar resource is constrained by the day-night cycle. A hydro plant may conserve limited water for the most valuable times.

Capacity factor describes utilization over time. It is not the same as:

- **efficiency**, which relates useful energy output to energy input;
- **availability**, which describes whether equipment is capable of operating; or
- **capacity accreditation**, which estimates contribution to system reliability.

---

## 2. Three broad operating categories

The categories below are useful mental models, but real resources can blur their boundaries.

### Dispatchable resources

A **dispatchable** resource can change output in response to an instruction, subject to its operating limits.

Examples include many:

- natural-gas plants;
- coal plants;
- nuclear plants;
- hydro facilities;
- batteries; and
- demand-response resources.

Dispatchable does not mean infinitely flexible. A coal or nuclear unit may change output slowly, have a substantial minimum level, and take many hours to start. A battery may respond almost immediately but run out of stored energy.

### Variable resources

A **variable** resource's available output changes with an uncontrolled energy source.

Examples include:

- solar, whose output depends on sunlight; and
- wind, whose output depends on wind conditions.

Operators can normally curtail variable generation below what is available. They cannot command the sun to shine or the wind to blow harder. Forecasting therefore matters.

The term **intermittent** is sometimes used, but **variable** is often more precise: the output is not merely on or off; it changes continuously and can often be forecast with useful, though imperfect, accuracy.

### Energy-limited resources

An **energy-limited** resource can provide power only for a limited duration before it must recharge, replenish, or recover.

Examples include:

- batteries;
- pumped-storage hydro;
- reservoirs with limited water;
- demand response with limits on event duration or frequency; and
- generators with restricted fuel inventories.

A resource can be both dispatchable and energy-limited. Batteries are the clearest example.

---

## 3. Operating constraints

A simplified model might let every plant jump from zero to full output instantly. Real equipment cannot always do that.

### Ramp rate

**Ramp rate** is how quickly a resource can change output, often expressed in MW per minute.

If a unit is producing 200 MW and can ramp upward at 10 MW per minute, reaching 300 MW takes at least:

```text
(300 MW − 200 MW) ÷ 10 MW/min = 10 minutes
```

Ramp capability matters when demand changes quickly, renewable output changes, or another generator trips offline.

### Minimum operating level

Many thermal plants cannot remain stable at every output between zero and nameplate capacity. A 500 MW unit might have a 200 MW minimum operating level.

Its simplified operating choices are then:

```text
Off:              0 MW
Running:          200–500 MW
Not normally:     1–199 MW
```

When demand falls, the system may need to reduce other resources because the unit cannot simply operate at 50 MW.

### Startup time

**Startup time** is the time required to move from an offline condition to synchronized production.

The time depends on technology and equipment condition. A unit that has been offline and cooled may take much longer to start than one that shut down recently. Operators therefore distinguish hot, warm, and cold starts.

A plant that needs ten hours to start cannot solve a shortage discovered five minutes beforehand.

### Minimum up and down times

Once started, some generators must remain online for a minimum number of hours. Once stopped, they may need to remain offline before restarting.

These constraints exist because repeated heating, cooling, and mechanical cycling can stress equipment, consume fuel, and increase maintenance needs.

### Startup cost and no-load cost

Starting a thermal generator can consume fuel and wear equipment before it produces saleable electricity. A running generator may also incur a **no-load cost** simply to remain synchronized, even before accounting for the fuel required for incremental output.

We will eventually model these details in unit commitment. For this lesson, remember that the decision to start a plant can depend on several future hours, not just the current one.

### Maximum continuous output and short-duration capability

Some resources can temporarily exceed their normal continuous rating or provide a short burst of response. That does not mean the higher output can be sustained indefinitely.

This distinction will matter later when we compare operating reserves with long-duration resource adequacy.

---

## 4. Outages and derates

Even a dispatchable generator is not always available.

### Planned outage

A **planned outage** is scheduled in advance for inspections, refueling, maintenance, or major equipment work.

Operators try to schedule planned outages during seasons when demand is expected to be lower. Too many simultaneous maintenance outages can still make the system vulnerable.

### Maintenance outage

A **maintenance outage** may be scheduled with less notice than a major planned outage to correct a condition before it becomes a failure.

Terminology varies across organizations, but the essential idea is that some outages can be coordinated while others are unexpected.

### Forced outage

A **forced outage** is an unplanned loss of all or part of a resource caused by equipment failure or another urgent condition.

If a 1,000 MW unit trips from full output, the grid immediately loses 1,000 MW of supply. This is why operators carry reserves.

### Derate

A **derate** reduces maximum available output without taking the entire resource offline.

Examples include:

- a 500 MW plant limited to 420 MW by an equipment problem;
- a thermal plant producing less during hot weather;
- a hydro unit limited by water conditions; or
- a gas generator restricted by fuel delivery.

### Outages can be correlated

A beginner's model may treat every plant failure as an independent coin flip. Real failures can share causes:

- extreme cold affects many generators and fuel systems at once;
- drought affects multiple hydro resources;
- smoke or storms affect large geographic areas of renewable output;
- a transmission failure disconnects several generators together; or
- a common equipment design has the same vulnerability across units.

Correlation is one reason annual average availability can understate risk during the system's hardest hours.

---

## 5. Thermal efficiency and heat rate

Thermal generators convert fuel energy into electrical energy. Not all fuel energy becomes electricity; much leaves as waste heat.

### Efficiency

Thermal efficiency can be written as:

```text
Efficiency = Electrical energy output ÷ Fuel energy input
```

If a plant converts 50% of its fuel energy into electricity, it needs two units of fuel energy for each unit of electrical energy delivered.

### Heat rate

Power-market analysis often describes efficiency using **heat rate**: the amount of fuel energy required to produce one unit of electrical energy.

Common units are British thermal units per kilowatt-hour, or Btu/kWh.

```text
Lower heat rate = less fuel needed per MWh = more efficient plant
```

For market calculations, a useful conversion is:

```text
7,000 Btu/kWh = 7 MMBtu/MWh
10,000 Btu/kWh = 10 MMBtu/MWh
```

The numerical conversion works because both numerator and denominator scale by 1,000.

### Approximate fuel cost

If a combined-cycle gas plant has a heat rate of 7 MMBtu/MWh and gas costs $4/MMBtu:

```text
Fuel cost = 7 MMBtu/MWh × $4/MMBtu
          = $28/MWh
```

If a less-efficient gas turbine has a heat rate of 10.5 MMBtu/MWh at the same gas price:

```text
Fuel cost = 10.5 MMBtu/MWh × $4/MMBtu
          = $42/MWh
```

The turbine burns 50% more fuel per MWh in this simplified comparison.

### Variable operating and maintenance cost

Plants also incur costs that change with production, known as **variable operations and maintenance**, or variable O&M.

A simplified short-run production cost is:

```text
Short-run operating cost
≈ Heat rate × Fuel price
  + Variable O&M
  + Variable emissions cost
  + Other incremental costs
```

Suppose the combined-cycle plant above has:

- fuel cost of $28/MWh;
- variable O&M of $3/MWh; and
- emissions or other variable costs of $2/MWh.

Its simplified short-run cost is:

```text
$28/MWh + $3/MWh + $2/MWh = $33/MWh
```

This is not the plant's total lifetime cost. It excludes fixed operations, debt, taxes, capital recovery, and other costs that do not change directly with one additional MWh.

### Marginal cost

**Marginal cost** asks: what does it cost to produce one additional unit of output?

For a simple thermal example, short-run marginal cost may be close to the calculation above. Actual generator offers can be more complicated because of startup costs, nonlinear heat rates, minimum output, operating constraints, fuel arrangements, environmental limits, and market rules.

Unit 3 will use marginal costs to build the merit order and market-clearing price.

---

## 6. Fixed cost and variable cost

A power resource has costs even when it is not producing.

### Fixed costs

Fixed costs do not change directly with each additional MWh. They can include:

- construction and financing;
- fixed staffing and maintenance;
- land and interconnection costs;
- insurance and property taxes; and
- ongoing costs required to keep the resource available.

### Variable costs

Variable costs rise with production. They can include:

- fuel;
- variable maintenance and consumables;
- emissions allowances or fees; and
- wear associated with output or cycling.

A resource can have high fixed cost and low marginal cost, or low fixed cost and high marginal cost.

This helps explain different operating patterns:

- A nuclear plant may be expensive to build and maintain but inexpensive to run for one additional hour.
- A gas turbine may be less costly to build but expensive to operate because of its heat rate and fuel use.
- Wind and solar have no fuel cost, so their short-run cost of producing available energy is often low, though their output is weather-dependent and their total project cost is certainly not zero.
- A battery's cost of discharge depends partly on the price and quantity of energy used to charge it, its efficiency losses, and degradation.

Do not infer total economic value from marginal cost alone. Low-marginal-cost energy and dependable capacity are different products.

---

## 7. Resource-by-resource intuition

The descriptions below are broad patterns, not universal rules. Individual facilities vary.

### Nuclear

**Physical role**

- Large units that can operate for long periods.
- Generally high utilization when available.
- Typically slow and costly to start from offline conditions.
- Often operated steadily rather than cycled daily.

**Important constraints**

- Refueling and planned maintenance outages.
- A forced outage at one large unit removes substantial power at once.
- Cooling-water and environmental conditions can sometimes constrain output.

**Economic intuition**

- High fixed costs.
- Relatively low fuel cost per MWh.
- Strong incentive to operate when available, subject to constraints.

### Natural-gas combined cycle

**Physical role**

- Uses a gas turbine plus captured exhaust heat to produce additional electricity through a steam cycle.
- More fuel-efficient than a simple-cycle gas turbine.
- Often capable of following demand, though flexibility varies by design.
- Can produce substantial energy over many hours.

**Important constraints**

- Gas supply and pipeline conditions.
- Startup time, ramping limits, and minimum load.
- Hot-weather output derates.

**Economic intuition**

- Fuel price and heat rate strongly influence operating cost.
- Often an important marginal resource in power markets.

### Natural-gas combustion turbine

Also called a simple-cycle turbine or peaker in many contexts.

**Physical role**

- Can often start and ramp faster than larger steam-cycle plants.
- Useful during peaks, contingencies, and short periods of tight supply.
- Generally less fuel-efficient than combined cycle.

**Important constraints**

- High fuel cost per MWh because of a higher heat rate.
- Weather and fuel availability.
- Some units have operating-hour or emissions limits.

**Economic intuition**

- May operate few hours yet remain valuable as ready capacity.
- Sparse energy production makes recovery of fixed costs an important question for later units.

### Coal

**Physical role**

- Can sustain output for long periods.
- Often has significant minimum output and slower startup or ramping than flexible gas resources.
- On-site fuel inventories can provide a degree of fuel storage, though fuel-handling equipment can still fail.

**Important constraints**

- Long startup times and cycling wear.
- Environmental limits and fuel logistics.
- Aging equipment and outage risk at some facilities.

**Economic intuition**

- Fuel, maintenance, and environmental costs vary widely.
- A plant may be capable of operating but uneconomic relative to alternatives during many hours.

### Solar photovoltaic

**Physical role**

- Output follows sunlight and is zero at night.
- Available output can change with clouds, season, orientation, temperature, and location.
- Inverters can reduce output rapidly when instructed.
- No fuel is consumed during generation.

**Important constraints**

- The timing of sunlight may not match the timing of system risk.
- More nameplate capacity can create midday surpluses without solving an evening shortfall.
- Transmission and interconnection limits may cause curtailment.

**Economic intuition**

- Low short-run marginal cost when sunlight is available.
- Capital, land, interconnection, and financing costs remain important.
- Energy value can decline when many solar projects produce simultaneously.

### Wind

**Physical role**

- Output changes with wind speed across a geographic area.
- Can produce during day or night.
- No fuel is consumed during generation.
- Can be curtailed but cannot be instructed to exceed weather-dependent availability.

**Important constraints**

- Forecast error and geographic correlation.
- Very low or very high winds can reduce output.
- Transmission may be distant from strong wind resources.

**Economic intuition**

- Low short-run marginal cost when wind is available.
- Output value depends on when and where the wind blows.

### Conventional hydroelectric generation

**Physical role**

- Can be highly flexible and fast responding.
- Reservoir hydro can shift water use across time.
- Run-of-river hydro is more dependent on current river flow.

**Important constraints**

- Water availability and reservoir level.
- Flood control, navigation, recreation, environmental, and downstream-flow obligations.
- Geography limits where new facilities are possible.

**Economic intuition**

- Low fuel cost, but water has an opportunity value: using it now may mean it cannot be used later.

### Battery storage

**Physical role**

- Responds quickly.
- Can charge when energy is abundant and discharge when supply is tight.
- Has separate MW and MWh ratings.
- Can provide several grid services, sometimes with the same equipment at different times.

**Important constraints**

- State of charge.
- Discharge duration.
- Charging opportunity.
- Round-trip losses.
- Degradation from time and cycling.

**Economic intuition**

- Storage shifts energy; it does not create net energy.
- Value depends on the spread between charging and discharging conditions, plus capacity and service revenues.

### Demand response

**Physical role**

- Reduces or shifts consumption instead of increasing generation.
- Can include industrial curtailment, thermostat adjustments, managed charging, or backup generation behind a customer's meter.
- Response speed and measurement rules vary.

**Important constraints**

- Customer willingness and operational needs.
- Event duration and frequency limits.
- Baseline measurement: estimating what the customer would otherwise have consumed.
- Rebound load after an event.

**Economic intuition**

- Avoiding 1 MW of load can balance the system just as effectively in that moment as adding 1 MW of generation.
- The interruption cost to the customer can be high, and availability must be credible.

---

## 8. "Baseload" and "peaker" describe roles, not laws of nature

You will often hear generators grouped as:

- **baseload:** resources that operate steadily for long periods;
- **intermediate:** resources that follow recurring changes in demand; and
- **peaking:** resources used during the highest-demand or most constrained hours.

These labels describe common operating and economic roles. They are not immutable physical categories.

A combined-cycle plant may run steadily in one market and cycle in another. A battery may act like a peaker for four hours but cannot sustain output like a fuel-secure plant. A nuclear plant can technically change output, even if economics and operating practices favor steady production.

It is more precise to ask about the underlying properties:

- marginal cost;
- startup time and cost;
- ramp rate;
- minimum output;
- energy or fuel limits;
- availability; and
- expected operating pattern.

---

## 9. A simplified 24-hour operating exercise

Return to the Unit 1 day:

- Overnight load is near 90 GW.
- Demand rises through the morning.
- Midday load is around 130 GW.
- The evening reaches 150 GW.
- Demand then declines.

Suppose the simplified fleet contains:

- 65 GW of steady generation;
- 40 GW of solar nameplate;
- 20 GW of wind nameplate;
- 70 GW of flexible generation; and
- a 15 GW / 60 GWh battery starting 75% full.

Our Unit 1 lab uses a deliberately simple physical scheduling rule:

1. Use available wind and solar.
2. Use steady generation up to its available capacity.
3. Use flexible generation to fill the remaining demand.
4. Discharge the battery if the other resources are insufficient.
5. Record any remaining demand as unserved.
6. Use otherwise-curtailed renewable energy to charge the battery when possible.

That order is not a real PJM market algorithm. It ignores costs, startups, ramp limits, transmission, reserves, and forecasts. Its purpose is to make the balance equation visible.

Unit 2 adds questions that the first lab did not answer:

- Can the steady fleet actually change output as modeled?
- Was the flexible fleet already running, or must it start?
- Can it ramp fast enough for the evening increase?
- Does the battery have enough energy remaining at the peak?
- What does it cost to operate each resource?
- Should limited hydro water or battery energy be saved for a later hour?
- How much headroom should remain for a surprise outage?

These are scheduling questions. Unit 3 will add bids and market prices.

---

## 10. The data-center connection

Data centers can increase the importance of several resource characteristics.

### High utilization creates a large energy requirement

A 1 GW load running continuously consumes 8.76 TWh in a non-leap year. Serving it requires resources that can provide energy across nights, seasons, maintenance periods, and extreme weather—not merely 1 GW of nameplate generation.

### Reliability expectations may be stringent

Data centers often use multiple utility feeds, uninterruptible power supplies, batteries, and backup generators. These systems protect the computing load, but their ability and authorization to support the wider grid vary.

### Fast construction does not create fast generation

A load can ramp faster than new power plants, transmission lines, gas infrastructure, or substations can be developed. Existing flexible resources may initially run more often, changing fuel use, emissions, maintenance, and market prices.

### A "matched" renewable contract does not mean hourly physical self-supply

A data center may buy enough renewable energy over a month or year to match its consumption financially. That does not prove the contracted resources produce during every hour the facility consumes, nor that the network can deliver their output directly to the site.

Annual energy matching, hourly balancing, local deliverability, and dependable capacity are separate questions.

---

## 11. Common misconceptions

### "Capacity factor tells me how reliable a resource is"

Capacity factor measures historical or modeled energy production relative to maximum possible production. Reliability contribution depends on availability during risk hours and on the rest of the portfolio. A resource can have a low annual capacity factor but be highly valuable during peaks.

### "Dispatchable means always available"

Dispatchable means output can be controlled when the resource is available and within its operating limits. It does not eliminate outages, fuel constraints, startup times, or derates.

### "Zero fuel cost means free electricity"

Fuel-free resources still have construction, financing, maintenance, land, and interconnection costs. Zero fuel cost mainly affects the short-run cost of producing one more MWh when the resource is available.

### "A four-hour battery provides firm power all day"

It can sustain its rated output for roughly four hours from a sufficiently charged state. Afterward it must recharge. Its contribution depends on the duration and timing of system stress.

### "A plant with the lowest heat rate is always cheapest"

Heat rate is only one component. Fuel prices, variable O&M, emissions costs, startup costs, and operating constraints also matter.

### "Demand response is the same as generation"

Both can balance a MW shortfall in a particular moment, but demand response has different measurement, customer, duration, rebound, and availability constraints.

### "If a plant is not running, it has no value"

An offline or lightly used resource may provide option value if it can start when the system becomes tight. Whether it earns enough revenue to remain available is an economic question we will revisit in the capacity-market units.

---

## 12. Readiness check

Try these without opening the answer key.

### Question 1

A 400 MW generator produces 210,240 MWh during a 30-day month. What is its capacity factor?

### Question 2

A gas plant has a heat rate of 7.5 MMBtu/MWh. Gas costs $3.60/MMBtu, variable O&M is $3/MWh, and other variable costs are $1.50/MWh. What is its simplified short-run operating cost?

### Question 3

Plant A has a heat rate of 6.8 MMBtu/MWh and Plant B has a heat rate of 10.2 MMBtu/MWh. If both burn gas costing $5/MMBtu, how much greater is Plant B's fuel cost per MWh?

### Question 4

A generator is at 250 MW and can ramp upward at 8 MW per minute. Ignoring other constraints, how long does it take to reach 370 MW?

### Question 5

A 600 MW unit has a minimum operating level of 240 MW. Which of these outputs are feasible in the simplified model: 0 MW, 100 MW, 240 MW, 500 MW, and 620 MW?

### Question 6

A 100 MW / 400 MWh battery begins 50% charged. Ignoring efficiency and operating reserves, how long can it discharge at 100 MW? How long at 50 MW?

### Question 7

Why can a gas turbine with a high operating cost and low annual capacity factor still be useful to the grid?

### Question 8

A data center consumes a constant 500 MW. It signs an annual contract associated with 4.38 TWh of solar generation—the same amount of energy it consumes in a year. List three reasons this does not prove the data center is physically supplied by solar in every hour.

### Question 9

Explain the difference among these statements:

1. A plant has 500 MW of nameplate capacity.
2. It has 420 MW available today.
3. It is currently generating 300 MW.
4. It had a 70% capacity factor last year.

<details>
<summary>Answer key</summary>

1. Maximum monthly energy is `400 MW × 30 × 24 = 288,000 MWh`. Capacity factor is `210,240 ÷ 288,000 = 73%`.
2. Fuel cost is `7.5 × $3.60 = $27/MWh`. Total simplified operating cost is `$27 + $3 + $1.50 = $31.50/MWh`.
3. Heat-rate difference is `10.2 − 6.8 = 3.4 MMBtu/MWh`. At `$5/MMBtu`, Plant B spends `3.4 × $5 = $17/MWh` more on fuel.
4. Required change is `370 − 250 = 120 MW`. At `8 MW/min`, it takes `120 ÷ 8 = 15 minutes`.
5. Feasible outputs are 0 MW when off, and 240 MW or 500 MW when running. In this simplified model, 100 MW is below minimum stable output and 620 MW exceeds nameplate capacity.
6. Stored energy is `400 MWh × 50% = 200 MWh`. It can discharge at 100 MW for 2 hours or at 50 MW for 4 hours.
7. It may start and ramp quickly during rare peaks or unexpected outages. Those few hours can be critical even though the plant produces little annual energy.
8. Solar produces nothing at night; hourly solar production does not match constant consumption; weather and season change output; the project may be far from the data center; transmission can be constrained; and the contract may be a financial energy match rather than a physical delivery path. Any three earn the point.
9. Nameplate is the rated ceiling. Available capacity reflects today's conditions and derates. Generation is current output. Capacity factor summarizes energy production over the prior year relative to continuous nameplate production.

</details>

---

## 13. Vocabulary to retain

- **Nameplate capacity:** rated maximum power output under specified conditions.
- **Available capacity:** maximum output a resource could provide under current conditions.
- **Generation:** actual electrical output at a moment or energy produced over an interval, depending on context.
- **Capacity factor:** actual energy divided by the energy possible at continuous nameplate output.
- **Availability:** whether equipment is capable of operating.
- **Dispatchable:** controllable in response to instruction, within operating constraints.
- **Variable resource:** resource whose available output depends on an uncontrolled source such as sun or wind.
- **Energy-limited:** unable to sustain output indefinitely because stored energy, water, fuel, or response duration is limited.
- **Ramp rate:** speed at which output can change.
- **Minimum operating level:** lowest stable output while a unit is online.
- **Startup time:** time required to move from offline to producing electricity.
- **Minimum up/down time:** minimum period a unit must remain on or off after changing state.
- **Planned outage:** scheduled removal from service.
- **Forced outage:** unexpected loss of all or part of a resource.
- **Derate:** temporary reduction in maximum available output.
- **Thermal efficiency:** electrical energy output divided by fuel energy input.
- **Heat rate:** fuel energy required per unit of electrical output; lower is more efficient.
- **Variable O&M:** operating and maintenance costs that change with production.
- **Marginal cost:** cost of producing one additional unit of output.
- **Curtailment:** reduction below otherwise available output or consumption.
- **Demand response:** deliberate load reduction or shifting in response to system or economic conditions.

## What comes next

The [Unit 2 interactive lab](../apps/unit-02-resources/index.html) lets us compare resource attributes, calculate thermal operating costs, and schedule a simplified fleet through the same 24-hour day used in Unit 1. It adds ramping, minimum output, startups, outages, and energy limits—but still stops before calculating a market-clearing price. See the repository README for local launch instructions.

Unit 3 will then use these physical capabilities and marginal costs to construct the merit order and introduce wholesale energy-market clearing.

## Optional references

- [FERC Energy Primer](https://www.ferc.gov/media/energy-primer-handbook-energy-market-basics)
- [PJM Learning Center: Generation Sources](https://learn.pjm.com/electricity-basics/generation-sources)
- [PJM manuals](https://www.pjm.com/library/manuals.aspx), especially the operating and cost-development manuals as we add detail
- [Annual Technology Baseline](https://atb.nrel.gov/), for technology assumptions and definitions used in later quantitative work
