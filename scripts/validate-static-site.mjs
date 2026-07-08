import { existsSync, readFileSync, statSync } from 'node:fs';

const removedPublicManual = new URL('../public/manual.html', import.meta.url);

if (existsSync(removedPublicManual)) {
  throw new Error('public/manual.html should not be part of the hosted demo surface.');
}

const checks = [
  {
    path: '../public/index.html',
    minBytes: 8000,
    requiredText: [
      'Scheduling MVP1 (Commercial) - DEMO DATA ONLY',
      'Opportunity Start Date',
      'Primary timing date for MVP1 rules',
      'Decision console',
      'Request details',
      'DD-MMM-YYYY',
      'Additional information',
      'Offramp requested',
      'Recommendations',
      'Last checked',
      'Check results'
    ]
  },
  {
    path: '../public/app.js',
    minBytes: 10000,
    requiredText: [
      'Opportunity Start Date known',
      'specific_date_requested',
      'green_light',
      'Snapshot-based recommendation, not capacity reservation',
      'commercialPostureFor',
      'Selected snapshot option',
      'formatFullDate'
    ]
  },
  {
    path: '../public/styles.css',
    minBytes: 3000,
    requiredText: [
      '.demo-grid',
      '.wizard',
      '.decision-console',
      '.state-tabs',
      '.wizard-actions',
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

console.log('Static site validation passed.');
