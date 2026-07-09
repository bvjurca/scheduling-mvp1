# UI and Input Decision Rationale

Date: 2026-07-09

## Purpose

This document explains why each input and UI element exists in the DSA Commercial Scheduling MVP1 prototype.

The prototype is not a scheduling engine, room optimizer, or capacity reservation tool. It is a Commercial decision aid for the Blueprint MVP1 flow: determine whether Commercial has enough structured SFDC/RFP/Study context to give a time-bound site/month recommendation, caveat the recommendation, or off-ramp to Central Scheduling.

## Product Principles

1. **Keep the hosted demo narrow.** The demo should be a wizard plus a decision console. Stakeholder narrative belongs in a side document or PDF, not inside the app surface.
2. **Make the date source explicit.** The MVP1 gate is Opportunity Start Date. Other dates are context and must not silently replace the gate.
3. **Separate recommendation from commitment.** The UI can recommend a site/month option, but it must always say the option creates no capacity hold.
4. **Expose ambiguity instead of hiding it.** If the request means LabSci start, customer submission timing, Reporting/SEND timing, exact date, or unclear timing, the console should show that risk.
5. **Preserve the human context.** Email, Teams, notes, and free text can contain constraints the rules do not parse.
6. **Show the rule path.** Commercial and Scheduling should be able to see why the system recommended, caveated, blocked, or escalated.

## Top State Tabs / Scenario Pills

The top pills represent the major states Commercial will need to explain in a stakeholder demo:

| State | Why it exists | Expected behavior |
| --- | --- | --- |
| Ideal case | Shows the MVP1 happy path: enough data, outside four-month gate, no material blocker, no unresolved dependency blocker, capability supported. | Should light automatically when the wizard inputs meet ideal-case conditions. Clicking it can load the happy-path scenario. |
| Missing data | Shows that MVP1 should ask for data rather than inventing a date or recommendation. | Should light when Opportunity Start Date, species, configuration, or other required context is missing or ambiguous. |
| Specific date (Off-ramp) | Captures the VoC point that a specific date is materially different from month-of timing. | Should light when exact timing is requested or the start date is inside the four-month MVP1 window. |
| Dependency risk | Captures the reality that LabSci, Reporting/SEND, or related dependencies may have a separate timeline. | Should light when the timing meaning is LabSci/method-related, LabSci timing is unresolved, or Reporting/SEND requires validation. |
| Expired | Makes the "snapshot, not promise" principle visible. | Should light when the recommendation validity window has elapsed. |

Design reason: the tabs are not just demo presets. They should be connected to the evaluated wizard state so the top of the page reflects the same logic as the bottom decision console.

State priority: missing required data should outrank dependency risk. If a scenario has missing Opportunity Start Date, species, configuration, or core timing semantics, the Missing Data tab should stay selected even if Reporting/SEND is also unknown. Dependency Risk should describe a review path only after the request has enough basic data to evaluate. Manual "Off-ramp required" maps to the off-ramp tab because it is a user decision to route the case outside the self-serve path, not a missing-field condition.

## Wizard Structure

The wizard is split into four groups because that mirrors the real decision path:

1. Opportunity and RFP: commercial request, gate date, timing precision, requested timing context, and date semantics.
2. Study configuration: structured study metadata needed for capability and timing.
3. Site, dependencies, and material readiness: the operational constraints that change recommendation confidence.
4. Additional information: human-readable context that should travel with the recommendation or escalation.

This grouping deliberately avoids copying the SFDC screen one-to-one. The goal is not to reproduce Salesforce; it is to synthesize scheduling-relevant context that is scattered across Opportunity, RFP, Study, Configurator, notes, and files.

## Opportunity and RFP Inputs

### Opportunity #

Reason: gives the recommendation a commercial record anchor.

Decision impact: mostly traceability. It does not drive the rules in the prototype, but it should appear in future escalation packets and audit views.

