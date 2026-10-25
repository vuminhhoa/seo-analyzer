import React from 'react';
import {Text} from '@shopify/polaris';

import {isUndefined, merge} from 'lodash';

import Assessment from '../assessment.js';
import AssessmentResult from '../../../values/AssessmentResult.js';

/**
 * Assessment to check whether the page has exactly one H1, counting the H1s in the text
 * and the ones the page renders outside of it (the `h1Count` paper attribute).
 */
class SingleH1Assessment extends Assessment {
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
      id: 'singleH1',
      docUrl:
        'https://github.com/vuminhhoa/seo-analyzer/blob/main/docs/checklist.md#singleh1',
      fixPosition: 'description',
      ctaType: 'contactUs',
      priority: 'medium',
      title: 'H1 tag',
      content: {
        good: 'The page has one H1 that states its main topic.',
        improve:
          'Use exactly one H1 as the main heading: it tells readers, screen readers and search engines what the page is about.',
        bad: ''
      }
    };

    this.identifier = 'singleH1';
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
    this._h1Count = researcher.getResearch('h1s');

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
   * The page's H1 total is the `h1Count` paper attribute (H1s rendered outside the text, e.g. by
   * a theme; defaults to 0) plus the H1 tags in the text itself. Exactly one H1 is good.
   *
   * @returns {Object|null} The calculated score and the feedback string.
   */
  calculateResult(paper, i18n) {
    const h1sInText = (paper.getText().match(/<h1[\s>]/gi) || []).length;
    const totalH1s = (this._h1Count || 0) + h1sInText;

    const status = totalH1s === 1 ? 'good' : 'improve';

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
    return paper.hasText();
  }
}

export default SingleH1Assessment;
