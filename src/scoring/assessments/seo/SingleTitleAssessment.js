import React from 'react';
import {Text} from '@shopify/polaris';

import {isUndefined, merge} from 'lodash';

import Assessment from '../assessment.js';
import AssessmentResult from '../../../values/AssessmentResult.js';

/**
 * Assessment to check whether the body of the text contains more than 1 H1s in the body.
 * This assessment doesn't penalize H1 that is not in the very beginning of the body.
 */
class SingleTitleAssessment extends Assessment {
  /**
   * Sets the identifier and the config.
   *
   * @param {Object} config The configuration to use.
   *
   * @returns {void}
   */
  constructor(config = {}) {
    super();

    const defaultConfig = {
      id: 'singleTitle',
      docUrl:
        'https://github.com/vuminhhoa/seo-analyzer/blob/main/docs/checklist.md#singletitle',
      ctaType: 'contactUs',
      priority: 'high',
      title: 'Duplicate title',
      content: {
        improve: '',
        bad: 'Found duplicate titles. Check your content and create unique titles.',
        good: 'No duplicate titles found.'
      }
    };

    this.identifier = 'singleTitle';
    this._config = merge(defaultConfig, config);
  }

  /**
   * Runs the h1 research and based on this returns an assessment result with a score.
   *
   * @param {Paper}       paper       The paper to use for the assessment.
   * @param {Researcher}  researcher  The researcher used for calling the research.
   * @param i18n
   * @returns {AssessmentResult} The assessment result.
   */
  getResult({paper, researcher, i18n}) {
    const assessmentResult = new AssessmentResult({config: this._config});

    const calculatedResult = this.calculateResult(paper, i18n);

    if (!isUndefined(calculatedResult)) {
      assessmentResult.setScore(calculatedResult.score);
      assessmentResult.setStatus(calculatedResult.status);
      assessmentResult.setBody(calculatedResult.body);
    }

    return assessmentResult;
  }

  /**
   * Returns the score and the feedback string for the single H1 assessment.
   *
   * @returns {Object|null} The calculated score and the feedback string.
   */
  calculateResult(paper, i18n) {
    const count = paper.getTitleCount();

    let status = '';
    if (count === 1) {
      status = 'good';
    } else {
      status = 'bad';
    }

    const score = this.getScore(this._config.priority, status);

    return {
      score,
      status,
      body: (
        <Text as={'span'}>
          {this._config.content[status]}{' '}
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
   * Checks whether the paper has a text.
   *
   * @param {Paper}       paper       The paper to use for the assessment.
   *
   * @returns {boolean} True when there is text.
   */
  isApplicable(paper) {
    return paper.hasTitle();
  }
}

export default SingleTitleAssessment;
