# Unit 3: Wholesale Energy Markets

## Before we begin

Units 1 and 2 gave us the physical ingredients:

- demand changes through time;
- electricity supply and demand must remain balanced;
- generators have different costs and operating constraints; and
- transmission limits where power can move.

Unit 3 adds a coordination mechanism: the wholesale energy market.

Our guiding question is:

> How can PJM decide which resources should run, determine what one more MWh is worth at each location, and settle the difference between tomorrow's plan and today's reality?

By the end of this lesson, you should be able to:

- distinguish wholesale from retail electricity transactions;
- build and clear a simple merit-order supply stack;
- identify the marginal generator and market-clearing price;
- explain why accepted generators can receive the same clearing price despite offering different prices;
- distinguish a generator's offer, marginal cost, market price, revenue, and profit;
- explain the roles of PJM's day-ahead and real-time energy markets;
- calculate a simple two-settlement example;
- explain why transmission congestion produces different locational marginal prices; and
- identify the energy, congestion, and marginal-loss components of LMP.

The numerical examples are deliberately simplified. Actual PJM market clearing uses security-constrained unit commitment and dispatch with far more detailed resource, reserve, transmission, and market rules.

---

## 1. Wholesale is not the same as retail

Most homes and businesses buy electricity from a utility or retail electricity supplier. That is the **retail** side of the industry.

Before the electricity reaches those customers, utilities, competitive suppliers, generators, power marketers, and other participants buy and sell electricity at the **wholesale** level.

### A simplified chain

```text
Generator or other resource
          ↓
PJM wholesale market or bilateral contract
          ↓
Utility / load-serving entity / retail supplier
          ↓
End-use customer
```

The chain is financial and institutional, not a dedicated physical wire from one seller to one buyer. Physical power flows through the interconnected network.

### Your retail bill is not simply the wholesale spot price

A customer's retail bill can include:

- wholesale energy costs;
- generation contracts or hedges;
- capacity costs;
- transmission charges;
- distribution infrastructure;
- ancillary services;
- administrative costs;
- policy charges and taxes; and
- the retail tariff's own design.

An LMP of $40/MWh therefore does not mean a household pays exactly four cents per kWh all-in. It is one wholesale component within a larger retail cost structure.

### Who operates the market?

PJM is a Regional Transmission Organization, or RTO. It coordinates the high-voltage system across its footprint and administers organized wholesale markets. It does not own the region's generation fleet or function as every customer's local utility.

In areas without an RTO or ISO, utilities may coordinate generation and trade power through other arrangements. Organized markets are important, but they are not the only possible industry structure.

---

## 2. The merit order

Suppose five resource groups offer energy for one hour:

```text
Wind:               3 GW at   $0/MWh
Nuclear:            5 GW at  $10/MWh
Gas combined cycle: 8 GW at  $35/MWh
Coal:                4 GW at  $45/MWh
Gas turbine:         5 GW at $100/MWh
```

Assume:

- one location with no transmission constraints;
- no startup costs, minimum-output constraints, ramp limits, losses, or reserves;
- each offer is constant across the listed quantity; and
- demand does not change with price.

Arrange the offers from lowest to highest. This creates the **merit order**, or supply stack:

```text
Cumulative supply

 3 GW  after wind
 8 GW  after nuclear
16 GW  after combined cycle
20 GW  after coal
25 GW  after gas turbine
```

If demand is 18 GW, the system accepts:

- all 3 GW of wind;
- all 5 GW of nuclear;
- all 8 GW of combined cycle; and
- 2 of the 4 GW offered by coal.

The gas turbine is not needed.

### The marginal generator

Coal supplies the final increment needed to meet 18 GW of demand. In this simplified example, coal is the **marginal resource** and the clearing price is:

```text
$45/MWh
```

If demand rose above 20 GW, some gas-turbine output would be needed and the clearing price would rise to $100/MWh.

If demand fell to 15 GW, combined cycle would be marginal and the price would be $35/MWh.

This demonstrates an important feature of electricity prices: a relatively small change in demand can produce a large price change when it moves the system onto a different part of the supply curve.

---

## 3. Why accepted resources receive the clearing price

In the simplified single-price market, every accepted MWh receives the clearing price, not its own offer price.

At 18 GW of demand:

