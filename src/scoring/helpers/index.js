import {
  contentSEOCategory,
  POINT,
  priorityRate,
  technicalSEOCategory
} from '../../const/analysis';

/**
 * Helper function to prepare the results by category.
 * @param {Array} originalResult - The original result array of assessments.
 * @returns {object} The prepared result object.
 */
export function groupAssessmentsByCategory(originalResult) {
  const technicalSEOResults = [];
  const contentSEOResults = [];

  originalResult.forEach(item => {
    const {id, status} = item;

    if (technicalSEOCategory.includes(id)) {
      technicalSEOResults.push({...item, status});
    } else if (contentSEOCategory.includes(id)) {
      contentSEOResults.push({...item, status});
    }
  });

  const sortByStatus = (a, b) => {
    const statusOrder = {bad: 1, improve: 2, good: 3};
    return statusOrder[a.status] - statusOrder[b.status];
  };

  const sortByPriority = (a, b) => {
    const priorityOrder = {high: 1, medium: 2, low: 3, undefined: 4};
    return (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4);
  };

  const sortItems = items => {
    items.sort((a, b) => {
      const statusComparison = sortByStatus(a, b);
      if (statusComparison !== 0) {
        return statusComparison;
      }
      return sortByPriority(a, b);
    });
  };

  sortItems(technicalSEOResults);
  sortItems(contentSEOResults);

  return {technicalSEOResults, contentSEOResults};
}

export function groupAssessmentsByStatus(assessments) {
  return assessments.reduce(
    (acc, assessment) => {
      const {status} = assessment;
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(assessment);
      return acc;
    },
    {good: [], improve: [], bad: []}
  );
}

export const getMaxPoint = assessments => {
  let totalScore = 0;
  assessments.forEach(item => {
    totalScore += POINT * priorityRate[item.priority];
  });

  return totalScore;
};
