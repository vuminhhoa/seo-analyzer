import React from 'react';
import {Text} from '@shopify/polaris';
import {merge} from 'lodash';

import Assessment from '../assessment';
import AssessmentResult from '../../../values/AssessmentResult';

/**
 * Represents the Slug keyword assessment. This assessment checks if the keyword is present in the slug.
 */
class KeyphraseAssessment extends Assessment {
  /**
   * Sets the identifier and the config.
   *
   * @param {Object} config   The configuration to use.
   * @returns {void}
   */
  constructor(config = {}) {
    super();

    const defaultConfig = {
      id: 'keyphrase',
      docUrl:
        'https://github.com/vuminhhoa/seo-analyzer/blob/main/docs/checklist.md#keyphrase',
      ctaType: 'fix',
      fixPosition: 'keyword search',
      priority: 'high',
      title: 'Use of main keyword',
      content: {
        improve: '',
        bad: 'No keywords found. Include keywords throughout the text.',
        good: 'Main keyword is used effectively.'
      }
    };

    this.identifier = 'keyphrase';
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
    const assessmentResult = new AssessmentResult({config: this._config});

    const calculatedResult = this.calculateResult(paper, i18n);

    assessmentResult.setScore(calculatedResult.score);
    assessmentResult.setStatus(calculatedResult.status);
    assessmentResult.setBody(calculatedResult.body);
    return assessmentResult;
  }

  /**
   * Checks whether the paper has a keyword and a slug.
   *
   * @param {Paper}       paper       The paper to use for the assessment.
   * @param {Researcher}  researcher  The researcher object.
   *
   * @returns {boolean} True if the paper contains a keyword and a slug, and if the keywordCountInSlug research is available on the researcher.
   */
  isApplicable(paper, researcher) {
    return true;
  }

  /**
   *
   * @param paper
   * @param i18n
   * @returns {{score: number, body: React.JSX.Element, status: string}}
   */
  calculateResult(paper, i18n) {
    const status = (() => {
      const hasKeyphrase = paper.hasKeyword();

      return hasKeyphrase ? 'good' : 'bad';
    })();

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

export default KeyphraseAssessment;
