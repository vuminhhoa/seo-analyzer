import {merge} from 'lodash';
import React from 'react';
import {Text} from '@shopify/polaris';

import Assessment from '../assessment';
import AssessmentResult from '../../../values/AssessmentResult';
import {countWordInHtml} from '@seo-analyzer/helpers';

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
      priority: 'high',
      fixPosition: 'description',
      title: 'Text length',
      content: {
        good: 'Text length is optimized.',
        improve:
          'Content length is acceptable, but could be expanded to 2,500 characters for more value.',
        bad:
          'Insufficient content. Aim for at least 600 words to provide value and rank well in search results.'
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
    const {wordCount, charCount} = countWordInHtml(paper.getText(), true);
    let status = 'bad';
    if (charCount < 2500 && wordCount >= 600) {
      status = 'improve';
    }
    if (wordCount < 600 && charCount < 2500) {
      status = 'bad';
    }
    if (charCount >= 2500 && wordCount >= 600) {
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
}
