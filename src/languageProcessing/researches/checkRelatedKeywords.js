/**
 * Checks how many sentences from a text contain at least one transition word or two-part transition word
 * that are defined in the transition words config and two part transition words config.
 *
 * @param {Paper} paper The Paper object to get text from.
 * @param {Researcher} researcher The researcher.
 *
 * @returns {object} An object with the total number of sentences in the text
 *                   and the total number of sentences containing one or more transition words.
 */
export default function(paper, researcher) {
  const data = paper.getData();
  const related_keywords = transformRelatedKeyword(data?.related_keywords || []);
  const string = getTextFullPage(data);
  return countWordsInRelatedKeywords({related_keywords, string});
}

export const transformRelatedKeyword = keywords =>
  keywords.map(keyword => (typeof keyword === 'string' ? {text: keyword} : keyword)) || [];

/**
 *
 * @param data
 * @returns {string}
 */
const getTextFullPage = data => {
  const faqString = data.faqs.status
    ? data.faqs.questions.map(i => i.question + ' ' + i.answer).join(' ')
    : '';
  const html = data.body_html || data.descriptionHtml;
  const bodyString = html?.length > 0 ? html.replace(/<\/?[^>]+(>|$)/g, ' ') : '';
  return [
    faqString,
    data.title,
    bodyString,
    data?.after_content,
    data.metafields_global_title_tag,
    data.metafields_global_description_tag
  ]
    .join(' ')
    .toLowerCase();
};

/**
 *
 * @param related_keywords
 * @param string
 * @returns {{totalWordUsed: number, words: {}, isWordUsedExceeding: boolean}}
 */
const countWordsInRelatedKeywords = ({related_keywords, string}) => {
  const total = string.split(/\s+/).filter(word => word.length > 0).length;
  const words = {};
  let totalWordUsed = 0;
  let isWordUsedExceeding = false;

  related_keywords.forEach(({text}) => {
    const keyword = text.toLowerCase();
    const length = (string.match(new RegExp(`\\b${keyword}\\b`, 'g')) || []).length;
    const percentage = parseFloat(((length / total) * 100).toFixed(1));
    if (!isWordUsedExceeding) {
      isWordUsedExceeding = percentage > 1;
    }
    totalWordUsed += length;
    words[text] = {length, percentage};
  });

  return {totalWordUsed, words, isWordUsedExceeding};
};
