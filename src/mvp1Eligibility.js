import { formatDate, parseFullDate } from './dateUtils';

export const mvp1EligibilityContext = {
  species: 'Mouse',
  studyTypeL1: 'Services - Regulatory Affairs',
  studyTypeL2: 'Regulatory Study Summary (OECD/IUCLID/METI/MHLW)'
};

export const mvp1EligibilityStatuses = ['pass', 'pass_with_warning', 'fail', 'blocked'];

export function evaluateMvp1Eligibility({ studyStartDate, selectedSite }) {
  const parsedStudyStartDate = parseFullDate(studyStartDate);
  const dateIsAvailable = Boolean(parsedStudyStartDate);
  const checks = [
    {
      id: 'lead_times',
      label: 'Date',
      operator: 'PRESENT',
      siteValue: 'Not applicable',
      studyValue: dateIsAvailable ? formatDate(parsedStudyStartDate) : 'Needs Study Start Date',
      status: dateIsAvailable ? 'pass' : 'fail',
      feedback: dateIsAvailable ? '' : 'Add a Study Start Date before checking eligibility.'
    },
    {
      id: 'crl_site',
      label: 'CRL site',
      operator: 'EQUALS',
      siteValue: selectedSite || 'Not provided',
      studyValue: selectedSite || 'Not provided',
      status: selectedSite ? 'pass' : 'skipped',
      feedback: ''
    },
    {
      id: 'species',
      label: 'Species',
      operator: 'EQUALS',
      siteValue: mvp1EligibilityContext.species,
      studyValue: mvp1EligibilityContext.species,
      status: 'pass',
      feedback: ''
    },
    {
      id: 'crl_study_type_l1',
      label: 'CRL study type L1',
      operator: 'EQUALS',
      siteValue: mvp1EligibilityContext.studyTypeL1,
      studyValue: mvp1EligibilityContext.studyTypeL1,
      status: 'pass',
      feedback: ''
    },
    {
      id: 'crl_study_type_l2',
      label: 'CRL study type L2',
      operator: 'EQUALS',
      siteValue: mvp1EligibilityContext.studyTypeL2,
      studyValue: mvp1EligibilityContext.studyTypeL2,
      status: 'pass',
      feedback: ''
    }
  ];

  if (!dateIsAvailable) {
    return {
      status: 'fail',
      label: 'Unavailable',
      summary: 'Add a Study Start Date, then run the eligibility check again.',
      checks,
      failureFeedback: checks[0].feedback,
      nextAction: 'Update Study Start Date',
      selectedSite,
      studyStartDate
    };
  }

  return {
    status: 'pass',
    label: 'Available',
    summary: 'The study has the date, species, and study-type information needed for eligibility.',
    checks,
    failureFeedback: '',
    nextAction: 'Confirm eligibility',
    selectedSite,
    studyStartDate
  };
}
