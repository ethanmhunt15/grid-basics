# Unit 1: Electricity from First Principles

## Before we begin

This lesson explains what the electric grid must accomplish before we introduce markets, prices, or PJM's reliability models.

Our guiding question is:

> How does a large electric system keep millions of changing loads supplied every moment of the day?

By the end of the lesson, you should be able to:

- distinguish power from energy;
- use W, kW, MW, and GW correctly;
- trace electricity from generators through transmission and distribution;
- interpret an hourly load curve;
- calculate peak load, average load, daily energy, and load factor;
- explain why supply and demand must remain balanced;
- describe what grid frequency tells an operator; and
- explain why installed generating capacity does not guarantee that demand can be served.

No prior knowledge is assumed. All numbers in the hypothetical PJM day are illustrative, not historical PJM data.

---

## 1. Power and energy are different

This distinction is the foundation for almost everything that follows.

### Power is a rate

**Power** measures how quickly energy is being produced or consumed at a particular moment.

Its basic unit is the **watt (W)**:

```text
1 kilowatt (kW) = 1,000 W
1 megawatt (MW) = 1,000 kW = 1,000,000 W
1 gigawatt (GW) = 1,000 MW = 1,000,000,000 W
```

Examples:

- A small LED bulb may draw roughly 10 W while it is on.
- An electric kettle may draw roughly 1.5 kW while heating.
- A large power plant may produce hundreds of MW while operating.
- A large data-center campus may request service measured in hundreds of MW or more.

A generator rated at 500 MW can produce power at a rate of up to 500 MW under its rated conditions. The rating alone does not say how long it operates or how much energy it produces over a year.

### Energy is power accumulated over time

**Energy** measures a quantity produced or consumed over an interval.

```text
Energy = Power × Time
```

When power is measured in watts and time in hours, energy is measured in watt-hours:

```text
1 kilowatt-hour (kWh) = 1 kW sustained for 1 hour
1 megawatt-hour (MWh) = 1 MW sustained for 1 hour
1 gigawatt-hour (GWh) = 1 GW sustained for 1 hour
1 terawatt-hour (TWh) = 1,000 GWh
```

For example, a 500 MW generator operating at 400 MW for three hours produces:

```text
400 MW × 3 h = 1,200 MWh
```

The same 1,200 MWh could be produced at 200 MW for six hours. The energy is equal, but the power profiles are different.

### A useful analogy

Think of water flowing through a pipe:

- **Power** is the flow rate at this moment.
- **Energy** is the total volume delivered over time.

The analogy is imperfect, but it makes the units intuitive. MW describes a rate; MWh describes an accumulated quantity.

### Dimensional check

The unit often reveals whether a statement makes sense:

- A power plant's maximum output is expressed in MW.
- An electric bill measures energy in kWh.
- A system's instantaneous demand is expressed in MW.
- A system's consumption over a day is expressed in MWh or GWh.

Calling a plant a "500 MWh plant" is incomplete unless you mean an energy-limited resource such as a battery. A battery needs two ratings:

- **Power rating:** how quickly it can charge or discharge, in MW.
- **Energy capacity:** how much energy it can store, in MWh.

A 100 MW / 400 MWh battery can discharge at its full rated power for four hours in the simplified ideal case:

```text
400 MWh ÷ 100 MW = 4 h
```

Real batteries also have efficiency losses, operating limits, and state-of-charge constraints.

---

## 2. What is load?

Every device using electricity contributes to **load**. At the system level, load is the combined electrical demand of homes, offices, factories, data centers, transit systems, and other users at a particular moment.

In everyday grid discussions, **load** and **demand** are often used almost interchangeably. Both normally refer to a rate of consumption measured in MW or GW.

Load changes continually:

- People wake up and turn on appliances.
- Offices and factories begin operating.
- Heating and air conditioning respond to weather.
- Solar panels behind customer meters reduce the demand seen by the grid.
- Industrial facilities change production.
- Data centers vary their computing workloads, though many maintain high, steady demand.

A grid operator therefore does not serve one fixed quantity. It follows a moving target.

### Peak, average, and minimum load

For any interval, we can describe:

- **Peak load:** the highest observed demand.
- **Minimum load:** the lowest observed demand.
- **Average load:** total energy divided by the length of the interval.

The peak is important because the system must be capable of serving the most demanding periods, not merely the average day or hour.

### The load curve

A **load curve** plots power demand against time. The area underneath the curve is energy.

Consider this simplified day:

| Period | Duration | Average load | Energy consumed |
|---|---:|---:|---:|
| Midnight–6 a.m. | 6 h | 90 GW | 540 GWh |
| 6–10 a.m. | 4 h | 110 GW | 440 GWh |
| 10 a.m.–4 p.m. | 6 h | 130 GW | 780 GWh |
| 4–8 p.m. | 4 h | 150 GW | 600 GWh |
| 8 p.m.–midnight | 4 h | 115 GW | 460 GWh |
| **Total** | **24 h** | — | **2,820 GWh** |

