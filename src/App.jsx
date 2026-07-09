import { useMemo, useRef, useState } from 'react';
import {
  Button,
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  Checkbox,
  DatePicker,
  Dialog,
  Group,
  Heading,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Radio,
  RadioGroup,
  Select,
  SelectValue,
  TextArea,
  TextField
} from 'react-aria-components';
import { parseDate } from '@internationalized/date';

const today = new Date('2026-07-07T12:00:00Z');
const expiryBusinessDays = 5;
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const monthLookup = Object.fromEntries(monthNames.map((month, index) => [month.toLowerCase(), index]));

const siteCapabilities = {
  Mattawan: {
    species: ['rat', 'dog', 'NHP', 'rabbit'],
    studyTypes: ['General tox', 'NHP IV infusion', 'Pregnant animal PK'],
    leadDays: 120
  },
  Horsham: {
    species: ['rat', 'rabbit'],
    studyTypes: ['Pregnant animal PK', 'General tox'],
    leadDays: 120
  },
  Lyon: {
    species: ['rat', 'dog'],
    studyTypes: ['General tox', 'Pathology slide scanning'],
    leadDays: 150
  },
  Reno: {
    species: ['NHP', 'rat'],
    studyTypes: ['NHP IV infusion', 'General tox'],
    leadDays: 150
  },
  Senneville: {
    species: ['rat', 'dog', 'NHP'],
    studyTypes: ['General tox'],
    leadDays: 130
  }
};

const scenarios = {
  happy: {
    opportunityId: 'OPP-400610',
    opportunityStage: 'Negotiate',
    opportunityStartDate: '15-Feb-2027',
    rfpRequestedStartDate: 'Feb-2027',
    timingPrecision: 'month',
    dateMeaning: 'in_vivo',
    snapshotDate: '07-Jul-2026',
    studyType1: 'Toxicology',
    studyType2: 'General tox',
    species: 'rat',
    route: 'Oral gavage',
    configurationComplete: 'complete',
    configuratorDepth: 'configured',
    preferredSite: 'Any qualified site',
    siteFlexibility: 'any',
    testMaterial: 'available',
    testMaterialDate: '01-Nov-2026',
    labsciRequired: 'none',
    labsciTiming: 'not_applicable',
    reportingSendDependency: 'none',
    reportingSendTargetDate: '',
    contextNotes: 'Customer is open to any qualified site if timing improves. No exact date promise has been made.',
    userCannotResolve: false
  },
  missing: {
    opportunityId: 'OPP-700600',
    opportunityStage: 'Proposal & Price',
    opportunityStartDate: '',
    rfpRequestedStartDate: '',
    timingPrecision: 'month',
    dateMeaning: 'unclear',
    snapshotDate: '07-Jul-2026',
    studyType1: 'Toxicology',
    studyType2: 'General tox',
    species: '',
    route: 'Unknown',
    configurationComplete: 'missing',
    configuratorDepth: 'basic',
    preferredSite: 'Senneville',
    siteFlexibility: 'preferred',
    testMaterial: 'unknown',
    testMaterialDate: '',
    labsciRequired: 'none',
    labsciTiming: 'not_applicable',
    reportingSendDependency: 'unknown',
    reportingSendTargetDate: '',
    contextNotes: 'RFP has partial information. Customer timing and species are not yet clear.',
    userCannotResolve: false
  },
  specific: {
    opportunityId: 'OPP-419206',
    opportunityStage: 'Negotiate',
    opportunityStartDate: '15-Sep-2026',
    rfpRequestedStartDate: '15-Sep-2026',
    timingPrecision: 'exact',
    dateMeaning: 'in_vivo',
    snapshotDate: '07-Jul-2026',
    studyType1: 'Toxicology',
    studyType2: 'General tox',
    species: 'NHP',
    route: 'IV infusion',
    configurationComplete: 'complete',
    configuratorDepth: 'complex',
    preferredSite: 'Mattawan',
    siteFlexibility: 'specific',
    testMaterial: 'future',
    testMaterialDate: '28-Aug-2026',
    labsciRequired: 'bioanalysis',
    labsciTiming: 'unknown',
    reportingSendDependency: 'send_required',
    reportingSendTargetDate: '30-Oct-2026',
    contextNotes: 'Customer asked for a specific September 15 in-life start. This should not be promised from snapshot data.',
    userCannotResolve: false
  },
  labsci: {
    opportunityId: 'OPP-397025',
    opportunityStage: 'Forecast & commit',
    opportunityStartDate: '20-Jan-2027',
    rfpRequestedStartDate: 'Jan-2027',
    timingPrecision: 'month',
    dateMeaning: 'labsci',
    snapshotDate: '07-Jul-2026',
    studyType1: 'Toxicology',
    studyType2: 'General tox',
    species: 'dog',
    route: 'Oral gavage',
    configurationComplete: 'complete',
    configuratorDepth: 'configured',
    preferredSite: 'Any qualified site',
    siteFlexibility: 'any',
    testMaterial: 'future',
    testMaterialDate: '15-Nov-2026',
    labsciRequired: 'method_validation',
    labsciTiming: 'unknown',
    reportingSendDependency: 'reporting_review',
    reportingSendTargetDate: '15-Mar-2027',
    contextNotes: 'Two timelines may run together: method validation and in vivo. Commercial needs a caveated month recommendation.',
    userCannotResolve: false
  },
  expired: {
    opportunityId: 'OPP-398891',
    opportunityStage: 'Closed Won',
    opportunityStartDate: '01-Feb-2027',
    rfpRequestedStartDate: 'Feb-2027',
    timingPrecision: 'month',
    dateMeaning: 'in_vivo',
    snapshotDate: '01-Jun-2026',
    studyType1: 'Services',
    studyType2: 'Pathology slide scanning',
    species: 'Not Applicable',
    route: 'Not applicable',
    configurationComplete: 'complete',
    configuratorDepth: 'basic',
    preferredSite: 'Reno',
    siteFlexibility: 'specific',
    testMaterial: 'available',
    testMaterialDate: '01-Aug-2026',
    labsciRequired: 'none',
    labsciTiming: 'not_applicable',
    reportingSendDependency: 'standard',
    reportingSendTargetDate: '',
    contextNotes: 'Previously shared month-of timing has aged out. Recheck before customer communication.',
    userCannotResolve: false
  }
};

const scenarioTabs = [
  { key: 'happy', label: 'Ideal case', statusKey: 'happy' },
  { key: 'missing', label: 'Missing data', statusKey: 'missing' },
  { key: 'specific', label: 'Specific date (Off-ramp)', statusKey: 'specific' },
  { key: 'labsci', label: 'Dependency risk', statusKey: 'labsci' },
  { key: 'expired', label: 'Expired', statusKey: 'expired' }
];

