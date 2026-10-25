import {merge} from 'lodash';
import React from 'react';
import {Text} from '@shopify/polaris';

import Assessment from '../assessment';
import AssessmentResult from '../../../values/AssessmentResult';

/**
 * Represents an assessment that checks the length of the text and gives feedback accordingly.
 */
export default class TextLengthAssessment extends Assessment {
  /**
   * Sets the identifier and the config.
   *
   * @param {Object} [config] The configuration to use.
   *
   * @returns {void}
   */
  constructor(config = {}) {
    super();

    const defaultConfig = {
      id: 'textLength',
      ctaType: 'fix',
      docUrl:
        'https://github.com/vuminhhoa/seo-analyzer/blob/main/docs/checklist.md#textlength',
      priority: 'medium',
      fixPosition: 'description',
      title: 'Text length',
      // Google has no preferred word count; this only flags thin content. Thresholds follow the
      // current Yoast SEO defaults and are doubled for languages counted in characters (Japanese).
      parameters: {
        recommendedMinimum: 300,
        belowMinimum: 200
      },
      content: {
        good: 'The text has enough content to cover the topic.',
        improve:
          'The text is a little short (under 300 words). Add details that help readers, not filler.',
        bad:
          'The text is thin (under 200 words). Add useful information such as details, uses or answers to common questions.'
      }
    };

    this.identifier = 'textLength';
    this._config = merge(defaultConfig, config);
  }

  /**
   * Executes the Assessment and returns a result.
   *
   * @param {Paper}       paper       The Paper object to assess.
   * @param {Researcher}  researcher  The Researcher object containing all available researches.
   *
   * @param i18n
   * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
   */
  getResult({paper, researcher, i18n}) {
    this._wordCount = researcher.getResearch('wordCountInText');
    const calculatedResult = this.calculateResult(paper, i18n);

    const assessmentResult = new AssessmentResult({config: this._config});
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
    const {count, unit} = this._wordCount;
    const factor = unit === 'character' ? 2 : 1;
    const {recommendedMinimum, belowMinimum} = this._config.parameters;

    let status = 'good';
    if (count < belowMinimum * factor) {
      status = 'bad';
    } else if (count < recommendedMinimum * factor) {
      status = 'improve';
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
