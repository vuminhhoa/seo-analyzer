import {merge} from 'lodash';
import {Text} from '@shopify/polaris';
import React from 'react';

import Assessment from '../assessment';
import AssessmentResult from '../../../values/AssessmentResult';

/**
 * Represents the assessment that assesses the SEO title width and gives the feedback accordingly.
 */
export default class NumberInMetaTitleAssessment extends Assessment {
  /**
   * Sets the identifier and the config.
   *
   * @param {Object}  [config]        The configuration to use.
   *
   * @returns {void}
   */
  constructor(config = {}) {
    super();

    const defaultConfig = {
      id: 'numberTitle',
      ctaType: 'fix',
      status: 'good',
      docUrl:
        'https://github.com/vuminhhoa/seo-analyzer/blob/main/docs/checklist.md#numbertitle',
      priority: 'high',
      fixPosition: 'meta title',
      title: 'Number in meta title',
      content: {
        good: 'Number is used effectively in the title tag.',
        improve: '',
        bad: 'No number found in title tag. Consider adding a number to make it more engaging.'
      }
    };

    this.identifier = 'numberTitle';
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

    assessmentResult.setScore(calculatedResult.score);
    assessmentResult.setStatus(calculatedResult.status);
    assessmentResult.setBody(calculatedResult.body);

    return assessmentResult;
  }

  /**
   *
   * @param paper
   * @param i18n
   * @returns {{score: number, body: React.JSX.Element, status: string}}
   */
  calculateResult(paper, i18n) {
    const title = paper.getTitle();

    let status = '';
    if (!/\d/.test(title)) {
      status = 'bad';
    }

    if (!title || /\d/.test(title)) {
      status = 'good';
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
