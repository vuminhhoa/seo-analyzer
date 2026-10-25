import {merge} from 'lodash';
import {Text} from '@shopify/polaris';
import React from 'react';

import Assessment from '../assessment';
import AssessmentResult from '../../../values/AssessmentResult';

/**
 * Represents the assessment that assesses the SEO title width and gives the feedback accordingly.
 */
export default class PageTitleWidthAssessment extends Assessment {
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
      id: 'titleWidth',
      fixPosition: 'meta title',
      docUrl:
        'https://github.com/vuminhhoa/seo-analyzer/blob/main/docs/checklist.md#titlewidth',
      ctaType: 'fix',
      priority: 'high',
      title: 'Meta title width',
      // Google truncates titles to the device width (about 600px on desktop). Pass the measured
      // `titleWidth` (pixels) for an exact check; otherwise characters are used as an estimate.
      parameters: {
        minWidth: 400,
        maxWidth: 600,
        minLength: 40,
        maxLength: 60
      },
      content: {
        good: 'Title length is good, so it shows in full in search results.',
        improve: 'The title is short. Use the space to describe the page more specifically (about 40-60 characters).',
        bad: 'The title is too long and will be cut off in search results. Keep it to about 60 characters.'
      }
    };

    this.identifier = 'titleWidth';
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
    const {minWidth, maxWidth, minLength, maxLength} = this._config.parameters;
    const [size, min, max] = paper.hasTitleWidth()
      ? [paper.getTitleWidth(), minWidth, maxWidth]
      : [paper.getTitle().length, minLength, maxLength];

    let status = 'good';
    if (size > max) {
      status = 'bad';
    } else if (size < min) {
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
   * Checks whether the paper has a text.
   *
   * @param {Paper}       paper       The paper to use for the assessment.
   *
   * @returns {boolean} True when there is text.
   */
  isApplicable(paper) {
    return paper.hasTitle();
  }
}
