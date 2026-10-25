import {ContentAssessor, SEOAssessor} from '@seo-analyzer/scoring/assessors/index';
import {getMaxPoint, groupAssessmentsByCategory, groupAssessmentsByStatus} from '../helpers';

/**
 * The CombinedAssessor class is combines the SEO and content assessors into a single analysis.
 */
export default class CombinedAssessor {
  /**
   * Creates a new CombinedAssessor instance.
   * @param {Researcher}  researcher  The researcher to use.
   * @param {Object}    [config]  The assessor config.
   */
  constructor(researcher, config = {}) {
    const seoAssessor = new SEOAssessor(researcher, config);
    const contentAssessor = new ContentAssessor(researcher, config);
    this.seoAssessor = seoAssessor;
    this.contentAssessor = contentAssessor;
    this.researcher = researcher;
    this.config = config;
  }

  assess(paper, i18n) {
    this.seoAssessor.assess(paper, i18n);
    this.contentAssessor.assess(paper, i18n);

    let assessments = [...this.seoAssessor.results, ...this.contentAssessor.results];
    assessments = assessments.map(assessment => ({
      ...assessment.config,
      body: assessment.body,
      status: assessment.status,
      score: assessment.score,
      title: assessment.title || assessment.config.title
    }));
    this.assessments = assessments;
  }

  getResult(groupBy = 'category', getScore = true) {
    let assessments = [];
    switch (groupBy) {
      case 'category':
        assessments = groupAssessmentsByCategory(this.assessments);
        break;
      case 'status':
        assessments = groupAssessmentsByStatus(this.assessments);
        break;
    }

    return {
      assessments,
      ...(getScore ? {score: this.getScore()} : {})
    };
  }

  getScore() {
    let point = 0;

    this.assessments.forEach(assessment => {
      point += assessment.score;
    });

    const maxPoint = getMaxPoint(this.assessments);
    return maxPoint > 0 ? Math.round((point * 100) / maxPoint) : 0;
  }
}