Why not hide it: stakeholders expect to see a recognizable SFDC reference, and Central Scheduling would need the record identifier if an off-ramp occurs.

### Opportunity Stage

Reason: stage is the SFDC-owned sales-process signal and the best available proxy for commercial posture.

Decision impact: later-stage or awarded work should receive stricter language because Commercial may be closer to customer commitment or operational execution.

Why included in MVP1: the screenshots show stage as a dominant SFDC signal. The VoC also distinguishes budgetary from ready-to-execute requests.

Why **Intent Maturity** was removed: it was too redundant with Opportunity Stage. If the team needs a richer maturity concept later, it should be derived from Opportunity Stage plus RFP/study signals and shown as read-only "Commercial posture," not entered by the user as another field.

### Opportunity Start Date

Reason: this is the official MVP1 gate date from the Blueprint.

Decision impact: required. The happy path only continues when this date is known and more than four months out from the current evaluation date.

Why the label is explicit: "target date" is too vague. "Study Start Date" is too operational. "Opportunity Start Date" keeps MVP1 aligned to the agreed commercial flow.

Format: full dates are displayed as `DD-MMM-YYYY` so the prototype does not mix ISO date strings with business-facing date language.

### Timing Precision Requested

Reason: defines the kind of timing the customer/RFP actually supplied before the UI asks for requested timing details.

Options:

- General lead time
- Quarter guidance
- Month-of timing
- Specific date

Decision impact: month-of timing fits MVP1. Exact date requests should be caveated or off-ramped because they imply a stronger promise.

Why it appears before RFP requested timing: the precision determines the correct input control. A customer who says "Q2" should not be forced into a fake exact date.

### RFP Requested Timing

Reason: captures the customer/RFP timing context that may explain, populate, or conflict with Opportunity Start Date.

Control behavior:

- General lead time: no date required; free timing context is acceptable.
- Quarter guidance: requested quarter text, such as `2027 Q1`.
- Month-of timing: requested month input.
- Specific date: requested date input.

Decision impact: context and reconciliation, not the primary gate.

Why separate from Opportunity Start Date: VoC made clear that requested start can mean different things. Keeping this field visible prevents silent date substitution.

### Date Meaning

Reason: captures what the date is supposed to represent.

Options:

- In-life / in vivo start
- LabSci / method start
- Customer submission deadline
- Budgetary/Quote
- Unclear / mixed meaning

Decision impact: only in-life/in vivo date meaning supports a straightforward commercial timing recommendation. LabSci, submission, budgetary/quote, or unclear timing should create caveats.

Why included: "requested start" was identified as ambiguous. This field makes ambiguity visible and discussable.

## Study Configuration Inputs

### Study Type L1

Reason: broad scientific/service category used to classify the request.

Decision impact: part of configuration completeness. Future versions can map it to DOT, capabilities, and timing rules.

Why included: MVP1 depends on standardized study design context, not just opportunity metadata.

### Study Type L2

Reason: more specific study design signal.

Decision impact: used in the prototype's mock site-capability check.

Why separate from L1: capability often depends on the specific study pattern, not only the broad category.

### Species

Reason: species materially changes site capability, lead time, and operational feasibility.

Decision impact: required for capability matching except where species is not applicable.

Why included: screenshots and existing DSA dashboards heavily use species as a filter and timing determinant.

### Route of Administration

Reason: captures a study design detail that can change feasibility and complexity.

Decision impact: currently contextual, but it belongs in the data packet because it may matter for future rules.

Why included now: it is a visible bridge to the Configurator/RACE-style detail without overbuilding the prototype.

### Configuration Completeness

Reason: summarizes whether required SFDC/RFP/Study fields are present.

Decision impact: missing or ambiguous configuration blocks a strong recommendation.

Why included: MVP1 should ask for missing data before producing false confidence.

### Configurator Detail

Reason: indicates the depth or complexity of the configured study.

Decision impact: currently contextual. Complex custom endpoints should lower confidence or increase review needs in future versions.

