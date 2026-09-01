# Unit 5: Capacity Markets

## Before we begin

Unit 4 determined how much dependable capability a future system needs. Unit 5 asks how PJM obtains commitments from resources to help meet that need—and how the resulting price is determined.

By the end of this lesson, you should be able to:

- distinguish an energy payment from a capacity payment;
- describe the timeline from a reliability study to a delivery year;
- read a simple capacity supply curve and find an auction-clearing result;
- explain why PJM uses a downward-sloping capacity demand curve;
- distinguish a reliability requirement from the quantity purchased in an auction;
- explain ICAP, UCAP, CONE, and Net CONE at an introductory level;
- calculate approximate annual capacity revenue or customer cost;
- explain why capacity prices can differ by location;
- describe the obligations that accompany a capacity commitment; and
- trace how data-center load growth can affect capacity prices and costs.

This is an introduction to the economic mechanism, not a guide to bidding or a complete description of PJM's current tariff. Detailed auction parameters and rules change over time. Our goal is to understand the durable structure well enough to investigate particular delivery years later.

---

## 1. Two products for two different questions

Recall the energy market from Unit 3:

> Which resources should produce electricity now, and what should each MWh be worth at this location and time?

A capacity market asks a different question:

> Which resources will commit dependable capability for a future period, and what is that commitment worth?

The two products have different units:

```text
Energy
Actual production or consumption over time
Measured in MWh
Priced in $/MWh

Capacity
An accredited commitment of capability
Measured in MW
PJM auction prices are commonly stated in $/MW-day
```

A generator can receive both types of revenue. It may also earn ancillary-service revenue for capabilities such as reserves or frequency regulation.

This leads to a simple **revenue stack**:

```text
Energy revenue
       +
Ancillary-service revenue
       +
Capacity revenue
       =
Total market revenue before other adjustments
```

These revenues pay for different things. A capacity payment is not payment for MWh already generated, and an energy payment is not automatically a promise that the resource will still exist several years from now.

---

## 2. Why create a capacity market?

Some resources are most valuable during rare, difficult conditions. Consider a peaking generator that runs only 20 hours in a year. Its energy-market margin during those hours may not reliably recover all of its annual fixed costs:

- construction financing;
- staffing;
- maintenance;
- property and insurance costs;
- pipeline or fuel arrangements; and
- the return required to keep capital invested.

If the system needs that plant for reliability but its expected market revenue cannot support it, investors may retire it or decline to build a replacement. This problem is often discussed as **missing money**.

A capacity market is one market-design response. It creates a forward payment for qualifying resources that commit to be available under defined rules. The payment can support existing resources, demand-side capability, imports, storage, or new entry when those resources are eligible and competitive.

This does not prove that every electricity system must use a centralized capacity market. Regions use different designs, including energy-only markets, bilateral requirements, and utility planning. A capacity market is an institutional choice for translating a planning need into commitments and prices.

PJM calls its capacity-market construct the **Reliability Pricing Model**, or **RPM**.

---

## 3. What PJM is buying

The easiest definition is:

> Capacity is a resource's accredited commitment to be available and perform according to market rules during a future delivery period.

That definition contains four important ideas.

### It is forward

The main auction is intended to occur before the delivery year so suppliers and customers can plan. Actual auction schedules can be altered or compressed, so later analysis must check the dates for the specific delivery year.

### It is accredited

PJM does not simply count every nameplate MW equally. A resource clears and is paid using a capacity quantity determined under accreditation rules. We will introduce this distinction later in the lesson and study it deeply in Unit 7.

### It is a commitment

Clearing an auction creates obligations. Capacity revenue is not free money for merely owning equipment.

### It concerns capability, not guaranteed production

A cleared generator does not run continuously merely because it sold capacity. The energy market and system operator still determine when it operates. But it must satisfy applicable offer, availability, testing, notification, and performance requirements.

---

## 4. From forecast to delivery year

A simplified timeline looks like this:

```text
Future load forecast
        ↓
Reliability study and reserve requirement
        ↓
Accreditation and locational requirements
        ↓
Base Residual Auction
        ↓
Incremental auctions and other adjustments
        ↓
Delivery year: resources carry obligations and may perform
```

### Base Residual Auction

PJM's principal auction is the **Base Residual Auction**, usually abbreviated **BRA**. Its standard design is a forward auction for a future delivery year. “Residual” reflects that it obtains the requirement remaining after accounting for applicable commitments outside the central auction and other adjustments.

