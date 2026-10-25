import {merge} from 'lodash';
import {Text} from '@shopify/polaris';
import React from 'react';

import Assessment from '../assessment';
import AssessmentResult from '../../../values/AssessmentResult';
import {ExternalIcon} from '@shopify/polaris-icons';

/**
 * Represents the assessment that assesses the SEO title width and gives the feedback accordingly.
 */
export default class TextImagesAssessment extends Assessment {
  /**
   * Sets the identifier and the config.
   *
   * @param {Object}  [config]        The configuration to use.
   *
   * @returns {void}
   */
  constructor(config = {}) {
    super();

    const defaultConfig = {
      id: 'textImages',
      ctaType: 'fix',
      docUrl:
        'https://github.com/vuminhhoa/seo-analyzer/blob/main/docs/checklist.md#textimages',
      fixPosition: 'description',
      icon: ExternalIcon,
      priority: 'high',
      title: 'Alt text',
      content: {
        good: 'All images have descriptive and relevant alt text.',
        improve:
          'Some alt text repeats the keyword. Describe what the image shows instead: keyword-filled alt text can be treated as spam.',
        bad: 'Missing alt text. Add descriptive alt text for accessibility and SEO.'
      }
    };

    this.identifier = 'textImages';
    this._config = merge(defaultConfig, config);
  }

  /**
   * Runs the h1 research and based on this returns an assessment result with a score.
   *
   * @param {Paper}       paper       The paper to use for the assessment.
   * @param {Researcher}  researcher  The researcher used for calling the research.
   * @param i18n
   * @returns {AssessmentResult} The assessment result.
   */
  getResult({paper, researcher, i18n}) {
    const assessmentResult = new AssessmentResult({config: this._config});
    this.altTagsProperties = researcher.getResearch('altTagCount');
    this.imageCount = researcher.getResearch('imageCount');

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
    const imagesNoAlt = this.altTagsProperties.noAlt;

    let status = 'good';
    if (imagesNoAlt > 0) {
      status = 'bad';
    } else if (this.hasKeywordStuffedAlt(paper)) {
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
   *
   * @param shop
   * @param data
   * @returns {string}
   */
  fix({shop, data}) {
    if (!shop) {
      console.log('Shop is missing');
      return data.body || '';
    }

    if (!data.body) {
      console.log('body is missing');
      return '';
    }

    const altText = `${shop?.name || 'Shop'} | ${data?.title || 'Title'}`;

    const parser = new DOMParser();
    const doc = parser.parseFromString(data.body, 'text/html');

    const imgTags = doc.querySelectorAll('img');

    imgTags.forEach(img => {
      if (!img.hasAttribute('alt') || img.getAttribute('alt') === '') {
        img.setAttribute('alt', altText);
      }
    });

    return doc.body.innerHTML;
  }

  /**
   * Checks whether any alt text repeats the keyword.
   *
   * @param {Paper} paper The paper.
   * @returns {boolean} Whether an alt text contains the keyword more than once.
   */
  hasKeywordStuffedAlt(paper) {
    const keyword = paper.getKeyword().trim().toLowerCase();
    if (!keyword) {
      return false;
    }

    const doc = new DOMParser().parseFromString(paper.getText(), 'text/html');
    return Array.from(doc.querySelectorAll('img[alt]')).some(
      img => img.getAttribute('alt').toLowerCase().split(keyword).length - 1 > 1
    );
  }

  /**
   * Checks whether the paper has a text.
   *
   * @param {Paper}       paper       The paper to use for the assessment.
   * @param researcher
   * @returns {boolean} True when there is text.
   */
  isApplicable(paper, researcher) {
    this.imageCount = researcher.getResearch('imageCount');
    return paper.hasText() && this.imageCount > 0;
  }
}
