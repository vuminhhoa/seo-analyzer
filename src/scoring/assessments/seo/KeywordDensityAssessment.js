import {merge} from 'lodash';
import React from 'react';
import {Text} from '@shopify/polaris';

import Assessment from '../assessment';
import AssessmentResult from '../../../values/AssessmentResult';

import keyphraseLengthFactor from '../../../scoring/helpers/assessments/keyphraseLengthFactor';

/**
 * Represents the assessment that will look if the keyphrase density is within the recommended range.
 */
class KeyphraseDensityAssessment extends Assessment {
  /**
   *
   * @param config
   */
  constructor(config = {}) {
    super();

    const defaultConfig = {
      id: 'keyphraseDensity',
      fixPosition: 'highlightKeyword',
      docUrl:
        'https://github.com/vuminhhoa/seo-analyzer/blob/main/docs/checklist.md#keyphrasedensity',
      ctaType: 'fix',
      priority: 'high',
      title: 'Main keyword density',
      content: {
        good: 'Keyword density is optimized, between 1 - 1.5%.',
        bad: 'Keep keyword density from 1% - 1.5%.',
        improve: ''
      }
    };

    this.identifier = 'keyphraseDensity';
    this._config = merge(defaultConfig, config);
  }

  /**
   * Runs the keyphrase density module, based on this returns an assessment
   * result with score.
   *
   * @param {Paper} paper The paper to use for the assessment.
   * @param {Researcher} researcher The researcher used for calling the research.
   *
   * @param i18n
   * @returns {AssessmentResult} The result of the assessment.
   */
  getResult({paper, researcher, i18n}) {
    this._keyphraseCount = researcher.getResearch('getKeyphraseCount');
    const keyphraseLength = this._keyphraseCount.keyphraseLength;

    this._keyphraseDensity = researcher.getResearch('getKeyphraseDensity');
    this._keyphraseDensity = this._keyphraseDensity * keyphraseLengthFactor(keyphraseLength);

    const assessmentResult = new AssessmentResult({config: this._config});

    const calculatedResult = this.calculateResult(paper, i18n);

    assessmentResult.setScore(calculatedResult.score);
    assessmentResult.setStatus(calculatedResult.status);
    assessmentResult.setBody(calculatedResult.body);
    assessmentResult.setTitle(calculatedResult.title);
    return assessmentResult;
  }

  /**
   * Returns the score for the keyphrase density.
   *
   * @returns {Object} The object with calculated score and resultText.
   */
  calculateResult(paper, i18n) {
    const density = this._keyphraseDensity;
    let status = '';
    if (density < 1 || density > 1.5) {
      status = 'bad';
    }
    if (density >= 1 && density <= 1.5) {
      status = 'good';
    }
    const score = this.getScore(this._config.priority, status);

    return {
      title: (this._config.title || 'Main keyword density') + ': ' + density.toFixed(2) + '%',
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
   * Checks whether the paper has a text of the minimum required length and a keyphrase is set. Language-specific length requirements and methods
   * of counting text length may apply (e.g. for Japanese, the text should be counted in characters instead of words, which also makes the minimum
   * required length higher).
   *
   * @param {Paper} 		paper 		The paper to use for the assessment.
   * @param {Researcher}  researcher  The paper to use for the assessment.
   *
   * @returns {boolean} True if applicable.
   */
  isApplicable(paper, researcher) {
    return paper.hasText() && paper.hasKeyword();
  }
}

export default KeyphraseDensityAssessment;