The day's average load is:

```text
2,820 GWh ÷ 24 h = 117.5 GW
```

Its peak load is 150 GW. The system consumes 2.82 TWh during the day.

### Load factor

**Load factor** compares average demand with peak demand:

```text
Load factor = Average load ÷ Peak load
```

For the example:

```text
117.5 GW ÷ 150 GW = 78.3%
```

A high load factor means demand remains relatively close to its peak. A low load factor means the system builds or maintains substantial capability that is used only during narrower peak periods.

Load factor describes the demand side. Do not confuse it with a generator's **capacity factor**, which compares the energy a generator actually produced with the energy it could have produced by running at nameplate power for the entire interval.

---

## 3. From a power plant to a wall outlet

The grid is a connected network, not a delivery route that assigns one generator to one customer.

A simplified path is:

```text
energy source
    ↓
generator
    ↓
step-up transformer
    ↓
high-voltage transmission network
    ↓
transmission substation
    ↓
distribution network
    ↓
local transformer
    ↓
customer equipment
```

### Generation

Generators convert another form of energy into electrical energy:

- A gas, coal, or nuclear plant produces heat, makes steam or hot gas, and turns a turbine-generator.
- A hydro plant uses moving water to turn a turbine-generator.
- A wind turbine converts moving air into rotation and then electricity.
- A solar photovoltaic panel converts light directly into electricity.
- A battery does not create primary energy; it stores electricity received earlier and returns part of it later.

These technologies differ in how quickly they can change output, when they are available, how much fuel or stored energy they have, and how they respond to weather. Unit 2 explores those differences.

### Transformers and voltage

For a given amount of transmitted power, using higher voltage allows lower current. Lower current greatly reduces resistive losses and allows power to move efficiently over long distances. A **step-up transformer** raises voltage near a generator for transmission. Other transformers lower it in stages before electricity reaches customers.

Voltage can be thought of as part of the electrical pressure that drives current, though the full physics is more subtle. For now, remember:

- Transmission generally uses very high voltage over long distances.
- Distribution uses lower voltage to serve local areas.
- Customer equipment uses voltage reduced to an appropriate level.

### Transmission

Transmission lines connect large generators, substations, and population centers. They let a region share resources across a wide area, but they have physical limits.

Power does not follow a commercial contract along one chosen wire. It spreads through the interconnected AC network according to physical laws and the network's impedances. Operators must keep every relevant facility within safe limits even when total system generation appears sufficient.

This is our first hint that **where** generation and load are located matters, not only how many MW exist in total. We will return to this when studying congestion and locational prices.

### Distribution

Distribution networks deliver power from substations to neighborhoods, commercial buildings, and many industrial sites. Very large customers may connect at higher voltages directly to the transmission system or to major distribution facilities.

A data-center campus can require new substations, transformers, transmission upgrades, and sometimes new generation. Having enough generation somewhere in a large region does not prove that the local network can deliver the requested power to a particular site.

---

## 4. The grid must balance continuously

At every moment, total electricity injected into the interconnected system must match electricity withdrawn plus system losses closely enough to keep the system stable.

In simplified form:

```text
Generation + net imports + storage discharge
=
Load + losses + net exports + storage charging
```

This is not merely an accounting identity checked at the end of the month. It is a continuous physical requirement.

### Why electricity cannot simply wait in the wires

Transmission lines move electromagnetic energy, but the grid itself is not a giant warehouse. Useful bulk storage must be provided by resources such as batteries, pumped hydro, compressed air, thermal storage, or flexible demand.

Storage also cannot remove the balancing problem:

- Charging a battery is additional load.
- Discharging it is additional supply.
- Its state of charge must be tracked.
- It cannot discharge after its stored energy is depleted.
- It returns less energy than it consumed because of losses.

Operators therefore forecast demand, schedule resources, maintain reserves, and adjust output continually.

### Frequency as a system-wide clue

The Eastern Interconnection operates at a nominal frequency near 60 hertz. Synchronous generators across the interconnection rotate in coordination with that frequency.

In simplified terms:

- If electrical demand suddenly exceeds mechanical input to generation, frequency tends to fall.
- If generation exceeds demand, frequency tends to rise.

Frequency is therefore a fast physical indication of imbalance. Automated controls and operator actions respond on different timescales to keep it near its target.

This does **not** mean every local problem appears only as a frequency problem. A transmission line can overload or local voltage can deteriorate even while overall system frequency looks normal.

### A sudden outage example

