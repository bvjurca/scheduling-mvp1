# MVP1 Blueprint Reassessment Rationale

Date: 2026-07-28

Sources reviewed:

- `Blueprint Scheduling_2026-07-28_12-09-19.pdf`
- `study reference.png`
- `Wireframe.png`

## Current MVP1 Decision

MVP1 is now intentionally narrower than the prior split-view prototype.

The MVP1 surface should start from two SFDC Study fields:

- Study Start Date
- CRL Site

Study Start Date is still the governing timing field for the simplified MVP1 rule. CRL Site is captured because Commercial usually starts with a preferred site. The right-side output then displays eligible site/month options from the separate site lead-time and ranking logic. This prototype does not need to reproduce that ranking logic in detail. It only needs to show where the result lands in SFDC and how Commercial sees the output.

## Why This Change Is Correct

The stakeholder clarification shifts MVP1 away from a wizard or broad readiness console. The actual MVP1 impact is concentrated on the existing SFDC Study record, specifically the date field that determines whether site/month recommendations can be shown and the CRL Site field that captures preferred-site context.

The earlier MVP1 version still carried too much of the long-term Commercial Vision:

- configuration completeness
- route/species/study type checks
- LabSci dependency language
- Reporting/SEND dependency language
- recommendation confidence
- rule-trace detail
- customer response loop

Those may be valid future concepts, but they are not required for the simplified MVP1 screen.

## What The UI Now Shows

The MVP1 path now presents:

1. A generic SFDC Study page frame, modeled after the supplied Study reference.
2. A visually muted SFDC record backdrop with only enough skeleton structure to imply the native page.
3. A highlighted Study Start Date field.
4. A highlighted CRL Site dropdown beside the date field, prefilled from the SFDC Study record.
5. A right-side native SFDC-style box titled `Eligible sites`.
6. An initial empty state until the user checks the current Study Start Date and CRL Site.
7. A compact, read-only `Eligible sites` list with the first five ranked site/month rows after the first check.
8. A synthetic approximately 20-site eligible set behind the module.
9. Eligible rows sorted chronologically by lead-time month, then by most recent lead-time update when months tie.
10. A `View all` action that opens a Salesforce-style list detail view with 20 ranked rows.
11. A `Preferred` marker for the CRL Site selected in the Study field.
12. A last-updated marker on every visible eligible site, using a time icon and recency color.
13. A confidence disclaimer explaining that the output is a proposal window, not a capacity hold.
14. A `Check site recommendations` action before the list is loaded, then a `Recheck` action that refreshes the snapshot timestamp.
15. A simplified alphabetically sorted `CRL Site` dropdown.
16. `Valid as of DD-MMM-YYYY HH:MM`, rather than `Valid until`, shown only after an eligible list is loaded.
17. Missing-information handling when Study Start Date is blank.
18. Immediate Central Scheduling off-ramp handling when Study Start Date is inside the four-month threshold.

## What The Eligible Site List Means

The eligible site list is still not a booking confirmation.

It means:

- based on the Study Start Date,
- using the selected CRL Site as preferred-site context,
- and based on separately governed site lead-time/ranking logic,
- Commercial can see candidate site/month options.
- Commercial can compare the preferred site against other eligible site/month options.
- Commercial can see whether the selected CRL Site appears in the ranked eligible set.
- Commercial can see how recently each lead-time signal was updated.

It does not mean:

- capacity has been reserved,
- a room or operational slot exists,
- RPM has accepted the date,
- Central Scheduling has been bypassed,
- all downstream dependencies are resolved.
- any option has been routed, reserved, or committed.

The list is FYI only. It has no radio control, selected state, hover affordance, or routing behavior. The side module previews the first five rows. `View all` opens a Salesforce-style detail list with 20 ranked rows.

Ranking rule shown in this prototype:

- sort first by lead-time month,
- if lead-time month ties, sort by the most recently updated lead-time signal,
- if both tie, sort alphabetically by site.

