import {merge} from 'lodash';
import React from 'react';
import {Text} from '@shopify/polaris';
import AssessmentResult from '../../../values/AssessmentResult';
import Assessment from '../assessment';

/**
 * Represents the assessment that checks whether long texts are broken up by subheadings.
 */
export default class SubheadingDistributionAssessment extends Assessment {
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
      id: 'subheadingDistribution',
      priority: 'medium',
      docUrl:
        'https://github.com/vuminhhoa/seo-analyzer/blob/main/docs/checklist.md#subheadingdistribution',
      fixPosition: 'subheading',
      ctaType: 'fix',
      title: 'Subheading distribution',
      // Word counts, following Yoast SEO. Doubled for languages counted in characters.
      parameters: {
        applicableIfTextLongerThan: 300,
        recommendedMaximumLength: 300,
        maximumLength: 350
      },
      content: {
        good: 'The text is broken up by subheadings.',
        improve: 'A section has more than {recommended} words without a subheading. Add a subheading to break it up.',
        bad: 'A section has more than {maximum} words without a subheading. Add subheadings so readers can scan the text.'
      }
    };

    this.identifier = 'subheadingDistribution';
    this._config = merge(defaultConfig, config);
  }

  /**
   *
   * @param paper
   * @param i18n
   * @returns {{score: number, body: React.JSX.Element, status: string}}
   */
  calculateResult(paper, i18n) {
    const {recommendedMaximumLength, maximumLength} = this._config.parameters;
    const factor = this._unit === 'character' ? 2 : 1;
    // Without any subheading the research returns no sections: the whole text is one section.
    const hasSubheadings = this._sections.some(section => section.subheading);
    const longest = hasSubheadings
      ? Math.max(0, ...this._sections.map(section => section.countLength))
      : this._textLength;

    let status = 'good';
    if (longest > maximumLength * factor) {
      status = 'bad';
    } else if (longest > recommendedMaximumLength * factor) {
      status = 'improve';
    }

    const score = this.getScore(this._config.priority, status);
    const message = this._config.content[status]
      .replace('{recommended}', recommendedMaximumLength * factor)
      .replace('{maximum}', maximumLength * factor);

    return {
      score,
      status,
      body: (
        <Text as={'span'}>
          {message}{' '}
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
    this._sections = researcher.getResearch('getSubheadingTextLengths');
    const calculatedResult = this.calculateResult(paper, i18n);
    const assessmentResult = new AssessmentResult({config: this._config});

    assessmentResult.setScore(calculatedResult.score);
    assessmentResult.setStatus(calculatedResult.status);
    assessmentResult.setBody(calculatedResult.body);

    return assessmentResult;
  }

  /**
   * Only applies to longer texts.
   *
   * @param {Paper} paper The paper to check.
   * @param {Researcher} researcher The researcher.
   *
   * @returns {boolean} Whether the assessment applies.
   */
  isApplicable(paper, researcher) {
    const {count, unit} = researcher.getResearch('wordCountInText');
    this._unit = unit;
    this._textLength = count;
    const factor = unit === 'character' ? 2 : 1;
    return count > this._config.parameters.applicableIfTextLongerThan * factor;
  }
}
