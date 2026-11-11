import { afterEach, describe, expect, it, vi } from "vitest";
import { Paper } from "../src/index.js";
import { calculateKeywordDensity } from "../src/helpers/index.js";
import checkRelatedKeywords from "../src/languageProcessing/researches/checkRelatedKeywords.js";
import videoCount from "../src/languageProcessing/researches/videoCount.js";
import MetaTitleKeywordAssessment from "../src/scoring/assessments/seo/MetaTitleKeywordAssessment.js";
import MetaDescriptionKeywordAssessment from "../src/scoring/assessments/seo/MetaDescriptionKeywordAssessment.js";

// The analyzed HTML, keyword and related keywords come from the page being edited, so they must be
// treated as data: never parsed into the live document, never compiled as a regular expression.

const timed = fn => {
	const start = Date.now();
	const result = fn();
	return { result, ms: Date.now() - start };
};

describe( "calculateKeywordDensity", () => {
	afterEach( () => vi.restoreAllMocks() );

	it( "parses the HTML in an inert document instead of the live one", () => {
		const createElement = vi.spyOn( document, "createElement" );
		const result = calculateKeywordDensity( '<p>Red mug</p><img src="x" onerror="window.__pwned = 1"><p>mug</p>', "mug" );

		expect( createElement ).not.toHaveBeenCalled();
		expect( window.__pwned ).toBeUndefined();
		expect( result.keywordCount ).toBe( 2 );
		expect( result.totalWords ).toBe( 3 );
	} );
} );

describe( "keyword matching", () => {
	it( "treats regex characters in the keyword literally", () => {
		const paper = new Paper( "<p>Text.</p>", { keyword: "c++ guide", title: "A c++ guide", description: "Our c++ guide." } );

		expect( new MetaTitleKeywordAssessment().calculateResult( paper ).status ).toBe( "good" );
		expect( new MetaDescriptionKeywordAssessment().calculateResult( paper ).status ).toBe( "good" );
	} );

	it( "does not backtrack catastrophically on a hostile keyword", () => {
		const paper = new Paper( "<p>Text.</p>", { keyword: "(x+x+)+y", title: "x".repeat( 40 ), description: "x".repeat( 40 ) } );
		const { ms } = timed( () => {
			new MetaTitleKeywordAssessment().calculateResult( paper );
			new MetaDescriptionKeywordAssessment().calculateResult( paper );
		} );

		expect( ms ).toBeLessThan( 1000 );
	} );

	it( "treats regex characters in related keywords literally", () => {
		const paper = new Paper( "", { data: { related_keywords: [ "c++", "(a+)+$", "mug" ], faqs: {}, body_html: `<p>A mug. ${ "a".repeat( 40 ) }!</p>` } } );
		const { result, ms } = timed( () => checkRelatedKeywords( paper ) );

		expect( ms ).toBeLessThan( 1000 );
		expect( result.words.mug.length ).toBe( 1 );
		expect( result.words[ "(a+)+$" ].length ).toBe( 0 );
	} );
} );

describe( "videoCount", () => {
	it( "counts videos, video iframes and video sources", () => {
		const text = '<video src="a.mp4"></video><VIDEO>x</Video><iframe src="https://www.youtube.com/embed/x"></iframe>' +
			'<iframe src="https://example.com/map"></iframe><source src=\'b.webm?x=1\'>';

		expect( videoCount( new Paper( text ) ) ).toBe( 5 );
	} );

	it( "stays linear on unclosed tags and attributes", () => {
		for ( const text of [
			'src="'.repeat( 20000 ),
			"<video ".repeat( 20000 ),
			"<iframe ".repeat( 20000 ),
			'<iframe src="https://youtube.com/'.repeat( 3000 ),
			'<iframe src="https://example.com/ '.repeat( 5000 ) + ">",
		] ) {
			expect( timed( () => videoCount( new Paper( text ) ) ).ms ).toBeLessThan( 1000 );
		}
	} );
} );
