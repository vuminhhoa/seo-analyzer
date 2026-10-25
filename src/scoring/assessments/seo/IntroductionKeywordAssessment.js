import {merge} from 'lodash';

import Assessment from '../assessment';
import AssessmentResult from '../../../values/AssessmentResult';
import {KeyIcon} from '@shopify/polaris-icons';
import React from 'react';
import {Text} from '@shopify/polaris';

/**
 * Assessment to check whether the keyphrase or synonyms are encountered in the first paragraph of the article.
 */
class IntroductionKeywordAssessment extends Assessment {
  /**
   * Sets the identifier and the config.
   *
   * @param {Object} [config] The configuration to use.
   * @param {string} [config.url] The URL to the relevant article on Yoast.com.
   *
   * @returns {void}
   */
  constructor(config = {}) {
    super();

    const defaultConfig = {
      id: 'introductionKeyword',
      ctaType: 'fix',
      priority: 'low',
      docUrl:
        'https://github.com/vuminhhoa/seo-analyzer/blob/main/docs/checklist.md#introductionkeyword',
      fixPosition: 'highlightFirstParagraph',
      icon: KeyIcon,
      title: 'Introduction Keyword',
      content: {
        improve: '',
        bad: 'No keywords found in the first sentence. Add one to improve keyword rank.',
        good: 'Keyword is included in the first sentence.'
      }
    };

    this.identifier = 'introductionKeyword';
    this._config = merge(defaultConfig, config);
  }

  /**
   * Assesses the presence of keyphrase or synonyms in the first paragraph.
   *
   * @param {Paper} paper The paper to use for the assessment.
   * @param {Researcher} researcher The researcher used for calling research.
   *
   * @param i18n
   * @returns {AssessmentResult} The result of this assessment.
   */
  getResult({paper, researcher, i18n}) {
    const assessmentResult = new AssessmentResult({config: this._config});

    this._firstParagraphMatches = researcher.getResearch('findKeywordInFirstParagraph');
    const calculatedResult = this.calculateResult(i18n);

    assessmentResult.setScore(calculatedResult.score);
    assessmentResult.setStatus(calculatedResult.status);
    assessmentResult.setBody(calculatedResult.body);

    return assessmentResult;
  }

  /**
   * Checks if the paper has both keyword and text.
   *
   * @param {Paper} paper The paper to be analyzed.
   *
   * @returns {boolean} Whether the assessment is applicable or not.
   */
  isApplicable(paper) {
    return paper.hasKeyword() && paper.hasText();
  }

  /**
   * Returns a result based on the number of occurrences of keyphrase in the first paragraph.
   *
   * @returns {Object} result object with a score and translation text.
   */
  calculateResult(i18n) {
    let status = '';

    if (this._firstParagraphMatches.foundInOneSentence) {
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
}

export default IntroductionKeywordAssessment;
