import {merge} from 'lodash';
import React from 'react';

import AssessmentResult from '../../../values/AssessmentResult';
import Assessment from '../assessment';

import RelatedKeywordsDescription from '@seo-analyzer/components/RelatedKeywordsDescription';
import {BlockStack, Text} from '@shopify/polaris';

/**
 * Represents the assessment that checks whether there are enough transition words in the text.
 */
export default class RelatedKeywordsAssessment extends Assessment {
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
      id: 'relatedKeywords',
      fixPosition: 'description',
      ctaType: 'fix',
      docUrl:
        'https://github.com/vuminhhoa/seo-analyzer/blob/main/docs/checklist.md#relatedkeywords',
      priority: 'medium',
      title: 'Related keywords',
      content: {
        good: 'Related keyword density is optimized',
        bad:
          'Consider using at least a related keyword in your page to establish topical relevance.',
        improve: 'Too high related keyword density. Keep related keyword density from 0.5% - 1%.'
      }
    };

    this.identifier = 'relatedKeywords';
    this._config = merge(defaultConfig, config);
  }

  /**
   *
   * @param data
   * @param relatedKeywords
   * @param i18n
   * @returns {{score: number, body: React.JSX.Element, status: string}}
   */
  calculateResult(data, relatedKeywords, i18n) {
    const {totalWordUsed, words, isWordUsedExceeding} = relatedKeywords;
    let status = 'good';
    if (!data?.related_keywords?.length || totalWordUsed <= 0) {
      status = 'bad';
    }

    if (isWordUsedExceeding) {
      status = 'improve';
    }

    const score = this.getScore(this._config.priority, status);

    return {
      score,
      status,
      body: (
        <BlockStack gap={200}>
          <Text as={'span'}>
            {this._config.content[status]}{' '}
            {this._config.docUrl && (
              <a href={this._config.docUrl} target="_blank" rel="noreferrer">
                {i18n ? i18n.translate(`SeoAnalyzer.Button.learnMore`) : 'Learn more'}
              </a>
            )}
          </Text>
          <RelatedKeywordsDescription {...{words, i18n}} />
        </BlockStack>
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
    const relatedKeywords = researcher.getResearch('checkRelatedKeywords');
    const data = paper.getData();

    const result = this.calculateResult(data, relatedKeywords, i18n);
    const assessmentResult = new AssessmentResult({config: this._config});

    assessmentResult.setScore(result.score);
    assessmentResult.setStatus(result.status);
    assessmentResult.setBody(result.body);

    return assessmentResult;
  }

  /**
   * Checks if the transition words assessment is applicable to the paper. Language-specific length requirements and methods of counting text length
   * may apply (e.g. for Japanese, the text should be counted in characters instead of words, which also makes the minimum required length higher).
   *
   * @param {Paper}       paper       The paper to check.
   * @param {Researcher}  researcher  The researcher object.
   *
   * @returns {boolean} Returns true if the language is available, the paper is not empty and the text is longer than the minimum required length.
   */
  isApplicable(paper, researcher) {
    return paper.hasRelatedKeywords();
  }
}
