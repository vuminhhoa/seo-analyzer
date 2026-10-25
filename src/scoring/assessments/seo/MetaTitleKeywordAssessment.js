import React from 'react';
import {Text} from '@shopify/polaris';

import {isNumber, merge} from 'lodash';
import Assessment from '../assessment';
import AssessmentResult from '../../../values/AssessmentResult';
import matchTextWithWord from '@seo-analyzer/languageProcessing/helpers/match/matchTextWithWord';

/**
 * Assessment for checking the keyword matches in the meta title.
 */
export default class MetaTitleKeywordAssessment extends Assessment {
  /**
   * Sets the identifier and the config.
   *
   * @param {Object} [config] The configuration to use.
   * @param {number} [config.parameters.recommendedMinimum] The recommended minimum of keyword occurrences in the meta description.
   * @param {number} [config.scores.good] The score to return if there are enough keyword occurrences in the meta description.
   * @param {number} [config.scores.bad] The score to return if there aren't enough keyword occurrences in the meta description.
   * @param {string} [config.url] The URL to the relevant article on Yoast.com.
   *
   * @returns {void}
   */
  constructor(config = {}) {
    super();

    const defaultConfig = {
      id: 'titleKeyword',
      docUrl:
        'https://github.com/vuminhhoa/seo-analyzer/blob/main/docs/checklist.md#titlekeyword',
      fixPosition: 'meta title',
      ctaType: 'fix',
      priority: 'high',
      title: 'Keyword in meta title',
      content: {
        bad:
          'No keywords found in meta title. Add one to improve keyword rank and click through rate.',
        good: 'Keyword is included in meta title.',
        improve:
          'The keyword appears more than once in the title. Use it once: repeated terms look spammy in search results.'
      }
    };

    this.identifier = 'titleKeyword';
    this._config = merge(defaultConfig, config);
  }

  /**
   * Runs the metaDescriptionKeyword researcher and based on this, returns an assessment result with score.
   *
   * @param {Paper}      paper      The paper to use for the assessment.
   * @param {Researcher} researcher The researcher used for calling research.
   *
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
   * Returns the result object based on the number of keyword matches in the meta description.
   *
   * @returns {Object} Result object with score and text.
   */
  calculateResult(paper, i18n) {
    const keyword = paper.getKeyword();
    const title = paper.getTitle();
    const {count} = matchTextWithWord(title, keyword, paper.getLocale(), null);

    let status = 'bad';
    if (isNumber(count) && count > 1) {
      status = 'improve';
    } else if (isNumber(count) && count > 0) {
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
   * Checks whether the paper has a keyword and a meta description.
   *
   * @param {Paper} paper The paper to use for the assessment.
   *
   * @returns {boolean} True if the paper has a keyword and a meta description.
   */
  isApplicable(paper) {
    return paper.hasKeyword();
  }
}
