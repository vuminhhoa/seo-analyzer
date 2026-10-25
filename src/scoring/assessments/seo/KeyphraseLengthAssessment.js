import {merge} from 'lodash';

import Assessment from '../assessment';
import AssessmentResult from '../../../values/AssessmentResult';
import {KeyIcon} from '@shopify/polaris-icons';
import {countWords} from '@seo-analyzer/helpers';
import React from 'react';
import {Text} from '@shopify/polaris';

/**
 * Assessment to check whether the keyphrase has a good length.
 */
class KeyphraseLengthAssessment extends Assessment {
  /**
   * Sets the identifier and the config.
   *
   * @param {Object} [config] The configuration to use.
   *
   * @returns {void}
   */
  constructor(config) {
    super();

    this.defaultConfig = {
      id: 'keyphraseLength',
      ctaType: 'fix',
      priority: 'low',
      docUrl:
        'https://github.com/vuminhhoa/seo-analyzer/blob/main/docs/checklist.md#keyphraselength',
      fixPosition: 'keyword search',
      icon: KeyIcon,
      title: 'Keyword length',
      content: {
        improve: '',
        bad: 'Keyword too long. Keep keyword length less than 4 words for readability.',
        good: 'Keyword length is optimized, less than 4 words.'
      }
    };

    this.identifier = 'keyphraseLength';
    this._config = merge(this.defaultConfig, config);
  }

  /**
   * Assesses the keyphrase presence and length.
   *
   * @param {Paper} paper The paper to use for the assessment.
   * @param {Researcher} researcher The researcher used for calling research.
   *
   * @param i18n
   * @returns {AssessmentResult} The result of this assessment.
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
   * Calculates the result based on the keyphraseLength research.
   *
   * @returns {Object} Object with score and text.
   */
  calculateResult(paper, i18n) {
    const keywordLength = countWords(paper.getKeyword());

    let status = '';
    if (keywordLength <= 4) {
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
    return paper.hasKeyword();
  }
}

export default KeyphraseLengthAssessment;