Why included: it acknowledges that a simple study outline and a deeply configured study are not the same scheduling risk.

## Site, Dependencies, and Material Inputs

### Site Flexibility

Reason: governs whether a preferred site matters at all and whether the system can recommend alternatives.

Options represent common commercial constraints:

- Specific site required
- Preferred, but flexible
- Region required
- Any qualified site
- Keep program together
- Fastest start wins

Decision impact: flexible requests can generate alternate site/month options; specific-site requests carry higher risk.

Default: "Any qualified site" is the starting state because it preserves recommendation breadth and avoids accidentally encoding a site constraint before the user has stated one.

Why it appears before Preferred site: site flexibility is the parent choice. If the request is "Any qualified site," asking for a required preferred site creates false constraint.

### Preferred Site

Reason: captures the commercial or customer-preferred site when one exists.

Decision impact: checked against mock site capabilities. A mismatch can produce a warning or off-ramp depending on flexibility.

Conditional behavior: disabled when Site flexibility is "Any qualified site." In that state, the site preference should not constrain the recommendation.

Why included: site preference is one of the strongest levers in scheduling feasibility, but only when it is a real constraint or preference.

### Test Material Availability

Reason: captures whether study timing is blocked by test article/material readiness.

Decision impact: unknown or future availability creates caveats.

Why included: material readiness can invalidate a timing answer even if site timing looks feasible.

### Test Material Available Date

Reason: captures the date behind the material availability caveat.

Decision impact: currently displayed as rationale; future versions can compare it against Opportunity Start Date.

Why included: a generic "future material" flag is less actionable than a dated assumption.

### LabSci Dependency

Reason: captures whether method transfer, validation, or bioanalysis creates a separate timeline.

Decision impact: non-none dependencies increase risk unless timing is known and feasible.

Why included: LabSci can run before, during, or alongside in vivo work, and can be the real driver of customer timing.

### LabSci Timing State

Reason: captures whether the LabSci dependency has been checked.

Decision impact: unknown or not feasible states should caveat or block stronger Commercial language.

Why included: it prevents a simple site/month answer from masking method or bioanalysis uncertainty.

### Reporting/SEND Dependency

Reason: captures whether reporting, SEND, or reporting review affects the proposal timing window.

Options:

- No Reporting/SEND dependency
- Standard Reporting/SEND expected
- SEND package required
- Reporting/SEND review required
- Unknown / needs check

Decision impact: unknown or review-required states produce a Needs Validation outcome and a structured off-ramp reason code. SEND-required can remain eligible when the target date is captured, but the card still carries a Reporting/SEND caveat and recheck trigger.

Why included: Reporting/SEND is not LabSci and not site capacity. Treating it as a separate dependency prevents the recommendation from becoming a false booking confirmation while still allowing Commercial to carry the right caveat.

### Reporting/SEND Target Date

Reason: if Reporting/SEND is required or under review, the UI needs the customer-facing report, SEND, or submission target date.

Conditional behavior: hidden unless Reporting/SEND dependency is `SEND package required` or `Reporting/SEND review required`.

Decision impact: missing target date creates a readiness warning, a rule-trace warning, and the `REPORTING_SEND_REVIEW_REQUIRED` packet reason code. A captured date becomes an assumption, data source, and recheck trigger.

Why this is conditional: the UI should not ask every request for another date. The field appears only when the dependency makes the date relevant. It is not the MVP1 gate date and should not replace Opportunity Start Date.

Scrutiny: a generic "Reporting/SEND required" flag is too weak by itself. If Commercial is going to tell a customer that a proposal window is viable while Reporting/SEND is in play, the console needs either the dependency target date or an explicit validation path.

## Additional Information Inputs

### Customer Constraints / Notes / Email Context

Reason: gives Commercial a place to carry human context that structured fields miss.

Decision impact: rendered into the decision console and escalation packet.

