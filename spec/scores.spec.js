import { describe, expect, it } from "vitest";
import { POINT, priorityRate, statusRate } from "../src/const/analysis.js";
import { analyze } from "./helpers/analyze.js";
import papers from "./fixtures/papers.js";

describe( "assessment scores", () => {
	it.each( Object.entries( papers ) )( "match each assessment's status and priority (%s)", ( name, [ text, attributes ] ) => {
		const mismatched = analyze( text, attributes ).assessments
			.filter( assessment => assessment.score !== POINT * priorityRate[ assessment.priority ] * statusRate[ assessment.status ] )
			.map( assessment => `${ assessment.id }: ${ assessment.status }/${ assessment.priority } scored ${ assessment.score }` );

		expect( mismatched ).toEqual( [] );
	} );
} );