```text
Wind receives:               $45/MWh
Nuclear receives:            $45/MWh
Gas combined cycle receives: $45/MWh
Accepted coal receives:      $45/MWh
```

Why not pay each resource its offer?

The market is pricing the value of one additional MWh at the margin. If the next MWh requires coal at $45/MWh, consuming one more MWh imposes approximately that incremental system cost under our assumptions. Producing one less MWh would avoid it.

A uniform marginal price also gives resources an incentive to offer near the cost of producing another MWh in a competitive market. A low-cost generator does not need to guess the most expensive accepted offer merely to be paid the clearing price.

Real markets require mitigation and monitoring because participants can have market power, offers do not always equal marginal cost, and the network or operating constraints may leave few alternatives.

### Offer is not the same as cost

An **offer** is the price and quantity a seller submits under market rules.

**Marginal cost** is the economic cost of producing one additional MWh.

They may be related, but they are not synonyms. Market rules can allow price-based offers, require or permit cost-based schedules, impose offer caps, and mitigate offers when market power is a concern.

For this unit's examples, we treat offers as if they reflect simplified short-run marginal costs.

---

## 4. Revenue, gross margin, and profit

Return to the 8 GW combined-cycle fleet offered at $35/MWh and paid $45/MWh for one hour.

### Revenue

```text
Revenue = 8,000 MWh × $45/MWh
        = $360,000
```

### Simplified variable operating cost

```text
Variable cost = 8,000 MWh × $35/MWh
              = $280,000
```

### Gross margin above the offer

```text
Gross margin = $360,000 − $280,000
             = $80,000
```

This $80,000 is sometimes called an **inframarginal rent** or operating margin in a simplified example.

It is not necessarily profit. The resource still must recover costs such as:

- construction and financing;
- fixed operations and maintenance;
- staffing and insurance;
- property taxes;
- maintenance caused by starts and cycling; and
- periods when it is unavailable or earns little revenue.

The coal resource is marginal at $45/MWh and, under the simplified assumption that its offer equals marginal cost, earns little or no margin on the final MWh. Its other accepted blocks could have different costs in a more realistic offer curve.

---

## 5. Supply curves are often stair steps

A generator does not have to submit one price for its entire range. It may have multiple offer blocks.

For example:

```text
First 100 MW:   $30/MWh
Next 200 MW:    $36/MWh
Final 150 MW:   $48/MWh
```

The later blocks may be more expensive because fuel efficiency changes with output, additional equipment must operate, or operating risks increase.

Aggregating many resources and blocks produces a stair-step supply curve. The curve is often relatively flat when many low-cost options remain and becomes steep when the system approaches its available limit.

### Demand is not perfectly vertical

Introductory diagrams often draw electricity demand as a fixed vertical line because most customers do not see or respond to the five-minute wholesale price.

In reality, some demand is price-sensitive:

- industrial customers can reduce production;
- batteries can stop charging;
- flexible data-center workloads may shift;
- demand-response resources can curtail; and
- price-responsive bids can specify a maximum willingness to pay.

The simplified vertical line remains useful, but it is an assumption.

---

## 6. Unit commitment is not the same as dispatch

The merit order pretends every plant can instantly operate at any output. Unit 2 showed why that is false.

### Unit commitment

**Unit commitment** decides which resources should be online and available over a future sequence of hours.

It must consider:

- startup time and startup cost;
- minimum output;
- minimum up and down times;
- ramp limits;
- forecast demand;
- expected renewable output;
- outages;
- reserve requirements; and
- transmission constraints.

The decision is chronological. Starting a slow unit tonight may be necessary to meet tomorrow morning's demand.

### Economic dispatch

**Economic dispatch** decides how much online resources should produce, subject to their limits and system constraints.

A useful simplification is:

```text
Commitment: Which machines need to be on?
Dispatch:   How much should each online machine produce?
```

PJM's actual market software co-optimizes a much richer version of these decisions. Because startup costs, minimum output, and other constraints do not always fit neatly into a single per-MWh price, some resources may require additional make-whole payments. These are part of **uplift**, which we will defer.

---

## 7. The day-ahead market

The day-ahead market creates a financially binding plan for the following operating day.

Participants submit offers to sell and bids to buy energy. PJM clears the market using forecast system conditions and resource and transmission constraints. The result includes hourly schedules and day-ahead LMPs.

The day-ahead market helps participants:

