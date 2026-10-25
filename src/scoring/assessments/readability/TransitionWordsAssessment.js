import {merge} from 'lodash';
import React from 'react';
import {Text} from '@shopify/polaris';

import formatNumber from '../../../helpers/formatNumber';
import {inRangeStartInclusive as inRange} from '../../helpers/assessments/inRange';
import AssessmentResult from '../../../values/AssessmentResult';
import Assessment from '../assessment';
import removeHtmlBlocks from '@seo-analyzer/languageProcessing/helpers/html/htmlParser';
import getWords from '@seo-analyzer/languageProcessing/helpers/word/getWords';
import {filterShortcodesFromHTML} from '@seo-analyzer/languageProcessing/helpers';

/**
 * Represents the assessment that checks whether there are enough transition words in the text.
 */
export default class TransitionWordsAssessment extends Assessment {
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
      id: 'textTransitionWords',
      fixPosition: 'longestParagraph',
      ctaType: 'fix',
      docUrl:
        'https://github.com/vuminhhoa/seo-analyzer/blob/main/docs/checklist.md#texttransitionwords',
      priority: 'low',
      applicableIfTextLongerThan: 200,
      title: 'Use of transition words',
      content: {
        good: 'Transition words are used effectively.',
        bad:
          'Lack of transition words. Improve readability and flow by adding words like "however," "also," etc.',
        improve: ''
      }
    };

    this.identifier = 'textTransitionWords';
    this._config = merge(defaultConfig, config);
  }

  /**
   * Calculates the actual percentage of transition words in the sentences.
   *
   * @param {object} sentences The object containing the total number of sentences and the number of sentences containing
   * a transition word.
   *
   * @returns {number} The percentage of sentences containing a transition word.
   */
  calculateTransitionWordPercentage(sentences) {
    if (sentences.transitionWordSentences === 0 || sentences.totalSentences === 0) {
      return 0;
    }

    return formatNumber((sentences.transitionWordSentences / sentences.totalSentences) * 100);
  }

  /**
   * Calculates the score for the assessment based on the percentage of sentences containing transition words.
   *
   * @param {number} percentage The percentage of sentences containing transition words.
   *
   * @returns {number} The score.
   */
  calculateScoreFromPercentage(percentage) {
    if (percentage < 20) {
      // Red indicator.
      return 3;
    }

    if (inRange(percentage, 20, 30)) {
      // Orange indicator.
      return 6;
    }

    // Green indicator.
    return 9;
  }

  /**
   *
   * @param transitionWordSentences
   * @param i18n
   * @returns {{score: number, body: React.JSX.Element, status: string}}
   */
  calculateTransitionWordResult(transitionWordSentences, i18n) {
    const percentage = this.calculateTransitionWordPercentage(transitionWordSentences);
    const score = this.calculateScoreFromPercentage(percentage);

    let status = 'good';
    if (score < 7 && percentage === 0) {
      status = 'bad';
    }

    if (score < 7) {
      status = 'bad';
    }
    const customScore = this.getScore(this._config.priority, status);

    return {
      score: customScore,
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
   *
   * @param paper
   * @param researcher
   * @param i18n
   * @returns {AssessmentResult}
   */
  getResult({paper, researcher, i18n}) {
    const transitionWordSentences = researcher.getResearch('findTransitionWords');
    const transitionWordResult = this.calculateTransitionWordResult(transitionWordSentences, i18n);
    const assessmentResult = new AssessmentResult({config: this._config});

    assessmentResult.setScore(transitionWordResult.score);
    assessmentResult.setStatus(transitionWordResult.status);
    assessmentResult.setBody(transitionWordResult.body);

    return assessmentResult;
  }

  /**
   * Checks if the transition words assessment is applicable to the paper. Language-specific length requirements and methods of counting text length
   * may apply (e.g. for Japanese, the text should be counted in characters instead of words, which also makes the minimum required length higher).
   *
   * @param {Paper}       paper       The paper to check.
   * @param {Researcher}  researcher  The researcher object.
   *
   * @returns {boolean} Returns true if the language is available, the paper is not empty and the text is longer than the minimum required length.
   */
  isApplicable(paper, researcher) {
    const customCountLength = researcher.getHelper('customCountLength');
    const customApplicabilityConfig = researcher.getConfig('assessmentApplicability')
      .transitionWords;
    if (customApplicabilityConfig) {
      this._config.applicableIfTextLongerThan = customApplicabilityConfig;
    }
    let text = paper.getText();
    text = removeHtmlBlocks(text);
    text = filterShortcodesFromHTML(text, paper._attributes && paper._attributes.shortcodes);
    const textLength = customCountLength ? customCountLength(text) : getWords(text).length;

    // Do not use hasEnoughContent in this assessment as it is mostly redundant with `textLength >= this._config.applicableIfTextLongerThan`
    return (
      textLength >= this._config.applicableIfTextLongerThan &&
      researcher.hasResearch('findTransitionWords')
    );
  }
}
