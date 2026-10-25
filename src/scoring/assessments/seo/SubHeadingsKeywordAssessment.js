import React from 'react';
import {Text} from '@shopify/polaris';

import {merge} from 'lodash';
import Assessment from '../assessment';
import AssessmentResult from '../../../values/AssessmentResult';

/**
 * Represents the assessment that checks if the keyword is present in one of the subheadings.
 */
export default class SubHeadingsKeywordAssessment extends Assessment {
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
      id: 'subheadingsKeyword',
      ctaType: 'fix',
      docUrl:
        'https://github.com/vuminhhoa/seo-analyzer/blob/main/docs/checklist.md#subheadingskeyword',
      priority: 'medium',
      fixPosition: 'subheading',
      title: 'Keyword in Subheading',
      content: {
        good: 'Keywords are included in subheadings.',
        bad:
          'Keyword not found in any subheadings. Include it in at least one subheading (H2, H3, etc.).',
        improve: ''
      }
    };

    this.identifier = 'subheadingsKeyword';
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
    this._subHeadings = researcher.getResearch('matchKeywordInSubheadings');

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
    let status = '';
    if (this._subHeadings.matches.numberOfSubheadings > 0) {
      status = 'good';
    } else {
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
   * Checks whether the paper has a text.
   *
   * @param {Paper}       paper       The paper to use for the assessment.
   *
   * @returns {boolean} True when there is text.
   */
  isApplicable(paper) {
    return paper.hasKeyword();
  }
}
