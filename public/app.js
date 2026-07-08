const today = new Date('2026-07-07T12:00:00Z');
const expiryBusinessDays = 5;

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
    opportunityStartDate: '2027-02-15',
    rfpRequestedStartDate: '2027-02-15',
    intentMaturity: 'planning',
    timingPrecision: 'month',
    dateMeaning: 'in_vivo',
    snapshotDate: '2026-07-07',
    studyType1: 'Toxicology',
    studyType2: 'General tox',
    species: 'rat',
    route: 'Oral gavage',
    configurationComplete: 'complete',
    configuratorDepth: 'configured',
    preferredSite: 'Mattawan',
    siteFlexibility: 'preferred',
    testMaterial: 'available',
    testMaterialDate: '2026-11-01',
    labsciRequired: 'none',
    labsciTiming: 'not_applicable',
    contextNotes: 'Customer prefers Mattawan but is open to other North America sites if timing improves. No exact date promise has been made.',
    userCannotResolve: false
  },
  missing: {
    opportunityId: 'OPP-700600',
    opportunityStage: 'Proposal & Price',
    opportunityStartDate: '',
    rfpRequestedStartDate: '',
    intentMaturity: 'planning',
    timingPrecision: 'month',
    dateMeaning: 'unclear',
    snapshotDate: '2026-07-07',
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
    contextNotes: 'RFP has partial information. Customer timing and species are not yet clear.',
    userCannotResolve: false
  },
  specific: {
    opportunityId: 'OPP-419206',
    opportunityStage: 'Negotiate',
    opportunityStartDate: '2026-09-15',
    rfpRequestedStartDate: '2026-09-15',
    intentMaturity: 'ready',
    timingPrecision: 'exact',
    dateMeaning: 'in_vivo',
    snapshotDate: '2026-07-07',
    studyType1: 'Toxicology',
    studyType2: 'General tox',
    species: 'NHP',
    route: 'IV infusion',
    configurationComplete: 'complete',
    configuratorDepth: 'complex',
    preferredSite: 'Mattawan',
    siteFlexibility: 'specific',
    testMaterial: 'future',
    testMaterialDate: '2026-08-28',
    labsciRequired: 'bioanalysis',
    labsciTiming: 'unknown',
    contextNotes: 'Customer asked for a specific September 15 in-life start. This should not be promised from snapshot data.',
    userCannotResolve: false
  },
  labsci: {
    opportunityId: 'OPP-397025',
    opportunityStage: 'Forecast & commit',
    opportunityStartDate: '2027-01-20',
    rfpRequestedStartDate: '2027-01-20',
    intentMaturity: 'ready',
    timingPrecision: 'month',
    dateMeaning: 'labsci',
    snapshotDate: '2026-07-07',
    studyType1: 'Toxicology',
    studyType2: 'General tox',
    species: 'dog',
    route: 'Oral gavage',
    configurationComplete: 'complete',
    configuratorDepth: 'configured',
    preferredSite: 'Any qualified site',
    siteFlexibility: 'any',
    testMaterial: 'future',
    testMaterialDate: '2026-11-15',
    labsciRequired: 'method_validation',
    labsciTiming: 'unknown',
    contextNotes: 'Two timelines may run together: method validation and in vivo. Commercial needs a caveated month recommendation.',
    userCannotResolve: false
  },
  expired: {
    opportunityId: 'OPP-398891',
    opportunityStage: 'Closed Won',
    opportunityStartDate: '2027-02-01',
    rfpRequestedStartDate: '2027-02-01',
    intentMaturity: 'awarded',
    timingPrecision: 'month',
    dateMeaning: 'in_vivo',
    snapshotDate: '2026-06-01',
    studyType1: 'Services',
    studyType2: 'Pathology slide scanning',
    species: 'Not Applicable',
    route: 'Not applicable',
    configurationComplete: 'complete',
    configuratorDepth: 'basic',
    preferredSite: 'Reno',
    siteFlexibility: 'specific',
    testMaterial: 'available',
    testMaterialDate: '2026-08-01',
    labsciRequired: 'none',
    labsciTiming: 'not_applicable',
    contextNotes: 'Previously shared month-of timing has aged out. Recheck before customer communication.',
    userCannotResolve: false
  }
};

