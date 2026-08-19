import {
  addMonths,
  formatDate,
  formatDateTime,
  monthNames,
  parseFullDate,
  parseMonthSelection,
  shiftMonthLabel
} from './dateUtils';

export const mvp1AsOfDate = new Date(2026, 6, 28, 12, 9);

const mvp1EligibleSiteLeadTimes = [
  { site: 'Hertenbosch', monthOffset: 0, updatedDaysAgo: 4 },
  { site: 'Reno', monthOffset: 0, updatedDaysAgo: 10 },
  { site: 'Ashland', monthOffset: 0, updatedDaysAgo: 24 },
  { site: 'Lyon', monthOffset: 1, updatedDaysAgo: 3 },
  { site: 'Senneville', monthOffset: 1, updatedDaysAgo: 12 },
  { site: 'Shrewsbury', monthOffset: 1, updatedDaysAgo: 18 },
  { site: 'Laval', monthOffset: 1, updatedDaysAgo: 31 },
  { site: 'Mattawan', monthOffset: 2, updatedDaysAgo: 7 },
  { site: 'Montreal', monthOffset: 2, updatedDaysAgo: 14 },
  { site: 'Edinburgh', monthOffset: 2, updatedDaysAgo: 22 },
  { site: 'Evreux', monthOffset: 2, updatedDaysAgo: 35 },
  { site: 'Horsham', monthOffset: 3, updatedDaysAgo: 2 },
  { site: 'Kansas City', monthOffset: 3, updatedDaysAgo: 16 },
  { site: 'Portishead', monthOffset: 3, updatedDaysAgo: 27 },
  { site: 'Alderley', monthOffset: 4, updatedDaysAgo: 6 },
  { site: 'Elphinstone', monthOffset: 4, updatedDaysAgo: 25 },
  { site: 'Barcelona', monthOffset: 4, updatedDaysAgo: 34 },
  { site: 'Beerse', monthOffset: 5, updatedDaysAgo: 11 },
  { site: 'Cleveland', monthOffset: 5, updatedDaysAgo: 21 },
  { site: 'Freiburg', monthOffset: 5, updatedDaysAgo: 42 }
];

const mvp1LeadTimeOffsetPattern = [0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6];

export const mvp1AllCrlSites = mvp1EligibleSiteLeadTimes.map((item) => item.site).sort((a, b) => a.localeCompare(b));

export function evaluateMvp1DateOnly(studyStartDate, snapshot) {
  const startDate = parseFullDate(studyStartDate);
  const thresholdDate = addMonths(mvp1AsOfDate, 4);
  const validAsOf = formatDateTime(snapshot.checkedAt);

  if (!startDate) {
    return {
      level: 'warn',
      title: 'Missing information',
      copy: 'MVP1 cannot show eligible sites until the SFDC Study Start Date is populated.',
      validAsOf,
      recommendations: [],
      emptyTitle: 'Missing information',
      emptyCopy: 'Add Study Start Date in the highlighted SFDC field before checking site/month options.',
      offRampReason: 'MISSING_STUDY_START_DATE'
    };
  }

  if (startDate <= thresholdDate) {
    return {
      level: 'bad',
      title: 'Central Scheduling off-ramp',
      copy: `${formatDate(startDate)} is not more than four months out from the current snapshot.`,
      statusTimestamp: formatDate(startDate),
      validAsOf,
      recommendations: buildMvp1SiteRecommendations(startDate, snapshot),
      emptyTitle: 'No self-serve recommendation',
      emptyCopy: 'Requests inside the <4 months threshold should be handled by Central Scheduling.',
      offRampReason: 'START_DATE_WITHIN_4_MONTH_THRESHOLD'
    };
  }

  return {
    level: 'good',
    title: 'Eligible sites',
    copy: 'Refreshed from the separate site lead-time logic. No capacity is reserved by this view.',
    validAsOf,
    recommendations: buildMvp1SiteRecommendations(startDate, snapshot),
    emptyTitle: '',
    emptyCopy: '',
    offRampReason: null
  };
}

export function sortMvp1SiteRecommendations(recommendations) {
  return [...recommendations].sort((a, b) => {
    const availabilityDiff = monthLabelToSortValue(a.availability) - monthLabelToSortValue(b.availability);
    if (availabilityDiff !== 0) return availabilityDiff;
    const updatedDiff = b.lastUpdated.getTime() - a.lastUpdated.getTime();
    if (updatedDiff !== 0) return updatedDiff;
    return a.site.localeCompare(b.site);
  });
}

export function getCompactMvp1EligibleSites(recommendations, selectedSite) {
  const rankedSites = sortMvp1SiteRecommendations(recommendations);
  const visibleSites = rankedSites.slice(0, 5);
  const hasPreferredSite = Boolean(selectedSite && selectedSite !== 'Any');
  const preferredSite = hasPreferredSite ? rankedSites.find((item) => item.site === selectedSite) : null;

  if (!preferredSite || visibleSites.some((item) => item.site === selectedSite)) {
    return visibleSites;
  }

  return [...rankedSites.slice(0, 4), { isPreferredPinGap: true }, preferredSite];
}

function monthLabelToSortValue(monthLabel) {
  const parsed = parseMonthSelection(monthLabel);
  if (!parsed) return Number.MAX_SAFE_INTEGER;
  return parsed.year * 12 + parsed.month;
}

function buildMvp1SiteRecommendations(startDate, snapshot) {
  const targetMonth = `${monthNames[startDate.getUTCMonth()]}-${startDate.getUTCFullYear()}`;
  const checkedAt = snapshot?.checkedAt ?? mvp1AsOfDate;
  const variant = snapshot?.variant ?? 0;
  const shuffledSites = shuffleWithSeed(mvp1EligibleSiteLeadTimes, variant + 1);

  return sortMvp1SiteRecommendations(shuffledSites.map((item, index) => {
    const monthOffset = mvp1LeadTimeOffsetPattern[index % mvp1LeadTimeOffsetPattern.length];
    const adjustedDaysAgo = ((item.updatedDaysAgo + (variant * 5) + (index * 3)) % 49) + 1;
    const lastUpdated = subtractDays(checkedAt, adjustedDaysAgo);
    return {
      site: item.site,
      availability: shiftMonthLabel(targetMonth, monthOffset),
      monthOffset,
      lastUpdated,
      updatedDaysAgo: adjustedDaysAgo,
      freshnessLevel: freshnessLevelFor(adjustedDaysAgo)
    };
  }));
}

function shuffleWithSeed(items, seed) {
  const shuffled = [...items];
  const random = seededRandom(seed);

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

function seededRandom(seed) {
  let value = Math.max(1, Math.floor(seed)) % 2147483647;

  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function subtractDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() - days);
  return next;
}

function freshnessLevelFor(daysAgo) {
  if (daysAgo <= 14) return 'fresh';
  if (daysAgo <= 28) return 'aging';
  return 'stale';
}
