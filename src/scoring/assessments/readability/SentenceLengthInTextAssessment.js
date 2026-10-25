import {merge} from 'lodash';
import React from 'react';
import {Text} from '@shopify/polaris';
import Assessment from '../assessment';
import getTooLongSentences from '../../helpers/assessments/checkForTooLongSentences';
import formatNumber from '../../../helpers/formatNumber';
import AssessmentResult from '../../../values/AssessmentResult';
import {TextBlockIcon} from '@shopify/polaris-icons';

/**
 * Represents the assessment that will calculate the length of sentences in the text.
 */
class SentenceLengthInTextAssessment extends Assessment {
  /**
	 * Sets the identifier and the config.
	 *
	 * @param {object} config			The scoring configuration that should be used.
	 * @param {boolean} isCornerstone	Whether cornerstone configuration should be used.
	 * @param {boolean} isProduct		Whether product configuration should be used.

	 * @returns {void}
	 */
  constructor(config = {}, isCornerstone = false, isProduct = false) {
    super();

    const defaultConfig = {
      id: 'textSentenceLength',
      priority: 'medium',
      docUrl:
        'https://github.com/vuminhhoa/seo-analyzer/blob/main/docs/checklist.md#textsentencelength',
      ctaType: 'fix',
      fixPosition: 'sentenceLength',
      icon: TextBlockIcon,
      recommendedLength: 20,
      slightlyTooMany: 25,
      farTooMany: 30,
      title: 'Text Sentence Length',
      // `recommendedLength` is the word limit per sentence; `slightlyTooMany` and `farTooMany`
      // are the share (%) of sentences over that limit. Defaults follow Yoast SEO.
      content: {
        good: 'Most sentences are short enough to read easily.',
        improve: 'Over {slightlyTooMany}% of sentences have more than {recommendedLength} words. Try splitting some of them.',
        bad: 'Over {farTooMany}% of sentences have more than {recommendedLength} words. Split long sentences to make the text easier to read.'
      }
    };

    this._config = merge(defaultConfig, config);
    this.identifier = 'textSentenceLength';
  }

  /**
   * Scores the percentage of sentences including more than the recommended number of words.
   *
   * @param {Paper} paper The paper to use for the assessment.
   * @param {Researcher} researcher The researcher used for calling research.
   *
   * @param i18n
   * @returns {AssessmentResult} The Assessment result.
   */
  getResult({paper, researcher, i18n}) {
    const sentences = researcher.getResearch('countSentencesFromText');
    if (researcher.getConfig('sentenceLength')) {
      this._config = this.getLanguageSpecificConfig(researcher);
    }

    const percentage = this.calculatePercentage(sentences);
    const result = this.calculateResult(percentage, i18n);

    const assessmentResult = new AssessmentResult({config: this._config});

    assessmentResult.setScore(result.score);
    assessmentResult.setStatus(result.status);
    assessmentResult.setBody(result.body);

    return assessmentResult;
  }

  /**
   * Checks whether the paper has text.
   *
   * @param {Paper} paper The paper to use for the assessment.
   *
   * @returns {boolean} True when there is text.
   */
  isApplicable(paper) {
    return this.hasEnoughContentForAssessment(paper);
  }

  /**
   * Check if there is language-specific config, and if so, overwrite the current config with it.
   *
   * @param {Researcher} researcher The researcher to use.
   *
   * @returns {Object} The config that should be used.
   */
  getLanguageSpecificConfig(researcher) {
    const currentConfig = this._config;
    const languageSpecificConfig = researcher.getConfig('sentenceLength');

    if (languageSpecificConfig.hasOwnProperty('recommendedLength')) {
      currentConfig.recommendedLength = languageSpecificConfig.recommendedLength;
    }

    return currentConfig;
  }

  /**
   * Calculates the percentage of sentences that are too long.
   *
   * @param {Array} sentences The sentences to calculate the percentage for.
   * @returns {number} The calculates percentage of too long sentences.
   */
  calculatePercentage(sentences) {
    let percentage = 0;

    if (sentences.length !== 0) {
      const tooLongTotal = this.countTooLongSentences(sentences);

      percentage = formatNumber((tooLongTotal / sentences.length) * 100);
    }

    return percentage;
  }

  /**
   *
   * @param percentage
   * @param i18n
   * @returns {{score: number, body: React.JSX.Element, status: string}}
   */
  calculateResult(percentage, i18n) {
    const {recommendedLength, slightlyTooMany, farTooMany} = this._config;
    let status = 'good';
    if (percentage > farTooMany) {
      status = 'bad';
    } else if (percentage > slightlyTooMany) {
      status = 'improve';
    }

    const score = this.getScore(this._config.priority, status);
    const message = this._config.content[status].replace(
      /\{(recommendedLength|slightlyTooMany|farTooMany)\}/g,
      (match, key) => ({recommendedLength, slightlyTooMany, farTooMany}[key])
    );

    return {
      score,
      status,
      body: (
        <Text as={'span'}>
          {message}{' '}
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
   * Gets the sentences that are qualified as being too long.
   *
   * @param {array} sentences The sentences to filter through.
   * @returns {array} Array with all the sentences considered to be too long.
   */
  getTooLongSentences(sentences) {
    return getTooLongSentences(sentences, this._config.recommendedLength);
  }

  /**
   * Get the total amount of sentences that are qualified as being too long.
   *
   * @param {Array} sentences The sentences to filter through.
   * @returns {Number} The amount of sentences that are considered too long.
   */
  countTooLongSentences(sentences) {
    return this.getTooLongSentences(sentences).length;
  }
}

export default SentenceLengthInTextAssessment;
