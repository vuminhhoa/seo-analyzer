import {merge} from 'lodash';
import React from 'react';
import {Text} from '@shopify/polaris';
import AssessmentResult from '../../../values/AssessmentResult';
import Assessment from '../assessment';

/**
 * Represents the assessment that checks shop has schema.
 */
export default class SchemaAssessment extends Assessment {
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
      id: 'schema',
      priority: 'high',
      docUrl:
        'https://github.com/vuminhhoa/seo-analyzer/blob/main/docs/checklist.md#schema',
      ctaType: 'contactUs',
      title: 'Schema',
      content: {
        good: 'Schema markup is applied effectively.',
        improve: '',
        bad: 'No schema markup applied. Add schema to optimize visibility for search engines.'
      }
    };

    this.identifier = 'schema';
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
    const url = paper.getSlug();
    const shopSettings = paper.getShopSettings();
    if (url.includes('product') || url.includes('collection')) {
      if (paper.hasProductSchema()) {
        status = 'good';
      } else {
        status = 'bad';
      }
    }
    if (url.includes('blogs')) {
      if (shopSettings?.blogPostsAndArticle?.status) {
        status = 'good';
      } else {
        status = 'bad';
      }
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
   * @param config
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
   * @returns {boolean} Returns true if the language is available and the paper is not empty.
   */
  isApplicable(paper, researcher) {
    return paper.hasShopSettings() && paper.hasSlug();
  }
}
