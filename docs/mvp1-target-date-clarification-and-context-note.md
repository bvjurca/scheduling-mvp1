# MVP1 Target Date Clarification and Context Note

Date: 2026-07-06

## Recommended wording

Use **Requested Start Date** or **requested start / commercial timing anchor** in the MVP1 prototype instead of the generic phrase **target date**.

## What it means in MVP1

For MVP1, the date used by the four-month gate should mean:

- the date or month the customer is asking Commercial to evaluate;
- the commercial timing anchor captured during the SFDC Opportunity/RFP/Study workflow;
- the input used to decide whether MVP1 can produce a site/month recommendation.

It is **not**:

- a calculated LabSci lead-time date;
- a test material availability date;
- room availability;
- animal availability;
- the final RPM execution date after award;
- a SAP billing milestone.

## Why this matters

Marjorie’s transcript distinguishes system roles:

- **SFDC** captures the customer request, initial study design, pricing/costing, quote/SOW context, and commercial commitment language.
- **RPM** is the post-award system of record for study execution dates.
- **SAP** consumes downstream financial/billing context.
- **RACE / DSA dashboards** expose useful reference data such as General Timing, Just Say Yes, LabSci Lead Times, TCR Lead Times, and site capabilities.

So MVP1 should avoid implying that Commercial is calculating or locking a final operational study date. The MVP1 promise is narrower: a time-bound, rules-supported **Site / Month-of-Timing** recommendation.

## UI implication

In the prototype, the eligibility gate should read:

1. Requested timing anchor known.
2. Requested start is more than four months out.
3. Required SFDC/RFP/Study configuration is present.
4. Configuration is transformed and standardized.

If the customer does not know timing, the UI should show a visibly labeled **business placeholder** rather than silently treating it as a real requested date.

## Open stakeholder decision

Confirm the official SFDC field mapping:

- Is the MVP1 date field **Requested Start Date** from the RFP tab?
- Is it **Opportunity Start Date** from the earlier handoff language?
- Is it **Study Start Date** or **Anticipated Start Date** from the Study object in any scenarios?
- Should the prototype support more than one date source, with a visible date-source label?

Until confirmed, the prototype should show both the user-facing label and the source:

> Requested Start Date  
> Source: SFDC RFP / commercial request