Suppose the system is balanced at 120 GW and a 1 GW generator trips offline:

```text
Immediately before outage:
120 GW supply = 120 GW load

Immediately after outage:
119 GW supply < 120 GW load
```

The missing 1 GW must be arrested and replaced. Inertia and fast frequency response slow the initial change; automatically responding resources act next; operating reserves and redispatch restore a secure position. If the system cannot replace the loss, protective actions may eventually disconnect load to prevent a wider collapse.

The important lesson is not the exact sequence yet. It is that installed capacity sitting somewhere on a list is not enough. Resources must be able to respond on the required timescale and must be deliverable through the network.

---

## 5. Capacity, availability, and energy constraints

Consider four resources, each labeled 1,000 MW:

### A thermal generator

It may be capable of producing close to 1,000 MW for many consecutive hours, but it can experience a forced outage, lack fuel, derate in extreme weather, or be offline for maintenance.

### A solar fleet

Its output depends on sunlight. It produces nothing at night, varies with clouds and season, and may produce less than 1,000 MW even at midday.

### A wind fleet

Its output depends on wind conditions. It can sometimes produce near nameplate output and sometimes very little. Its output during the system's riskiest hours matters more for reliability than its annual average alone.

### A battery fleet

Its MW rating describes discharge speed, not endurance. A 1,000 MW / 4,000 MWh battery can ideally sustain full output for four hours only if it starts full. It must previously have found enough time and supply to charge.

The label "1,000 MW" therefore answers only one part of a larger question. To determine whether a resource can serve demand during a difficult hour, we also need to know:

- Is it available?
- Is its energy source available?
- How long can it sustain output?
- How quickly can it respond?
- Can the transmission system deliver its output to the load?
- Are other resources likely to fail under the same conditions?

These questions eventually lead to forced-outage modeling, capacity accreditation, UCAP, ELCC, LOLE, and EUE. For now, the goal is simply to see why counting nameplate MW is insufficient.

---

## 6. Our hypothetical PJM day

We will use the simplified 90–150 GW day as the basis for the first interactive lab.

Imagine the following sequence:

1. **Overnight:** Demand is low. Many homes and businesses are quiet, but always-on loads continue.
2. **Morning ramp:** People wake, buildings open, and demand rises.
3. **Midday:** Commercial and industrial activity is high. Solar output may also be strong.
4. **Evening peak:** Demand reaches 150 GW as solar output fades and other loads remain elevated.
5. **Night:** Demand declines, creating an opportunity to reduce generation or charge storage.

The lab will let us change:

- the hourly demand curve;
- available generation by resource;
- solar and wind profiles;
- battery power and stored energy;
- unexpected generator outages; and
- the timing and size of a large data-center load.

It will show:

- hourly generation by resource;
- storage charging, discharging, and state of charge;
- unused available generation;
- unmet demand, if any;
- peak and average load;
- daily energy consumption; and
- load factor.

We will initially use a simple rule for choosing resources. Market bids, fuel costs, and prices belong in Units 2 and 3.

---

## 7. Why data centers change the shape of the question

A data center is not just an annual energy number. It has:

- a power requirement in MW;
- an hourly load profile;
- a physical location on the network;
- an energization date and construction ramp;
- a desired level of reliability;
- backup systems; and
- potentially some ability—or inability—to reduce load when the grid is stressed.

Consider a 1 GW campus operating at a constant 1 GW:

```text
Daily energy = 1 GW × 24 h = 24 GWh
Annual energy = 1 GW × 8,760 h = 8,760 GWh = 8.76 TWh
```

Adding it to our hypothetical system would increase demand by 1 GW in every hour. It would increase daily energy by 24 GWh, average load by 1 GW, and peak load by 1 GW.

Compare that with a weather-sensitive 1 GW load that appears only during the four-hour system peak. It adds just 4 GWh of daily energy, but still adds 1 GW to peak demand. The two loads have very different annual energy consumption but the same effect on that day's peak.

This is why both **magnitude** and **shape** matter.

Later we will add location, uncertainty, and connection timing. Those factors help explain why a list of announced data-center projects is not yet a grid load forecast.

---

## 8. Common misconceptions

### "A 1 GW plant produces 1 GWh"

The statement is missing a time interval. A plant producing 1 GW for one hour produces 1 GWh. If it produces 1 GW for 24 hours, it produces 24 GWh.

### "The region has more generation capacity than peak demand, so it is safe"

Only if sufficient generation is available at the right time, can sustain its output, and can be delivered through the network. A nameplate comparison ignores outages, weather, storage duration, transmission constraints, and correlated risks.

### "Electricity from a particular plant travels directly to the customer who bought it"

Commercial transactions can assign financial rights and obligations, but physical power flows through the interconnected network according to electrical conditions.

