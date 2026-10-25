import React from 'react';
import {Text} from '@shopify/polaris';

import {merge} from 'lodash';
import Assessment from '../assessment';
import AssessmentResult from '../../../values/AssessmentResult';

/**
 * Assessment for calculating the length of the meta description.
 */
export default class MetaDescriptionLengthAssessment extends Assessment {
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
      id: 'metaDescriptionLength',
      ctaType: 'fix',
      docUrl:
        'https://github.com/vuminhhoa/seo-analyzer/blob/main/docs/checklist.md#metadescriptionlength',
      priority: 'high',
      fixPosition: 'meta description',
      title: 'Meta description length',
      // Google sets no length limit but truncates snippets to the device width: roughly
      // 120 characters on mobile and 155-160 on desktop.
      parameters: {
        minimum: 120,
        maximum: 160
      },
      content: {
        good: 'Meta description length is good (120-160 characters), so it shows in full on most devices.',
        improve:
          'Aim for 120-160 characters: shorter descriptions waste space, longer ones get cut off in search results.',
        bad:
          'Missing meta description. Write a unique summary of the page in 120-160 characters.'
      }
    };

    this.identifier = 'metaDescriptionLength';
    this._config = merge(defaultConfig, config);
  }

  /**
   * Runs the metaDescriptionLength module, based on this returns an assessment result with score.
   *
   * @param {Paper}       paper       The paper to use for the assessment.
   * @param {Researcher}  researcher  The researcher used for calling research.
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
   *
   * @param paper
   * @param i18n
   * @returns {{score: number, body: React.JSX.Element, status: string}}
   */
  calculateResult(paper, i18n) {
    const length = paper.getDescription().length;

    const {minimum, maximum} = this._config.parameters;

    let status = 'good';
    if (length === 0) {
      status = 'bad';
    } else if (length < minimum || length > maximum) {
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

  /**
   * Checks whether the paper has a text.
   *
   * @param {Paper}       paper       The paper to use for the assessment.
   *
   * @returns true
   */
  isApplicable(paper) {
    return true;
  }
}