### Incremental auctions

Conditions change after the BRA:

- load forecasts rise or fall;
- resources retire;
- new projects are delayed;
- resource ratings change; or
- obligations move between participants.

PJM therefore conducts **Incremental Auctions** closer to the delivery year to adjust positions. The exact sequence and schedule are implementation details we can study later.

### Delivery year

The commitment applies during a defined delivery year. The auction therefore trades a future obligation, not electricity delivered on auction day.

### The FRR alternative

Eligible load-serving entities may use the **Fixed Resource Requirement**, or **FRR**, alternative rather than having all of their obligation procured through RPM auctions. This matters because the system's total reliability need and the quantity cleared in one central auction are not necessarily identical.

---

## 5. Who can supply capacity?

Depending on the applicable rules and qualifications, capacity can come from resources such as:

- existing generators;
- planned new generators;
- storage;
- demand response;
- imports backed by external capability and transmission arrangements; and
- qualifying increases in capability at existing facilities.

Each resource must satisfy market and technical requirements. An announcement, interconnection request, or nameplate rating alone is not a capacity commitment.

Demand response illustrates why “capacity” is broader than “generation.” If a customer can reliably reduce 50 MW during specified system conditions, that reduction can serve the same immediate balance equation as 50 MW of additional supply:

```text
Supply − load reduction = load served by other supply
```

But qualification, measurement, duration, notification, and performance rules determine how much of that capability counts.

---

## 6. The supply side of a capacity auction

Imagine that suppliers offer blocks of accredited capacity. Each block has a quantity and an offer price.

Our fictional offers are:

- 20 GW of nuclear at $40/MW-day;
- 15 GW of coal at $80/MW-day;
- 25 GW of combined-cycle gas at $120/MW-day;
- 5 GW of demand response at $150/MW-day; and
- 15 GW of new gas capacity at $220/MW-day.

Ordered from lowest to highest price, they form a stair-step supply curve:

```text
Cumulative accredited capacity     Offer price
0–20 GW                            $40/MW-day
20–35 GW                           $80/MW-day
35–60 GW                           $120/MW-day
60–65 GW                           $150/MW-day
65–80 GW                           $220/MW-day
```

For the moment, pretend the buyer must acquire exactly 60 GW—a vertical demand curve. The auction accepts the cheapest offers until reaching 60 GW. The last accepted block is combined-cycle gas at $120/MW-day.

In this simplified **uniform-price auction**, every accepted MW receives the clearing price, not its own offer price.

```text
Clearing quantity = 60 GW
Clearing price = $120/MW-day
```

Real offer rules, mitigation, minimum quantities, resource constraints, locations, and clearing algorithms are more complicated. The toy stack isolates the central mechanism.

---

## 7. Why a small quantity change can produce a large price change

Keep the same offers but increase the toy requirement.

### At 60 GW

Combined-cycle gas is marginal:

```text
Price = $120/MW-day
```

### At 63 GW

Three GW of demand response must clear:

```text
Price = $150/MW-day
```

### At 70 GW

Five GW of the new-gas block must clear:

```text
Price = $220/MW-day
```

The requirement rose by only 10 GW from the first case, but the marginal offer nearly doubled the price paid to every cleared MW in this simplified example.

This is the geometry behind a central capacity-market insight:

> When the supply curve is steep near the clearing point, a modest change in demand or supply can cause a large price change.

The same thing can happen if demand stays constant but a low-priced resource retires, loses accreditation, misses its entry date, or becomes unavailable to a constrained location.

---

## 8. Turning a daily capacity price into annual dollars

An approximate annual capacity payment is:

```text
Accredited MW × clearing price in $/MW-day × days in delivery period
```

Using 365 days, the 60 GW case produces:

```text
60,000 MW × $120/MW-day × 365 days
= $2.628 billion
```

The 63 GW case produces:

```text
63,000 MW × $150/MW-day × 365 days
= $3.44925 billion
```

The cleared quantity rose 5%, but this simplified gross payment rose by about 31%. The quantity increase moved the entire market onto a higher-priced supply block.

Actual customer charges and supplier revenues include zones, obligations, auction adjustments, performance, settlement rules, hedges, and other factors. The multiplication is an intuition-building estimate, not a bill forecast.

For an individual 500 MW resource clearing at $150/MW-day:

```text
500 MW × $150/MW-day × 365
= $27.375 million per year
```

That scale explains why forecasts of future clearing prices can be economically valuable.

---

## 9. Real PJM demand is not a vertical line

Our first auction forced the buyer to purchase exactly 60 GW at any price. PJM instead uses an administratively defined, downward-sloping **Variable Resource Requirement curve**, usually called the **VRR curve**.

It expresses a relationship between:

- the quantity of capacity PJM is willing to procure; and
- the price the market assigns at that quantity.

Conceptually:

```text
Capacity price
    │\
    │ \
    │  \       downward-sloping VRR demand curve
    │   \
    │    X      intersection clears the auction
    │   / \
    │  /   \
    │_/_____\________________ Accredited capacity
      upward-sloping supply
```

The precise curve is defined by planning parameters for each auction. The reliability requirement helps locate its target quantity, while cost benchmarks help determine its price points.

### Why slope the demand curve?

A vertical requirement says the final MW before the target is indispensable, while the first MW beyond it has no value. Reliability does not behave that abruptly.

Additional capacity above a target can still reduce shortage risk. Capacity somewhat below a target still has value, although it leaves more risk. A sloped curve recognizes this gradual relationship and can reduce the extreme price volatility and market-power problems of a perfectly vertical demand curve.

### Reliability requirement versus auction result

The **reliability requirement** is the planning quantity associated with satisfying the reliability criterion under the study's assumptions.

The **cleared auction quantity** is the quantity at which the offered supply curve intersects the VRR demand curve, subject to market rules and constraints.

They are related, but they need not be numerically equal. Low-priced supply can lead the auction to clear above the target; expensive supply can lead it to clear below the target within the curve's allowed range.

---

## 10. CONE and Net CONE

The capacity demand curve needs an economic scale for its price axis. Two important concepts help provide it.

### Cost of New Entry

**CONE**, or **Cost of New Entry**, estimates the annualized cost of building and maintaining a specified reference resource. It converts construction and fixed operating costs into an annual value, commonly expressed on a capacity basis.

### Net CONE

A new resource may also expect to earn money in the energy and ancillary-service markets. The capacity market would not need to recover costs already expected from those sources.

Conceptually:

```text
Net CONE
= Gross CONE
− projected net energy and ancillary-service revenue
```

If gross CONE is `$300/MW-day` and the projected energy and ancillary-service offset is `$110/MW-day`:

```text
Net CONE = $190/MW-day
```

Net CONE helps anchor the VRR curve. It is not:

- a guaranteed return to every developer;
- the actual cost of every possible plant;
- a forecast that a plant will definitely be built; or
- the auction clearing price by definition.

Reference technology, financing assumptions, location, cost estimates, and expected market revenues all matter. Seemingly technical parameter choices can therefore move billions of dollars.

---

## 11. Nameplate MW are not auction MW

Unit 4 established that installed capacity is not the same as dependable capability. The auction needs a common quantity for comparing resources with different reliability characteristics.

At an introductory level:

- **ICAP**, or Installed Capacity, begins from a resource's rated capability under applicable rules.
- **UCAP**, or Unforced Capacity, represents the accredited capacity quantity used for resource-adequacy and market purposes after relevant performance adjustments.

A 100 MW nameplate resource may offer fewer than 100 MW of accredited capacity. The translation depends on the resource type and PJM's accreditation methodology.

This is particularly important for:

- thermal resources with forced-outage risk;
- wind and solar whose output depends on weather and time;
- storage whose contribution depends on duration and system conditions; and
- combinations of resources whose risks may be correlated.

Unit 7 will examine accreditation and Effective Load Carrying Capability. For now, retain this rule:

> Capacity auctions compare accredited MW, not a casual sum of nameplate ratings.

---

## 12. Capacity can have a location

Suppose PJM has enough capacity in aggregate, but a transmission constraint prevents remote resources from serving a particular area during stressed conditions. Capacity outside the constraint is not a complete substitute for capacity inside it.

PJM models **Locational Deliverability Areas**, or **LDAs**, and can impose locational capacity requirements. When a constrained area needs local resources, its supply-demand intersection can produce a different clearing price.

```text
PJM-wide capacity may be sufficient
                 +
Transmission into Area A is limited
                 +
Area A has little local supply
                 ↓
Area A can clear at a higher capacity price
```

Location matters twice:

- in the energy market, congestion can create different LMPs now; and
- in the capacity market, deliverability constraints can create different forward capacity prices.

A data center therefore cannot be analyzed only as “one more GW somewhere in PJM.” Its zone, transmission needs, and timing can be economically decisive.

---

## 13. A capacity commitment has obligations

A resource that sells capacity generally must meet requirements such as:

- offering into applicable energy markets;
- maintaining qualifying status;
- reporting outages and availability;
- participating in tests or demonstrations;
- following approved maintenance and outage procedures; and
- performing during defined emergency or shortage conditions.

Failure can have financial consequences. The details depend on the tariff and the delivery period, but the durable economic logic is simple:

```text
Capacity payment
        ↕
Obligation to make accredited capability available and perform
```

Without credible obligations, buyers would be paying for a promise that could disappear precisely when it matters.

Performance incentives also create risk for sellers. A resource must consider not just the expected payment but its probability of being unavailable, fuel-constrained, energy-limited, or otherwise unable to meet the obligation.

---

## 14. What a capacity price signals—and what it cannot guarantee

A high capacity price can signal that accredited supply is scarce relative to the demand curve. It can:

- increase revenue for existing resources;
- discourage retirement;
- reward demand response or imports;
- make upgrades more attractive; and
- improve the economics of new entry.

But a price signal does not instantly create a power plant. Developers still face:

- interconnection studies and network upgrades;
- permitting;
- site control;
- financing;
- equipment procurement;
- construction lead times;
- gas-pipeline or fuel arrangements; and
- uncertainty about future revenues after the delivery year.

A high one-year price may be insufficient for a project that requires many years of stable cash flow. Conversely, a low capacity price can reflect abundant supply today while obscuring future retirements or rapidly growing load.

This is one reason a model that looks beyond the most recent auction result can be valuable.

---

## 15. Administrative choices shape the result

A capacity auction is not a naturally occurring curve waiting to be observed. Institutions define important inputs and rules, including:

- the load forecast;
- the reliability criterion and reserve requirement;
- resource accreditation;
- the shape and price points of the VRR curve;
- CONE and expected revenue assumptions;
- locational constraints;
- offer mitigation;
- price caps and floors where applicable;
- qualification and retirement rules; and
- performance obligations.

These choices are necessary because reliability is partly a public good: customers cannot independently choose to remain physically isolated from a widespread shortage while using the same grid.

They also create legitimate debates. A forecast that is too high may procure expensive excess capacity. A forecast that is too low may leave inadequate time to build resources. Accreditation can overstate or understate contribution. Mitigation can protect consumers from market power but may also affect investment incentives.

Understanding a capacity model therefore requires studying both physical assumptions and market rules.

---

## 16. The data-center connection

Large data centers can affect the capacity market through several channels.

### They can raise the forecast requirement

If credible new data-center load increases the forecast peak, the reliability study may identify a higher capacity need. That shifts the relevant portion of capacity demand to the right.

### The timing can be mismatched

A campus may energize faster than generation and transmission can be completed. Even if a future project pipeline is large, only resources expected to qualify by the delivery year can help clear that year's need.

### Geographic concentration can raise local value

Several campuses in one constrained zone may create a local capacity problem even when the whole region appears adequate.

### Flexibility can reduce the effective burden

A facility able to curtail verified load during scarce conditions may qualify as demand response or reduce its exposure through an applicable program or contract. A constant, inflexible load and a flexible load with the same annual MWh are not equivalent for reliability.

### Capacity cost can be material

As a rough scale calculation, 1,000 MW exposed to $200/MW-day corresponds to:

```text
1,000 MW × $200/MW-day × 365
= $73 million per year
```

That is not a forecast of any specific customer's bill. Actual obligations, rates, zones, peak-contribution methods, contracts, and pass-through arrangements matter. It does show why a hyperscaler, utility, power developer, or investor might pay for a better forecast of load, supply, accreditation, and auction outcomes.

---

## 17. Why a capacity model can be economically valuable

A useful model connects several uncertain layers:

```text
Large-load forecast and timing
             ↓
Reliability requirement and location
             ↓
Accredited existing and new supply
             ↓
Retirements, delays, and constraints
             ↓
Supply curve × VRR demand curve
             ↓
Clearing quantity, price, and exposure
```

Different clients can use that view differently.

