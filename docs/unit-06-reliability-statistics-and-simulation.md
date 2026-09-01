# Unit 6: Reliability Statistics and Simulation

## Before we begin

Unit 4 showed that a deterministic reserve margin can conceal important risks. Unit 5 showed how a future reliability need can become a capacity-market demand curve. We now need to understand how planners actually measure that underlying risk.

The central question is:

> Across many plausible combinations of load, weather, outages, and resource performance, how often would available supply fall short—and how severe would those shortfalls be?

By the end of this lesson, you should be able to:

- treat generator availability as a random variable rather than a fixed haircut;
- calculate a simple Loss of Load Probability and expected unserved energy;
- distinguish LOLP, LOLH, LOLE, and EUE;
- explain what the traditional “one day in ten years” criterion does and does not mean;
- explain why independent-outage assumptions can understate common-mode risk;
- distinguish chronological simulation from a load-duration-curve approach;
- describe the steps in a Monte Carlo resource-adequacy model;
- explain convergence, sampling error, and the purpose of a random seed;
- distinguish a stress test from a probabilistic result; and
- explain why data-center forecasts can change reliability risk nonlinearly.

This lesson introduces the concepts and arithmetic. The Unit 6 lab will let us run the repeated trials ourselves.

---

## 1. Deterministic margins discard the distribution

Suppose a system expects:

- 100 MW of load; and
- 108 MW of available generation on average.

The average comparison looks adequate:

```text
Expected available supply − load
= 108 MW − 100 MW
= 8 MW
```

But “108 MW on average” could describe very different systems.

One system might provide almost exactly 108 MW in every hour. Another might provide 120 MW most of the time and only 60 MW when a large unit fails. Their average availability can be identical while their shortage probabilities and consequences differ.

Resource adequacy therefore needs the **distribution** of possible outcomes, not only the mean.

For each modeled hour, imagine two uncertain quantities:

```text
L = load
A = available supply
```

A resource shortfall occurs when:

```text
A < L
```

The amount of shortage is:

```text
Unserved load = max(0, L − A)
```

The model repeatedly asks whether that condition occurs across hours and simulated futures.

---

## 2. Forced outages as random events

A **forced outage** is an unplanned loss of some or all of a resource's capability. A forced-outage rate summarizes historical or modeled unavailability, but it does not tell us exactly which future hour the resource will fail.

Consider two 60 MW generators. Each has:

- a 90% probability of being available in the hour; and
- a 10% probability of being on forced outage.

For the moment, assume their outages are independent. There are four combinations:

- Both available: probability `0.9 × 0.9 = 81%`; available supply is 120 MW.
- Generator A available and B out: probability `0.9 × 0.1 = 9%`; available supply is 60 MW.
- Generator A out and B available: probability `0.1 × 0.9 = 9%`; available supply is 60 MW.
- Both out: probability `0.1 × 0.1 = 1%`; available supply is 0 MW.

The probabilities sum to 100%.

At 100 MW of load, only the first state serves all demand:

- 81% probability of no shortage;
- 18% probability of a 40 MW shortage; and
- 1% probability of a 100 MW shortage.

Expected available supply is still:

```text
120 MW × 81%
+ 60 MW × 18%
+ 0 MW × 1%
= 108 MW
```

Yet the probability of some shortage is 19%. Comparing average supply with load missed the shape of the distribution.

This toy calculation is a **capacity outage probability** model. Real studies represent many units, partial derates, maintenance, weather-dependent performance, variable generation, storage, demand uncertainty, imports, and transmission.

---

## 3. Loss of Load Probability

**Loss of Load Probability**, or **LOLP**, is the probability that available resources cannot serve modeled load during a specified interval.

For hour `h`:

```text
LOLPₕ = Probability(available supplyₕ < loadₕ)
```

In the two-generator example at 100 MW of load:

```text
LOLP = 18% + 1% = 19%
```

LOLP is dimensionless. It can be written as a probability between zero and one or as a percentage.

### The interval must be stated

“LOLP is 2%” is incomplete unless we know the interval and conditions. It could mean:

