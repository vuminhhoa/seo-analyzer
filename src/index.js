import * as assessments from './scoring/assessments';
import * as helpers from './helpers';
import * as markers from './markers';
import * as interpreters from './scoring/interpreters';
import * as languageProcessing from './languageProcessing';
import * as values from './values';
import * as assessors from './scoring/assessors';
import Assessor from './scoring/assessors/assessor';
import CombinedAssessor from './scoring/assessors/combinedAssessor';
import ContentAssessor from './scoring/assessors/contentAssessor';
import SeoAssessor from './scoring/assessors/seoAssessor';
import Paper from './values/Paper';
import AssessmentResult from './values/AssessmentResult';
import Assessment from './scoring/assessments/assessment';
import {DIFFICULTY} from './languageProcessing/researches/getFleschReadingScore';

import Factory from './helpers/factory';

/*
 * Everything exported here is put on the `yoast.analysis` global in the plugin.
 */
export {
  Assessor,
  ContentAssessor,
  SeoAssessor,
  CombinedAssessor,
  Paper,
  AssessmentResult,
  Assessment,
  assessments,
  assessors,
  helpers,
  markers,
  interpreters,
  languageProcessing,
  values,
  DIFFICULTY,
  Factory
};

/*
 * Used for backwards compatibility reasons.
 * For new exports, please add it as a named dependency above instead.
 */
export default {
  Assessor,
  ContentAssessor,
  SeoAssessor,
  CombinedAssessor,

  Paper,
  AssessmentResult,

  assessments,
  helpers,
  markers,
  interpreters,
  languageProcessing,
  values
};
