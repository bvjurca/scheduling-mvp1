import { readFileSync, statSync } from 'node:fs';

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
    path: '../public/manual.html',
    minBytes: 4000,
    requiredText: [
      'Stakeholder manual',
      'Blueprint anchor',
      'Snapshot, not promise',
      'Opportunity Start Date'
    ]
  },
  {
    path: '../public/app.js',
    minBytes: 10000,
    requiredText: [
      'Opportunity Start Date known',
      'specific_date_requested',
      'green_light',
      'Snapshot-based recommendation, not capacity reservation'
    ]
  },
  {
    path: '../public/styles.css',
    minBytes: 3000,
    requiredText: [
      '.demo-grid',
      '.wizard',
      '.decision-console',
      '.manual-layout'
    ]
  }
];

for (const check of checks) {
  const filePath = new URL(check.path, import.meta.url);
  const text = readFileSync(filePath, 'utf8');
  const stats = statSync(filePath);
  const missing = check.requiredText.filter((snippet) => !text.includes(snippet));

  if (stats.size < check.minBytes) {
    throw new Error(`${check.path} is unexpectedly small.`);
  }

  if (missing.length > 0) {
    throw new Error(`${check.path} is missing expected text: ${missing.join(', ')}`);
  }
}

console.log('Static site validation passed.');
