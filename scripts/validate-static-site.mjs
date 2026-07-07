import { readFileSync, statSync } from 'node:fs';

const indexPath = new URL('../public/index.html', import.meta.url);
const html = readFileSync(indexPath, 'utf8');
const stats = statSync(indexPath);

const requiredText = [
  'DSA Commercial Scheduling MVP1 Stakeholder Proposal',
  'requested start / commercial timing anchor',
  'SFDC Opportunity + RFP intake',
  'Requested Start Date'
];

const missing = requiredText.filter((text) => !html.includes(text));

if (stats.size < 1000) {
  throw new Error('public/index.html is unexpectedly small.');
}

if (missing.length > 0) {
  throw new Error(`public/index.html is missing expected text: ${missing.join(', ')}`);
}

console.log('Static site validation passed.');