### "Batteries generate electricity"

Batteries shift energy through time. They discharge electricity that was stored earlier, minus losses.

### "Average demand tells us how much infrastructure the grid needs"

Infrastructure must also handle peaks, contingencies, local constraints, and uncertainty. Average demand alone hides the most stressful periods.

### "A flat 1 GW data-center load is equivalent to any other 1 GW load"

It may have the same instantaneous magnitude, but timing, flexibility, location, ramp schedule, and reliability requirements can create very different system consequences.

---

## 9. Readiness check

Try these without looking at the answer key.

### Question 1

A data center draws 250 MW continuously for eight hours. How much energy does it consume?

### Question 2

A 600 MW generator operates at 450 MW for four hours and 300 MW for two hours. How much energy does it produce over the six hours?

### Question 3

A battery is rated at 200 MW / 600 MWh. Ignoring losses and operating limits, how long can it discharge at:

1. 200 MW?
2. 100 MW?

### Question 4

A system consumes 2,400 GWh over a 24-hour day and reaches a peak of 125 GW. What are its average load and load factor?

### Question 5

Two systems both have 50 GW of installed generation and a 40 GW peak. System A has primarily fuel-secure thermal and hydro resources with independent outages. System B has primarily solar plus four-hour batteries and reaches peak demand several hours after sunset. Do their equal 25% nameplate reserve margins imply equal reliability? Why or why not?

### Question 6

What happens physically, in simplified terms, when load suddenly becomes greater than generation?

### Question 7

Why might a region have enough generation in total but still be unable to serve a new data center at a particular location?

<details>
<summary>Answer key</summary>

1. `250 MW × 8 h = 2,000 MWh = 2 GWh`.
2. `(450 MW × 4 h) + (300 MW × 2 h) = 1,800 MWh + 600 MWh = 2,400 MWh`.
3. At 200 MW: `600 MWh ÷ 200 MW = 3 h`. At 100 MW: `600 MWh ÷ 100 MW = 6 h`.
4. Average load is `2,400 GWh ÷ 24 h = 100 GW`. Load factor is `100 GW ÷ 125 GW = 80%`.
5. No. Nameplate reserve margin does not capture when variable resources produce, battery duration and starting state of charge, forced outages, correlated conditions, or the timing of peak risk. The systems can have very different shortage risk.
6. System frequency tends to fall. Fast physical and automatic responses initially arrest the decline, and responsive generation, storage, imports, or load reductions must restore balance. If they cannot, protective disconnection of load may be required.
7. Transmission or distribution facilities near the site may lack sufficient capacity. The system may require new lines, substations, transformers, or other upgrades even if adequate generation exists elsewhere.

</details>

---

## 10. Vocabulary to retain

- **Power:** rate of producing or consuming energy, measured in W, kW, MW, or GW.
- **Energy:** power accumulated over time, measured in Wh, kWh, MWh, GWh, or TWh.
- **Load or demand:** electrical power being consumed at a moment.
- **Peak load:** maximum demand during an interval.
- **Average load:** energy consumed during an interval divided by its duration.
- **Load factor:** average load divided by peak load.
- **Nameplate capacity:** a resource's rated maximum power output under specified conditions.
- **Capacity factor:** actual energy production divided by maximum possible energy production at continuous nameplate output.
- **Transmission:** high-voltage network that moves bulk power across longer distances.
- **Distribution:** local network that delivers power to most customers.
- **Substation:** facility that switches circuits, protects equipment, and often transforms voltage.
- **Frequency:** rate of AC oscillation; nominally 60 Hz in the continental US systems discussed here.
- **Operating reserve:** capability held ready to respond when supply or demand changes unexpectedly.
- **State of charge:** energy currently stored in a battery relative to its usable capacity.
- **Curtailment:** reduction of otherwise available generation or load, depending on context.
- **Unserved energy:** electricity demand that the system cannot supply.

## What comes next

The [interactive 24-hour grid lab](../apps/unit-01-grid-day/index.html) turns this lesson into a controllable system. Before writing market logic, we will test whether a resource fleet can physically follow demand and what happens when solar fades, a generator trips, a battery empties, or a data center connects. See the repository README for local launch instructions.

After the lab, Unit 2 will examine how different generating resources actually operate and what it costs to run them.

## Optional references

- [FERC: What FERC Does](https://www.ferc.gov/what-ferc-does)
- [FERC Energy Primer](https://www.ferc.gov/media/energy-primer-handbook-energy-market-basics)
- [PJM Learning Center: How Energy Use Varies With the Seasons](https://learn.pjm.com/electricity-basics/energy-use-and-weather.aspx)
- [PJM Learning Center: Electricity Basics](https://learn.pjm.com/electricity-basics.aspx)
