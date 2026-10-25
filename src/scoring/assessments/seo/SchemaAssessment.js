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
        good: 'Structured data (schema) is set up for this page.',
        improve: '',
        bad:
          'No structured data found. Add Product schema (products) or Article schema (blog posts) so the page can show rich results such as price and ratings.'
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
  /**
   * Detects the kind of page from its URL, using Shopify's URL structure.
   *
   * @param {Paper} paper The paper.
   * @returns {?string} "product" (products and collections), "article" (blog posts) or null.
   */
  getPageType(paper) {
    const url = paper.getSlug();
    if (url.includes('product') || url.includes('collection')) {
      return 'product';
    }
    if (url.includes('blogs')) {
      return 'article';
    }
    return null;
  }

  calculateResult(paper, i18n) {
    const hasSchema =
      this.getPageType(paper) === 'product'
        ? paper.hasProductSchema()
        : Boolean(paper.getShopSettings()?.blogPostsAndArticle?.status);
    const status = hasSchema ? 'good' : 'bad';

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

    assessmentResult.setScore(calculatedResult.score);
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
    return paper.hasShopSettings() && paper.hasSlug() && this.getPageType(paper) !== null;
  }
}
