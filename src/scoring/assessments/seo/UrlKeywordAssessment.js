import React from 'react';
import {Text} from '@shopify/polaris';
import {merge} from 'lodash';

import Assessment from '../assessment';
import AssessmentResult from '../../../values/AssessmentResult';

/**
 * Represents the Slug keyword assessment. This assessment checks if the keyword is present in the slug.
 */
class SlugKeywordAssessment extends Assessment {
  /**
   * Sets the identifier and the config.
   *
   * @param {Object} config   The configuration to use.
   * @returns {void}
   */
  constructor(config = {}) {
    super();

    const defaultConfig = {
      id: 'slugKeyword',
      docUrl:
        'https://github.com/vuminhhoa/seo-analyzer/blob/main/docs/checklist.md#slugkeyword',
      fixPosition: 'url handle',
      ctaType: 'fix',
      priority: 'low',
      title: 'Keyword in URL',
      content: {
        good: 'Keyword is included in URL.',
        improve: '',
        bad: 'Missing keyword in URL. Include it for relevance and better SEO.'
      }
    };

    this.identifier = 'slugKeyword';
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
    this._keywordInSlug = researcher.getResearch('keywordCountInSlug');

    const assessmentResult = new AssessmentResult({config: this._config});

    const calculatedResult = this.calculateResult(i18n);

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
    return (
      !paper.isFrontPage() &&
      paper.hasKeyword() &&
      paper.hasSlug() &&
      researcher.hasResearch('keywordCountInSlug')
    );
  }

  /**
   *
   * @param i18n
   * @returns {{score: number, body: React.JSX.Element, status: string}}
   */
  calculateResult(i18n) {
    const status = (() => {
      if (this._keywordInSlug.keyphraseLength < 3) {
        return this._keywordInSlug.percentWordMatches === 100 ? 'good' : 'bad';
      }
      return this._keywordInSlug.percentWordMatches > 50 ? 'good' : 'bad';
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

export default SlugKeywordAssessment;
