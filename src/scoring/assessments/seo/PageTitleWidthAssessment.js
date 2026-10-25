import {merge} from 'lodash';
import {Text} from '@shopify/polaris';
import React from 'react';

import Assessment from '../assessment';
import AssessmentResult from '../../../values/AssessmentResult';

/**
 * Represents the assessment that assesses the SEO title width and gives the feedback accordingly.
 */
export default class PageTitleWidthAssessment extends Assessment {
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
      id: 'titleWidth',
      fixPosition: 'meta title',
      docUrl:
        'https://github.com/vuminhhoa/seo-analyzer/blob/main/docs/checklist.md#titlewidth',
      ctaType: 'fix',
      priority: 'high',
      title: 'Meta title width',
      content: {
        good: 'Title width is optimized, between 50 - 70 characters.',
        improve: '',
        bad:
          'Title too long or too short. Aim for 50-70 characters for best display in search results.'
      }
    };

    this.identifier = 'titleWidth';
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
    const length = paper.getTitle().length;

    let status = '';
    if (length <= 70 && length >= 50) {
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
