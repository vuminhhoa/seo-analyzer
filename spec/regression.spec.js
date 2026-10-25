import { describe, expect, it } from "vitest";
import { analyze } from "./helpers/analyze.js";
import papers from "./fixtures/papers.js";

// Locks in the status and score of every assessment for a set of sample papers.
// After an intended change (or an upstream sync), review the diff and run `yarn test -u`.
describe( "assessment results", () => {
	it.each( Object.entries( papers ) )( "%s", ( name, [ text, attributes ] ) => {
		const { score, assessments } = analyze( text, attributes );

		const results = Object.fromEntries(
			assessments
				.map( assessment => [ assessment.id, `${ assessment.status } (${ assessment.score })` ] )
				.sort( ( [ a ], [ b ] ) => a.localeCompare( b ) )
		);

		expect( Number.isFinite( score ) ).toBe( true );
		expect( { score, results } ).toMatchSnapshot();
	} );
} );
