import {get, merge} from 'lodash';
import React from 'react';
import {Text} from '@shopify/polaris';
import AssessmentResult from '../../../values/AssessmentResult';
import Assessment from '../assessment';

const firstOf = value => (Array.isArray(value) ? value[0] : value);
const has = (schema, path) => {
  const value = get(schema, path);
  return value !== undefined && value !== null && value !== '' && !(Array.isArray(value) && value.length === 0);
};

/**
 * Represents the assessment that checks whether a page's Product structured data has the properties
 * Google requires and recommends for merchant listings (price, availability, brand, GTIN, ratings…).
 */
export default class ProductSchemaAssessment extends Assessment {
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
      id: 'productSchema',
      priority: 'high',
      docUrl: 'https://github.com/vuminhhoa/seo-analyzer/blob/main/docs/checklist.md#productschema',
      ctaType: 'fix',
      title: 'Product structured data',
      content: {
        good: 'Product structured data has the required and recommended properties.',
        improve: 'Product structured data is missing recommended properties: {missing}. Adding them gives richer search results.',
        bad: 'Product structured data is missing required properties: {missing}. Without them the product is not eligible for merchant listings.'
      }
    };

    this.identifier = 'productSchema';
    this._config = merge(defaultConfig, config);
  }

  /**
   * Lists the missing required and recommended properties of a Product schema object.
   *
   * @param {Object} schema The Product schema (JSON-LD object).
   * @returns {{required: string[], recommended: string[]}} The missing property names.
   */
  getMissingProperties(schema) {
    const offer = firstOf(schema.offers) || {};
    const price = has(offer, 'price') ? offer.price : get(offer, 'priceSpecification.price');
    const currency = offer.priceCurrency || get(offer, 'priceSpecification.priceCurrency');

    const required = [
      ['name', has(schema, 'name')],
      ['image', has(schema, 'image')],
      ['offers', has(schema, 'offers')],
      ['price', Number(price) > 0],
      ['priceCurrency', Boolean(currency)]
    ];
    const recommended = [
      ['description', has(schema, 'description')],
      ['brand', has(schema, 'brand.name') || typeof schema.brand === 'string'],
      ['gtin', ['gtin', 'gtin8', 'gtin12', 'gtin13', 'gtin14', 'isbn'].some(key => has(schema, key))],
      ['sku', has(schema, 'sku')],
      ['availability', has(offer, 'availability')],
      ['aggregateRating or review', has(schema, 'aggregateRating') || has(schema, 'review')]
    ];

    const missing = list => list.filter(([, present]) => !present).map(([name]) => name);
    return {required: missing(required), recommended: missing(recommended)};
  }

  /**
   *
   * @param paper
   * @param i18n
   * @returns {{score: number, body: React.JSX.Element, status: string}}
   */
  calculateResult(paper, i18n) {
    const {required, recommended} = this.getMissingProperties(paper.getProductSchema());

    let status = 'good';
    let missing = [];
    if (required.length > 0) {
      status = 'bad';
      missing = required;
    } else if (recommended.length > 0) {
      status = 'improve';
      missing = recommended;
    }

    const score = this.getScore(this._config.priority, status);

    return {
      score,
      status,
      body: (
        <Text as={'span'}>
          {this._config.content[status].replace('{missing}', missing.join(', '))}{' '}
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

    assessmentResult.setScore(calculatedResult.score);
    assessmentResult.setStatus(calculatedResult.status);
    assessmentResult.setBody(calculatedResult.body);

    return assessmentResult;
  }

  /**
   * Applies when the producer passes the page's Product structured data (`productSchema` attribute).
   *
   * @param {Paper} paper The paper to check.
   *
   * @returns {boolean} Whether the assessment applies.
   */
  isApplicable(paper) {
    return Boolean(paper.getProductSchema());
  }
}