Why included: VoC called out that emails, Teams, notes, and descriptions can contain critical constraints not cleanly represented in SFDC fields.

### Off-ramp Required

Reason: explicit manual override for ambiguity, discomfort, or cases the rules cannot model.

Decision impact: should off-ramp to Central Scheduling assistance.

Why included: MVP1 must support human judgment rather than pretending the rules cover every scenario.

## Wizard CTAs

### Save

Reason: lets the user preserve the current draft state without implying workflow submission or SFDC writeback.

Decision impact: none in MVP1. It is a local draft action in the prototype.

Why included: Commercial users expect a way to pause work. The CTA should remain lower-commitment than a submit action.

### Check results

Reason: moves attention from input gathering to the decision console.

Decision impact: runs the current evaluation and takes the user to the result area.

Why included: it supports a natural wizard mental model without hiding the live-updating console. The right-arrow icon communicates forward motion without leaving literal arrow characters in the label.

## Decision Console Elements

### Outcome Banner

Reason: gives Commercial the primary answer first.

Decision impact: summarizes whether the user can proceed, proceed with caveats, fill missing data, recalculate, or off-ramp.

Why prominent: stakeholder demos need a clear "so what" before they inspect rule details.

### Outcome Pill

Reason: gives a compact machine-like status code beside the human-readable outcome.

Decision impact: helps connect UI state to future workflow states or SFDC status values.

Why included: useful for stakeholder conversation around future field mapping.

### MVP1 Gate Logic

Reason: keeps the agreed Blueprint rule intact without making the user inspect implementation scaffolding.

Decision impact: Opportunity Start Date still drives the ideal-case path, missing-data state, specific-date caveat, and off-ramp behavior.

Layout decision: the visible MVP1 Gate panel was removed from the console. It was behind-the-scenes logic rather than a decision the user needed to operate, and it pushed recommendations lower on the page.

Why retained behind the scenes: this protects the team from drifting back into ambiguous "target date" language while keeping the console focused on readiness and recommendations.

### Readiness List

Reason: shows each evaluated condition as pass/review/fail.

Decision impact: gives the user an actionable checklist.

Layout decision: readiness is a compact grid so pass/review/fail conditions consume less vertical space and do not push the recommendation too far down.

Why included: Commercial needs to know what to fix, not just that the recommendation failed.

Relationship to Rule Trace: Readiness and Rule Trace intentionally use the same underlying evaluation, but they are not meant to answer the same question.

- Readiness answers: "Can I proceed, and what input or assumption needs attention?"
- Rule Trace answers: "Which rule fired, and why did the console produce this outcome or recommendation?"

Readiness is the user-facing checklist tied to the wizard state. It compresses conditions into practical labels such as missing date, configuration incomplete, LabSci unresolved, Reporting/SEND review required, material unknown, or site capability supported. Rule Trace is the audit/debug layer. It exposes the rule provenance behind the outcome, recommendation, off-ramp, and Central Scheduling packet.

Why both exist: removing Readiness would make the user hunt through rules to know what to fix. Removing Rule Trace would make the console feel like a black box and weaken stakeholder review. The two should stay linked, but not visually identical: Readiness is operational; Rule Trace is explanatory.

### Recommendations

Reason: represents the actual MVP1 output.

Decision impact: suggests preferred and alternate site/month options when rules permit.

Why month-of rather than exact date: MVP1 should support commercial guidance, not promise operational start dates.

Ideal-case behavior: when the request reaches `ELIGIBLE_TO_PROPOSE` with no unresolved warnings and site flexibility is not specific-site-only, the console shows three recommendation options instead of two. Reason: a clean MVP1 case is the moment when Commercial can safely compare more than the minimum preferred/alternate pair without implying that any option is reserved.

### Recommendation Card Metadata

Each recommendation repeats four parameters because cards are intended to be compared side by side. The user should not have to infer whether the preferred option and alternate option carry the same caveats.

#### Precision

