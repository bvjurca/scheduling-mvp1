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
      'Scheduling readiness demo',
      'Opportunity Start Date',
      'Official MVP1 gate from the Blueprint',
      'Decision console',
      'Populate scheduling inputs'
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
      'Selected snapshot option'
    ]
  },
  {
    path: '../public/styles.css',
    minBytes: 3000,
    requiredText: [
      '.demo-grid',
      '.wizard',
      '.decision-console',
      '.state-tab',
      '.option-card',
      '.selection-state'
    ]
  },
  {
    path: '../docs/dsa-scheduling-mvp1-stakeholder-manual.pdf',
    minBytes: 5000,
    binary: true,
    requiredText: []
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
