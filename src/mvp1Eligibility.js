import { formatDate, parseFullDate, parseMonthSelection } from './dateUtils';

export const mvp1EligibilityContext = {
  species: 'Mouse',
  studyTypeL1: 'Services - Regulatory Affairs',
  studyTypeL2: 'Regulatory Study Summary (OECD/IUCLID/METI/MHLW)'
};

export function evaluateMvp1Eligibility({ studyStartDate, selectedSite, recommendations = [] }) {
  const parsedStudyStartDate = parseFullDate(studyStartDate);
  const selectedRecommendation = recommendations.find((item) => item.site === selectedSite);

  if (!parsedStudyStartDate || !selectedSite || recommendations.length === 0) {
    return blockedEligibilityResult({
      hasStudyStartDate: Boolean(parsedStudyStartDate),
      hasSelectedSite: Boolean(selectedSite),
      hasRecommendationSnapshot: recommendations.length > 0
    });
  }

  const availableFrom = selectedRecommendation ? availableFromFor(selectedRecommendation.availability) : null;
  const leadTimesPass = Boolean(availableFrom && parsedStudyStartDate >= availableFrom);
  const checks = [
    {
      id: 'lead_times',
      label: 'Lead time',
      operator: 'GREATER_THAN_OR_EQUAL',
      siteValue: availableFrom ? formatDate(availableFrom) : 'No site snapshot',
      studyValue: formatDate(parsedStudyStartDate),
      status: leadTimesPass ? 'pass' : 'fail',
      feedback: leadTimesPass
        ? ''
        : `The selected site is available from ${availableFrom ? formatDate(availableFrom) : 'a later snapshot'}; choose a later Study Start Date or another site.`
    },
    {
      id: 'crl_site',
      label: 'CRL site',
      operator: 'EQUALS',
      siteValue: selectedSite,
      studyValue: selectedSite,
      status: leadTimesPass ? 'pass' : 'skipped',
      feedback: leadTimesPass ? '' : 'Not run because the lead-time check failed.'
    },
    {
      id: 'species',
      label: 'Species',
      operator: 'EQUALS',
      siteValue: mvp1EligibilityContext.species,
      studyValue: mvp1EligibilityContext.species,
      status: leadTimesPass ? 'pass' : 'skipped',
      feedback: leadTimesPass ? '' : 'Not run because the preceding site check did not pass.'
    },
    {
      id: 'crl_study_type_l1',
      label: 'CRL study type L1',
      operator: 'EQUALS',
      siteValue: mvp1EligibilityContext.studyTypeL1,
      studyValue: mvp1EligibilityContext.studyTypeL1,
      status: leadTimesPass ? 'pass' : 'skipped',
      feedback: leadTimesPass ? '' : 'Not run because the preceding study-context check did not pass.'
    },
    {
      id: 'crl_study_type_l2',
      label: 'CRL study type L2',
      operator: 'EQUALS',
      siteValue: mvp1EligibilityContext.studyTypeL2,
      studyValue: mvp1EligibilityContext.studyTypeL2,
      status: leadTimesPass ? 'pass' : 'skipped',
      feedback: leadTimesPass ? '' : 'Not run because the preceding study-context check did not pass.'
    }
  ];

  const hasFreshnessWarning = selectedRecommendation && selectedRecommendation.freshnessLevel !== 'fresh';
  if (leadTimesPass && hasFreshnessWarning) {
    checks[0] = {
      ...checks[0],
      status: 'pass_with_warning',
      feedback: 'The eligibility conditions pass, but the site lead-time signal is not in the freshest band. Recheck before award communication.'
    };
  }

  if (!leadTimesPass) {
    return {
      status: 'fail',
      label: 'Eligibility failed',
      summary: 'Update the selected site or Study Start Date, then run the eligibility check again.',
      checks,
      failureFeedback: checks[0].feedback,
      nextAction: 'Update site and/or date',
      selectedSite,
      studyStartDate
    };
  }

  if (hasFreshnessWarning) {
    return {
      status: 'pass_with_warning',
      label: 'Pass with warning',
      summary: 'The selected site and date pass the ordered checks, with a freshness caveat.',
      checks,
      failureFeedback: '',
      nextAction: 'Recheck before award communication',
      selectedSite,
      studyStartDate
    };
  }

  return {
    status: 'pass',
    label: 'Eligible',
    summary: 'The selected site and Study Start Date pass the ordered eligibility checks.',
    checks,
    failureFeedback: '',
    nextAction: 'Confirm eligibility',
    selectedSite,
    studyStartDate
  };
}

function blockedEligibilityResult({ hasStudyStartDate, hasSelectedSite, hasRecommendationSnapshot }) {
  const missingStudyContext = !hasStudyStartDate || !hasSelectedSite;
  const summary = missingStudyContext
    ? 'Add a Study Start Date and select a CRL Site before checking eligibility.'
    : 'Run Check recommendation to load a current site snapshot before checking eligibility.';
  const checks = [
    {
      id: 'lead_times',
      label: 'Lead time',
      operator: 'GREATER_THAN_OR_EQUAL',
      siteValue: hasSelectedSite ? (hasRecommendationSnapshot ? 'Ready to evaluate' : 'Needs site snapshot') : 'Needs CRL Site',
      studyValue: hasStudyStartDate ? 'Ready to evaluate' : 'Needs Study Start Date',
      status: 'blocked',
      feedback: summary
    }
  ];

  return {
    status: 'blocked',
    label: 'More information needed',
    summary,
    checks,
    failureFeedback: checks[0].feedback,
    nextAction: missingStudyContext ? 'Update site and/or date' : 'Check recommendation'
  };
}

function availableFromFor(monthLabel) {
  const parsed = parseMonthSelection(monthLabel);
  if (!parsed) return null;
  return new Date(Date.UTC(parsed.year, parsed.month, 1, 12));
}