Reason: tells the user what kind of timing answer the card represents.

Source: derived from Timing precision. General, quarter, and month-of requests are translated into their corresponding business-facing precision label. If the request is a specific date, the card explicitly says it needs validation instead of implying an exact start promise.

Decision impact: prevents a site/month recommendation from being misread as a committed date.

#### Confidence

Reason: gives Commercial a quick sense of how clean or caveated the recommendation is.

Source in the prototype: a simple heuristic based on open warning count. No warnings yields HIGH. One warning yields MEDIUM. More than one warning yields LOW. Alternate-site recommendations inherit the same caveat profile because they are proposal options, not committed capacity.

What it is not: not a statistical probability, not a capacity confidence score, and not a site commitment. It is a readability layer over unresolved assumptions such as date semantics, future/unknown material, LabSci uncertainty, Reporting/SEND review, or other caveats.

Why this deserves scrutiny: the current rule is intentionally simple for MVP1. A production version should likely weight warnings differently. For example, unresolved LabSci timing should probably reduce confidence more than a harmless note; a site capability mismatch should block or off-ramp rather than merely lower confidence.

#### Valid Until

Reason: makes the snapshot nature of the answer visible at the point of recommendation.

Source: calculated from the proposal snapshot date plus the prototype validity window.

Decision impact: forces the user to recheck if the recommendation has aged out, because site timing, material readiness, scope, or customer preference may have changed.

#### Commitment

Reason: keeps the strongest guardrail visible inside every recommendation card.

Source: fixed to "No capacity hold" in MVP1.

Decision impact: prevents the recommendation from being interpreted as capacity reservation, room-level scheduling, final RPM execution timing, or a replacement for Central Scheduling.

### Snapshot Recommendation Card Selection

Reason: lets the user select a recommendation option as local UI state.

Decision impact: selection should update the page state only. It must not route, reserve, write to SFDC, or imply commitment.

Why included: stakeholders can see how Commercial might choose between options without overclaiming workflow integration.

### Snapshot Metadata

Reason: shows proposal freshness where the recommendation is being consumed.

Displayed data:

- Last checked
- Valid-until date
- No capacity hold

Decision impact: drives expiry and frames the recommendation as a snapshot rather than a promise.

Why placed in the recommendation header: "Last checked" is provenance for the snapshot recommendation, not an intake question the user should normally answer. It replaces the old top-right commitment emphasis because freshness is the first thing the user needs before trusting a recommendation.

### Non-Reservation Language

Reason: keeps the non-commitment caveat visible at the point of recommendation.

Decision impact: none mechanically, but it changes interpretation.

Why included: this is one of the most important VoC lessons. A snapshot recommendation is not a capacity hold.

### Caveat Badges, Data Used, and Recheck Triggers

Reason: makes a recommendation behave like a decision contract rather than a booking confirmation.

Decision impact: dependency badges expose why the card is caveated; Data used shows which source types informed the card; Recheck if lists conditions that invalidate the answer.

Reporting/SEND impact: if Reporting/SEND is required, under review, unknown, or missing a target date, the recommendation card should carry a Reporting/SEND caveat and the packet should carry structured reason codes. This allows Commercial to discuss a proposal window while preserving the boundary that operational scheduling has not happened.

### Rule Trace

Reason: shows the exact rule path that produced the recommendation or off-ramp.

Decision impact: supports trust, debugging, and stakeholder review.

Why included: without rule trace, the console feels like an unexplained score.

### Central Scheduling Packet

Reason: packages reason codes and assumptions for escalation.

Decision impact: reduces rework when Commercial cannot resolve a request.

Why included: MVP1 should not dead-end when rules fail; it should hand off cleanly.

### Additional Information Display

Reason: mirrors the free-text input back into the console.

Decision impact: ensures human context travels with the decision.

Why included: this is the bridge between structured rules and real commercial conversations.

## Visual and Layout Decisions

### Two-column layout on desktop

