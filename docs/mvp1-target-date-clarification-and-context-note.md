# MVP1 Date Clarification and Context Note

Date: 2026-07-07

## Recommended wording

Use **Opportunity Start Date** as the official MVP1 gate date, per the Blueprint.

Use **RFP Requested Start Date** or **requested timing context** only when describing the upstream customer/RFP signal that may populate, justify, or conflict with the Opportunity Start Date.

Avoid the generic phrase **target date** in the UI unless it is accompanied by a source label.

## What It Means In MVP1

For MVP1, the date used by the four-month gate should mean:

- the SFDC Opportunity Start Date required by the Blueprint flow;
- the commercial timing anchor used to decide whether the inquiry is more than four months out;
- the input used to decide whether MVP1 can produce a site/month recommendation.

Related dates should remain visible as context, but should not silently replace the gate:

- RFP Requested Start Date;
- customer-provided requested timing;
- Management Triage Release;
- test material available date;
- LabSci method or bioanalysis timing.

It is **not**:

- Study Start Date;
- a calculated LabSci lead-time date;
- a test material availability date;
- room availability;
- animal availability;
- the final RPM execution date after award;
- a SAP billing milestone.

## Why This Matters

The Blueprint defines MVP1 as a Commercial Persona flow for "Just Say Yes" / "In The Know." It starts with SFDC intake, requires Opportunity Start Date, checks whether that date is more than four months out, asks for missing configuration data, calculates site/month options, and then returns either a green light or an off-ramp.

The latest VoC and screenshots add nuance without changing the scope:

- SFDC captures customer request, RFP, opportunity, study configuration, quote/SOW, and commercial commitment context.
- RACE, PowerBI, DOT, and scheduling reference data provide useful current-state signals.
- RPM remains the post-award system of record for execution scheduling.
- A PowerBI/RACE timing answer is a snapshot, not a capacity reservation.

So MVP1 should avoid implying that Commercial is calculating or locking a final operational study date. The MVP1 promise is narrower: a time-bound, rules-supported **Site / Month-of-Timing** recommendation with caveats and expiry.

## UI Implication

In the prototype, the eligibility gate should read:

1. Opportunity Start Date known.
2. Opportunity Start Date is more than four months out.
3. Required SFDC/RFP/Study configuration is present.
4. Date meaning and timing precision are clear enough for Commercial guidance.
5. Recommendation is valid only until expiry and is not reserved capacity.

If the customer does not know timing, the UI should show a visibly labeled **business placeholder** rather than silently treating it as a real date.

If RFP Requested Start Date differs from Opportunity Start Date, the UI should show a reconciliation warning before the decision console returns a stronger recommendation.

## Stakeholder Decision Still Needed

Confirm the data mapping and governance rules:

- Which field writes or updates Opportunity Start Date?
- Should RFP Requested Start Date be allowed to populate Opportunity Start Date automatically?
- What label should Commercial see when date meaning is unclear?
- What status should represent month guidance versus confirmed operational timing?

Until then, the prototype should show both the gate and the source:

> Opportunity Start Date  
> Source: SFDC Opportunity, with RFP Requested Start Date shown as context
