import {merge, partition, sortBy} from 'lodash';
import React from 'react';
import {Text} from '@shopify/polaris';
import AssessmentResult from '../../../values/AssessmentResult';
import Assessment from '../assessment';
import {TextBlockIcon} from '@shopify/polaris-icons';

const maximumConsecutiveDuplicates = 2;

/**
 * Represents the assessment that checks whether there are three or more consecutive sentences beginning with the same word.
 */
export default class SentenceBeginningsAssessment extends Assessment {
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
      id: 'sentenceBeginnings',
      priority: 'medium',
      ctaType: 'fix',
      docUrl:
        'https://github.com/vuminhhoa/seo-analyzer/blob/main/docs/checklist.md#sentencebeginnings',
      fixPosition: 'description',
      icon: TextBlockIcon,
      title: 'Sentence beginnings',
      content: {
        improve: '',
        bad:
          'Found sentences with repetitive beginnings. Change the wording for more engaging content.',
        good: 'No sentences with repetitive beginnings found.'
      }
    };

    this.identifier = 'sentenceBeginnings';
    this._config = merge(defaultConfig, config);
  }

  /**
   * Counts and groups the number too often used sentence beginnings and determines the lowest count within that group.
   *
   * @param {array} sentenceBeginnings The array containing the objects containing the beginning words and counts.
   *
   * @returns {object} The object containing the total number of too often used beginnings and the lowest count within those.
   */
  groupSentenceBeginnings(sentenceBeginnings) {
    const tooOften = partition(sentenceBeginnings, function(word) {
      return word.count > maximumConsecutiveDuplicates;
    });

    if (tooOften[0].length === 0) {
      return {total: 0};
    }

    const sortedCounts = sortBy(tooOften[0], function(word) {
      return word.count;
    });

    return {total: tooOften[0].length, lowestCount: sortedCounts[0].count};
  }

  /**
   *
   * @param groupedSentenceBeginnings
   * @param i18n
   * @returns {{score: number, body: React.JSX.Element, status: string}}
   */
  calculateSentenceBeginningsResult(groupedSentenceBeginnings, i18n) {
    let status = '';
    if (groupedSentenceBeginnings.total > 0) {
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

  /**
   *
   * @param paper
   * @param researcher
   * @param i18n
   * @returns {AssessmentResult}
   */
  getResult({paper, researcher, i18n}) {
    const sentenceBeginnings = researcher.getResearch('getSentenceBeginnings');
    const groupedSentenceBeginnings = this.groupSentenceBeginnings(sentenceBeginnings);
    const calculatedResult = this.calculateSentenceBeginningsResult(
      groupedSentenceBeginnings,
      i18n
    );
    const assessmentResult = new AssessmentResult({config: this._config});

    assessmentResult.setScore(calculatedResult.score);
    assessmentResult.setStatus(calculatedResult.status);
    assessmentResult.setBody(calculatedResult.body);

    return assessmentResult;
  }

  /**
   * Checks if the sentence beginnings assessment is applicable to the paper.
   *
   * @param {Object}      paper       The paper to check.
   * @param {Researcher}  researcher  The researcher object.
   *
   * @returns {boolean} Returns true if the language is available and the paper is not empty.
   */
  isApplicable(paper, researcher) {
    return (
      this.hasEnoughContentForAssessment(paper) && researcher.hasResearch('getSentenceBeginnings')
    );
  }
}