- a 2% probability during one particular hour;
- a 2% probability that some shortage occurs during a day;
- an average across a set of simulated hours; or
- another definition established by the study.

Always ask: **probability of what, during what period, under which assumptions?**

### Loss of load is a modeled condition

The phrase does not necessarily mean customers will observe a blackout exactly as simulated. A model may count a loss-of-load condition after applying specified resources, transfers, demand response, and emergency procedures. The scope differs across studies.

It also does not model every way electricity service can fail. A tree falling on a distribution feeder can interrupt customers even when the bulk system has abundant generation. Resource-adequacy LOLP concerns a modeled insufficiency of supply or deliverability, not all outage causes.

---

## 4. Expected Unserved Energy

LOLP counts whether a shortage occurs. It does not measure its depth.

**Expected Unserved Energy**, or **EUE**, measures the probability-weighted amount of energy demand that the modeled system cannot serve.

For a one-hour interval:

```text
Expected unserved energy
= Σ(probability of state × shortage MW × 1 hour)
```

For the two-generator example:

```text
EUE
= 81% × 0 MW × 1 h
+ 18% × 40 MW × 1 h
+ 1% × 100 MW × 1 h
= 8.2 MWh
```

This does not predict that exactly 8.2 MWh will go unserved. In any one realization, the shortfall is 0, 40, or 100 MWh. EUE is the long-run probability-weighted average across the modeled outcomes.

For many hours and simulations:

```text
EUE = expected value of Σ max(0, loadₕ − available supplyₕ) × interval duration
```

EUE is commonly reported in MWh or GWh per year. It can also be normalized relative to total demand so systems of different sizes can be compared.

### Same frequency, different severity

Imagine two systems that each experience a modeled shortage in 1% of trials:

- System A loses 10 MW for one hour when it fails.
- System B loses 2,000 MW for ten hours when it fails.

Their event probability may look identical, but their EUE is radically different. Frequency and magnitude answer different questions.

---

## 5. LOLH, LOLE, and the importance of counting rules

Several metrics summarize shortages over longer periods.

### Loss of Load Hours

**Loss of Load Hours**, or **LOLH**, is the expected number of hours with a loss-of-load condition during the study period.

If each hour has a modeled LOLP, a simple expected-hour calculation is:

```text
Annual LOLH = sum of hourly LOLPs across the year
```

If ten hours each have a 2% LOLP and every other hour has zero risk:

```text
LOLH = 10 × 0.02 = 0.2 hours/year
```

This is an expectation over many possible years, not a claim that one-fifth of an hour must fail every calendar year.

### Loss of Load Expectation

**Loss of Load Expectation**, or **LOLE**, is an expected frequency measure. It is often reported as loss-of-load days per year, although terminology and counting conventions must be checked in the study.

For a daily LOLE calculation, a day typically counts once if at least one qualifying loss-of-load condition occurs during that day. A five-hour event on one day can therefore contribute:

- five loss-of-load hours to LOLH; but
- one loss-of-load day to daily LOLE.

You cannot generally obtain daily LOLE by dividing LOLH by 24. Shortage hours cluster within events and days.

### Loss-of-load events

Some studies also report event counts or durations. Two consecutive shortage hours may count as one event, while the same two hours separated by recovery may count as two. Again, the counting definition matters.

### Keep the questions separate

```text
LOLP: What is the probability of shortage in this interval?

LOLH: How many shortage hours are expected?

LOLE: On how many days or occasions is shortage expected under the stated convention?

EUE: How much energy is expected to go unserved?
```

No single metric describes the full risk distribution.

---

## 6. What “one day in ten years” means

North American resource planning has traditionally used a criterion described as **one day in ten years**. In an annual daily-LOLE formulation, this corresponds to:

```text
0.1 expected loss-of-load days per year
```

It is easy to misinterpret.

### It is an expectation, not a schedule

The criterion does not predict one shortage day in 2030 and then none until 2040. Random outcomes can cluster. Several difficult years can occur close together, followed by a long quiet period.

### It is not “one blackout every ten years”

The model's loss-of-load condition depends on its definitions and assumptions. It does not include every transmission, distribution, protection, cyber, or weather-related cause of customer interruption.