- plan generator commitment and fuel arrangements;
- hedge exposure to volatile real-time prices;
- schedule expected load and generation;
- identify expected congestion; and
- create a financially binding reference against which deviations are settled.

The day-ahead schedule is not a promise that reality will match the forecast. Weather changes, generators fail, renewable output differs, and customers consume more or less than expected.

That is why a real-time market is also necessary.

---

## 8. The real-time market

PJM's real-time market balances deviations from the day-ahead schedule using current system conditions. Real-time prices are calculated on a five-minute basis.

Changes can arise from:

- load forecast error;
- generator outages or derates;
- wind and solar forecast error;
- transmission outages or congestion;
- imports or exports changing; and
- operator actions needed to maintain reliability.

The real-time market is often called a **balancing market** because it settles differences between scheduled and actual quantities.

### Two markets, one physical grid

Day-ahead and real-time are not two separate electric systems. They are linked financial settlements around one physical operating day.

A participant's simplified settlement is:

```text
Day-ahead scheduled quantity × Day-ahead LMP

plus


Deviation from schedule × Real-time LMP
```

The sign depends on whether the participant is buying or selling and whether actual quantity is above or below the day-ahead schedule.

---

## 9. A two-settlement example

Suppose a load-serving entity schedules 100 MWh in the day-ahead market at $40/MWh.

Its day-ahead cost is:

```text
100 MWh × $40/MWh = $4,000
```

During the actual hour, its customers consume 105 MWh. The extra 5 MWh is settled at a real-time price of $60/MWh:

```text
5 MWh × $60/MWh = $300
```

Total simplified energy settlement:

```text
$4,000 + $300 = $4,300
```

Its effective average cost is:

```text
$4,300 ÷ 105 MWh = $40.95/MWh
```

### What if actual consumption is lower?

Suppose the entity schedules 100 MWh day-ahead but consumes only 95 MWh. Its deviation is negative 5 MWh. In simplified terms, it sells back that difference at the real-time price.

If real-time price is $60/MWh:

```text
Day-ahead purchase: 100 MWh × $40/MWh =  $4,000
Real-time deviation: −5 MWh × $60/MWh =   −$300
Total:                                      $3,700
```

The exact accounting language depends on participant type and settlement conventions, but the central intuition is durable: day-ahead establishes the scheduled position; real-time prices deviations.

### Forecasting creates financial exposure

If real-time prices are high, under-scheduling load can be expensive. Over-scheduling can also be costly if the real-time value of the excess differs unfavorably from the day-ahead purchase.

The two-settlement design therefore rewards useful forecasts without requiring them to be perfect.

---

## 10. One grid does not have one price

Our merit-order example assumed unlimited transmission. Real networks have constraints and electrical losses.

Imagine two areas:

```text
WEST                                  EAST
Abundant low-cost generation         Large city and data-center load
          ───── limited transmission line ─────>
                                      Higher-cost local generation
```

If the line has spare capacity, another MWh of eastern demand may be served by increasing low-cost western generation.

If the line is already at its limit, eastern demand cannot be served by sending more power across it. PJM may need to:

- reduce generation that would worsen the constraint; and
- increase more expensive generation on the constrained side.

This is **redispatch**. The marginal cost of serving another MWh can now differ by location.

### Congestion is not traffic congestion

The analogy to a crowded highway is helpful but incomplete. Power flows over many network paths according to electrical laws. A generator can increase or relieve a constraint even when it is not located directly beside the named line.

PJM's dispatch must respect monitored transmission limits under normal conditions and specified contingencies.

---

## 11. Locational Marginal Price

The **Locational Marginal Price**, or LMP, is the marginal cost of serving one additional MWh at a particular location while respecting generation and transmission constraints.

LMP is commonly decomposed into:

```text
LMP = Energy component
    + Congestion component
    + Marginal loss component
```

### Energy component

The energy component reflects the marginal value of energy for the system before location-specific congestion and losses are added.

### Congestion component

The congestion component reflects how an increment at the location affects binding transmission constraints and the cost of redispatching resources to remain within limits.

It can be positive or negative relative to the reference energy component. A location that worsens an expensive constraint can have a higher LMP; a location whose injection helps relieve it can have a different result.

### Marginal loss component

Transmission losses increase as power moves through electrical equipment. Supplying one additional MWh of load may require producing slightly more than one additional MWh at a distant generator.

