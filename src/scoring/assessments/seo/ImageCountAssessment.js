import React from 'react';
import {Text} from '@shopify/polaris';

import {merge} from 'lodash';

import Assessment from '../assessment';
import AssessmentResult from '../../../values/AssessmentResult';

/**
 * Represents the assessment that checks if the text has any images present, including videos in product pages.
 */
export default class TextImagesAssessment extends Assessment {
  /**
   * Sets the identifier and the config.
   *
   * @param {object}  config      The configuration to use.
   * @param {boolean} countVideos Whether videos are also included in the assessment or not.
   *
   * @returns {void}
   */
  constructor(config = {}, countVideos = true) {
    super();

    const defaultConfig = {
      id: 'images',
      docUrl:
        'https://github.com/vuminhhoa/seo-analyzer/blob/main/docs/checklist.md#images',
      priority: 'high',
      fixPosition: 'description',
      title: 'Media',
      content: {
        good: 'Media are used effectively.',
        improve: '',
        bad: 'No media found. Add visual content to enhance engagement.'
      }
    };

    this.identifier = 'images';
    this._config = merge(defaultConfig, config);
    this._countVideos = countVideos;
  }

  /**
   * Execute the Assessment and return a result.
   *
   * @param {Paper}       paper       The Paper object to assess.
   * @param {Researcher}  researcher  The Researcher object containing all available researches.
   *
   * @param i18n
   * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
   */
  getResult({paper, researcher, i18n}) {
    this.imageCount = researcher.getResearch('imageCount');
    this.videoCount = researcher.getResearch('videoCount');

    const assessmentResult = new AssessmentResult({config: this._config});

    const calculatedResult = this.calculateResult(i18n);

    assessmentResult.setScore(calculatedResult.score);
    assessmentResult.setStatus(calculatedResult.status);
    assessmentResult.setBody(calculatedResult.body);

    return assessmentResult;
  }

  /**
   * Checks whether the paper has text.
   *
   * @param {Paper}       paper       The paper to use for the assessment.
   *
   * @returns {boolean} True when there is text.
   */
  isApplicable(paper) {
    return paper.hasText();
  }

  /**
   * Calculate the result based on the availability of images in the text, including videos in product pages.
   *
   * @returns {Object} The calculated result.
   */
  calculateResult(i18n) {
    // If "countVideos" is on, we include videos in the assessment
    const mediaCount = this._countVideos ? this.imageCount + this.videoCount : this.imageCount;

    let status = '';
    // No images.
    if (mediaCount === 0) {
      status = 'bad';
    } else {
      status = 'good';
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
}
