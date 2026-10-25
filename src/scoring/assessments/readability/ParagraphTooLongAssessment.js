import {merge} from 'lodash';
import React from 'react';
import {Text} from '@shopify/polaris';
import {inRangeEndInclusive as inRange} from '../../helpers/assessments/inRange';
import AssessmentResult from '../../../values/AssessmentResult';
import Assessment from '../assessment';

/**
 * Represents the assessment that will look if the text has too long paragraphs.
 */
export default class ParagraphTooLongAssessment extends Assessment {
  /**
   * Sets the identifier and the config.
   *
   * @param {object} config       The configuration to use.
   *
   * @returns {void}
   */
  constructor(config = {}) {
    super();

    const defaultConfig = {
      id: 'textParagraphTooLong',
      priority: 'high',
      docUrl:
        'https://github.com/vuminhhoa/seo-analyzer/blob/main/docs/checklist.md#textparagraphtoolong',
      fixPosition: 'longParagraph',
      ctaType: 'fix',
      parameters: {
        recommendedLength: 150,
        maximumRecommendedLength: 150
      },
      title: 'Paragraph length',
      content: {
        bad: 'Paragraph too long. Keep paragraph length less than 150 words for readability.',
        improve: '',
        good: 'Paragraph is optimized, with less than 150 words.'
      }
    };

    this.identifier = 'textParagraphTooLong';
    this._config = merge(defaultConfig, config);
  }

  /**
   * Check if there is language-specific config, and if so, overwrite the current config with it.
   *
   * @param {Researcher} researcher The researcher to use.
   *
   * @returns {Object} The config that should be used.
   */
  getConfig(researcher) {
    const currentConfig = this._config;
    const languageSpecificConfig = researcher.getConfig('paragraphLength');

    /*
     * If a language has a specific paragraph length config, check further if the assessment is run in product pages.
     * If it's run in product pages, override the default config parameters with the language specific config for product pages,
     * otherwise override it with the language specific config for default pages analysis.
     */
    if (languageSpecificConfig) {
      currentConfig.parameters = this._isProduct
        ? languageSpecificConfig.productPageParams
        : languageSpecificConfig.defaultPageParams;
    }

    return currentConfig;
  }

  /**
   *
   * @param paragraphsLength
   * @param tooLongParagraphs
   * @param config
   * @param i18n
   * @returns {{score: number, body: React.JSX.Element, status: string}}
   */
  calculateResult({paragraphsLength, config, i18n}) {
    let status = '';
    if (paragraphsLength.length === 0) {
      status = 'good';
    }

    const longestParagraphLength = paragraphsLength[0].countLength;

    if (longestParagraphLength <= config.parameters.recommendedLength) {
      status = 'good';
    }

    if (
      inRange(
        longestParagraphLength,
        config.parameters.recommendedLength,
        config.parameters.maximumRecommendedLength
      )
    ) {
      status = 'good';
    }

    if (longestParagraphLength > config.parameters.maximumRecommendedLength) {
      status = 'bad';
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
   * Sort the paragraphs based on word count.
   *
   * @param {Array} paragraphs The array with paragraphs.
   *
   * @returns {Array} The array sorted on word counts.
   */
  sortParagraphs(paragraphs) {
    return paragraphs.sort(function(a, b) {
      return b.countLength - a.countLength;
    });
  }

  /**
   * Runs the getParagraphLength module, based on this returns an assessment result with score and text.
   *
   * @param {Paper} paper             The paper to use for the assessment.
   * @param {Researcher} researcher   The researcher used for calling research.
   * @param i18n
   * @returns {object} The assessment result.
   */
  getResult({paper, researcher, i18n}) {
    let paragraphsLength = researcher.getResearch('getParagraphLength');

    paragraphsLength = this.sortParagraphs(paragraphsLength);
    const config = this.getConfig(researcher);

    const paragraphLengthResult = this.calculateResult({
      paragraphsLength,
      config,
      i18n
    });
    const assessmentResult = new AssessmentResult({config: this._config});

    assessmentResult.setScore(paragraphLengthResult.score);
    assessmentResult.setStatus(paragraphLengthResult.status);
    assessmentResult.setBody(paragraphLengthResult.body);

    return assessmentResult;
  }

  /**
   * Checks if the paragraphTooLong assessment is applicable to the paper.
   *
   * @param {Paper} paper The paper to check.
   *
   * @returns {boolean} Returns true if the assessment is applicable to the paper.
   */
  isApplicable(paper) {
    return this.hasEnoughContentForAssessment(paper);
  }
}