### It does not state magnitude

LOLE counts occurrence under a convention. A shallow one-hour shortage and a deep, prolonged event may each contribute one day. EUE and duration metrics are needed to describe severity.

### It is not a universal law of nature

It is a planning criterion embedded in institutions and methods. Models, counting conventions, emergency assumptions, and acceptable-risk decisions differ. Modern resource-adequacy work increasingly examines multiple metrics because a changing resource mix can create energy and tail risks that LOLE alone does not reveal.

The right interpretation is:

> Under this model and its counting rules, the portfolio is adjusted until expected loss-of-load frequency meets the chosen criterion.

---

## 7. From a reliability criterion to a reserve requirement

Suppose a planner has a forecast resource portfolio and hourly load model. The planner can scale load upward or downward and repeatedly calculate LOLE.

```text
Lower modeled load
        ↓
More surplus capability
        ↓
Lower LOLE

Higher modeled load
        ↓
Less surplus capability
        ↓
Higher LOLE
```

The model searches for the load level that reaches the target, such as 0.1 days/year. The difference between that solved load and the original forecast helps establish the capacity or reserve requirement.

Conceptually:

```text
1. Hold the modeled resource portfolio and assumptions.
2. Guess a load level.
3. Simulate reliability.
4. Compare LOLE with the target.
5. Adjust load and repeat until the target is reached.
6. Translate the solved relationship into planning parameters.
```

This is why the Reserve Requirement Study is not simply “peak forecast plus a fixed percentage.” The required margin emerges from the modeled distribution of load and resource availability.

If forced-outage risk increases, more reserve may be required. If the fleet becomes more dependable, less reserve may achieve the same LOLE. If weather correlation or energy limitations are modeled more fully, the relationship may change again.

---

## 8. Independence is a strong assumption

The two-generator calculation multiplied outage probabilities because we assumed independence. That means one generator's failure does not change the other's probability of failure.

Real failures can share causes:

- extreme heat can derate several thermal units;
- extreme cold can freeze equipment and interrupt natural-gas supply;
- low river levels or high water temperatures can affect multiple plants;
- a common pipeline constraint can limit several generators;
- smoke, storms, or icing can affect renewable output across a region;
- a transmission outage can make several remote resources undeliverable; and
- software, design, or maintenance problems can affect similar equipment.

These are **correlated** or **common-mode** risks.

Consider the same two 60 MW generators serving 60 MW of load.

If their 10% outage probabilities are independent, load is lost only when both are out:

```text
LOLP = 10% × 10% = 1%
```

If a shared fuel failure instead makes both generators unavailable together 10% of the time:

```text
LOLP = 10%
```

The individual units can each appear 90% available in both descriptions. The dependence between their outages changes system risk by a factor of ten.

Diversification is valuable only when the supposedly diverse resources do not fail together under the conditions that matter.

---

## 9. Weather links the demand and supply sides

Weather is not merely one input among many. It can connect several inputs in the same direction.

During an extreme cold period:

```text
Electric heating load rises
          +
Thermal equipment may derate or fail
          +
Gas supply can become constrained
          +
Neighboring regions may also need imports
          +
Wind, solar, and hydro follow the same weather system
```

If a model samples high load independently from generator failures, fuel limitations, renewable profiles, and imports, it may assemble combinations that are statistically convenient but physically implausible. It may also fail to assemble the dangerous combinations that actually share a weather cause.

A weather-aware model tries to preserve relevant relationships. For example, the same historical or synthetic weather trace can drive:

- hourly load;
- wind output;
- solar output;
- temperature-dependent thermal derates;
- hydro conditions; and
- outage or fuel-risk adjustments.

This does not eliminate uncertainty. It organizes uncertainty around coherent possible worlds.

---

## 10. Chronology changes the answer

A **load-duration curve** sorts the year's hourly loads from highest to lowest. It is useful for seeing how often demand exceeds a level, but it discards the original order of hours.

That loss of chronology matters for resources with memory or time constraints.

### Storage

A battery's ability to serve hour 8 depends on whether it discharged in hours 4–7 and whether it had an opportunity to recharge.