Reason: keeps input and output visible at the same time.

Decision impact: users can see the console change as they edit inputs.

### Tablet-minimum viewport

Reason: this workflow is an SFDC-adjacent commercial decision tool and will not be used as a phone-first experience.

Decision impact: the hosted demo preserves an 800px minimum working width and does not introduce phone-specific layout compromises. Tablet portrait may stack major work areas, but controls should remain dense and operational.

### Enterprise, restrained styling

Reason: this is an operational Commercial/SFDC-adjacent tool, not a marketing page.

Decision impact: compact panels, controlled colors, and scan-friendly cards.

### Form control styling

Reason: native browser selects, native month/date pickers, and default checkboxes varied by operating system and made the prototype look unfinished.

Decision impact: the hosted app now uses `react-aria-components` for Select, Checkbox, Button, RadioGroup/Radio, Tooltip, TextField, Input, and TextArea. This gives the wizard one interaction model for focus, hover, disabled, selected, and open states instead of relying on browser-specific widgets.

Date control decision: full dates remain text-based `DD-MMM-YYYY` fields instead of native date pickers because the business format is explicit and native pickers do not reliably present `DD-MMM-YYYY`. Month and quarter requests are captured as business text (`Feb-2027`, `2027 Q1`) rather than native `type="month"` controls. This avoids broken datepicker behavior while preserving the MVP1 distinction between precision, requested timing context, and Opportunity Start Date.

### Cards only for actual panels and repeated options

Reason: avoids turning the page into a decorative card collage.

Decision impact: panels map to work surfaces: wizard, readiness, recommendation, trace, packet, and additional information.

Console clutter update: the decision console keeps one outer container, while direct child panels are visually unboxed so the page reads as one decision surface instead of a stack of competing cards.

### Color meaning

| Color | Meaning |
| --- | --- |
| Green | Pass / ideal case / selected safe option |
| Amber | Review / caveat / no capacity hold |
| Red | Fail / off-ramp / expired |
| Blue | Structural focus / active UI / information |
| Violet | Informational context |

### Demo Data Label

Reason: stakeholders still need to know the prototype uses demo data.

Decision impact: none.

Why the **Synthetic** pill was removed: it was prototype metadata sitting inside the workflow. The H1-level "DEMO DATA ONLY" label is enough for the prototype and avoids suggesting that "Synthetic" is a future product state.

## Wizard Version Control

The wizard does not need full user-facing version control in MVP1.

It does need lightweight auditability for saved or checked recommendations:

- timestamp;
- user or owner when authenticated;
- input snapshot;
- selected recommendation, if any;
- rule/data version;
- last checked;
- validity window;
- off-ramp reason codes.

Reason: Commercial and Scheduling need to know what recommendation was made and under which assumptions. They do not need a full version history for every keystroke in the wizard.

## Deliberate Non-Decisions

These are intentionally not in MVP1:

- no capacity reservation;
- no room-level optimization;
- no final RPM execution date;
- no SAP billing milestone logic;
- no automatic writeback to SFDC;
- no hidden use of RFP Requested Start Date as the gate;
- no customer/SFDC screenshots embedded in the hosted demo;
- no promise that PowerBI/RACE timing is current after the validity window.

## Open Follow-up Decisions

1. Confirm exactly how Opportunity Start Date is populated from SFDC/RFP data.
2. Decide whether RFP Requested Start Date mismatch should block recommendation or only warn.
3. Decide the formal expiry window for snapshot recommendations.
4. Decide which Scheduling Status values should map to recommendation state, timing precision, validity, and off-ramp reason.
5. Decide whether selected recommendation state should eventually write to SFDC, remain ephemeral, or generate a task.
6. Decide how Central Scheduling packet contents should be formatted for handoff.
7. Decide what audit payload should be stored when a user clicks Save or Check results.
8. Decide whether Reporting/SEND target date should map to an existing SFDC/RFP field or remain a derived wizard field in MVP1.
