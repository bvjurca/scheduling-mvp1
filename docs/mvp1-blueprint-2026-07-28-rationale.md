# MVP1 Blueprint Reassessment Rationale

Date: 2026-07-28

Source reviewed: `Blueprint Scheduling_2026-07-28_12-09-19.pdf`

## Summary

The July 28 Blueprint diagram reinforces that MVP1 is not a standalone scheduling workspace. It is a Commercial-persona decision flow embedded around the existing SFDC Opportunity/Study context.

MVP1 should answer one narrow question:

Can Commercial use SFDC StudyID/configuration metadata plus governed reference data to calculate proposal-window options, give the user a "Just Say Yes" path, or off-ramp to Central Scheduling?

The diagram does not expand MVP1 into Reporting/SEND, test material logistics, room scheduling, labor capacity, or post-award operational scheduling. Those remain long-term Commercial Vision or later-release concepts.

## What The Diagram Shows

The diagram's MVP1 path is:

1. Lead/intake enters SFDC and creates an Opportunity.
2. The scheduling process starts from the SFDC Opportunity context.
3. The user must know or capture the target start date.
4. The target start date must be more than four months out.
5. If the date is sooner, the request off-ramps because it is not in MVP scope.
6. If mandatory configuration is missing, the user is asked to fill missing data.
7. The "Just Say Yes" / "In The Know" area is powered by SFDC StudyID/configuration fields:
   - Select a site
   - Study Type 1/2
   - Species
   - Route of Administration
   - Specialized Endpoint / Housing
8. DOT/transformed data sources feed the calculation:
   - LabSci capabilities
   - Site capability
   - LabSci lead times
   - General timing
   - Custom rules / SFDC transformation
   - Client site preference data
   - SFDC Config API
   - Scheduling rules engine
9. The system calculates options.
10. If options work, the user selects an option and gets proposal-window language.
11. While awaiting customer response, the option can expire.
12. If the client says no, the user modifies selections and recalculates.
13. If the options do not work, the request off-ramps to Central Scheduling or the user modifies selections.

## Reassessment Of The Current MVP1 UI

The split-view branch already made the right structural move by separating:

- MVP1: SFDC Opportunity decision support
- LT Commercial Vision: full request workspace, full wizard, expanded decision console

The July 28 diagram required further MVP1 tightening:

1. Reporting/SEND should not appear as an MVP1 input.

   Reporting/SEND is useful in the broader prototype, but the diagram's MVP1 decision contract is built around SFDC StudyID configuration, site capability, LabSci/general timing, and rules. Reporting/SEND remains in LT Commercial Vision only.

2. The MVP1 field set should mirror the green SFDC StudyID boxes.

   The reduced MVP1 UI now exposes Study Type 1, Study Type 2, Species, Route of Administration, Specialized Endpoint / Housing, Site Flexibility, and Preferred Site. This better reflects the diagram's "Have all config data fields been entered?" checkpoint.

3. The MVP1 result should show the customer-response loop.

   The diagram does not end at "option calculated." It continues through selected option, awaiting customer response, customer says yes, customer says no, or the offer expires. The MVP1 UI now shows this as a lightweight post-selection state row, without adding real routing or commitment.

4. MVP1 should still avoid capacity language.

   The UI keeps "no capacity hold" and "proposal window" language because the diagram says the system calculates options, not reservations.

## What Changed In The UI

MVP1 path:

- Kept the SFDC Opportunity page framing.
- Kept the >4 months Opportunity Start Date gate.
- Kept readiness, recommendations, rule trace, and Central Scheduling off-ramp.
- Removed Reporting/SEND from the MVP1 reduced field set.
- Added Study Type 1.
- Added Route of Administration.
- Added Specialized Endpoint / Housing.
- Replaced the side-card emphasis on Test Materials with SFDC configuration.
- Added an "After option selection" row for:
  - Customer says yes
  - Client says no
  - Response after expiry

LT Commercial Vision path:

- No reduction applied.
- Keeps the full request workspace.
- Keeps the full wizard and full decision console.
- Keeps Reporting/SEND, test material, LabSci timing, timing precision, dependency risk, and broader recommendation caveats.

## What Is Actually MVP1

MVP1 is the SFDC-adjacent decision support component:

- Opportunity Start Date known
- Opportunity Start Date more than four months out
- Required SFDC StudyID/configuration fields present
- Site capability check
- Lead-time/general timing check
- Rules-engine option calculation
- Selectable proposal-window recommendation
- Valid-until/expiry state
- Central Scheduling off-ramp when the self-serve flow cannot answer

MVP1 is not:

- A booking confirmation
- A capacity reservation
- Room-level scheduling
- Labor capacity planning
- Test material logistics
- Reporting/SEND scheduling
- Equipment availability
- Post-award RPM execution scheduling
- Full commercial request management

## Open Product Questions

1. Should "Specialized Endpoint / Housing" be a discrete SFDC field, or is it derived from existing configurator data?
2. Should "Select a Site" mean a user-selected site, a preferred site, or "any qualified site" by default?
3. How exactly should the option expiry period be governed: fixed business days, reference-data freshness, or customer-response SLA?
4. Should "Client Site Preference" be read-only in MVP1 because the diagram labels it as data only?
5. When the user modifies selections after a client says no, should that create a new recommendation snapshot or update the prior snapshot?