### Demand response

A program may have limits on event duration, notification, number of calls, recovery periods, or total annual activations.

### Thermal units

Startup time, minimum run time, ramping, repairs, and outage duration link one hour to the next.

### Weather events

Three consecutive low-wind days are different from 72 low-wind hours scattered across a year.

### Fuel and hydro inventories

Stored fuel, reservoirs, and gas availability can become constrained across a prolonged event.

A **chronological simulation** preserves the sequence:

```text
Hour 1 → Hour 2 → Hour 3 → ... → Hour 8,760
```

The model carries state—such as battery charge or outage repair status—from one interval to the next. This is computationally heavier but often essential for an energy-limited and weather-dependent fleet.

---

## 11. Monte Carlo simulation

For a small fleet, we can enumerate every outage combination. For hundreds or thousands of uncertain components across thousands of hours, exact enumeration becomes impractical.

**Monte Carlo simulation** estimates the distribution by repeatedly drawing random but rule-consistent outcomes.

A simplified annual trial might:

1. Select or generate a weather year.
2. Produce an hourly load trace from that weather and the demand forecast.
3. Produce wind, solar, hydro, and temperature-derate traces consistent with it.
4. Sample thermal forced outages and repair durations.
5. Apply planned maintenance.
6. Model imports and transmission limits.
7. Dispatch storage and demand response chronologically under stated rules.
8. Record every hour in which available capability is below load.
9. Record the unserved MW and MWh.

The model repeats the trial many times:

```text
Trial 1: no shortage
Trial 2: no shortage
Trial 3: two-hour, 400 MWh shortage
...
Trial 50,000: no shortage
```

It then averages the recorded outcomes to estimate LOLP, LOLH, LOLE, EUE, and other statistics.

The power of Monte Carlo is not that randomness creates truth. Its value is that repeated sampling propagates explicitly defined uncertainties through a system too complicated to solve by hand.

---

## 12. A tiny Monte Carlo example

Return to the two 60 MW generators and 100 MW load. Instead of calculating all four states analytically, imagine drawing a random number from 0 to 1 for each generator.

For each generator:

```text
Random draw < 0.10 → forced outage
Random draw ≥ 0.10 → available
```

One simulated sequence might be:

- Trial 1: both available; 0 MWh unserved.
- Trial 2: A available, B out; 40 MWh unserved.
- Trial 3: both available; 0 MWh unserved.
- Trial 4: both available; 0 MWh unserved.
- Trial 5: both out; 100 MWh unserved.

After only five trials, the estimated LOLP is 40% and EUE is 28 MWh. Both are far from the analytical values of 19% and 8.2 MWh because the sample is tiny and happened to include the rare both-out state.

After many thousands of independent trials, the estimates should move toward the analytical values. This is **convergence**.

---

## 13. Convergence and sampling error

Every finite Monte Carlo result contains sampling error. Running the same model with a different random sequence can produce a slightly different estimate.

### More trials reduce noise

As the number of independent trials grows, estimated averages generally stabilize. The standard error of many Monte Carlo estimates shrinks roughly with the square root of the number of trials:

```text
To reduce sampling error by about half,
you often need roughly four times as many trials.
```

Rare events can require very large samples. If the event of interest occurs once in 10,000 simulated years, a run of 1,000 years may never see it.

### A random seed makes a run reproducible

Pseudo-random number generators begin from a **seed**. Using the same model, inputs, algorithm, and seed should reproduce the same draws. This helps debugging and comparison.

But repeating one seed is not proof of convergence. Good practice can include:

- running more trials;
- comparing multiple seeds;
- reporting confidence intervals or sampling uncertainty;
- tracking metrics as the simulation grows; and
- verifying the simulation against cases with known analytical answers.

### Precision is not accuracy

A million simulations can produce a very stable wrong answer if the outage rates, load shapes, correlations, or operating rules are wrong.

```text
Sampling uncertainty: Did we run enough trials?

Model uncertainty: Did we represent the system appropriately?

Input uncertainty: Are the forecasts and parameters credible?
```

Monte Carlo directly addresses the first. It does not automatically solve the other two.