- A generator owner may estimate capacity revenue and retirement economics.
- A developer may evaluate whether new capacity could clear and at what price.
- A data-center operator may compare locations, energization dates, flexibility, and power-cost exposure.
- A utility or load-serving entity may estimate procurement costs and customer impacts.
- An investor may evaluate power producers, equipment demand, fuel infrastructure, or project economics.

The value does not come from predicting one number with certainty. It comes from making assumptions explicit, testing scenarios, locating nonlinearities, and updating faster than decisions can be reversed.

The steep part of a supply curve is especially important: being wrong by 2 GW may matter little in one scenario and move the clearing price dramatically in another.

---

## 18. What the capacity market does not solve by itself

A capacity auction can procure commitments, but it does not automatically:

- construct transmission;
- shorten interconnection queues;
- issue permits;
- guarantee fuel availability;
- guarantee distribution service to a particular site;
- eliminate all operational failures;
- ensure that every proposed new resource is financeable; or
- decide the socially optimal mix of emissions, land use, and technology.

It also cannot make a poor load forecast accurate. Market-clearing precision does not repair incorrect inputs.

Capacity markets therefore sit inside a larger system of resource planning, transmission planning, interconnection, environmental policy, fuel infrastructure, and real-time operation.

---

## 19. Common misconceptions

### “Capacity is electricity stored for later”

Capacity is a commitment of capability. It is not a warehouse of MWh. Storage can sell capacity, but its stored energy and duration still constrain performance.

### “A plant paid for capacity must run all year”

No. Energy dispatch determines actual production. Capacity creates availability and performance obligations.

### “Capacity price is quoted in `$/MWh`”

Energy is commonly priced in `$/MWh`. PJM capacity auction prices are commonly quoted in `$/MW-day` of accredited capacity.

### “PJM simply buys the reserve requirement exactly”

The offered supply curve intersects a sloped VRR demand curve. The auction quantity can differ from the target reliability quantity, and arrangements such as FRR also affect what the central auction must procure.

### “Every nameplate MW participates as one capacity MW”

Resources receive accredited quantities reflecting applicable reliability and performance methods.

### “The cheapest resource always sets the price”

Offers are accepted from low to high, but the marginal accepted offer or curve intersection determines the clearing price in the simplified uniform-price model.

### “A high price guarantees new construction”

It improves the signal, but entry depends on lead times, permits, interconnection, financing, fuel, equipment, and expectations for many future years.

### “One PJM-wide price tells the whole story”

Locational constraints can create different capacity needs and prices in different areas.

---

## 20. Readiness check

Try these without opening the answer key.

### Question 1

What does the energy market buy, what does the capacity market buy, and what price unit is commonly associated with each?

### Question 2

A 500 MW resource clears at $150/MW-day for a 365-day delivery period. What is its simplified gross capacity revenue?

### Question 3

Using the supply stack in Section 6 and a vertical toy requirement, what clears at requirements of 60 GW, 63 GW, and 70 GW?

### Question 4

Why does total gross cost rise much faster than quantity between the 60 GW and 63 GW toy cases?

### Question 5

Gross CONE is `$300/MW-day` and projected net energy and ancillary-service revenue is `$110/MW-day`. What is Net CONE, and what role does it play?

### Question 6

Why might a downward-sloping VRR curve be preferable to a perfectly vertical capacity requirement?

### Question 7

Give two reasons the cleared quantity in the BRA may differ from the reliability requirement.

### Question 8

Why can capacity clear at a higher price in one PJM location than another?

### Question 9

Why does a high capacity price not guarantee that enough new plants will enter service by the delivery year?

### Question 10

Estimate the annual scale of capacity cost associated with 1 GW at $200/MW-day. Then name two reasons this is not necessarily a particular data center's actual bill.

<details>
<summary>Answer key</summary>

