import { Paper, CombinedAssessor } from "../../src/index.js";
import getResearcher from "../../src/languageProcessing/getResearcher.js";

/**
 * Runs the CombinedAssessor on a text, as a consumer would.
 *
 * @param {string} text The HTML text.
 * @param {Object} attributes The Paper attributes.
 *
 * @returns {{score: number, assessments: Object[]}} The score and every assessment result.
 */
export function analyze( text, attributes = {} ) {
	const paper = new Paper( text, { locale: "en_US", ...attributes } );
	const Researcher = getResearcher( paper.getLocale() );
	const assessor = new CombinedAssessor( new Researcher( paper ) );
	assessor.assess( paper );

	return { score: assessor.getScore(), assessments: assessor.assessments };
}

/**
 * Returns a single assessment result by id.
 *
 * @param {string} text The HTML text.
 * @param {Object} attributes The Paper attributes.
 * @param {string} id The assessment id.
 *
 * @returns {Object|undefined} The assessment result.
 */
export function assessmentResult( text, attributes, id ) {
	return analyze( text, attributes ).assessments.find( assessment => assessment.id === id );
}
