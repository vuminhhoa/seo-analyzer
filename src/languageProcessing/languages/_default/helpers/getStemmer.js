import {languageProcessing} from '@seo-analyzer/index.js';
const {baseStemmer} = languageProcessing;

/**
 * Returns the stemmer for a researcher.
 *
 * @returns {Function} The stemmer.
 */
export default function getStemmer() {
  return baseStemmer;
}
