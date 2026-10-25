export {measureTextWidth} from './createMeasurementElement';
export {getLanguagesWithWordFormSupport} from './getLanguagesWithWordFormSupport';
export {default as formatNumber} from './formatNumber';
export {getLanguagesWithWordComplexity} from './getLanguagesWithWordComplexity';
export {createAnchorOpeningTag} from './shortlinker';
export {default as getWordComplexityHelper} from './getWordComplexityHelper';
export {default as getWordComplexityConfig} from './getWordComplexityConfig';

import * as htmlEntities from './htmlEntities';

export {htmlEntities};

export function countWords(str) {
  const wordsArray = str.trim().split(/\s+/);

  return wordsArray.length;
}

/**
 * To find the first string in the second string
 * @param firstStr
 * @param secondStr
 * @returns {*}
 */
export const isIncludes = (firstStr, secondStr) => {
  const keywordParts = firstStr.split(' ');
  return keywordParts.every(part => secondStr.toLowerCase().includes(part));
};

/**
 * Helper function to check if the HTML string contains the keyword in subheadings.
 * @param {string} htmlString - The HTML string.
 * @param {string} keyword - The keyword.
 * @returns {boolean} True if the HTML string contains the keyword in subheadings, false otherwise.
 */
export function containsKeywordInSubheadings(htmlString, keyword) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  const subheadings = doc.querySelectorAll('h2, h3, h4, h5, h6');

  for (let i = 0; i < subheadings.length; i++) {
    if (subheadings[i].innerText.toLowerCase().includes(keyword)) {
      return true;
    }
  }

  return false;
}

/**
 *
 * @param htmlString
 * @param getCharCount
 * @returns {*|{charCount: *, wordCount: *}}
 */
export function countWordInHtml(htmlString, getCharCount = false) {
  const textOnly = htmlString.replace(/<[^>]*>/g, ' ');
  const words = textOnly.trim().split(/[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*/gu);
  const validWords = words.filter(word => word.length > 0);
  const wordCount = validWords.length;
  if (!getCharCount) {
    return wordCount;
  }
  const cleanedString = textOnly.replace(/\s/g, '');
  const charCount = cleanedString.length;
  return {wordCount, charCount};
}

/**
 *
 * @param htmlString
 * @param keyword
 * @returns {{keywordCount: number, totalWords: number, density: string}}
 */
export function calculateKeywordDensity(htmlString, keyword) {
  const spacedHtml = htmlString.replace(/(<[^>]+>)/g, ' $1 ');
  const tempElement = document.createElement('div');
  tempElement.innerHTML = spacedHtml;
  const textContent = tempElement.textContent || tempElement.innerText || '';
  const cleanedText = textContent
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();

  const lowerCaseKeyword = keyword.toLowerCase();

  const escapedKeyword = lowerCaseKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const keywordCount = (cleanedText.match(new RegExp(escapedKeyword, 'g')) || []).length;

  const totalWords = cleanedText.split(/\s+/).filter(word => word.length > 0).length;

  const density = (keywordCount / totalWords) * 100;

  return {
    keywordCount: keywordCount,
    totalWords: totalWords,
    density: density.toFixed(2)
  };
}

/**
 *
 * @param htmlString
 * @returns {{isMissing: boolean, missingAltTags: *[], imgTags: *}|{isMissing: boolean, imgTags: *[]}|{isMissing: boolean, imgTags: *}}
 */
export function checkMissingAlt(htmlString) {
  const imgTags = htmlString.match(/<img[^>]*>/g);

  if (!imgTags) {
    return {isMissing: false, imgTags: []};
  }

  const missingAltTags = [];

  imgTags.forEach(imgTag => {
    if (!/alt\s*=\s*["'][^"']*["']/.test(imgTag) || /alt\s*=\s*["']["']/.test(imgTag)) {
      missingAltTags.push(imgTag);
    }
  });

  if (missingAltTags.length === 0) {
    return {isMissing: false, imgTags};
  } else {
    return {isMissing: true, imgTags, missingAltTags};
  }
}
