# UI and Input Decision Rationale

Date: 2026-07-07

## Purpose

This document explains why each input and UI element exists in the DSA Commercial Scheduling MVP1 prototype.

The prototype is not a scheduling engine, room optimizer, or capacity reservation tool. It is a Commercial decision aid for the Blueprint MVP1 flow: determine whether Commercial has enough structured SFDC/RFP/Study context to give a time-bound site/month recommendation, caveat the recommendation, or off-ramp to Central Scheduling.

## Product Principles

1. **Keep the hosted demo narrow.** The demo should be a wizard plus a decision console. Stakeholder narrative belongs in a side document or PDF, not inside the app surface.
2. **Make the date source explicit.** The MVP1 gate is Opportunity Start Date. Other dates are context and must not silently replace the gate.
3. **Separate recommendation from commitment.** The UI can recommend a site/month option, but it must always say the option is not reserved capacity.
4. **Expose ambiguity instead of hiding it.** If the request means LabSci start, customer submission timing, exact date, or unclear timing, the console should show that risk.
5. **Preserve the human context.** Email, Teams, notes, and free text can contain constraints the rules do not parse.
6. **Show the rule path.** Commercial and Scheduling should be able to see why the system recommended, caveated, blocked, or escalated.

## Top State Tabs / Scenario Pills

The top pills represent the major states Commercial will need to explain in a stakeholder demo:

| State | Why it exists | Expected behavior |
| --- | --- | --- |
| Green light | Shows the MVP1 happy path: enough data, outside four-month gate, no material blocker, no unresolved LabSci blocker, capability supported. | Should light automatically when the wizard inputs meet green-light conditions. Clicking it can load the happy-path scenario. |
| Missing data | Shows that MVP1 should ask for data rather than inventing a date or recommendation. | Should light when Opportunity Start Date, species, configuration, or other required context is missing or ambiguous. |
| Specific date | Captures the VoC point that a specific date is materially different from month-of timing. | Should light when exact timing is requested or the start date is inside the four-month MVP1 window. |
| LabSci risk | Captures the reality that method validation, bioanalysis, or LabSci sequencing may have a separate timeline. | Should light when the timing meaning is LabSci/method-related or LabSci timing is unresolved. |
| Expired | Makes the "snapshot, not promise" principle visible. | Should light when the recommendation validity window has elapsed. |

Design reason: the tabs are not just demo presets. They should be connected to the evaluated wizard state so the top of the page reflects the same logic as the bottom decision console.

## Wizard Structure

The wizard is split into four groups because that mirrors the real decision path:

1. Opportunity and RFP: commercial request, gate date, maturity, and date semantics.
2. Study configuration: structured study metadata needed for capability and timing.
3. Site, LabSci, and material readiness: the operational constraints that change recommendation confidence.
4. Context capsule: human-readable context that should travel with the recommendation or escalation.

This grouping deliberately avoids copying the SFDC screen one-to-one. The goal is not to reproduce Salesforce; it is to synthesize scheduling-relevant context that is scattered across Opportunity, RFP, Study, Configurator, notes, and files.

## Opportunity and RFP Inputs

### Opportunity #

Reason: gives the recommendation a commercial record anchor.

Decision impact: mostly traceability. It does not drive the rules in the prototype, but it should appear in future escalation packets and audit views.

Why not hide it: stakeholders expect to see a recognizable SFDC reference, and Central Scheduling would need the record identifier if an off-ramp occurs.

### Opportunity Stage

Reason: stage changes how strong the recommendation can be.

Decision impact: later-stage or awarded work should receive stricter language because Commercial may be closer to customer commitment or operational execution.

Why included in MVP1: the screenshots show stage as a dominant SFDC signal. The VoC also distinguishes budgetary from ready-to-execute requests.

### Opportunity Start Date

Reason: this is the official MVP1 gate date from the Blueprint.

Decision impact: required. The happy path only continues when this date is known and more than four months out from the current evaluation date.

Why the label is explicit: "target date" is too vague. "Study Start Date" is too operational. "Opportunity Start Date" keeps MVP1 aligned to the agreed commercial flow.

### RFP Requested Start Date

Reason: captures the customer/RFP date that may explain, populate, or conflict with Opportunity Start Date.

Decision impact: context and reconciliation, not the primary gate.

Why separate from Opportunity Start Date: VoC made clear that requested start can mean different things. Keeping this field visible prevents silent date substitution.

### Intent Maturity

Reason: captures whether the request is budgetary, planning, ready-to-execute, or awarded.

Decision impact: budgetary/planning requests can tolerate broader timing; ready/awarded states need stronger validation and may require Scheduling involvement.

Why it matters: Zach's VoC sharply separated budgetary estimates from execution-level asks.

### Timing Precision Requested

Reason: distinguishes general lead time, quarter guidance, month-of timing, and specific date.

Decision impact: month-of timing fits MVP1. Exact date requests should be caveated or off-ramped because they imply a stronger promise.

Why it is a select: precision is categorical, not free text. A controlled field lets the console produce stable recommendation language.

### Date Meaning

Reason: captures what the date is supposed to represent.

Options:

- In-life / in vivo start
- LabSci / method start
- Customer submission deadline
- Unclear / mixed meaning

Decision impact: only in-life/in vivo date meaning supports a straightforward commercial timing recommendation. LabSci, submission, or unclear timing should create caveats.

Why included: "requested start" was identified as ambiguous. This field makes ambiguity visible and discussable.

### Proposal Last Checked

Reason: records the snapshot date for the recommendation.

Decision impact: drives expiry. If the snapshot is too old, the recommendation must be recalculated before customer communication.

Why included: this is the core "snapshot, not promise" mechanism.

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

## Site, LabSci, and Material Inputs

### Preferred Site

Reason: captures the commercial or customer-preferred site.

Decision impact: checked against mock site capabilities. A mismatch can produce a warning or off-ramp depending on flexibility.

Why included: site preference is one of the strongest levers in scheduling feasibility.

### Site Flexibility

Reason: determines whether the system can recommend alternatives.

Options represent common commercial constraints:

- Specific site required
- Preferred, but flexible
- Region required
- Any qualified site
- Keep program together
- Fastest start wins

Decision impact: flexible requests can generate alternate site/month options; specific-site requests carry higher risk.

Why included: the VoC made clear that broader site flexibility can unlock earlier timing.

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

## Context Capsule Inputs

### Customer Constraints / Notes / Email Context

Reason: gives Commercial a place to carry human context that structured fields miss.

Decision impact: rendered into the decision console and escalation packet.

Why included: VoC called out that emails, Teams, notes, and descriptions can contain critical constraints not cleanly represented in SFDC fields.

### User Cannot Resolve With MVP1 Rules

Reason: explicit manual override for ambiguity, discomfort, or cases the rules cannot model.

Decision impact: should off-ramp to Central Scheduling assistance.

Why included: MVP1 must support human judgment rather than pretending the rules cover every scenario.

## Decision Console Elements

### Outcome Banner

Reason: gives Commercial the primary answer first.

Decision impact: summarizes whether the user can proceed, proceed with caveats, fill missing data, recalculate, or off-ramp.

Why prominent: stakeholder demos need a clear "so what" before they inspect rule details.

### Outcome Pill

Reason: gives a compact machine-like status code beside the human-readable outcome.

Decision impact: helps connect UI state to future workflow states or SFDC status values.

Why included: useful for stakeholder conversation around future field mapping.

### MVP1 Gate Panel

Reason: makes the agreed gate visible:

- Official gate date
- Gate source
- Minimum window
- Timing precision

Decision impact: explains whether the request is in the MVP1 happy path.

Why included: this panel protects the team from drifting back into ambiguous "target date" language.

### Readiness List

Reason: shows each evaluated condition as pass/review/fail.

Decision impact: gives the user an actionable checklist.

Why included: Commercial needs to know what to fix, not just that the recommendation failed.

### Site / Month-of-Timing Options

Reason: represents the actual MVP1 output.

Decision impact: suggests preferred and alternate site/month options when rules permit.

Why month-of rather than exact date: MVP1 should support commercial guidance, not promise operational start dates.

### Snapshot Recommendation Card Selection

Reason: lets the user select a recommendation option as local UI state.

Decision impact: selection should update the page state only. It must not route, reserve, write to SFDC, or imply commitment.

Why included: stakeholders can see how Commercial might choose between options without overclaiming workflow integration.

### "Not Reserved" Pill

Reason: keeps the non-commitment caveat visible at the point of recommendation.

Decision impact: none mechanically, but it changes interpretation.

Why included: this is one of the most important VoC lessons. A snapshot recommendation is not a capacity hold.

### Rule Trace

Reason: shows the exact rule path that produced the recommendation or off-ramp.

Decision impact: supports trust, debugging, and stakeholder review.

Why included: without rule trace, the console feels like an unexplained score.

### Central Scheduling Packet

Reason: packages reason codes and assumptions for escalation.

Decision impact: reduces rework when Commercial cannot resolve a request.

Why included: MVP1 should not dead-end when rules fail; it should hand off cleanly.

### Context Capsule Display

Reason: mirrors the free-text input back into the console.

Decision impact: ensures human context travels with the decision.

Why included: this is the bridge between structured rules and real commercial conversations.

## Visual and Layout Decisions

### Two-column layout on desktop

Reason: keeps input and output visible at the same time.

Decision impact: users can see the console change as they edit inputs.

### Single-column layout on mobile/tablet

Reason: prevents horizontal overflow and keeps controls usable.

Decision impact: the wizard stacks above the console.

### Enterprise, restrained styling

Reason: this is an operational Commercial/SFDC-adjacent tool, not a marketing page.

Decision impact: compact panels, controlled colors, and scan-friendly cards.

### Cards only for actual panels and repeated options

Reason: avoids turning the page into a decorative card collage.

Decision impact: panels map to work surfaces: wizard, gate, readiness, recommendation, trace, packet.

### Color meaning

| Color | Meaning |
| --- | --- |
| Green | Pass / green light / selected safe option |
| Amber | Review / caveat / not reserved |
| Red | Fail / off-ramp / expired |
| Blue | Structural focus / active UI / information |
| Violet | Synthetic/demo context |

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

