import { describe, expect, it } from "vitest";
import { assessmentResult } from "./helpers/analyze.js";

const status = ( text, h1Count ) => assessmentResult( text, h1Count === undefined ? {} : { h1Count }, "singleH1" ).status;

describe( "SingleH1Assessment", () => {
	it( "counts H1s in the text when h1Count is not provided", () => {
		expect( status( "<h1>Title</h1><p>Text.</p>" ) ).toBe( "good" );
		expect( status( "<p>Text.</p>" ) ).toBe( "bad" );
		expect( status( "<h1>One</h1><h1 class=\"x\">Two</h1>" ) ).toBe( "improve" );
	} );

	it( "adds the H1s rendered outside the text (h1Count)", () => {
		expect( status( "<p>Text.</p>", 1 ) ).toBe( "good" );
		expect( status( "<p>Text.</p>", 0 ) ).toBe( "bad" );
		expect( status( "<h1>Title</h1>", 1 ) ).toBe( "improve" );
		expect( status( "<p>Text.</p>", 2 ) ).toBe( "improve" );
	} );

	it( "always produces a numeric score", () => {
		const result = assessmentResult( "<p>Text.</p>", {}, "singleH1" );
		expect( Number.isFinite( result.score ) ).toBe( true );
	} );
} );