---

## 14. Stress tests and probabilistic models answer different questions

A **stress test** selects an adverse condition and asks what happens:

> If load is 10% above forecast while 25 GW of thermal supply is unavailable for eight hours, does the portfolio serve demand?

A **probabilistic model** assigns or derives probabilities and asks how risk accumulates across many possible conditions:

> Given these distributions and dependencies, what are expected shortage frequency and severity?

Stress tests are useful when:

- an event is important but hard to assign a probability;
- a planner wants to understand failure mechanisms;
- stakeholders need a transparent scenario; or
- tail behavior deserves examination beyond an average metric.

Probabilistic simulation is useful when:

- alternatives must be compared on a common risk basis;
- a reliability target must be solved;
- interacting uncertainties need to be aggregated; or
- expected frequency and severity matter.

Neither replaces the other. A portfolio can meet an annual LOLE target and still perform badly in a specific plausible stress. A stress test can expose vulnerability but cannot, by itself, say how often the condition should be expected.

---

## 15. Modeling choices that deserve questions

When reading a reliability study, ask how it treats each major category.

### Load

- How many weather years are used?
- Is economic and forecast uncertainty included?
- Are large loads modeled by location, ramp date, and hourly shape?
- Are electrification and behind-the-meter resources represented consistently?

### Thermal resources

- Are outages sampled independently or conditioned on weather?
- Are partial derates represented?
- How are repair durations, planned maintenance, and fuel limitations modeled?
- Does new entry exist by the assumed date?

### Wind and solar

- Are profiles synchronized with the weather driving load?
- Is geographic correlation preserved?
- Are curtailment and transmission constraints modeled?

### Storage

- Is state of charge chronological?
- What dispatch rule is used?
- Are efficiency, duration, charging supply, and degradation represented?
- Does the model give storage perfect knowledge of future conditions?

### Demand response and flexible load

- What triggers dispatch?
- Are duration, call limits, rebound, and nonperformance included?
- Is the same load reduction also embedded in the load forecast, creating double counting?

### Imports and transmission

- Are neighbors stressed by the same weather?
- Are transfer limits and transmission outages represented?
- Is supply contractually firm and physically deliverable?

### Outputs

- What exactly counts as a loss-of-load hour, day, or event?
- Are both frequency and severity reported?
- Is sampling uncertainty shown?
- Which scenarios dominate the result?

These questions are not objections to modeling. They are how we understand what the result means.

---

## 16. The data-center connection

Data centers interact with probabilistic adequacy in more ways than simply adding their nameplate demand to peak load.

### Completion and timing are uncertain

Announced projects may be delayed, duplicated, resized, or cancelled. Others may emerge outside the visible pipeline. A model can represent this with scenarios or probability distributions rather than one all-or-nothing forecast.

### Flat load affects more than the annual peak

A nearly constant 1 GW addition raises demand during summer afternoons, winter mornings, overnight low-wind periods, and multi-day energy events. It can move risk into hours that previously had comfortable margins.

### Concentration creates common-mode exposure

Several campuses in one area can depend on the same substations, transmission paths, gas infrastructure, or generation additions. Treating each as geographically independent may hide local tail risk.

### Flexibility changes the distribution

A data center that can reduce load reliably during a few critical hours can lower LOLH and EUE. The value depends on:

- how much load can move or curtail;
- how quickly it responds;
- event duration;
- rebound or deferred computing work;
- notification requirements; and
- whether the response remains available during prolonged events.

### Risk can change nonlinearly

Adding the first GW of load may consume comfortable surplus without causing many shortages. Another GW can push hundreds of previously close simulations across the shortage boundary.

```text
If available supply is 101 GW and load rises from 99 to 100 GW:
no shortage.

If load then rises from 100 to 102 GW:
a shortage appears.
```

Across a probability distribution, many small threshold crossings can cause LOLE or EUE to rise faster than the load forecast itself.

That nonlinearity is a major source of economic value in a detailed PJM model. A simple “GW announced” total cannot show where the reliability curve becomes steep.

---

## 17. Why multiple metrics matter economically

Imagine two portfolios that both meet the same daily LOLE criterion.

