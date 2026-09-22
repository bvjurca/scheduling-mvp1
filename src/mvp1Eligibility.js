import { formatDate, parseFullDate, parseMonthSelection } from './dateUtils';

export const mvp1EligibilityContext = {
  species: 'Mouse',
  studyTypeL1: 'Services - Regulatory Affairs',
  studyTypeL2: 'Regulatory Study Summary (OECD/IUCLID/METI/MHLW)'
};

export const mvp1EligibilityStatuses = ['pass', 'pass_with_warning', 'fail', 'blocked'];

export function evaluateMvp1Eligibility({ studyStartDate, selectedSite, recommendations = [] }) {
  const parsedStudyStartDate = parseFullDate(studyStartDate);
  const selectedRecommendation = recommendations.find((item) => item.site === selectedSite);
  const availableFrom = selectedRecommendation ? availableFromFor(selectedRecommendation.availability) : null;
  const leadTimesPass = Boolean(parsedStudyStartDate && availableFrom && parsedStudyStartDate >= availableFrom);
  const checks = [
    {
      id: 'lead_times',
      label: 'Date',
      operator: 'GREATER_THAN_OR_EQUAL',
      siteValue: availableFrom ? formatDate(availableFrom) : 'No site lead-time snapshot',
      studyValue: parsedStudyStartDate ? formatDate(parsedStudyStartDate) : 'Needs Study Start Date',
      status: leadTimesPass ? 'pass' : 'fail'
    },
    {
      id: 'crl_site',
      label: 'CRL site',
      operator: 'EQUALS',
      siteValue: selectedSite || 'Not provided',
      studyValue: selectedSite || 'Not provided',
      status: selectedSite ? 'pass' : 'skipped'
    },
    {
      id: 'species',
      label: 'Species',
      operator: 'EQUALS',
      siteValue: mvp1EligibilityContext.species,
      studyValue: mvp1EligibilityContext.species,
      status: 'pass'
    },
    {
      id: 'crl_study_type_l1',
      label: 'CRL study type L1',
      operator: 'EQUALS',
      siteValue: mvp1EligibilityContext.studyTypeL1,
      studyValue: mvp1EligibilityContext.studyTypeL1,
      status: 'pass'
    },
    {
      id: 'crl_study_type_l2',
      label: 'CRL study type L2',
      operator: 'EQUALS',
      siteValue: mvp1EligibilityContext.studyTypeL2,
      studyValue: mvp1EligibilityContext.studyTypeL2,
      status: 'pass'
    }
  ];

  const hasFreshnessWarning = Boolean(selectedRecommendation && selectedRecommendation.freshnessLevel !== 'fresh');
  if (leadTimesPass && hasFreshnessWarning) {
    checks[0] = {
      ...checks[0],
      status: 'pass_with_warning'
    };
  }

  if (!leadTimesPass) {
    return {
      status: 'fail',
      label: 'Unavailable',
      summary: !parsedStudyStartDate
        ? 'A Study Start Date is needed to compare against the selected site lead time.'
        : availableFrom
          ? 'The requested date is earlier than the selected site lead time.'
          : 'The selected site has no lead-time date in the current snapshot.',
      checks,
      selectedSite,
      studyStartDate
    };
  }

  if (hasFreshnessWarning) {
    return {
      status: 'pass_with_warning',
      label: 'Available',
      summary: 'The selected site and date are eligible, with a freshness caveat.',
      checks,
      selectedSite,
      studyStartDate
    };
  }

  return {
    status: 'pass',
    label: 'Available',
    summary: 'The selected site and Study Start Date pass the ordered eligibility checks.',
    checks,
    selectedSite,
    studyStartDate
  };
}

function availableFromFor(monthLabel) {
  const parsed = parseMonthSelection(monthLabel);
  if (!parsed) return null;
  return new Date(Date.UTC(parsed.year, parsed.month, 1, 12));
}
