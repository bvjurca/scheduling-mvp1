import { existsSync, readFileSync, statSync } from 'node:fs';

const removedPublicManual = new URL('../public/manual.html', import.meta.url);
const removedDistManual = new URL('../dist/manual.html', import.meta.url);

if (existsSync(removedPublicManual)) {
  throw new Error('public/manual.html should not be part of the hosted demo surface.');
}

if (existsSync(removedDistManual)) {
  throw new Error('dist/manual.html should not be part of the hosted demo surface.');
}

const checks = [
  {
    path: '../dist/index.html',
    minBytes: 400,
    requiredText: [
      'DSA Scheduling MVP1 Demo',
      '/assets/'
    ]
  },
  {
    path: '../src/App.jsx',
    minBytes: 30000,
    requiredText: [
      'react-aria-components',
      'Scheduling MVP1 (Commercial) - DEMO DATA ONLY',
      'Opportunity Start Date',
      'Primary timing date for MVP1 rules',
      'Decision console',
      'Request details',
      'DD-MMM-YYYY',
      'Timing precision (OUT OF SCOPE)',
      'Specific date (Off-ramp)',
      'Budgetary/Quote',
      'Reporting/SEND dependency',
      'Reporting/SEND review required',
      'Reporting/SEND target date',
      'Additional information',
      'Open packet in new tab',
      'Important context',
      'Off-ramp required',
      'Recommendations',
      'Last checked',
      'Check results',
      'Opportunity Start Date known',
      'specific_date_requested',
      'eligible_to_propose',
      'reporting_send_review_required',
      'reporting_send_target_date_missing',
      'No capacity hold',
      'Snapshot-based recommendation, no capacity hold',
      'commercialPostureFor',
      'Selected snapshot option',
      'budgetary_quote',
      'formatFullDate',
      'targetCount = idealCase ? 3',
      'TextInputField'
    ]
  },
  {
    path: '../src/styles.css',
    minBytes: 10000,
    requiredText: [
      '.demo-grid',
      '.wizard',
      '.decision-console',
      '.state-tabs',
      '.wizard-actions',
      '.info-button',
      '.select-popover',
      'select[tabindex="-1"]',
      '.select-field > select',
      'clip-path: inset(50%)',
      '.select-option[data-selected]',
      '.checkbox-row[data-selected]',
      '.panel-icon',
      '.support-divider',
      '.support-panel',
      '.title-with-icon',
      '.caveat-badge',
      'appearance: none',
      '.rec-radio',
      '.snapshot-meta'
    ]
  }
];

for (const check of checks) {
  const filePath = new URL(check.path, import.meta.url);
  const stats = statSync(filePath);
  const text = check.binary ? '' : readFileSync(filePath, 'utf8');
  const missing = check.requiredText.filter((snippet) => !text.includes(snippet));

  if (stats.size < check.minBytes) {
    throw new Error(`${check.path} is unexpectedly small.`);
  }

  if (missing.length > 0) {
    throw new Error(`${check.path} is missing expected text: ${missing.join(', ')}`);
  }
}

const appSource = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8');
if (appSource.includes('type="month"') || appSource.includes("type='month'")) {
  throw new Error('Native month inputs should not be used; use React Aria-styled timing controls.');
}

console.log('Static site validation passed.');
