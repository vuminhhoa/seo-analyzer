import React from 'react';
import {Text} from '@shopify/polaris';

import {isNumber, merge} from 'lodash';
import Assessment from '../assessment';
import AssessmentResult from '../../../values/AssessmentResult';
import {KeyIcon} from '@shopify/polaris-icons';
import matchTextWithWord from '@seo-analyzer/languageProcessing/helpers/match/matchTextWithWord';

/**
 * Assessment for checking the keyword matches in the meta description.
 */
class MetaDescriptionKeywordAssessment extends Assessment {
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
      id: 'metaDescriptionKeyword',
      priority: 'medium',
      fixPosition: 'meta description',
      ctaType: 'fix',
      docUrl:
        'https://github.com/vuminhhoa/seo-analyzer/blob/main/docs/checklist.md#metadescriptionkeyword',
      icon: KeyIcon,
      title: 'Meta description keyword',
      content: {
        bad: 'No keywords found in meta description. Add at least one to improve keyword rank.',
        good: 'Keywords are included meta description.',
        improve: ''
      }
    };

    this.identifier = 'metaDescriptionKeyword';
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
    const description = paper.getDescription();
    const {count} = matchTextWithWord(description, keyword, paper.getLocale(), null);

    let status = '';
    if (isNumber(count) && count > 0) {
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
   * Checks whether the paper has a keyword and a meta description.
   *
   * @param {Paper} paper The paper to use for the assessment.
   *
   * @returns {boolean} True if the paper has a keyword and a meta description.
   */
  isApplicable(paper) {
    return paper.hasKeyword() && paper.hasDescription();
  }
}

export default MetaDescriptionKeywordAssessment;
