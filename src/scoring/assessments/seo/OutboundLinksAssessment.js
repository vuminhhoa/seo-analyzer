import {isEmpty, merge} from 'lodash';
import React from 'react';
import {Text} from '@shopify/polaris';

import Assessment from '../assessment';
import AssessmentResult from '../../../values/AssessmentResult';
import {ExternalIcon} from '@shopify/polaris-icons';

/**
 * Assessment for calculating the outbound links in the text.
 */
export default class OutboundLinksAssessment extends Assessment {
  /**
   * Sets the identifier and the config.
   *
   * @param {Object} [config] The configuration to use.
   *
   * @returns {void}
   */
  constructor(config = {}) {
    super();

    const defaultConfig = {
      id: 'externalLinks',
      docUrl:
        'https://github.com/vuminhhoa/seo-analyzer/blob/main/docs/checklist.md#externallinks',
      fixPosition: 'description',
      icon: ExternalIcon,
      title: 'External links',
      priority: 'high',
      content: {
        improve: '',
        good: 'External links are used effectively.',
        bad: 'No external links found. Add relevant links to be more authoritative and informative.'
      }
    };

    this.identifier = 'externalLinks';
    this._config = merge(defaultConfig, config);
  }

  /**
   * Runs the getLinkStatistics module, based on this returns an assessment result with score.
   *
   * @param {Paper}       paper       The paper to use for the assessment.
   * @param {Researcher}  researcher  The researcher used for calling research.
   *
   * @param i18n
   * @returns {AssessmentResult} The assessment result.
   */
  getResult({paper, researcher, i18n}) {
    const linkStatistics = researcher.getResearch('getLinkStatistics');
    const assessmentResult = new AssessmentResult({config: this._config});

    const calculatedResult = this.calculateResult(linkStatistics, i18n);

    if (!isEmpty(linkStatistics)) {
      assessmentResult.setScore(calculatedResult.score);
      assessmentResult.setStatus(calculatedResult.status);
      assessmentResult.setBody(calculatedResult.body);
    }
    return assessmentResult;
  }

  /**
   * Checks whether paper has text.
   *
   * @param {Paper}       paper       The paper to use for the assessment.
   *
   * @returns {boolean} True when there is text.
   */
  isApplicable(paper) {
    return paper.hasText();
  }

  /**
   *
   * @param linkStatistics
   * @param i18n
   * @returns {{score: number, body: React.JSX.Element, status: string}}
   */
  calculateResult(linkStatistics, i18n) {
    let status = '';
    if (linkStatistics.externalTotal === 0) {
      status = 'bad';
    } else if (linkStatistics.externalNofollow === linkStatistics.externalTotal) {
      status = 'bad';
    } else if (linkStatistics.externalDofollow < linkStatistics.externalTotal) {
      status = 'good';
    } else if (linkStatistics.externalDofollow === linkStatistics.externalTotal) {
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
