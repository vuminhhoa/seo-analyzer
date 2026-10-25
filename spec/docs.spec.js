import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { analyze } from "./helpers/analyze.js";

const checklist = readFileSync( resolve( __dirname, "../docs/checklist.md" ), "utf8" );
const anchors = new Set( [ ...checklist.matchAll( /<a name="([^"]+)"><\/a>/g ) ].map( match => match[ 1 ] ) );

describe( "docs/checklist.md", () => {
	it( "has a section for every assessment's \"Learn more\" link", () => {
		const { assessments } = analyze( "<h1>Coffee</h1><p>Coffee text.</p>", { keyword: "coffee" } );
		const missing = assessments
			.filter( assessment => assessment.docUrl )
			.filter( assessment => ! anchors.has( assessment.docUrl.split( "#" )[ 1 ] ) )
			.map( assessment => assessment.id );

		expect( missing ).toEqual( [] );
	} );
} );