- Portfolio A has more frequent but shallow one-hour shortages.
- Portfolio B has rarer but deep multi-day energy shortages.

If we look only at LOLE, they may appear equivalent. They may not be economically or operationally equivalent.

EUE can affect estimates of customer interruption cost. Event duration can determine whether backup generation or batteries survive. Tail depth can determine how much emergency import capability or load flexibility is valuable. Location can determine whether a region-wide average hides a local problem.

For investors and large power users, the relevant questions include:

- Which assumptions move the system across its reliability target?
- Is risk concentrated in summer peaks, winter fuel events, or long low-renewable periods?
- Which resource addition reduces EUE most effectively?
- Does flexible demand avoid a capacity need or only shift it?
- How sensitive is the answer to large-load completion dates?
- Is a projected capacity price responding to frequent shallow scarcity or rare deep scarcity?

Reliability statistics become economically useful when they reveal the mechanism behind the headline reserve requirement.

---

## 18. Common misconceptions

### “A 5% forced-outage rate means the plant will be out for exactly 438 hours”

It is a probabilistic or historical rate, not a calendar schedule. Outages can cluster, have different durations, and depend on conditions.

### “Expected available capacity can be compared directly with load”

The expected value discards the distribution. Shortage risk depends on the probability of low-availability states.

### “LOLP tells us how large a shortage will be”

LOLP measures probability of occurrence. EUE or another severity statistic is needed for magnitude.

### “LOLE of 0.1 means a ten-percent chance of blackout this year”

Not necessarily. LOLE is an expected frequency under a stated counting convention. It is not automatically an annual probability, and a modeled loss-of-load condition is not synonymous with every type of customer blackout.

### “One day in ten years means one event precisely every decade”

Random events do not follow a schedule. The value is a long-run expectation under model assumptions.

### “If every generator's outage draw is random, the model captures uncertainty”

Independent random draws can miss weather-driven, fuel-driven, or infrastructure-driven correlation.

### “A load-duration curve is enough for storage”

Sorting hours destroys the sequence that determines charging, depletion, and recovery.

### “More Monte Carlo trials make the model correct”

More trials reduce sampling noise. They do not repair biased data, missing correlations, or unrealistic operating logic.

### “Passing LOLE proves the system is safe under every stress”

An expected annual metric can coexist with vulnerabilities to particular severe scenarios. Stress testing remains useful.

---

## 19. Readiness check

Try these without opening the answer key.

### Question 1

Two independent 60 MW generators are each available with 90% probability. What are the probabilities that both, exactly one, and neither are available?

### Question 2

Using those generators at 100 MW load, calculate the hourly LOLP.

### Question 3

For the same hour, calculate EUE if exactly one generator creates a 40 MW shortage and neither available creates a 100 MW shortage.

### Question 4

Two systems each have a 1% shortage probability. One loses 10 MWh when short; the other loses 10,000 MWh. Which metric distinguishes them?

### Question 5

Ten modeled hours each have a 2% LOLP and all other hours have zero. What is the simple expected LOLH?

### Question 6

A five-hour shortage occurs within one calendar day. Under a convention that counts any affected day once, how much does it contribute to LOLH and daily LOLE?

### Question 7

Explain two things the “one day in ten years” criterion does not mean.

### Question 8

Two 60 MW generators each have 90% availability and serve 60 MW of load. What is LOLP if their outages are independent? What is LOLP if both always fail together 10% of the time?

### Question 9

Why can sorting all hours from highest to lowest load produce a misleading storage result?

### Question 10

Put these Monte Carlo steps in order: record shortages, sample outages, calculate metrics across trials, construct hourly load and renewable profiles, dispatch chronological resources, select a weather realization.

<details>
<summary>Answer key</summary>

