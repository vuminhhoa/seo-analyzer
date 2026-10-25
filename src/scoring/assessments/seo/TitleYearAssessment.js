import {merge} from 'lodash';
import React from 'react';
import {Text} from '@shopify/polaris';
import AssessmentResult from '../../../values/AssessmentResult';
import Assessment from '../assessment';

/**
 * Represents the assessment that checks whether the title mentions a year that has already passed.
 * Google may rewrite titles with obsolete dates in search results.
 */
export default class TitleYearAssessment extends Assessment {
  /**
   * Sets the identifier and the config.
   *
   * @param {object} config The configuration to use.
   *
   * @returns {void}
   */
  constructor(config = {}) {
    super();

    const defaultConfig = {
      id: 'titleYear',
      priority: 'medium',
      docUrl: 'https://github.com/vuminhhoa/seo-analyzer/blob/main/docs/checklist.md#titleyear',
      fixPosition: 'meta title',
      ctaType: 'fix',
      title: 'Year in meta title',
      parameters: {
        currentYear: new Date().getFullYear()
      },
      content: {
        good: 'The year in the title is current.',
        improve:
          'The title mentions {years}. If the page has been updated since, update the year: Google may rewrite titles with outdated dates.'
      }
    };

    this.identifier = 'titleYear';
    this._config = merge(defaultConfig, config);
  }

  /**
   * Returns the years (1900-2099) mentioned in the title.
   *
   * @param {Paper} paper The paper.
   * @returns {number[]} The years.
   */
  getYears(paper) {
    return (paper.getTitle().match(/\b(19|20)\d{2}\b/g) || []).map(Number);
  }

  /**
   *
   * @param paper
   * @param i18n
   * @returns {{score: number, body: React.JSX.Element, status: string}}
   */
  calculateResult(paper, i18n) {
    const outdated = this.getYears(paper).filter(year => year < this._config.parameters.currentYear);
    const status = outdated.length === 0 ? 'good' : 'improve';

    const score = this.getScore(this._config.priority, status);

    return {
      score,
      status,
      body: (
        <Text as={'span'}>
          {this._config.content[status].replace('{years}', outdated.join(', '))}{' '}
          {this._config.docUrl && (
            <a href={this._config.docUrl} target="_blank" rel="noreferrer">
              {i18n ? i18n.translate(`SeoAnalyzer.Button.learnMore`) : 'Learn more'}
            </a>
          )}
        </Text>
      )
    };
  }

  /**
   *
   * @param paper
   * @param researcher
   * @param i18n
   * @returns {AssessmentResult}
   */
  getResult({paper, researcher, i18n}) {
    const calculatedResult = this.calculateResult(paper, i18n);
    const assessmentResult = new AssessmentResult({config: this._config});

    assessmentResult.setScore(calculatedResult.score);
    assessmentResult.setStatus(calculatedResult.status);
    assessmentResult.setBody(calculatedResult.body);

    return assessmentResult;
  }

  /**
   * Only applies when the title mentions a year.
   *
   * @param {Paper} paper The paper to check.
   *
   * @returns {boolean} Whether the assessment applies.
   */
  isApplicable(paper) {
    return paper.hasTitle() && this.getYears(paper).length > 0;
  }
}