const options = {
  opportunityStage: ['Target', 'Qualify', 'Proposal & Price', 'Budgetary', 'Negotiate', 'Forecast & commit', 'Closed Won'].map(toOption),
  timingPrecision: [
    ['general', 'General lead time'],
    ['quarter', 'Quarter guidance'],
    ['month', 'Month-of timing'],
    ['exact', 'Specific date']
  ].map(toOptionPair),
  dateMeaning: [
    ['in_vivo', 'In-life / in vivo start'],
    ['labsci', 'LabSci / method start'],
    ['submission', 'Customer submission deadline'],
    ['budgetary_quote', 'Budgetary/Quote'],
    ['unclear', 'Unclear / mixed meaning']
  ].map(toOptionPair),
  studyType1: [
    ['', '-- Missing --'],
    ['Toxicology', 'Toxicology'],
    ['PK', 'PK'],
    ['Services', 'Services']
  ].map(toOptionPair),
  studyType2: [
    ['', '-- Missing --'],
    ['General tox', 'General tox'],
    ['NHP IV infusion', 'NHP IV infusion'],
    ['Pregnant animal PK', 'Pregnant animal PK'],
    ['Pathology slide scanning', 'Pathology slide scanning']
  ].map(toOptionPair),
  species: [
    ['', '-- Missing --'],
    ['rat', 'rat'],
    ['dog', 'dog'],
    ['NHP', 'NHP'],
    ['rabbit', 'rabbit'],
    ['Not Applicable', 'Not Applicable']
  ].map(toOptionPair),
  route: ['Oral gavage', 'IV infusion', 'Subcutaneous', 'Not applicable', 'Unknown'].map(toOption),
  configurationComplete: [
    ['complete', 'Required fields present'],
    ['missing', 'Missing required fields'],
    ['ambiguous', 'Ambiguous / free text only']
  ].map(toOptionPair),
  configuratorDepth: [
    ['basic', 'Basic study outline'],
    ['configured', 'Configured study components'],
    ['complex', 'Complex custom endpoints']
  ].map(toOptionPair),
  siteFlexibility: [
    ['specific', 'Specific site required'],
    ['preferred', 'Preferred, but flexible'],
    ['region', 'Region required'],
    ['any', 'Any qualified site'],
    ['same_program', 'Keep program together'],
    ['fastest', 'Fastest start wins']
  ].map(toOptionPair),
  preferredSite: ['Mattawan', 'Horsham', 'Lyon', 'Reno', 'Senneville', 'Any qualified site'].map(toOption),
  testMaterial: [
    ['available', 'Material in hand now'],
    ['future', 'Future date'],
    ['unknown', 'Unknown']
  ].map(toOptionPair),
  labsciRequired: [
    ['none', 'No LabSci dependency'],
    ['method_transfer', 'Method transfer'],
    ['method_validation', 'Method validation'],
    ['bioanalysis', 'Bioanalysis / TK-PK']
  ].map(toOptionPair),
  labsciTiming: [
    ['not_applicable', 'Not applicable'],
    ['known', 'Known and feasible'],
    ['unknown', 'Unknown / needs check'],
    ['not_feasible', 'Not feasible for requested timing']
  ].map(toOptionPair),
  reportingSendDependency: [
    ['none', 'No Reporting/SEND dependency'],
    ['standard', 'Standard reporting/SEND expected'],
    ['send_required', 'SEND package required'],
    ['reporting_review', 'Reporting/SEND review required'],
    ['unknown', 'Unknown / needs check']
  ].map(toOptionPair)
};