The marginal loss component reflects the change in system losses associated with serving another increment at that location.

### Nodes, zones, and hubs

PJM calculates prices at many pricing locations. Market participants and analysts may also use aggregations such as zones or hubs.

An average zonal price can hide meaningful differences among individual nodes. For a large data center, the precise interconnection location can matter more than a broad regional average.

---

## 12. A congestion example without pretending the grid is simple

Suppose:

- western generation can supply another MWh for $30;
- an eastern generator can supply another MWh for $80; and
- the west-to-east transfer path is at its limit.

An additional eastern MWh cannot be served by simply increasing the $30 western plant. The system may need the $80 eastern plant, making the eastern marginal cost much higher.

An additional western MWh of load may still be served locally at approximately $30.

It is tempting to declare that the western LMP must therefore be exactly $30 and the eastern LMP exactly $80. A real meshed network is not that simple. The precise prices depend on:

- which constraints bind;
- how an injection at each node changes each constrained flow;
- losses;
- the marginal resources available for redispatch; and
- other simultaneous system constraints.

The correct takeaway is not a memorized two-price formula. It is:

> When transmission becomes binding, the cost of serving the next MWh depends on where that MWh is injected or withdrawn.

---

## 13. Scarcity and very high prices

When plenty of capacity is available, price is usually set by an ordinary energy offer. As the system tightens, the value of reserves and flexibility rises.

If serving more energy would reduce operating reserves below required levels, shortage-pricing rules can increase energy and reserve prices. The price signal is intended to reflect that the system is giving up valuable protection against another contingency.

High prices can:

- encourage available generators to produce;
- encourage flexible load to reduce consumption;
- attract imports when feasible;
- reward resources that preserved flexibility; and
- signal the value of investment or transmission at constrained times and locations.

Actual PJM scarcity pricing is governed by detailed rules and co-optimization of energy and reserves. We do not need those formulas yet.

### Price cap does not mean physical cap

A market price cap limits a price produced by market rules. It does not create physical supply. A system can still face a shortage even if the price has reached an administrative ceiling.

---

## 14. Why prices can be negative

A negative wholesale price means the marginal market outcome pays a buyer to consume, or charges a seller to inject, during that interval and location.

Possible contributors include:

- abundant wind or solar output;
- low demand;
- transmission congestion;
- thermal generators with minimum-output or shutdown constraints;
- startup and cycling costs that make remaining online preferable;
- production incentives or contract terms outside the energy price; and
- limited storage or export capability.

Negative price does not mean electricity has no value to all customers or that the grid has unlimited free energy. It is a time- and location-specific marginal signal within the wholesale market.

Curtailment may still occur if generation cannot be absorbed or transmitted.

---

## 15. Energy is only one market product

The energy market pays for MWh produced or consumed through market positions.

PJM also procures ancillary services that support short-term operation, including regulation and reserves. A resource may need to hold back some capability instead of producing energy so it can respond to an unexpected event.

Capacity is different again: it concerns a future commitment to be available for system needs.

Keep the layers separate:

```text
Energy:             Produce or consume MWh
Ancillary services: Maintain short-term balancing capability
Capacity:           Commit dependable capability for a future period
```

The products interact. A generator can earn multiple revenue streams, and reserving capability for one product can change what remains available for another.

---

## 16. Contracts, hedges, and spot prices

Not every MWh is economically exposed to the spot LMP.

Market participants use:

- bilateral power contracts;
- fixed-price retail supply arrangements;
- financial swaps;
- long-term power-purchase agreements;
- fuel hedges; and
- congestion hedges.

These instruments redistribute price risk. They generally do not change the physical need for PJM to dispatch the system and calculate spot prices.

A generator might physically produce at a $100/MWh LMP while a financial contract fixes its net energy price at a different level. A utility might pay volatile wholesale prices but recover costs from customers under a smoother retail tariff.

When evaluating an asset or company, we must distinguish:

- physical output;
- market settlement;
- contractual settlement; and
- final accounting revenue.

---

## 17. The data-center connection

Large data centers make time and location especially important.

### One additional flat GW

A 1 GW campus adds approximately 1,000 MWh of demand in every hour it operates at full load.

Its wholesale energy cost at a constant $40/MWh would be:

```text
1,000 MWh/h × $40/MWh = $40,000 per hour
```

Across a non-leap year at constant output:

```text
8,760,000 MWh × $40/MWh = $350.4 million
```

This is a simplified energy-only calculation. It excludes capacity, transmission, distribution, losses, ancillary services, taxes, infrastructure, and hedging.

Every $10/MWh change in the annual average energy price changes this hypothetical cost by:

```text
8,760,000 MWh × $10/MWh = $87.6 million per year
```

### Location

A campus behind a binding transmission constraint can face a different LMP from a campus elsewhere in PJM. Broad regional averages may miss the specific congestion risk that matters to a site.

### Forecast error

A load-serving entity must manage the difference between scheduled and actual consumption. A large, unexpected ramp can create real-time exposure.

### Flexibility

If some computing work can shift across hours or locations, the data center may reduce consumption during high-price or constrained intervals and increase it when energy is abundant. The feasibility depends on workload deadlines, redundancy, networking, customer requirements, and facility operations.

### Contract claims

A long-term renewable contract may stabilize cost or support new generation. It does not by itself eliminate hourly LMP exposure, transmission congestion, or the need for dependable supply when the renewable resource is unavailable.

---

## 18. Common misconceptions

### "The cheapest plant sets its own price"

In a uniform clearing market, the marginal accepted offer sets the simplified clearing price. Lower-offer accepted resources receive that marginal price.

### "Every generator earns pure profit whenever price exceeds its offer"

The difference first contributes to fixed costs and other obligations. Offer price is not total cost, and revenue is not profit.

### "PJM dispatches strictly from cheapest to most expensive"

PJM seeks a least-cost feasible solution subject to transmission, reserve, commitment, ramping, outage, and other constraints. A more expensive resource may run because the cheaper resource cannot start, ramp, or deliver additional power.

### "Day-ahead is only a forecast"

It uses forecasts, but its cleared positions are financially binding. Real-time settles deviations.

### "Real-time replaces the day-ahead settlement"

The markets form a two-settlement system. Real-time generally prices the difference from the day-ahead position.

### "PJM has one electricity price"

PJM calculates locational prices. Congestion and losses can create significant differences across nodes and aggregations.

### "A negative price means electricity is free for retail customers"

The negative LMP applies to a particular wholesale interval and location. Retail tariffs and many other cost components remain.

### "High energy prices prove the system lacks annual energy"

A high price may reflect a short-lived peak, a transmission constraint, an outage, fuel conditions, or reserve scarcity. Annual energy totals can look ample while a specific hour and location are tight.

---

## 19. Readiness check

Try these without opening the answer key.

### Question 1

Using the five-resource stack from Section 2, what clears and what sets the price when demand is:

1. 7 GW?
2. 16 GW?
3. 22 GW?

### Question 2

At 18 GW of demand and a $45/MWh clearing price, calculate one-hour revenue for the 3 GW wind fleet and 5 GW nuclear fleet.

### Question 3

A 300 MW generator produces at full output for one hour. Its offer is $32/MWh and the clearing price is $50/MWh. Calculate revenue, simplified variable cost, and gross margin above the offer.

### Question 4

A load schedules 80 MWh day-ahead at $35/MWh and consumes 86 MWh when real-time price is $70/MWh. What is its simplified total settlement and effective average price?

### Question 5

The same load schedules 80 MWh but consumes 74 MWh. Real-time price is $20/MWh. What is its simplified total settlement?

### Question 6

Why might a $90/MWh local generator run while a $30/MWh generator elsewhere in PJM still has unused capacity?

### Question 7

Name the three conceptual components of LMP and explain each in one sentence.

### Question 8

Why can a generator with a ten-hour startup time be committed even if its energy is not needed in the current hour?

### Question 9

A 500 MW data center runs continuously for a non-leap year. How many MWh does it consume? How much does a $15/MWh change in average energy price change its simplified annual energy cost?

### Question 10

Explain why a negative wholesale price and renewable curtailment can occur during the same hour.

<details>
<summary>Answer key</summary>

