// External dependencies.
import {filter, find, findIndex, isFunction, isUndefined, map} from 'lodash';

// Internal dependencies.
import AssessmentResult from '../../values/AssessmentResult.js';
import {build} from '../../parse/build';
import LanguageProcessor from '../../parse/language/LanguageProcessor.js';
import MissingArgument from '../../errors/missingArgument.js';
import {showTrace} from '../../helpers/errors.js';
import {Text} from '@shopify/polaris';
import React from 'react';

// The maximum score of individual assessment is 9. This is why we set the "score rating" here to 9.
const ScoreRating = 9;

/**
 * The Assessor is a base class for all assessors.
 */
class Assessor {
  /**
   * Creates a new Assessor instance.
   * @param {Researcher}	researcher	The researcher to use.
   * @param {Object}		[config]	The assessor config.
   */
  constructor(researcher, config) {
    this.type = 'assessor';
    this.setResearcher(researcher);
    this._assessments = [];
  }

  /**
   * Checks if the researcher is defined and sets it.
   *
   * @param   {Researcher} researcher The researcher to use in the assessor.
   *
   * @throws  {MissingArgument} Parameter needs to be a valid researcher object.
   * @returns {void}
   */
  setResearcher(researcher) {
    if (isUndefined(researcher)) {
      throw new MissingArgument('The assessor requires a researcher.');
    }
    this._researcher = researcher;
  }

  /**
   * Gets all available assessments.
   * @returns {Assessment[]} assessment
   */
  getAvailableAssessments() {
    return this._assessments;
  }

  /**
   * Checks whether the Assessment is applicable.
   *
   * @param {Assessment} assessment The Assessment object that needs to be checked.
   * @param {Paper} paper The Paper object to check against.
   * @param {Researcher} [researcher] The Researcher object containing additional information.
   * @returns {boolean} Whether or not the Assessment is applicable.
   */
  isApplicable(assessment, paper, researcher) {
    const ignoreAssessments = paper.getIgnoredAssessments();

    if (ignoreAssessments.includes(assessment._config.id)) {
      return false;
    }

    if (
      assessment.hasOwnProperty('isApplicable') ||
      typeof assessment.isApplicable === 'function'
    ) {
      return assessment.isApplicable(paper, researcher);
    }

    return true;
  }

  /**
   * Determines whether an assessment has a marker.
   *
   * @param {Assessment} assessment The assessment to check for.
   * @returns {boolean} Whether or not the assessment has a marker.
   */
  hasMarker(assessment) {
    return (
      isFunction(this._config.marker) &&
      (assessment.hasOwnProperty('getMarks') || typeof assessment.getMarks === 'function')
    );
  }

  /**
   * Returns the specific marker for this assessor.
   *
   * @returns {Function} The specific marker for this assessor.
   */
  getSpecificMarker() {
    return this._config.marker;
  }

  /**
   * Returns the paper that was most recently assessed.
   *
   * @returns {Paper} The paper that was most recently assessed.
   */
  getPaper() {
    return this._lastPaper;
  }

  /**
   * Runs the researches defined in the task list or the default researches.
   *
   * @param {Paper} paper The paper to run assessments on.
   * @param i18n
   * @returns {void}
   */
  assess(paper, i18n) {
    this._researcher.setPaper(paper);

    const languageProcessor = new LanguageProcessor(this._researcher);
    const shortcodes = paper._attributes && paper._attributes.shortcodes;
    paper.setTree(build(paper, languageProcessor, shortcodes));

    let assessments = this.getAvailableAssessments();
    this.results = [];

    assessments = filter(
      assessments,
      function(assessment) {
        return this.isApplicable(assessment, paper, this._researcher);
      }.bind(this)
    );

    this.results = map(assessments, assessment =>
      this.executeAssessment({
        paper,
        researcher: this._researcher,
        assessment,
        i18n
      })
    );
    this._lastPaper = paper;
  }