1. Both available: `0.9 × 0.9 = 81%`. Exactly one available: `2 × 0.9 × 0.1 = 18%`. Neither available: `0.1 × 0.1 = 1%`.
2. Load is served only when both are available. `LOLP = 18% + 1% = 19%`.
3. `EUE = 0.18 × 40 MW × 1 h + 0.01 × 100 MW × 1 h = 8.2 MWh`.
4. EUE distinguishes the probability-weighted magnitude of unserved energy. Duration and tail-risk metrics may add further information.
5. `10 × 0.02 = 0.2 expected loss-of-load hours`.
6. It contributes five hours to LOLH and one day to daily LOLE under that convention.
7. Possible answers: it is not one scheduled event every decade; it is not a guarantee of no other outages; it does not describe shortage magnitude; it is not automatically a 10% annual blackout probability; and it does not include every cause of customer interruption.
8. With independent outages, both are out with probability `0.1 × 0.1 = 1%`. If both fail together 10% of the time, LOLP is 10%.
9. Sorting removes the sequence that determines whether storage charged before a risky hour, how much energy it already discharged, and whether it can recover between events.
10. Select a weather realization → construct hourly load and renewable profiles → sample outages → dispatch chronological resources → record shortages → calculate metrics across trials. Some implementations sample or construct inputs in a different internal order, but they must preserve the intended dependencies.

</details>

---

## 20. Vocabulary to retain

- **Random variable:** quantity whose realized value depends on an uncertain outcome.
- **Probability distribution:** possible outcomes and their probabilities.
- **Forced outage:** unplanned loss of all or part of a resource's capability.
- **Forced-outage rate:** historical or modeled measure of forced unavailability under a defined convention.
- **Capacity outage probability:** probability distribution over available capacity states produced by resource outages.
- **LOLP:** Loss of Load Probability, probability of a qualifying shortfall during a specified interval.
- **LOLH:** Loss of Load Hours, expected number of hours with a qualifying shortfall.
- **LOLE:** Loss of Load Expectation, expected frequency of loss-of-load days or occurrences under a specified counting convention.
- **EUE:** Expected Unserved Energy, probability-weighted quantity of demand not served.
- **Common-mode failure:** shared cause that makes multiple components fail together.
- **Correlation:** statistical dependence between outcomes; one variable's state contains information about another's.
- **Load-duration curve:** hourly loads sorted from highest to lowest, with chronology removed.
- **Chronological simulation:** model that preserves time order and carries system state between intervals.
- **Monte Carlo simulation:** repeated random sampling used to estimate a distribution of model outcomes.
- **Trial or replication:** one simulated realization of the modeled period.
- **Random seed:** starting value that makes a pseudo-random sequence reproducible.
- **Convergence:** stabilization of an estimate as the number of trials grows.
- **Sampling error:** difference between a finite-sample estimate and the model's underlying expected value.
- **Stress test:** analysis of a selected adverse scenario without necessarily assigning its probability.
- **Tail risk:** low-probability but potentially high-consequence part of a distribution.

## What comes next

The [Unit 6 interactive lab](../apps/unit-06-reliability-simulation/index.html) begins with the two-generator experiment from this lesson. Run individual outage trials, watch the sample estimate converge toward the analytical answer, and then move into a small chronological system where load, weather, outages, and storage produce LOLH, LOLE, and EUE. See the repository README for local launch instructions.

Unit 7 will use the same reliability machinery to ask a new question: how much additional load can the system serve at the same reliability level after a resource is added? That is the intuition behind Effective Load Carrying Capability.

## Optional references

- [PJM Resource Adequacy Planning](https://www.pjm.com/en/planning/resource-adequacy-planning)
- [PJM manuals](https://www.pjm.com/library/manuals.aspx), especially Manual 20A for current resource-adequacy analysis practices
- [PJM Effective Load Carrying Capability data](https://www.pjm.com/planning/resource-adequacy-planning/effective-load-carrying-capability)
- [NERC Probabilistic Adequacy and Measures report](https://www.nerc.com/comm/RSTC/PAWG/Probabilistic_Adequacy_and_Measures_Report.pdf)
- [NERC Probabilistic Assessment Technical Guideline](https://www.nerc.com/globalassets/who-we-are/standing-committees/rstc/pawg/proba_technical_guideline_document_08082014.pdf)

When we recreate any specific PJM result, we will use the exact manual revision, study assumptions, input files, metric definitions, and delivery-year conventions applicable to that result.