export default function App() {
  const [formData, setFormData] = useState(scenarios.happy);
  const [selectedRecommendationId, setSelectedRecommendationId] = useState(null);
  const [draftStatus, setDraftStatus] = useState('');
  const consoleRef = useRef(null);

  const data = normalizeData(formData);
  const evaluation = useMemo(() => evaluate(data), [data]);
  const selectedRecommendation = evaluation.recommendations.find((card) => card.id === selectedRecommendationId);
  const preferredSiteDisabled = data.siteFlexibility === 'any';
  const rfpTiming = rfpTimingProps(data.timingPrecision);
  const requiresReportingTarget = reportingSendRequiresTargetDate(data.reportingSendDependency);

  function updateField(name, value) {
    setSelectedRecommendationId(null);
    setFormData((current) => {
      const next = { ...current, [name]: value };

      if (name === 'siteFlexibility') {
        next.preferredSite = value === 'any' ? 'Any qualified site' : current.preferredSite === 'Any qualified site' ? 'Mattawan' : current.preferredSite;
      }

      if (name === 'reportingSendDependency' && !reportingSendRequiresTargetDate(value)) {
        next.reportingSendTargetDate = '';
      }

      if (name === 'timingPrecision') {
        next.rfpRequestedStartDate = coerceRequestedTiming(current.rfpRequestedStartDate, value);
      }

      return next;
    });
  }

  function applyScenario(name) {
    setFormData(scenarios[name]);
    setSelectedRecommendationId(null);
    setDraftStatus('');
  }

  function saveDraft() {
    const savedAt = new Date();
    const payload = {
      savedAt: savedAt.toISOString(),
      values: data,
      selectedRecommendationId
    };

    try {
      localStorage.setItem('dsaSchedulingMvp1Draft', JSON.stringify(payload));
      setDraftStatus(`Saved ${savedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. No SFDC writeback.`);
    } catch {
      setDraftStatus('Draft kept in this session only. No SFDC writeback.');
    }
  }

  function checkResults() {
    consoleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    consoleRef.current?.focus({ preventScroll: true });
  }

  return (
    <div className="app">
      <header className="topbar">
        <h1>Scheduling MVP1 (Commercial) - DEMO DATA ONLY</h1>
      </header>

      <main className="demo-grid">
        <section className="wizard" aria-labelledby="wizard-title">
          <div className="section-head">
            <div>
              <p className="eyebrow">Wizard</p>
              <h2 id="wizard-title">Request details</h2>
            </div>
          </div>

          <div className="scenario-bar state-tabs" aria-label="Request examples">
            {scenarioTabs.map((tab) => {
              const active = evaluation.statusKey === tab.statusKey;
              return (
                <Button
                  key={tab.key}
                  type="button"
                  className={`ghost-button state-tab ${active ? `is-active ${statusTone(tab.statusKey)}` : ''}`}
                  aria-pressed={active}
                  onPress={() => applyScenario(tab.key)}
                >
                  {tab.label}
                </Button>
              );
            })}
          </div>

          <form className="scheduler-form" onSubmit={(event) => event.preventDefault()}>
            <fieldset>
              <legend>1. Opportunity and RFP</legend>
              <div className="field-grid">
                <TextInputField
                  label="Opportunity #"
                  name="opportunityId"
                  value={data.opportunityId}
                  onChange={updateField}
                />
                <SelectField
                  label="Opportunity stage"
                  name="opportunityStage"
                  value={data.opportunityStage}
                  options={options.opportunityStage}
                  onChange={updateField}
                />
                <DatePickerField
                  label="Opportunity Start Date"
                  name="opportunityStartDate"
                  value={data.opportunityStartDate}
                  placeholder="DD-MMM-YYYY"
                  info="Primary timing date for the >4 months rule. Not Study Start Date."
                  onChange={updateField}
                />
                <SelectField
                  label="Timing precision (OUT OF SCOPE)"
                  name="timingPrecision"
                  value={data.timingPrecision}
                  options={options.timingPrecision}
                  onChange={updateField}
                />
                {data.timingPrecision === 'exact' ? (
                  <DatePickerField
                    label={rfpTiming.label}
                    name="rfpRequestedStartDate"
                    value={data.rfpRequestedStartDate}
                    placeholder={rfpTiming.placeholder}
                    info={rfpTiming.info}
                    onChange={updateField}
                  />
                ) : (
                  <TextInputField
                    label={rfpTiming.label}
                    name="rfpRequestedStartDate"
                    value={data.rfpRequestedStartDate}
                    placeholder={rfpTiming.placeholder}
                    info={rfpTiming.info}
                    onChange={updateField}
                  />
                )}
                <SelectField
                  label="Date meaning"
                  name="dateMeaning"
                  value={data.dateMeaning}
                  options={options.dateMeaning}
                  onChange={updateField}
                />
              </div>
            </fieldset>

            <fieldset>
              <legend>2. Study configuration</legend>
              <div className="field-grid">
                <SelectField
                  label="Study Type L1"
                  name="studyType1"
                  value={data.studyType1}
                  options={options.studyType1}
                  onChange={updateField}
                />
                <SelectField
                  label="Study Type L2"
                  name="studyType2"
                  value={data.studyType2}
                  options={options.studyType2}
                  onChange={updateField}
                />
                <SelectField
                  label="Species"
                  name="species"
                  value={data.species}
                  options={options.species}
                  onChange={updateField}
                />
                <SelectField
                  label="Route of administration"
                  name="route"
                  value={data.route}
                  options={options.route}
                  onChange={updateField}
                />
                <SelectField
                  label="Configuration completeness"
                  name="configurationComplete"
                  value={data.configurationComplete}
                  options={options.configurationComplete}
                  onChange={updateField}
                />
                <SelectField
                  label="Configurator detail"
                  name="configuratorDepth"
                  value={data.configuratorDepth}
                  options={options.configuratorDepth}
                  onChange={updateField}
                />
              </div>
            </fieldset>

            <fieldset>
              <legend>3. Site, dependencies, and material readiness</legend>
              <div className="field-grid">
                <SelectField
                  label="Site flexibility"
                  name="siteFlexibility"
                  value={data.siteFlexibility}
                  options={options.siteFlexibility}
                  onChange={updateField}
                />
                <SelectField
                  label="Preferred site"
                  name="preferredSite"
                  value={data.preferredSite}
                  options={options.preferredSite}
                  disabled={preferredSiteDisabled}
                  info={preferredSiteDisabled ? 'Disabled because Site flexibility is Any qualified site.' : 'Used when the customer or Commercial has a site preference.'}
                  onChange={updateField}
                />
                <SelectField
                  label="Test material availability"
                  name="testMaterial"
                  value={data.testMaterial}
                  options={options.testMaterial}
                  onChange={updateField}
                />
                <DatePickerField
                  label="Test material available date"
                  name="testMaterialDate"
                  value={data.testMaterialDate}
                  placeholder="DD-MMM-YYYY"
                  onChange={updateField}
                />
                <SelectField
                  label="LabSci dependency"
                  name="labsciRequired"
                  value={data.labsciRequired}
                  options={options.labsciRequired}
                  onChange={updateField}
                />
                <SelectField
                  label="LabSci timing state"
                  name="labsciTiming"
                  value={data.labsciTiming}
                  options={options.labsciTiming}
                  onChange={updateField}
                />
                <SelectField
                  label="Reporting/SEND dependency"
                  name="reportingSendDependency"
                  value={data.reportingSendDependency}
                  options={options.reportingSendDependency}
                  info="Captures whether reporting or SEND review affects the proposal timing window. This does not create an operational schedule."
                  onChange={updateField}
                />
                {requiresReportingTarget ? (
                  <DatePickerField
                    label="Reporting/SEND target date"
                    name="reportingSendTargetDate"
                    value={data.reportingSendTargetDate}
                    placeholder="DD-MMM-YYYY"
                    info="Customer-facing report, SEND, or submission target. This is a dependency date, not the >4 months rule date."
                    onChange={updateField}
                  />
                ) : (
                  <div className="field-spacer" aria-hidden="true" />
                )}
              </div>
            </fieldset>

            <fieldset>
              <legend>4. Additional information</legend>
              <TextAreaField
                label="Customer constraints, odd requests, notes, or email context"
                name="contextNotes"
                value={data.contextNotes}
                onChange={updateField}
              />
              <Checkbox
                className="checkbox-row"
                isSelected={data.userCannotResolve}
                onChange={(isSelected) => updateField('userCannotResolve', isSelected)}
              >
                <span className="checkbox-box" aria-hidden="true">
                  <CheckIcon />
                </span>
                <span>Off-ramp required</span>
              </Checkbox>
            </fieldset>

            <div className="wizard-actions">
              <Button type="button" className="ghost-button" onPress={saveDraft}>
                Save
              </Button>
              <Button type="button" className="primary-button" onPress={checkResults}>
                <span>Check results</span>
                <ArrowRightIcon />
              </Button>
              <span className="action-status" role="status" aria-live="polite">
                {draftStatus}
              </span>
            </div>
          </form>
        </section>

        <section className="console decision-console" aria-labelledby="console-title" tabIndex="-1" ref={consoleRef}>
          <div className="section-head">
            <div>
              <p className="eyebrow">Decision console</p>
              <h2 id="console-title">Scheduling readiness and recommendation</h2>
            </div>
            <span className={`pill ${evaluation.outcome.level}`}>{evaluation.outcome.label}</span>
          </div>

          <div className={`outcome-banner ${evaluation.outcome.level}`}>
            <h3>{evaluation.outcome.title}</h3>
            <p>{evaluation.outcome.copy}</p>
          </div>

          <div className="console-grid">
            <article className="panel span-2 readiness-panel">
              <p className="eyebrow">Readiness</p>
              <div className="check-list">
                {evaluation.checks.map((item) => (
                  <div className="check-item" key={`${item.title}-${item.copy}`}>
                    <span className={`dot ${item.level}`} />
                    <div>
                      <div className="item-title">
                        <strong>{item.title}</strong>
                      </div>
                      <p>{item.copy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="panel span-2 recommendation-panel">
              <div className="panel-head">
                <h3>Recommendations</h3>
                <p className="snapshot-meta">
                  Last checked <strong>{formatFullDate(data.snapshotDate) || 'Unknown'} | valid until {formatDate(evaluation.expiryDate)} | no capacity hold</strong>
                </p>
              </div>

              {evaluation.recommendations.length > 0 ? (
                <div className={`selection-state ${selectedRecommendation ? 'has-selection' : ''}`} aria-live="polite">
                  {selectedRecommendation ? (
                    <span>
                      <strong>Selected snapshot option:</strong> {selectedRecommendation.site} / {selectedRecommendation.month}. This is UI state only and does not route, reserve, or commit capacity.
                    </span>
                  ) : (
                    <span>No option selected. Choose a snapshot option to mark it for discussion; this does not route, reserve, or commit capacity.</span>
                  )}
                </div>
              ) : null}

              {evaluation.recommendations.length > 0 ? (
                <RadioGroup
                  aria-label="Recommendation options"
                  className="recommendations"
                  value={selectedRecommendationId || ''}
                  onChange={(value) => setSelectedRecommendationId(value)}
                >
                  {evaluation.recommendations.map((card) => (
                    <RecommendationCard key={card.id} card={card} />
                  ))}
                </RadioGroup>
              ) : (
                <div className="empty-card">
                  <strong>No recommendation generated</strong>
                  <p>Complete missing data, modify selections, or off-ramp to Central Scheduling.</p>
                </div>
              )}
            </article>

            <div className="support-divider" aria-hidden="true" />

            <article className="panel support-panel rule-panel">
              <div className="panel-title-row">
                <p className="eyebrow">Rule trace</p>
              </div>
              <div className="trace">
                {evaluation.trace.map((item) => (
                  <div className="trace-item" key={`${item.rule}-${item.copy}`}>
                    <div className="item-title">
                      <strong>{item.rule}</strong>
                      <span className={`pill ${item.level}`}>{item.status.toUpperCase()}</span>
                    </div>
                    <p>{item.copy}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="panel support-panel packet-panel">
              <div className="panel-title-row">
                <p className="eyebrow">Central Scheduling packet</p>
                <span className="panel-icon-group" role="img" aria-label="Open packet in new tab">
                  <ExternalLinkIcon />
                </span>
              </div>
              <div className="packet">
                <div className="packet-item">
                  <strong>Reason codes</strong>
                  <p>{(evaluation.triage.length ? evaluation.triage : ['none']).map(reasonCodeLabel).join(', ')}</p>
                </div>
                <div className="packet-item">
                  <strong>Assumptions</strong>
                  <p>{packetAssumptions(data).join(' | ')}</p>
                </div>
              </div>
            </article>

            <article className="panel span-2 context-panel">
              <div className="panel-title-row">
                <div className="title-with-icon">
                  <WarningIcon />
                  <p className="eyebrow">Additional information</p>
                </div>
              </div>
              <p className="context-copy">{data.contextNotes || 'No context notes provided.'}</p>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}

function TextInputField({ label, name, value, onChange, placeholder, info, disabled = false }) {
  return (
    <TextField className="field" value={value} isDisabled={disabled} onChange={(nextValue) => onChange(name, nextValue)}>
      <FieldLabel label={label} info={info} />
      <Input className="field-input" placeholder={placeholder} />
    </TextField>
  );
}

function DatePickerField({ label, name, value, onChange, placeholder, info, disabled = false }) {
  const dateValue = toCalendarDate(value);

  return (
    <DatePicker
      className="field date-picker-field"
      value={dateValue}
      isDisabled={disabled}
      onChange={(nextValue) => onChange(name, fromCalendarDate(nextValue))}
    >
      <FieldLabel label={label} info={info} />
      <Group className="date-group">
        <span className={`date-display ${value ? '' : 'is-placeholder'}`}>
          {formatFullDate(value) || placeholder}
        </span>
        <Button className="date-button" aria-label={`Choose ${label}`}>
          <CalendarIcon />
        </Button>
      </Group>
      <Popover className="calendar-popover">
        <Dialog className="calendar-dialog">
          <Calendar className="calendar">
            <header className="calendar-header">
              <Button className="calendar-nav" slot="previous" aria-label="Previous month">
                <ChevronLeftIcon />
              </Button>
              <Heading className="calendar-heading" />
              <Button className="calendar-nav" slot="next" aria-label="Next month">
                <ChevronRightIcon />
              </Button>
            </header>
            <CalendarGrid className="calendar-grid">
              <CalendarGridHeader>
                {(day) => <CalendarHeaderCell className="calendar-header-cell">{day}</CalendarHeaderCell>}
              </CalendarGridHeader>
              <CalendarGridBody>
                {(date) => <CalendarCell className="calendar-cell" date={date} />}
              </CalendarGridBody>
            </CalendarGrid>
          </Calendar>
        </Dialog>
      </Popover>
    </DatePicker>
  );
}

function TextAreaField({ label, name, value, onChange }) {
  return (
    <TextField className="field wide-field" value={value} onChange={(nextValue) => onChange(name, nextValue)}>
      <FieldLabel label={label} />
      <TextArea className="field-input text-area" rows={4} />
    </TextField>
  );
}

function SelectField({ label, name, value, options: fieldOptions, onChange, info, disabled = false }) {
  const selectedKey = value ?? '';

  return (
    <Select
      className="field select-field"
      selectedKey={selectedKey}
      isDisabled={disabled}
      onSelectionChange={(key) => onChange(name, String(key))}
    >
      <FieldLabel label={label} info={info} />
      <Button className="select-button">
        <SelectValue />
        <ChevronDownIcon />
      </Button>
      <Popover className="select-popover">
        <ListBox className="select-list">
          {fieldOptions.map((option) => (
            <ListBoxItem className="select-option" id={option.value} key={option.value} textValue={option.label}>
              {option.label}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </Select>
  );
}

function FieldLabel({ label, info }) {
  return (
    <div className="label-row">
      <Label className="field-label">{label}</Label>
      {info ? <InfoButton copy={info} /> : null}
    </div>
  );
}

function InfoButton({ copy }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <span
      className="info-wrapper"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocus={() => setIsOpen(true)}
      onBlur={() => setIsOpen(false)}
    >
      <Button className="info-button" aria-label={copy} aria-expanded={isOpen} onPress={() => setIsOpen((current) => !current)}>
        i
      </Button>
      {isOpen ? (
        <span className="tooltip" role="tooltip">
          {copy}
        </span>
      ) : null}
    </span>
  );
}

function RecommendationCard({ card }) {
  return (
    <Radio className="rec-card option-card" value={card.id}>
      <div className="item-title rec-title">
        <strong>{card.site} / {card.month}</strong>
        <span className="rec-header-actions">
          <span className="pill info">{card.status}</span>
          <span className="rec-select" aria-hidden="true">
            <span className="rec-radio" />
          </span>
        </span>
      </div>
      <div className="rec-meta">
        <div className="stat">
          <span>Precision</span>
          <strong>{card.precision}</strong>
        </div>
        <div className="stat">
          <span>Confidence</span>
          <strong>{card.confidence}</strong>
        </div>
        <div className="stat">
          <span>Valid until</span>
          <strong>{card.expires}</strong>
        </div>
        <div className="stat">
          <span>Commitment</span>
          <strong>No capacity hold</strong>
        </div>
      </div>
      {card.caveatBadges.length ? (
        <div className="badge-row">
          {card.caveatBadges.map((badge) => (
            <span className="caveat-badge" key={badge}>
              {badge}
            </span>
          ))}
        </div>
      ) : null}
      <p>{card.rationale}</p>
      <p className="rec-support">
        <strong>Data used:</strong> {card.dataSourcesUsed.join(', ')}
      </p>
      <p className="rec-support">
        <strong>Recheck if:</strong> {card.recheckTriggers.join(', ')}
      </p>
    </Radio>
  );
}

function evaluate(data) {
  const checks = [];
  const trace = [];
  const triage = [];
  const warnings = [];
  const start = parseFullDate(data.opportunityStartDate);
  const gateDate = addMonths(today, 4);
  const snapshotDate = parseFullDate(data.snapshotDate) || parseFullDate('07-Jul-2026');
  const expiryDate = addBusinessDays(snapshotDate, expiryBusinessDays);
  const expired = expiryDate < today;

  if (!start) {
    checks.push(check('bad', 'Opportunity Start Date missing', 'Blueprint requires Opportunity Start Date before calculating options.'));
    trace.push(rule('fail', 'Opportunity Start Date known', 'Missing mandatory timing date.'));
    triage.push('missing_opportunity_start_date');
  } else {
    checks.push(check('good', 'Opportunity Start Date present', `${formatFullDate(data.opportunityStartDate)} is used as the primary >4 months rule date.`));
    if (start <= gateDate) {
      checks.push(check('bad', 'Not >4 months out', 'Start date is too soon for the self-serve path.'));
      trace.push(rule('fail', '>4 months out', 'Opportunity Start Date must be more than 4 months out.'));
      triage.push('start_date_inside_mvp1_window');
    } else {
      checks.push(check('good', 'More than four months out', 'Eligible to continue to rules engine.'));
      trace.push(rule('pass', '>4 months out', 'Opportunity Start Date is more than 4 months out.'));
    }
  }

  const configMissing = data.configurationComplete !== 'complete' || !data.studyType1 || !data.studyType2 || !data.species;
  if (configMissing) {
    checks.push(check('bad', 'Configuration incomplete', 'Required SFDC/RFP/Study fields need completion or standardization.'));
    trace.push(rule('fail', 'Configuration completeness', 'Required configuration metadata is missing or ambiguous.'));
    triage.push('missing_configuration_metadata');
  } else {
    checks.push(check('good', 'Configuration present', 'Required study configuration fields are available.'));
    trace.push(rule('pass', 'Configuration completeness', 'Required SFDC/RFP/Study fields are present.'));
  }

  if (data.dateMeaning === 'unclear' || data.dateMeaning === 'submission' || data.dateMeaning === 'budgetary_quote') {
    checks.push(check('warn', 'Date meaning needs review', 'Requested timing may not mean in-life start.'));
    trace.push(rule('warning', 'Date semantics', 'Date meaning should be clarified before customer-facing language.'));
    warnings.push('date_semantics_ambiguous');
  } else if (data.dateMeaning === 'labsci') {
    checks.push(check('warn', 'LabSci date meaning', 'Requested timing may refer to method work rather than in vivo start.'));
    warnings.push('date_is_labsci_or_method_start');
  } else {
    checks.push(check('good', 'Date meaning clear', 'Timing anchor is interpreted as in-life / in vivo start.'));
  }

  if (data.timingPrecision === 'exact') {
    checks.push(check('warn', 'Specific date requested', 'Exact dates require stronger validation than month-of guidance.'));
    trace.push(rule('warning', 'Timing precision', 'Specific date request should off-ramp or receive Scheduling validation.'));
    triage.push('specific_date_requested');
  } else {
    checks.push(check('good', 'Precision fits', 'General, quarter, or month-of timing can be handled as a Commercial recommendation.'));
  }

  if (data.testMaterial === 'unknown') {
    checks.push(check('warn', 'Test material unknown', 'Material availability should be clarified or carried as an assumption.'));
    warnings.push('test_material_unknown');
  } else if (data.testMaterial === 'future') {
    checks.push(check('warn', 'Future test material', `Material availability depends on ${formatFullDate(data.testMaterialDate) || 'a future date'}.`));
    warnings.push('test_material_future');
  } else {
    checks.push(check('good', 'Test material available', 'No material timing blocker captured.'));
  }

  if (data.labsciRequired !== 'none' && data.labsciTiming !== 'known') {
    checks.push(check('warn', 'LabSci dependency unresolved', 'LabSci timing should be checked before stronger commitment language.'));
    trace.push(rule('warning', 'LabSci dependency', 'Method or bioanalysis timing is not fully validated.'));
    warnings.push('labsci_dependency_unresolved');
  } else {
    checks.push(check('good', 'LabSci dependency acceptable', 'No unresolved LabSci timing blocker for this proposal window.'));
  }

  const reportingResult = reportingSendEvaluation(data);
  checks.push(reportingResult.check);
  trace.push(reportingResult.trace);
  if (reportingResult.warning) warnings.push(reportingResult.warning);
  if (reportingResult.triage) triage.push(reportingResult.triage);

  if (expired) {
    trace.push(rule('fail', 'Offer validity', 'Snapshot-based recommendation has expired and must be recalculated.'));
    triage.push('offer_expired');
  } else {
    trace.push(rule('pass', 'Offer validity', `Recommendation valid until ${formatDate(expiryDate)} unless scope changes.`));
  }

  const siteResult = siteEvaluation(data);
  checks.push(siteResult.check);
  trace.push(siteResult.trace);
  if (siteResult.triage) triage.push(siteResult.triage);

  if (data.userCannotResolve) {
    triage.push('user_cannot_resolve_options');
  }

  const fatal = checks.some((item) => item.level === 'bad') || expired;
  const commercialPosture = commercialPostureFor(data.opportunityStage);
  const needsScheduling = triage.includes('specific_date_requested')
    || triage.includes('start_date_inside_mvp1_window')
    || triage.includes('reporting_send_review_required')
    || commercialPosture === 'awarded';
  const outcomeResult = decideOutcome({ fatal, needsScheduling, triage, warnings, data });
  const recommendations = buildRecommendations(data, siteResult, fatal, expiryDate, warnings, outcomeResult);
  const statusKey = statusKeyFor({ triage, warnings, outcome: outcomeResult });

  return {
    checks,
    trace,
    triage: [...new Set(triage)],
    warnings: [...new Set(warnings)],
    outcome: outcomeResult,
    recommendations,
    expiryDate,
    statusKey
  };
}

function reportingSendEvaluation(data) {
  const dependency = data.reportingSendDependency || 'none';
  const targetDate = formatFullDate(data.reportingSendTargetDate);
  const targetDateMissing = reportingSendRequiresTargetDate(dependency) && !targetDate;

  if (dependency === 'unknown') {
    return {
      check: check('warn', 'Reporting/SEND dependency unknown', 'Reporting or SEND impact should be clarified before stronger proposal language.'),
      trace: rule('warning', 'Reporting/SEND dependency', 'Reporting/SEND dependency is unknown and should be checked.'),
      warning: 'reporting_send_dependency_unknown',
      triage: 'reporting_send_review_required'
    };
  }

  if (targetDateMissing) {
    return {
      check: check('warn', 'Reporting/SEND target date missing', 'Capture the customer-facing report, SEND, or submission target before stronger proposal language.'),
      trace: rule('warning', 'Reporting/SEND dependency', 'Reporting/SEND is required, but the dependency target date is missing.'),
      warning: 'reporting_send_target_date_missing',
      triage: 'reporting_send_review_required'
    };
  }

  if (dependency === 'reporting_review') {
    return {
      check: check('warn', 'Reporting/SEND review required', `Reporting or SEND review is tied to ${targetDate} and can be flagged without creating an operational schedule.`),
      trace: rule('warning', 'Reporting/SEND dependency', `Commercial should validate reporting/SEND assumptions for ${targetDate} before customer-facing timing language.`),
      warning: 'reporting_send_review_required',
      triage: 'reporting_send_review_required'
    };
  }

  if (dependency === 'send_required') {
    return {
      check: check('good', 'Reporting/SEND dependency captured', `SEND requirement is visible as a proposal caveat through ${targetDate}.`),
      trace: rule('pass', 'Reporting/SEND dependency', `SEND target date ${targetDate} is captured separately from site timing and capacity.`),
      warning: null,
      triage: null
    };
  }

  if (dependency === 'standard') {
    return {
      check: check('good', 'Reporting/SEND dependency checked', 'Standard reporting/SEND path is captured.'),
      trace: rule('pass', 'Reporting/SEND dependency', 'Standard reporting/SEND expectation is captured.'),
      warning: null,
      triage: null
    };
  }

  return {
    check: check('good', 'Reporting/SEND dependency checked', 'No reporting or SEND timing dependency captured.'),
    trace: rule('pass', 'Reporting/SEND dependency', 'No reporting/SEND dependency affects the proposal window.'),
    warning: null,
    triage: null
  };
}

function siteEvaluation(data) {
  if (data.siteFlexibility === 'any') {
    return {
      check: check('good', 'Broad site search enabled', 'Any qualified site can be searched for feasible timing.'),
      trace: rule('pass', 'Site Flexibility', 'No single preferred site is required. Recommend qualified site/month options.'),
      triage: null
    };
  }

  const preferred = data.preferredSite === 'Any qualified site' ? 'Mattawan' : data.preferredSite;
  const site = siteCapabilities[preferred];
  if (!site) {
    return {
      check: check('warn', 'Site flexibility broad', 'Any qualified site can be searched for fastest feasible timing.'),
      trace: rule('warning', 'Site Capability', 'No single selected site; recommendations should compare qualified sites.'),
      triage: null
    };
  }

  const supports = supportsRequest(site, data);
  if (!supports && data.siteFlexibility === 'specific') {
    return {
      check: check('bad', 'Specific site mismatch', `${preferred} does not support the requested configuration in mock data.`),
      trace: rule('fail', 'Site Capability', 'Specific selected site does not support the study/species combination.'),
      triage: 'site_capability_mismatch'
    };
  }

  if (!supports) {
    return {
      check: check('warn', 'Preferred site mismatch', 'Preferred site may not fit, but flexible site search can continue.'),
      trace: rule('warning', 'Site Capability', 'Preferred site mismatch; alternate qualified sites can be recommended.'),
      triage: null
    };
  }

  return {
    check: check('good', 'Site capability supported', `${preferred} supports the requested configuration in mock data.`),
    trace: rule('pass', 'Site Capability', 'Selected/preferred site supports requested study configuration.'),
    triage: null
  };
}

function decideOutcome({ fatal, needsScheduling, triage, warnings, data }) {
  if (triage.includes('offer_expired')) {
    return outcome('bad', 'Expired: recheck required', 'The prior site/month recommendation must be recalculated before customer communication.', 'expired_recheck_required');
  }
  if (triage.includes('missing_opportunity_start_date')) {
    return outcome('warn', 'Not enough information', 'Need Opportunity Start Date or a business-approved placeholder before calculating options.', 'not_enough_information');
  }
  if (triage.includes('start_date_inside_mvp1_window')) {
    return outcome('bad', 'Needs Central Scheduling', 'This inquiry is not >4 months out and requires Central Scheduling assistance.', 'not_in_mvp_scope', 'needs_central_scheduling');
  }
  if (triage.includes('site_capability_mismatch')) {
    return outcome('bad', 'Needs Central Scheduling', 'The specific site does not support this configuration. Modify site or escalate capabilities.', 'not_in_mvp_scope', 'needs_central_scheduling');
  }
  if (data.userCannotResolve) {
    return outcome('bad', 'Needs validation', 'Off-ramp required. Send the packet and rule trace.', 'needs_validation');
  }
  if (triage.includes('reporting_send_review_required')) {
    return outcome('warn', 'Needs Reporting/SEND validation', 'The recommendation can remain a proposal window, but reporting/SEND assumptions need validation before stronger customer language.', 'needs_validation');
  }
  if (needsScheduling) {
    return outcome('warn', 'Needs validation', 'A specific date, awarded state, or execution-level request needs stronger Scheduling validation.', 'needs_validation');
  }
  if (fatal) {
    return outcome('warn', 'Not enough information', 'Complete or standardize the missing SFDC/RFP/Study inputs before recommendation.', 'not_enough_information');
  }
  if (warnings.length > 0) {
    return outcome('warn', 'Needs validation', 'Commercial can use the recommendation as a proposal window once the visible caveats are reviewed.', 'needs_validation');
  }
  return outcome('good', 'Eligible to propose', 'Commercial can share these site/month options as proposal windows based on the current snapshot, until expiry.', 'eligible_to_propose');
}

function buildRecommendations(data, siteResult, fatal, expiryDate, warnings, outcomeResult) {
  if (fatal) return [];

  const month = monthLabelFromFullDate(data.opportunityStartDate) || 'TBD';
  const preferred = data.preferredSite === 'Any qualified site' ? 'Mattawan' : data.preferredSite;
  const confidence = warnings.length > 1 ? 'LOW' : warnings.length === 1 ? 'MEDIUM' : 'HIGH';
  const caveatBadges = dependencyBadgesFor(data, warnings);
  const dataSourcesUsed = dataSourcesUsedFor(data);
  const recheckTriggers = recheckTriggersFor(data);
  const validationStatus = warnings.length ? 'Needs validation' : siteResult.check.level === 'good' ? 'Preferred option' : 'Needs review';
  const idealCase = outcomeResult.code === 'eligible_to_propose' && data.siteFlexibility !== 'specific';
  const targetCount = idealCase ? 3 : data.siteFlexibility === 'specific' ? 1 : 2;
  const candidateSites = candidateSitesFor(data, preferred, targetCount);

  return candidateSites.map((site, index) => {
    const shiftedMonth = index === 0 ? month : shiftMonthLabel(month, data.siteFlexibility === 'fastest' && index === 1 ? -1 : index);
    const status = index === 0 ? validationStatus : warnings.length ? 'Needs validation' : index === 1 ? 'Alternate option' : 'Additional option';

    return {
      id: `${site}-${shiftedMonth}-${index}`.replaceAll(' ', '-'),
      site,
      month: shiftedMonth,
      precision: data.timingPrecision === 'exact' ? 'Specific date requested - validate' : precisionLabel(data.timingPrecision),
      confidence: index === 0 ? confidence : warnings.length ? 'MEDIUM' : 'HIGH',
      rationale: index === 0
        ? 'Matches current Commercial snapshot as a proposal window. No capacity hold is created.'
        : 'Alternate qualified site shown to make the site-flexibility tradeoff explicit. No capacity hold is created.',
      status,
      dataSourcesUsed,
      caveatBadges,
      recheckTriggers,
      expires: formatDate(expiryDate)
    };
  });
}

function candidateSitesFor(data, preferred, targetCount) {
  const allSites = Object.keys(siteCapabilities);
  const supported = allSites.filter((siteName) => supportsRequest(siteCapabilities[siteName], data));
  const preferredFirst = [
    preferred,
    ...supported.filter((siteName) => siteName !== preferred),
    ...allSites.filter((siteName) => siteName !== preferred && !supported.includes(siteName))
  ];

  return [...new Set(preferredFirst)].slice(0, targetCount);
}

function supportsRequest(site, data) {
  return (data.species === 'Not Applicable' || site.species.includes(data.species)) && site.studyTypes.includes(data.studyType2);
}

function packetAssumptions(data) {
  const assumptions = [
    'Snapshot-based recommendation, no capacity hold',
    `Date meaning: ${data.dateMeaning.replaceAll('_', ' ')}`,
    `Site flexibility: ${data.siteFlexibility.replaceAll('_', ' ')}`,
    `Test material: ${data.testMaterial}`,
    `LabSci: ${data.labsciRequired.replaceAll('_', ' ')}`,
    `Reporting/SEND: ${reportingSendLabel(data.reportingSendDependency)}`
  ];

  if (reportingSendRequiresTargetDate(data.reportingSendDependency)) {
    assumptions.push(`Reporting/SEND target date: ${formatFullDate(data.reportingSendTargetDate) || 'missing'}`);
  }

  return assumptions;
}

function statusKeyFor({ triage, warnings, outcome }) {
  if (triage.includes('offer_expired')) return 'expired';
  if (triage.includes('user_cannot_resolve_options')) return 'specific';
  if (triage.includes('start_date_inside_mvp1_window') || triage.includes('specific_date_requested')) return 'specific';
  if (triage.includes('missing_opportunity_start_date') || triage.includes('missing_configuration_metadata')) return 'missing';
  if (warnings.includes('date_semantics_ambiguous') || warnings.includes('test_material_unknown')) return 'missing';
  if (
    warnings.includes('labsci_dependency_unresolved')
    || warnings.includes('date_is_labsci_or_method_start')
    || warnings.includes('reporting_send_review_required')
    || warnings.includes('reporting_send_target_date_missing')
    || warnings.includes('reporting_send_dependency_unknown')
  ) return 'labsci';
  if (outcome.code === 'eligible_to_propose') return 'happy';
  return 'missing';
}

function dependencyBadgesFor(data, warnings) {
  const badges = [];
  if (data.labsciRequired !== 'none') badges.push('LabSci dependency');
  if (data.reportingSendDependency === 'send_required') badges.push('Reporting/SEND dependency');
  if (data.reportingSendDependency === 'reporting_review' || data.reportingSendDependency === 'unknown') {
    badges.push('Reporting/SEND review');
  }
  if (warnings.includes('reporting_send_target_date_missing')) badges.push('Missing Reporting/SEND date');
  if (data.timingPrecision === 'exact') badges.push('Specific date requested');
  if (data.testMaterial === 'future' || data.testMaterial === 'unknown') badges.push('Test article risk');
  if (data.configuratorDepth === 'complex' || data.configurationComplete === 'ambiguous') badges.push('Custom configuration');
  if (warnings.includes('date_semantics_ambiguous')) badges.push('Timing ambiguity');
  return [...new Set(badges)];
}

function dataSourcesUsedFor(data) {
  const sources = ['SFDC Opportunity/RFP fields', 'Lead-time snapshot', 'Site capability reference'];
  if (data.labsciRequired !== 'none') sources.push('LabSci dependency flag');
  if (data.reportingSendDependency && data.reportingSendDependency !== 'none') sources.push('Reporting/SEND dependency flag');
  if (reportingSendRequiresTargetDate(data.reportingSendDependency) && formatFullDate(data.reportingSendTargetDate)) {
    sources.push('Reporting/SEND target date');
  }
  return sources;
}

function recheckTriggersFor(data) {
  const triggers = ['SOW delay', 'Scope/configuration change', 'Site preference change', 'Client response after expiry'];
  if (data.testMaterial === 'future' || data.testMaterial === 'unknown') triggers.push('Test article delay');
  if (data.labsciRequired !== 'none') triggers.push('LabSci timing change');
  if (data.reportingSendDependency && data.reportingSendDependency !== 'none') triggers.push('Reporting/SEND change or review');
  if (data.timingPrecision === 'exact') triggers.push('Specific date requested');
  return [...new Set(triggers)];
}

function normalizeData(data) {
  return {
    ...scenarios.happy,
    ...data,
    userCannotResolve: Boolean(data.userCannotResolve)
  };
}

function coerceRequestedTiming(value, precision) {
  if (precision === 'general') return '';
  if (precision === 'quarter') return value && /q[1-4]/i.test(value) ? value : '2027 Q1';
  if (precision === 'exact') return formatFullDate(value) || '15-Feb-2027';
  return monthLabelFromFullDate(value) || monthLabelFromKey(value) || 'Feb-2027';
}

function rfpTimingProps(precision) {
  if (precision === 'general') {
    return {
      label: 'RFP Timing Context',
      placeholder: 'General timing only',
      info: 'General timing only. No date is required for the RFP context field.'
    };
  }

  if (precision === 'quarter') {
    return {
      label: 'RFP Requested Quarter',
      placeholder: '2027 Q1',
      info: 'Quarter guidance is less precise than the Opportunity Start Date used by the >4 months rule.'
    };
  }

  if (precision === 'exact') {
    return {
      label: 'RFP Requested Date',
      placeholder: 'DD-MMM-YYYY',
      info: 'Specific dates imply stronger validation than month-of guidance.'
    };
  }

  return {
    label: 'RFP Requested Month',
    placeholder: 'Feb-2027',
    info: 'Month-of timing fits the proposal-window check. Opportunity Start Date remains the primary timing date.'
  };
}

function reportingSendLabel(value) {
  const labels = {
    none: 'No Reporting/SEND dependency',
    standard: 'Standard Reporting/SEND expected',
    send_required: 'SEND package required',
    reporting_review: 'Reporting/SEND review required',
    unknown: 'Unknown / needs check'
  };
  return labels[value] || 'Unknown / needs check';
}

function reportingSendRequiresTargetDate(value) {
  return value === 'send_required' || value === 'reporting_review';
}

function statusTone(statusKey) {
  if (statusKey === 'happy') return 'good';
  if (statusKey === 'specific' || statusKey === 'expired') return 'bad';
  return 'warn';
}

function precisionLabel(value) {
  const labels = {
    general: 'General lead time',
    quarter: 'Quarter guidance',
    month: 'Month-of timing',
    exact: 'Specific date'
  };
  return labels[value] || value;
}

function reasonCodeLabel(code) {
  return code === 'none' ? 'none' : code.toUpperCase();
}

function check(level, title, copy) {
  return { level, title, copy };
}

function rule(status, name, copy) {
  const level = status === 'pass' ? 'good' : status === 'warning' ? 'warn' : 'bad';
  return { level, status, rule: name, copy };
}

function outcome(level, title, copy, code, label = code.replaceAll('_', ' ')) {
  return { level, title, copy, code, label };
}

function commercialPostureFor(stage) {
  const postureByStage = {
    Target: 'early',
    Qualify: 'early',
    'Proposal & Price': 'budgetary',
    Budgetary: 'budgetary',
    Negotiate: 'ready',
    'Forecast & commit': 'ready',
    'Closed Won': 'awarded'
  };
  return postureByStage[stage] || 'planning';
}

function addMonths(date, months) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

function addBusinessDays(date, days) {
  const next = new Date(date);
  let added = 0;
  while (added < days) {
    next.setDate(next.getDate() + 1);
    const day = next.getDay();
    if (day !== 0 && day !== 6) added += 1;
  }
  return next;
}

function formatDate(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '';
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = monthNames[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  return `${day}-${month}-${year}`;
}

function formatFullDate(value) {
  const date = parseFullDate(value);
  return date ? formatDate(date) : '';
}

function toCalendarDate(value) {
  const date = parseFullDate(value);
  if (!date) return null;
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return parseDate(`${year}-${month}-${day}`);
}

function fromCalendarDate(value) {
  if (!value) return '';
  const day = String(value.day).padStart(2, '0');
  const month = monthNames[value.month - 1];
  return `${day}-${month}-${value.year}`;
}

function parseFullDate(value) {
  if (!value) return null;
  const trimmed = String(value).trim();
  const iso = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) {
    const [, year, month, day] = iso;
    return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), 12));
  }

  const display = trimmed.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/);
  if (!display) return null;
  const [, day, month, year] = display;
  const monthIndex = monthLookup[month.toLowerCase()];
  if (monthIndex === undefined) return null;
  return new Date(Date.UTC(Number(year), monthIndex, Number(day), 12));
}

function monthLabelFromFullDate(value) {
  const date = parseFullDate(value);
  if (!date) return '';
  return `${monthNames[date.getUTCMonth()]}-${date.getUTCFullYear()}`;
}

function monthLabelFromKey(value) {
  const match = String(value || '').match(/^(\d{4})-(\d{2})$/);
  if (!match) return '';
  const [, year, month] = match;
  return `${monthNames[Number(month) - 1]}-${year}`;
}

function shiftMonthLabel(monthLabel, delta) {
  if (!monthLabel || monthLabel === 'TBD') return 'TBD';
  const match = String(monthLabel).match(/^([A-Za-z]{3})-(\d{4})$/);
  if (!match) return monthLabel;
  const [, month, year] = match;
  const monthIndex = monthLookup[month.toLowerCase()];
  if (monthIndex === undefined) return monthLabel;
  const date = new Date(Date.UTC(Number(year), monthIndex, 15, 12));
  date.setMonth(date.getUTCMonth() + delta);
  return `${monthNames[date.getUTCMonth()]}-${date.getUTCFullYear()}`;
}

function toOption(value) {
  return { value, label: value };
}

function toOptionPair([value, label]) {
  return { value, label };
}

function ArrowRightIcon() {
  return (
    <svg className="button-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg className="control-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="control-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <path d="M3 10h18" />
      <path d="M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg className="control-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg className="control-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg className="panel-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M14 4h6v6" />
      <path d="M10 14 20 4" />
      <path d="M20 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg className="panel-icon warning-icon" viewBox="0 0 24 24" role="img" aria-label="Important context" focusable="false">
      <path d="M12 3 2 21h20L12 3z" />
      <path d="M12 9v5" />
      <path d="M12 17h.01" />
    </svg>
  );
}
