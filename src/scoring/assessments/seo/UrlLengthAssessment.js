import {merge} from 'lodash';
import React from 'react';
import {Text} from '@shopify/polaris';
import AssessmentResult from '../../../values/AssessmentResult';
import Assessment from '../assessment';

/**
 * Represents the assessment that checks whether there are three or more consecutive sentences beginning with the same word.
 */
export default class UrlLengthAssessment extends Assessment {
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
      id: 'urlLength',
      priority: 'high',
      docUrl:
        'https://github.com/vuminhhoa/seo-analyzer/blob/main/docs/checklist.md#urllength',
      fixPosition: 'url handle',
      ctaType: 'fix',
      title: 'URL length',
      content: {
        good: 'URL length is optimized, less than 75 characters.',
        improve: '',
        bad: 'Keep it less than 75 characters for better readability and SEO.'
      }
    };

    this.identifier = 'urlLength';
    this._config = merge(defaultConfig, config);
  }

  /**
   *
   * @param paper
   * @param i18n
   * @returns {{score: number, body: React.JSX.Element, status: string}}
   */
  calculateResult(paper, i18n) {
    let status = '';
    const length = paper.getDomain().length + paper.getSlug().length + 11;

    if (length < 75) {
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
   *
   * @param paper
   * @param researcher
   * @param i18n
   * @returns {AssessmentResult}
   */
  getResult({paper, researcher, i18n}) {
    const calculatedResult = this.calculateResult(paper, i18n);
    const assessmentResult = new AssessmentResult({config: this._config});

    assessmentResult.setStatus(calculatedResult.status);
    assessmentResult.setStatus(calculatedResult.status);
    assessmentResult.setBody(calculatedResult.body);

    return assessmentResult;
  }

  /**
   * Checks if the sentence beginnings assessment is applicable to the paper.
   *
   * @param {Object}      paper       The paper to check.
   * @param {Researcher}  researcher  The researcher object.
   *
   * @returns {boolean} Returns true if the language is available and the paper is not empty.
   */
  isApplicable(paper, researcher) {
    return true;
  }
}
