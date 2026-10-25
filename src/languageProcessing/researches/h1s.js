/**
 * Gets all H1s in a text, including their content and their position information.
 *
 * @param {Paper} paper The paper for which to get the H1s.
 *
 * @returns {number | null} An array with all H1s, their content and position.
 */
export default function(paper) {
  return paper.getH1Count();
}
