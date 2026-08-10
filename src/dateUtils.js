import { parseDate } from '@internationalized/date';

export const today = new Date('2026-07-07T12:00:00Z');
export const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const monthLookup = Object.fromEntries(monthNames.map((month, index) => [month.toLowerCase(), index]));

export function addMonths(date, months) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

export function addBusinessDays(date, days) {
  const next = new Date(date);
  let added = 0;
  while (added < days) {
    next.setDate(next.getDate() + 1);
    const day = next.getDay();
    if (day !== 0 && day !== 6) added += 1;
  }
  return next;
}

export function formatDate(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '';
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = monthNames[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  return `${day}-${month}-${year}`;
}

export function formatDateTime(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}-${month}-${year} ${hours}:${minutes}`;
}

export function formatFullDate(value) {
  const date = parseFullDate(value);
  return date ? formatDate(date) : '';
}

export function toCalendarDate(value) {
  const date = parseFullDate(value);
  if (!date) return null;
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return parseDate(`${year}-${month}-${day}`);
}

export function fromCalendarDate(value) {
  if (!value) return '';
  const day = String(value.day).padStart(2, '0');
  const month = monthNames[value.month - 1];
  return `${day}-${month}-${value.year}`;
}

export function parseFullDate(value) {
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

export function monthLabelFromFullDate(value) {
  const date = parseFullDate(value);
  if (!date) return '';
  return `${monthNames[date.getUTCMonth()]}-${date.getUTCFullYear()}`;
}

export function monthLabelFromKey(value) {
  const match = String(value || '').match(/^(\d{4})-(\d{2})$/);
  if (!match) return '';
  const [, year, month] = match;
  return `${monthNames[Number(month) - 1]}-${year}`;
}

export function parseMonthSelection(value) {
  const fullDateMonth = monthLabelFromFullDate(value);
  const normalizedValue = fullDateMonth || monthLabelFromKey(value) || String(value || '').trim();
  const match = normalizedValue.match(/^([A-Za-z]{3})-(\d{4})$/);
  if (!match) return null;
  const [, month, year] = match;
  const monthIndex = monthLookup[month.toLowerCase()];
  if (monthIndex === undefined) return null;
  return { month: monthIndex, year: Number(year) };
}

export function formatMonthSelection(monthIndex, year) {
  return `${monthNames[monthIndex]}-${year}`;
}

export function shiftMonthLabel(monthLabel, delta) {
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
