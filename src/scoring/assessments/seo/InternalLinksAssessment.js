import {merge} from 'lodash';
import React from 'react';
import {Text} from '@shopify/polaris';

import Assessment from '../assessment';
import AssessmentResult from '../../../values/AssessmentResult';
import {LinkIcon} from '@shopify/polaris-icons';

/**
 * Assessment to check whether the text has internal links and whether they are followed or no-followed.
 */
class InternalLinksAssessment extends Assessment {
  /**
   * Sets the identifier and the config.
   *
   * @param {Object} [config] The configuration to use.
   * @param {number} [config.parameters.recommendedMinimum] The recommended minimum number of internal links in the text.
   * @param {number} [config.scores.allInternalFollow] The score to return if all internal links are do-follow.
   * @param {number} [config.scores.someInternalFollow] The score to return if some but not all internal links are do-follow.
   * @param {number} [config.scores.noneInternalFollow] The score to return if all internal links are no-follow.
   * @param {number} [config.scores.noInternal] The score to return if there are no internal links.
   * @param {string} [config.url] The URL to the relevant KB article.
   *
   * @returns {void}
   */
  constructor(config = {}) {
    super();

    const defaultConfig = {
      id: 'internalLinks',
      fixPosition: '',
      docUrl:
        'https://github.com/vuminhhoa/seo-analyzer/blob/main/docs/checklist.md#internallinks',
      icon: LinkIcon,
      priority: 'high',
      title: 'Internal links',
      content: {
        good: 'Internal links are used effectively.',
        improve: '',
        bad: 'No internal links found. Add links to other relevant pages on your website.'
      }
    };

    this.identifier = 'internalLinks';
    this._config = merge(defaultConfig, config);
  }

  /**
   * Runs the getLinkStatistics module, based on this returns an assessment result with score.
   *
   * @param {Paper} paper The paper to use for the assessment.
   * @param {Researcher} researcher The researcher used for calling research.
   * @param i18n
   * @returns {AssessmentResult} The result of the assessment.
   */
  getResult({paper, researcher, i18n}) {
    this.linkStatistics = researcher.getResearch('getLinkStatistics');
    const assessmentResult = new AssessmentResult({config: this._config});

    const calculatedResult = this.calculateResult(i18n);
    assessmentResult.setScore(calculatedResult.score);
    assessmentResult.setStatus(calculatedResult.status);
    assessmentResult.setBody(calculatedResult.body);

    return assessmentResult;
  }

  /**
   * Checks if assessment is applicable to the paper.
   *
   * @param {Paper} paper The paper to be analyzed.
   *
   * @returns {boolean} Whether the paper has text.
   */
  isApplicable(paper) {
    return paper.hasText();
  }

  /**
   * Returns a score and text based on the linkStatistics object.
   *
   * @returns {Object} ResultObject with score and text
   */
  calculateResult(i18n) {
    let status = '';
    if (
      this.linkStatistics.internalTotal === 0 ||
      this.linkStatistics.internalNofollow === this.linkStatistics.internalTotal
    ) {
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

export default InternalLinksAssessment;
