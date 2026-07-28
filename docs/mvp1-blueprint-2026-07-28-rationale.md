# MVP1 Blueprint Reassessment Rationale

Date: 2026-07-28

Sources reviewed:

- `Blueprint Scheduling_2026-07-28_12-09-19.pdf`
- `study reference.png`
- `Wireframe.png`

## Current MVP1 Decision

MVP1 is now intentionally narrower than the prior split-view prototype.

The MVP1 surface should read one SFDC Study field:

- Study Start Date

It should then display ranked site/month options from the separate site lead-time and ranking logic. This prototype does not need to reproduce that ranking logic in detail. It only needs to show where the result lands in SFDC and how Commercial sees the output.

## Why This Change Is Correct

The stakeholder clarification shifts MVP1 away from a wizard or broad readiness console. The actual MVP1 impact is concentrated on the existing SFDC Study record, specifically the date field that determines whether site/month recommendations can be shown.

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
4. A right-side native SFDC-style box titled `Recommended sites`.
5. A compact `Recommended sites` list with ranked sites and month availability.
6. A `Check site recommendations` action that refreshes the snapshot and can change ranking order.
7. UI-only site selection that surfaces the selected site in the SFDC mockup as a `CRL Site` dropdown.
8. `Valid as of DD-MMM-YYYY HH:MM`, rather than `Valid until`.
9. Missing-information handling when Study Start Date is blank.
10. Central Scheduling off-ramp handling when Study Start Date is inside the four-month threshold.

## What The Recommendation Means

The recommendation is still not a booking confirmation.

It means:

- based on the Study Start Date,
- and based on separately governed site lead-time/ranking logic,
- Commercial can see candidate site/month options.
- Commercial can mark one site/month option in the UI.

It does not mean:

- capacity has been reserved,
- a room or operational slot exists,
- RPM has accepted the date,
- Central Scheduling has been bypassed,
- all downstream dependencies are resolved.
- the selected option has been routed, reserved, or committed.

## Missing Data Case

If Study Start Date is missing, MVP1 should not calculate or imply a recommendation.

Reason: the single required input for this simplified MVP1 is absent.

UI behavior:

- show `Missing information`,
- show no site/month list,
- tell the user to populate the highlighted SFDC field.

## Off-Ramp Case

If Study Start Date is not more than four months out, MVP1 should off-ramp.

Reason: the agreed MVP1 self-serve path is only appropriate for requests beyond the four-month threshold.

UI behavior:

- show `Central Scheduling off-ramp`,
- show no self-serve recommendation,
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

The right-side recommendation list mimics native SFDC related-list/card styling because stakeholders said MVP1 affects this existing screen. That makes the prototype read as an SFDC augmentation, not as a separate scheduling application.

When a user selects a recommended site, the value appears in the SFDC mockup as a visible `CRL Site` dropdown next to `Start Date`. That location is intentional: it makes the recommendation feel like a field-level augmentation of the existing Study page, while avoiding any expanded workflow inside the recommendation list.
