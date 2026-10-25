import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { contentSEOCategory, technicalSEOCategory } from "../src/const/analysis.js";
import ContentAssessor from "../src/scoring/assessors/contentAssessor.js";
import SEOAssessor from "../src/scoring/assessors/seoAssessor.js";

const checklist = readFileSync( resolve( __dirname, "../docs/checklist.md" ), "utf8" );
const registered = [ ...new SEOAssessor( null ).getAvailableAssessments(), ...new ContentAssessor( null ).getAvailableAssessments() ];

// Guards against an assessment that runs but silently disappears from results or docs.
describe.each( registered.map( assessment => [ assessment._config.id, assessment ] ) )( "%s", ( id, assessment ) => {
	it( "belongs to exactly one result category", () => {
		expect( [ technicalSEOCategory.includes( id ), contentSEOCategory.includes( id ) ].filter( Boolean ) ).toHaveLength( 1 );
	} );
	it( "has a docs section that its \"Learn more\" link points to", () => {
		expect( assessment._config.docUrl ).toMatch( new RegExp( `checklist\\.md#${ id.toLowerCase() }$` ) );
		expect( checklist ).toContain( `<a name="${ id.toLowerCase() }"></a>` );
	} );
} );