1. At 7 GW, all 3 GW wind plus 4 GW nuclear clear; nuclear sets $10/MWh. At 16 GW, wind, nuclear, and all combined cycle clear; the combined-cycle offer sets $35/MWh. At 22 GW, wind, nuclear, combined cycle, coal, and 2 GW of gas turbine clear; gas turbine sets $100/MWh.
2. Wind revenue is `3,000 MWh × $45/MWh = $135,000`. Nuclear revenue is `5,000 MWh × $45/MWh = $225,000`.
3. Revenue is `300 MWh × $50 = $15,000`. Simplified variable cost is `300 MWh × $32 = $9,600`. Gross margin is `$5,400`.
4. Day-ahead cost is `80 × $35 = $2,800`. The 6 MWh positive deviation costs `6 × $70 = $420`. Total is `$3,220`; effective price is `$3,220 ÷ 86 = $37.44/MWh`.
5. Day-ahead cost is `$2,800`. The deviation is `−6 MWh × $20 = −$120`. Total is `$2,680`.
6. Transmission congestion may prevent the cheaper generator from delivering another increment to the load. Startup, ramp, reserve, or other operating constraints could also make the cheap capacity unusable at that moment.
7. Energy reflects the system marginal energy value; congestion reflects the effect of binding transmission constraints and redispatch; marginal losses reflect the additional production needed because delivery changes electrical losses.
8. Commitment anticipates future hours. The unit must begin starting now to be available when forecast demand later requires it.
9. Energy is `500 MW × 8,760 h = 4,380,000 MWh`. A `$15/MWh` change alters simplified annual energy cost by `4,380,000 × $15 = $65.7 million`.
10. Negative prices can signal excess supply and costly shutdown or congestion conditions, but the price signal may still be insufficient to absorb all generation or move it through a constrained network. Some output must then be curtailed.

</details>

---

## 20. Vocabulary to retain

- **Wholesale market:** market in which electricity and related products are sold among generators, utilities, suppliers, and other market participants before retail delivery.
- **Retail market:** sale of electricity service to end-use customers.
- **Bid:** submission to buy energy, generally specifying quantity and price conditions.
- **Offer:** submission to sell energy, generally specifying quantity and price conditions.
- **Merit order:** ordering of supply offers from lowest to highest price.
- **Marginal resource:** resource supplying the final increment required in the simplified clearing solution.
- **Market-clearing price:** price established where accepted supply meets demand under the market's constraints.
- **Uniform pricing:** accepted quantities at a location receive or pay the applicable clearing price rather than each seller's individual offer.
- **Inframarginal margin:** difference between market revenue and incremental cost or offer for lower-cost accepted production in a simplified example.
- **Unit commitment:** decision about which resources should be online over a sequence of future intervals.
- **Economic dispatch:** selection of output levels for available resources subject to system constraints.
- **Day-Ahead Market:** financially binding forward market for the following operating day.
- **Real-Time Market:** balancing market that prices deviations using current operating conditions.
- **Two-settlement system:** day-ahead settlement of scheduled quantities plus real-time settlement of deviations.
- **Locational Marginal Price (LMP):** marginal cost of serving another MWh at a specific location subject to system constraints.
- **Congestion:** condition in which a transmission constraint affects feasible dispatch.
- **Redispatch:** increasing and decreasing selected resources to manage system constraints.
- **Marginal loss:** change in transmission losses caused by an incremental injection or withdrawal.
- **Scarcity pricing:** prices reflecting the value of limited energy or operating reserves during tight conditions.
- **Uplift:** additional settlement used when market prices alone do not cover certain eligible commitment or operating costs.
- **Hedge:** financial or contractual position designed to reduce exposure to price variability.

## What comes next

The [Unit 3 interactive lab](../apps/unit-03-energy-market/index.html) begins with the five-resource supply stack from this lesson. It lets us move demand across the stack, observe the marginal generator and gross margins, settle a day-ahead forecast error, and then add a constrained second location to create different LMPs. See the repository README for local launch instructions.

Unit 4 will step back from the question "Which resources should run now?" and ask the longer-term question: "Will enough dependable resources exist when conditions become unusually difficult?"

## Optional references

- [FERC: Energy Markets](https://www.ferc.gov/understanding-energy-markets)
- [FERC: Wholesale Electricity Markets Overview](https://www.ferc.gov/wholesale-electricity-markets-overview-and-guide)
- [PJM Energy Market](https://www.pjm.com/en/markets-and-operations/energy)
- [PJM Learning Center: Market for Electricity](https://learn.pjm.com/electricity-basics/market-for-electricity.aspx)
- [PJM manuals](https://www.pjm.com/library/manuals.aspx), particularly Manual 11 as we add PJM-specific detail