  /**
   * Executes an assessment and returns the AssessmentResult.
   *
   * @param {Paper} paper The paper to pass to the assessment.
   * @param {Researcher} researcher The researcher to pass to the assessment.
   * @param {Assessment} assessment The assessment to execute.
   * @param i18n
   * @returns {AssessmentResult} The result of the assessment.
   */
  executeAssessment({paper, researcher, assessment, i18n}) {
    let result;

    try {
      if (i18n) {
        assessment._config.title = i18n.translate(`SeoAnalyzer.${assessment._config.id}.title`);
        assessment._config.content = {
          good: i18n.translate(`SeoAnalyzer.${assessment._config.id}.good`),
          improve: i18n.translate(`SeoAnalyzer.${assessment._config.id}.improve`),
          bad: i18n.translate(`SeoAnalyzer.${assessment._config.id}.bad`)
        };
      }

      const skippedAssessments = paper.getSkippedAssessments();

      if (skippedAssessments.includes(assessment._config.id)) {
        const assessmentResult = new AssessmentResult({config: assessment._config});

        const score = assessment.getScore(assessment._config.priority, 'good');

        assessmentResult.setScore(score);
        assessmentResult.setStatus('good');
        assessmentResult.setTitle(assessment._config.title);
        assessmentResult.setBody(
          <Text as={'span'}>
            {assessment._config.content.good}{' '}
            {assessment._config.docUrl && (
              <a href={assessment._config.docUrl} target="_blank" rel="noreferrer">
                {i18n ? i18n.translate(`SeoAnalyzer.Button.learnMore`) : 'Learn more'}
              </a>
            )}
          </Text>
        );

        result = assessmentResult;
      } else {
        result = assessment.getResult({paper, researcher, i18n});
      }
      result.setIdentifier(assessment._config.id);
    } catch (assessmentError) {
      showTrace(assessmentError);

      result = new AssessmentResult();

      result.setScore(-1);
    }
    return result;
  }

  /**
   * Filters out all assessment results that have no score and no text.
   *
   * @returns {AssessmentResult[]} The array with all the valid assessments.
   */
  getValidResults() {
    return filter(
      this.results,
      function(result) {
        return this.isValidResult(result);
      }.bind(this)
    );
  }

  /**
   * Returns if an assessmentResult is valid.
   *
   * @param {AssessmentResult} assessmentResult The assessmentResult to validate.
   * @returns {boolean} whether or not the result is valid.
   */
  isValidResult(assessmentResult) {
    return assessmentResult.hasScore() && assessmentResult.hasText();
  }

  /**
   * Returns the overall score. Calculates the total score by adding all scores and dividing these
   * by the number of results times the ScoreRating.
   *
   * @returns {number} The overall score.
   */
  calculateOverallScore() {
    const results = this.getValidResults();

    const totalScore = results.reduce(
      (total, assessmentResult) => total + assessmentResult.getScore(),
      0
    );

    return Math.round((totalScore / (results.length * ScoreRating)) * 100) || 0;
  }

  /**
   * Registers an assessment and adds it to the internal assessments object.
   *
   * @param {string} name The name of the assessment.
   * @param {Assessment} assessment The object containing function to run as an assessment and it's requirements.
   * @returns {boolean} Whether registering the assessment was successful.
   */
  addAssessment(name, assessment) {
    if (!assessment.hasOwnProperty('identifier')) {
      assessment.identifier = name;
    }
    // If the assessor already has the same assessment, remove it and replace it with the new assessment with the same identifier.
    if (this.getAssessment(assessment.identifier)) {
      this.removeAssessment(assessment.identifier);
    }

    this._assessments.push(assessment);
    return true;
  }

  /**
   * Removes a specific Assessment from the list of Assessments.
   *
   * @param {string} name The Assessment to remove from the list of assessments.
   * @returns {void}
   */
  removeAssessment(name) {
    const toDelete = findIndex(this._assessments, function(assessment) {
      return assessment.hasOwnProperty('identifier') && name === assessment.identifier;
    });

    if (-1 !== toDelete) {
      this._assessments.splice(toDelete, 1);
    }
  }

  /**
   * Returns an assessment by identifier
   *
   * @param {string} identifier The identifier of the assessment.
   * @returns {undefined|Assessment} The object if found, otherwise undefined.
   */
  getAssessment(identifier) {
    return find(this._assessments, function(assessment) {
      return assessment.hasOwnProperty('identifier') && identifier === assessment.identifier;
    });
  }

  /**
   * Checks which of the available assessments are applicable and returns an array with applicable assessments.
   *
   * @returns {Assessment[]} The array with applicable assessments.
   */
  getApplicableAssessments() {
    const availableAssessments = this.getAvailableAssessments();
    return filter(
      availableAssessments,
      function(availableAssessment) {
        return this.isApplicable(availableAssessment, this.getPaper(), this._researcher);
      }.bind(this)
    );
  }
}

export default Assessor;