The color-coded last-updated marker is a trust signal, not another recommendation rule:

- green: updated within 2 weeks,
- orange: updated within 2-4 weeks,
- red: updated more than 4 weeks ago.

The selected CRL Site appears as `Preferred` in both the five-row module and the 20-row detail list when it is present in the eligible set. `Preferred` means user-entered preference, not a committed or reserved site.

## Peace Of Mind Disclaimer

The Eligible sites module includes the following text between the fifth row and `View all`:

> Eligible sites match current Commercial snapshot as a proposal window. No capacity hold implied.
>
> Data used: SFDC Opportunity/RFP fields, Lead-time snapshot, Site capability reference.
>
> Recheck if: SOW delay, Scope/configuration change, Site preference change, Client response after expiry

Reason: this is the shortest stakeholder-safe explanation of confidence, source data, and recheck conditions without reintroducing the broader decision-contract UI.

## Missing Data Case

If Study Start Date is missing, MVP1 should not calculate or imply a recommendation.

Reason: the single required input for this simplified MVP1 is absent.

UI behavior:

- show `Missing information`,
- show no eligible site/month list,
- show no check/recheck action,
- show no `Valid as of` timestamp,
- tell the user to populate the highlighted SFDC field.

## Off-Ramp Case

If Study Start Date is not more than four months out, MVP1 should off-ramp.

Reason: the agreed MVP1 self-serve path is only appropriate for requests beyond the four-month threshold.

UI behavior:

- show `Central Scheduling off-ramp`,
- show no self-serve recommendation,
- show no check/recheck action because the threshold failure is already known,
- provide the reason code `START_DATE_WITHIN_4_MONTH_THRESHOLD`.

## Why `Valid As Of` Replaces `Valid Until`

The stakeholder direction changes the output from a decision contract with expiry semantics to a simple snapshot output.

`Valid until` implies a governed expiration window, which may overstate MVP1. `Valid as of` is weaker and more accurate:

- it identifies when the site/month recommendation snapshot was checked,
- it avoids implying a reservation window,
- it leaves the refresh/expiry governance to the separate lead-time/ranking logic or future operational design.

## What Is Not In MVP1

These remain outside the simplified MVP1 view:

- full request workspace,
- wizard-driven request intake,
- configuration-readiness checklist,
- route/species/study-type validation,
- LabSci dependency review,
- Reporting/SEND dependency review,
- test material availability,
- custom endpoint/housing analysis,
- rule trace,
- recommendation confidence scoring,
- SOW/customer response flow,
- capacity reservation,
- operational scheduling.

The LT Commercial Vision path can continue to carry those ideas for discussion. MVP1 should not.

## Implementation Rationale

The UI recreates a generic SFDC Study wireframe in code instead of using the provided image as a static background.

Reason:

- it will deploy correctly to Netlify,
- it avoids depending on a local Downloads image path,
- it lets the highlighted Study Start Date remain editable,
- it keeps the prototype legible while still looking like the supplied SFDC screen.

The right-side eligible-sites list mimics native SFDC related-list/card styling because stakeholders said MVP1 affects this existing screen. That makes the prototype read as an SFDC augmentation, not as a separate scheduling application.

The `CRL Site` dropdown appears next to `Start Date` from the beginning because preferred site is part of Commercial’s starting context. That location is intentional: it makes MVP1 feel like a field-level augmentation of the existing Study page, while avoiding any expanded workflow inside the recommendation list.

The `CRL Site` dropdown is now one alphabetically sorted list. Reason: the earlier grouped dropdown over-explained eligibility inside the input. MVP1 should let Commercial set the preferred site in the familiar SFDC field location, then let the recommendations module show where that selected site lands in the ranked eligible set.

The `View all` list uses SFDC-style table density because the stakeholder reference was a native Salesforce list detail view. This keeps the expanded state recognizable without implying a new scheduling application or a separate workflow.
