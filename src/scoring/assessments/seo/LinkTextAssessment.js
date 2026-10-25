import {merge} from 'lodash';
import React from 'react';
import {Text} from '@shopify/polaris';
import AssessmentResult from '../../../values/AssessmentResult';
import Assessment from '../assessment';

/**
 * Represents the assessment that checks whether links use descriptive anchor text instead of
 * generic phrases such as "click here" or "read more".
 */
export default class LinkTextAssessment extends Assessment {
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
      id: 'linkText',
      priority: 'medium',
      docUrl: 'https://github.com/vuminhhoa/seo-analyzer/blob/main/docs/checklist.md#linktext',
      fixPosition: 'description',
      ctaType: 'fix',
      title: 'Link text',
      // Anchor texts that say nothing about the target page (compared lowercased, without punctuation).
      parameters: {
        genericTexts: [
          'click here',
          'click',
          'here',
          'read more',
          'more',
          'learn more',
          'more info',
          'more information',
          'see more',
          'this',
          'this page',
          'this link',
          'link',
          'go',
          'continue',
          'website',
          'page'
        ]
      },
      content: {
        good: 'Links use descriptive text.',
        improve:
          'Some links use generic or empty text ({examples}). Describe where the link goes, e.g. "our return policy" instead of "click here".'
      }
    };

    this.identifier = 'linkText';
    this._config = merge(defaultConfig, config);
  }

  /**
   * Returns the anchor texts in the paper's text that don't describe their target.
   *
   * @param {Paper} paper The paper.
   * @returns {string[]} The non-descriptive anchor texts ("(empty)" for links without text).
   */
  getNonDescriptiveLinks(paper) {
    const genericTexts = this._config.parameters.genericTexts;
    const doc = new DOMParser().parseFromString(paper.getText(), 'text/html');

    return Array.from(doc.querySelectorAll('a[href]'))
      .map(link => {
        const imageAlts = Array.from(link.querySelectorAll('img[alt]')).map(img => img.alt);
        return [link.textContent, ...imageAlts].join(' ').trim();
      })
      .filter(text => {
        const normalized = text.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, '').replace(/\s+/g, ' ').trim();
        return normalized === '' || genericTexts.includes(normalized);
      })
      .map(text => text || '(empty)');
  }

  /**
   *
   * @param paper
   * @param i18n
   * @returns {{score: number, body: React.JSX.Element, status: string}}
   */
  calculateResult(paper, i18n) {
    const nonDescriptive = this.getNonDescriptiveLinks(paper);
    const status = nonDescriptive.length === 0 ? 'good' : 'improve';
    const examples = [...new Set(nonDescriptive)].slice(0, 3).map(text => `"${text}"`).join(', ');

    const score = this.getScore(this._config.priority, status);

    return {
      score,
      status,
      body: (
        <Text as={'span'}>
          {this._config.content[status].replace('{examples}', examples)}{' '}
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
   * Checks whether the text contains links.
   *
   * @param {Paper} paper The paper to check.
   *
   * @returns {boolean} Whether the assessment applies.
   */
  isApplicable(paper) {
    return paper.hasText() && /<a\s[^>]*href=/i.test(paper.getText());
  }
}