const form = document.getElementById('scheduler-form');
const stateTabs = [...document.querySelectorAll('[data-scenario]')];
let selectedRecommendationId = null;
let currentRecommendations = [];

stateTabs.forEach((button) => {
  button.addEventListener('click', () => {
    applyScenario(button.dataset.scenario);
  });
});

form.addEventListener('input', render);
form.addEventListener('change', render);

function applyScenario(name) {
  const scenario = scenarios[name];
  selectedRecommendationId = null;
  Object.entries(scenario).forEach(([key, value]) => {
    const el = document.getElementById(key);
    if (!el) return;
    if (el.type === 'checkbox') {
      el.checked = Boolean(value);
    } else {
      el.value = value;
    }
  });
  render();
}

function values() {
  const data = {};
  new FormData(form).forEach((value, key) => {
    data[key] = value;
  });
  data.userCannotResolve = document.getElementById('userCannotResolve').checked;
  return data;
}

function evaluate(data) {
  const checks = [];
  const trace = [];
  const triage = [];
  const warnings = [];
  const start = data.opportunityStartDate ? new Date(`${data.opportunityStartDate}T12:00:00Z`) : null;
  const gateDate = addMonths(today, 4);
  const expiryDate = addBusinessDays(new Date(`${data.snapshotDate || '2026-07-07'}T12:00:00Z`), expiryBusinessDays);
  const expired = expiryDate < today;

  if (!start) {
    checks.push(check('bad', 'Opportunity Start Date missing', 'Blueprint requires Opportunity Start Date before MVP1 can calculate options.'));
    trace.push(rule('fail', 'Opportunity Start Date known', 'Missing mandatory MVP1 gate date.'));
    triage.push('missing_opportunity_start_date');
  } else {
    checks.push(check('good', 'Opportunity Start Date present', `${data.opportunityStartDate} is used as the MVP1 gate date.`));
    if (start <= gateDate) {
      checks.push(check('bad', 'Inside four-month MVP1 gate', 'Start date is too soon for the MVP1 happy path.'));
      trace.push(rule('fail', 'MVP1 lead-time gate', 'Opportunity Start Date must be more than four months out.'));
      triage.push('start_date_inside_mvp1_window');
    } else {
      checks.push(check('good', 'More than four months out', 'Eligible to continue to rules engine.'));
      trace.push(rule('pass', 'MVP1 lead-time gate', 'Opportunity Start Date is more than four months out.'));
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

  if (data.dateMeaning === 'unclear' || data.dateMeaning === 'submission') {
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
    checks.push(check('good', 'Precision fits MVP1', 'General, quarter, or month-of timing can be handled as a Commercial recommendation.'));
  }

  if (data.testMaterial === 'unknown') {
    checks.push(check('warn', 'Test material unknown', 'Material availability should be clarified or carried as an assumption.'));
    warnings.push('test_material_unknown');
  } else if (data.testMaterial === 'future') {
    checks.push(check('warn', 'Future test material', `Material availability depends on ${data.testMaterialDate || 'a future date'}.`));
    warnings.push('test_material_future');
  } else {
    checks.push(check('good', 'Test material available', 'No material timing blocker captured.'));
  }

  if (data.labsciRequired !== 'none' && data.labsciTiming !== 'known') {
    checks.push(check('warn', 'LabSci dependency unresolved', 'LabSci timing should be checked before stronger commitment language.'));
    trace.push(rule('warning', 'LabSci dependency', 'Method or bioanalysis timing is not fully validated.'));
    warnings.push('labsci_dependency_unresolved');
  } else {
    checks.push(check('good', 'LabSci dependency acceptable', 'No unresolved LabSci timing blocker for MVP1.'));
  }

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
  const needsScheduling = triage.includes('specific_date_requested') || triage.includes('start_date_inside_mvp1_window') || data.intentMaturity === 'awarded';
  const outcome = decideOutcome({ fatal, needsScheduling, triage, warnings, data });
  const recommendations = buildRecommendations(data, siteResult, fatal, expiryDate, warnings);
  const statusKey = statusKeyFor({ triage, warnings, outcome });

  return {
    checks,
    trace,
    triage: [...new Set(triage)],
    warnings: [...new Set(warnings)],
    outcome,
    recommendations,
    expiryDate,
    statusKey
  };
}

function siteEvaluation(data) {
  const preferred = data.preferredSite === 'Any qualified site' ? 'Mattawan' : data.preferredSite;
  const site = siteCapabilities[preferred];
  if (!site) {
    return {
      check: check('warn', 'Site flexibility broad', 'Any qualified site can be searched for fastest feasible timing.'),
      trace: rule('warning', 'Site Capability', 'No single selected site; recommendations should compare qualified sites.'),
      triage: null
    };
  }
  const supports = (data.species === 'Not Applicable' || site.species.includes(data.species)) && site.studyTypes.includes(data.studyType2);
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
    return outcome('bad', 'Offer expired', 'The prior site/month recommendation must be recalculated before customer communication.', 'recalculate_required');
  }
  if (triage.includes('missing_opportunity_start_date')) {
    return outcome('warn', 'Fill missing date or placeholder', 'MVP1 needs Opportunity Start Date or a business-approved placeholder before calculating options.', 'needs_missing_data');
  }
  if (triage.includes('start_date_inside_mvp1_window')) {
    return outcome('bad', 'Off-ramp: start too soon', 'This inquiry is inside the MVP1 lead-time window and requires Central Scheduling assistance.', 'off_ramp_timing');
  }
  if (triage.includes('site_capability_mismatch')) {
    return outcome('bad', 'Off-ramp: capability mismatch', 'The specific site does not support this configuration. Modify site or escalate capabilities.', 'off_ramp_capability');
  }
  if (data.userCannotResolve) {
    return outcome('bad', 'Request Central Scheduling assistance', 'User cannot resolve options with MVP1 rules. Send the packet and rule trace.', 'central_scheduling');
  }
  if (needsScheduling) {
    return outcome('warn', 'Scheduling validation required', 'A specific date, awarded state, or execution-level request needs stronger Scheduling validation.', 'scheduling_validation');
  }
  if (fatal) {
    return outcome('warn', 'Fill missing configuration', 'Complete or standardize the missing SFDC/RFP/Study inputs before recommendation.', 'needs_missing_data');
  }
  if (warnings.length > 0) {
    return outcome('warn', 'Green light with caveats', 'Commercial can share a caveated site/month option, with assumptions and expiry visible.', 'green_light_caveated');
  }
  return outcome('good', 'Green light to say yes', 'Commercial can share this site/month option based on the current snapshot, until expiry.', 'green_light');
}

function buildRecommendations(data, siteResult, fatal, expiryDate, warnings) {
  if (fatal) return [];
  const month = data.opportunityStartDate ? data.opportunityStartDate.slice(0, 7) : 'TBD';
  const preferred = data.preferredSite === 'Any qualified site' ? 'Mattawan' : data.preferredSite;
  const cards = [];
  const confidence = warnings.length > 1 ? 'Medium' : warnings.length === 1 ? 'Medium-high' : 'High';

  cards.push({
    id: '',
    site: preferred,
    month,
    precision: data.timingPrecision === 'exact' ? 'Specific date requested - validate' : precisionLabel(data.timingPrecision),
    confidence,
    rationale: 'Matches current Commercial snapshot. Not reserved. Recheck if customer delays, scope changes, material slips, or site preference narrows.',
    status: siteResult.check.level === 'good' ? 'Preferred option' : 'Needs review'
  });

  if (data.siteFlexibility !== 'specific') {
    const alternate = preferred === 'Mattawan' ? 'Senneville' : 'Mattawan';
    cards.push({
      id: '',
      site: alternate,
      month: shiftMonth(month, data.siteFlexibility === 'fastest' ? -1 : 1),
      precision: 'Month-of timing',
      confidence: 'Medium',
      rationale: 'Alternate qualified site shown to make the site-flexibility tradeoff explicit.',
      status: 'Alternate option'
    });
  }

  cards.forEach((card, index) => {
    card.id = `${card.site}-${card.month}-${index}`.replaceAll(' ', '-');
    card.expires = formatDate(expiryDate);
  });
  return cards;
}

function render() {
  const data = values();
  const evaluation = evaluate(data);
  renderOutcome(evaluation);
  renderStateTabs(evaluation.statusKey);
  renderGate(data);
  renderReadiness(evaluation.checks);
  renderRecommendations(evaluation.recommendations);
  renderTrace(evaluation.trace);
  renderPacket(data, evaluation);
  renderContext(data);
}

function renderOutcome(evaluation) {
  const banner = document.getElementById('outcome-banner');
  const pill = document.getElementById('outcome-pill');
  banner.className = `outcome-banner ${evaluation.outcome.level}`;
  pill.className = `pill ${evaluation.outcome.level}`;
  pill.textContent = evaluation.outcome.code.replaceAll('_', ' ');
  document.getElementById('outcome-title').textContent = evaluation.outcome.title;
  document.getElementById('outcome-copy').textContent = evaluation.outcome.copy;
}

function renderStateTabs(statusKey) {
  stateTabs.forEach((button) => {
    const active = button.dataset.statusKey === statusKey;
    button.classList.toggle('is-active', active);
    button.classList.toggle('good', active && statusKey === 'happy');
    button.classList.toggle('warn', active && (statusKey === 'missing' || statusKey === 'labsci'));
    button.classList.toggle('bad', active && (statusKey === 'specific' || statusKey === 'expired'));
    button.setAttribute('aria-pressed', String(active));
  });
}

function renderGate(data) {
  document.getElementById('gate-date').textContent = data.opportunityStartDate || 'Missing';
  document.getElementById('precision-label').textContent = precisionLabel(data.timingPrecision);
}

function renderReadiness(checks) {
  document.getElementById('readiness-list').innerHTML = checks.map((item) => `
    <div class="check-item">
      <span class="dot ${item.level}"></span>
      <div>
        <div class="item-title"><strong>${item.title}</strong><span class="pill ${item.level}">${labelForLevel(item.level)}</span></div>
        <p>${item.copy}</p>
      </div>
    </div>
  `).join('');
}

function renderRecommendations(cards) {
  const container = document.getElementById('recommendations');
  const selectedState = document.getElementById('selected-recommendation');
  currentRecommendations = cards;
  if (!cards.length) {
    selectedRecommendationId = null;
    container.innerHTML = '<div class="rec-card"><strong>No recommendation generated</strong><p>Complete missing data, modify selections, or off-ramp to Central Scheduling.</p></div>';
    selectedState.textContent = 'No option selected.';
    return;
  }
  if (!cards.some((card) => card.id === selectedRecommendationId)) {
    selectedRecommendationId = cards[0].id;
  }
  const selectedCard = cards.find((card) => card.id === selectedRecommendationId);
  container.innerHTML = cards.map((card) => `
    <button type="button" class="rec-card option-card ${card.id === selectedRecommendationId ? 'selected' : ''}" data-rec-id="${card.id}" aria-pressed="${card.id === selectedRecommendationId}">
      <div class="item-title">
        <strong>${card.site} / ${card.month}</strong>
        <span class="pill ${card.id === selectedRecommendationId ? 'good' : 'info'}">${card.id === selectedRecommendationId ? 'Selected' : card.status}</span>
      </div>
      <div class="rec-meta">
        <div class="stat"><span>Precision</span><strong>${card.precision}</strong></div>
        <div class="stat"><span>Confidence</span><strong>${card.confidence}</strong></div>
        <div class="stat"><span>Valid until</span><strong>${card.expires}</strong></div>
        <div class="stat"><span>Commitment</span><strong>Not reserved</strong></div>
      </div>
      <p>${card.rationale}</p>
    </button>
  `).join('');
  selectedState.innerHTML = `<strong>Selected snapshot option:</strong> ${selectedCard.site} / ${selectedCard.month}. This is a UI state only and does not route, reserve, or commit capacity.`;
  container.querySelectorAll('[data-rec-id]').forEach((button) => {
    button.addEventListener('click', () => {
      selectedRecommendationId = button.dataset.recId;
      renderRecommendations(currentRecommendations);
    });
  });
}

function renderTrace(trace) {
  document.getElementById('rule-trace').innerHTML = trace.map((item) => `
    <div class="trace-item">
      <div class="item-title"><strong>${item.rule}</strong><span class="pill ${item.level}">${item.status.toUpperCase()}</span></div>
      <p>${item.copy}</p>
    </div>
  `).join('');
}

function renderPacket(data, evaluation) {
  const reasons = evaluation.triage.length ? evaluation.triage : ['none'];
  const assumptions = [
    'Snapshot-based recommendation, not capacity reservation',
    `Date meaning: ${data.dateMeaning.replaceAll('_', ' ')}`,
    `Site flexibility: ${data.siteFlexibility.replaceAll('_', ' ')}`,
    `Test material: ${data.testMaterial}`,
    `LabSci: ${data.labsciRequired.replaceAll('_', ' ')}`
  ];

  document.getElementById('triage-packet').innerHTML = `
    <div class="packet-item">
      <strong>Reason codes</strong>
      <p>${reasons.join(', ').replaceAll('_', ' ')}</p>
    </div>
    <div class="packet-item">
      <strong>Assumptions</strong>
      <p>${assumptions.join(' | ')}</p>
    </div>
  `;
}

function renderContext(data) {
  document.getElementById('context-capsule').textContent = data.contextNotes || 'No context notes provided.';
}

function check(level, title, copy) {
  return { level, title, copy };
}

function rule(status, name, copy) {
  const level = status === 'pass' ? 'good' : status === 'warning' ? 'warn' : 'bad';
  return { level, status, rule: name, copy };
}

function outcome(level, title, copy, code) {
  return { level, title, copy, code };
}

function statusKeyFor({ triage, warnings, outcome }) {
  if (triage.includes('offer_expired')) return 'expired';
  if (triage.includes('start_date_inside_mvp1_window') || triage.includes('specific_date_requested')) return 'specific';
  if (warnings.includes('labsci_dependency_unresolved') || warnings.includes('date_is_labsci_or_method_start')) return 'labsci';
  if (triage.includes('missing_opportunity_start_date') || triage.includes('missing_configuration_metadata')) return 'missing';
  if (warnings.includes('date_semantics_ambiguous') || warnings.includes('test_material_unknown')) return 'missing';
  if (outcome.code === 'green_light' || outcome.code === 'green_light_caveated') return 'happy';
  return 'missing';
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

function labelForLevel(level) {
  return level === 'good' ? 'Pass' : level === 'warn' ? 'Review' : 'Fail';
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
  return date.toISOString().slice(0, 10);
}

function shiftMonth(month, delta) {
  if (!month || month === 'TBD') return 'TBD';
  const date = new Date(`${month}-15T12:00:00Z`);
  date.setMonth(date.getMonth() + delta);
  return date.toISOString().slice(0, 7);
}

applyScenario('happy');
