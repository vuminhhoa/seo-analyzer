import {languageProcessing} from '@seo-analyzer/index.js';
const {areWordsInSentence} = languageProcessing;

import getPassiveVerbs from '../config/internal/participlesShortenedList.js';

/**
 * Checks the passed sentence to see if it contains passive verbs.
 *
 * @param {string} sentence The sentence to match against.
 * @returns {Boolean} Whether the sentence contains passive voice.
 */
export default function isPassiveSentence(sentence) {
  return areWordsInSentence(getPassiveVerbs, sentence);
}