1. The energy market buys actual production or consumption over time and is commonly priced in `$/MWh`. The capacity market buys an accredited future capability commitment and PJM prices are commonly stated in `$/MW-day`.
2. `500 MW × $150/MW-day × 365 = $27.375 million`.
3. At 60 GW, combined-cycle gas is marginal and the price is `$120/MW-day`. At 63 GW, demand response is marginal and the price is `$150/MW-day`. At 70 GW, new gas is marginal and the price is `$220/MW-day`.
4. The additional quantity reaches a higher-priced supply block. Under the simplified uniform-price rule, the new clearing price applies to all cleared capacity, not only the extra 3 GW.
5. `Net CONE = $300 − $110 = $190/MW-day`. It is an economic benchmark used to help anchor price points on the administrative capacity demand curve; it is not automatically the clearing price or a guaranteed return.
6. Reliability value changes gradually around a target. A slope values some capacity beyond the target and allows price and quantity to adjust together, which can reduce volatility and vulnerability to market power compared with a vertical curve.
7. The supply curve intersects a sloped VRR curve rather than a fixed vertical requirement. Also, FRR commitments and other adjustments can make the central auction's residual quantity differ from total system need. Low or high offer prices can clear quantities above or below the curve's target.
8. Transmission limits may prevent outside resources from serving a constrained Locational Deliverability Area. Scarce local supply can therefore have greater reliability value and clear at a higher price.
9. New projects still require permitting, interconnection, equipment, fuel arrangements, financing, and construction time. Developers also consider whether revenues will persist beyond one delivery year.
10. `1,000 MW × $200/MW-day × 365 = $73 million per year`. Actual bills depend on factors such as the customer's capacity obligation, zone, peak-contribution method, contract, tariff, pass-through arrangement, and flexibility.

</details>

---

## 21. Vocabulary to retain

- **Capacity:** accredited capability committed under market rules for a future delivery period.
- **RPM:** Reliability Pricing Model, PJM's capacity-market construct.
- **Base Residual Auction (BRA):** PJM's principal forward auction for residual capacity needs in a future delivery year.
- **Incremental Auction:** later auction used to adjust capacity positions as conditions change.
- **Delivery year:** period during which cleared capacity obligations apply.
- **FRR:** Fixed Resource Requirement, an alternative available to eligible load-serving entities for satisfying capacity obligations outside the centralized RPM auction.
- **Supply offer:** quantity of accredited capacity a seller offers at a stated price.
- **Clearing price:** price at the intersection of accepted supply and demand, subject to auction rules and constraints.
- **Uniform price:** simplified rule under which accepted suppliers in a clearing area receive the market-clearing price rather than their individual offer prices.
- **VRR curve:** Variable Resource Requirement curve, PJM's downward-sloping administrative demand curve for capacity.
- **Reliability requirement:** planning quantity associated with satisfying the reliability criterion under specified assumptions.
- **CONE:** Cost of New Entry, an estimate of annualized fixed cost for a reference new resource.
- **Net CONE:** gross CONE minus projected net energy and ancillary-service revenue.
- **ICAP:** Installed Capacity, rated capability under applicable rules before translation to the unforced capacity quantity.
- **UCAP:** Unforced Capacity, accredited capacity quantity used in PJM's resource-adequacy and capacity-market framework.
- **LDA:** Locational Deliverability Area, an area for which transmission deliverability and local capacity needs can affect clearing.
- **Missing money:** concern that expected energy and ancillary-service revenues may not recover the fixed costs of resources needed for reliability.
- **Performance obligation:** requirement attached to a capacity commitment to be available and respond under defined conditions.

## What comes next

The [Unit 5 interactive lab](../apps/unit-05-capacity-market/index.html) looks different from the earlier hourly simulators. It is an auction-geometry tool: edit capacity supply blocks, move a VRR-style demand curve, watch the clearing point change, and translate the result into supplier revenue and customer cost. See the repository README for local launch instructions.

Later units will supply the inputs the auction currently treats as given. Unit 6 introduces probabilistic reliability simulation. Unit 7 explains why different resources receive different capacity accreditation. Unit 8 will connect those physical results to PJM's reserve requirement and auction parameters in more detail.

## Optional references

- [FERC: Understanding Wholesale Capacity Markets](https://www.ferc.gov/understanding-wholesale-capacity-markets)
- [FERC: Wholesale Electricity Markets Overview](https://www.ferc.gov/wholesale-electricity-markets-overview-and-guide)
- [PJM Learning Center: Capacity Market](https://learn.pjm.com/three-priorities/buying-and-selling-energy/capacity-markets.aspx)
- [PJM Reliability Pricing Model](https://www.pjm.com/markets-and-operations/rpm)
- [PJM manuals](https://www.pjm.com/library/manuals.aspx), especially Manual 18 for the capacity market and Manual 20 for resource-adequacy analysis

When we analyze a particular auction, we will also use that delivery year's official planning parameters, auction results, and governing tariff because those details change.
