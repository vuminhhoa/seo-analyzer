import { describe, expect, it } from "vitest";
import { assessmentResult } from "./helpers/analyze.js";

const status = ( id, text, attributes = {} ) => assessmentResult( text, attributes, id )?.status;
const words = count => Array.from( { length: count }, ( _, i ) => `word${ i }` ).join( " " );

describe( "keyphraseDensity (0.5% - 3%)", () => {
	// 200 words of filler plus N keyword occurrences.
	const text = n => `<p>${ words( 200 ) } ${ "coffee ".repeat( n ) }</p>`;

	it( "flags a keyword that barely appears", () => {
		expect( status( "keyphraseDensity", text( 0 ), { keyword: "coffee" } ) ).toBe( "improve" );
	} );
	it( "accepts a natural density", () => {
		expect( status( "keyphraseDensity", text( 3 ), { keyword: "coffee" } ) ).toBe( "good" );
	} );
	it( "flags keyword stuffing", () => {
		expect( status( "keyphraseDensity", text( 20 ), { keyword: "coffee" } ) ).toBe( "bad" );
	} );
} );

describe( "metaDescriptionLength (120 - 160 characters)", () => {
	const check = length => status( "metaDescriptionLength", "<p>Text.</p>", { description: "a".repeat( length ) } );

	it( "fails when missing", () => expect( check( 0 ) ).toBe( "bad" ) );
	it( "suggests a longer description", () => expect( check( 80 ) ).toBe( "improve" ) );
	it( "accepts 120 to 160 characters", () => {
		expect( check( 120 ) ).toBe( "good" );
		expect( check( 160 ) ).toBe( "good" );
	} );
	it( "warns about truncation", () => expect( check( 200 ) ).toBe( "improve" ) );
} );

describe( "textLength (300 words, 200 for 'bad')", () => {
	const check = count => status( "textLength", `<p>${ words( count ) }</p>` );

	it( "counts words correctly across paragraphs", () => {
		expect( status( "textLength", `<p>${ words( 150 ) }</p><p>${ words( 150 ) }</p>` ) ).toBe( "good" );
	} );
	it( "grades by word count", () => {
		expect( check( 150 ) ).toBe( "bad" );
		expect( check( 250 ) ).toBe( "improve" );
		expect( check( 300 ) ).toBe( "good" );
	} );
} );

describe( "titleWidth", () => {
	const check = attributes => status( "titleWidth", "<p>Text.</p>", attributes );

	it( "uses the measured pixel width when available", () => {
		expect( check( { title: "Short", titleWidth: 500 } ) ).toBe( "good" );
		expect( check( { title: "Short", titleWidth: 650 } ) ).toBe( "bad" );
		expect( check( { title: "Short", titleWidth: 300 } ) ).toBe( "improve" );
	} );
	it( "falls back to 40 - 60 characters", () => {
		expect( check( { title: "a".repeat( 50 ) } ) ).toBe( "good" );
		expect( check( { title: "a".repeat( 70 ) } ) ).toBe( "bad" );
		expect( check( { title: "a".repeat( 20 ) } ) ).toBe( "improve" );
	} );
} );

describe( "textSentenceLength (share of sentences over 20 words)", () => {
	const long = `Start ${ words( 24 ) }.`;
	const short = "This is short.";
	const check = ( longCount, shortCount ) =>
		status( "textSentenceLength", `<p>${ Array( longCount ).fill( long ).concat( Array( shortCount ).fill( short ) ).join( " " ) }</p>` );

	it( "grades by the percentage of long sentences", () => {
		expect( check( 1, 9 ) ).toBe( "good" );
		expect( check( 27, 73 ) ).toBe( "improve" );
		expect( check( 5, 5 ) ).toBe( "bad" );
	} );
} );

describe( "textParagraphTooLong (150 / 200 words)", () => {
	const check = count => status( "textParagraphTooLong", `<p>${ words( count ) }</p>` );

	it( "grades the longest paragraph", () => {
		expect( check( 100 ) ).toBe( "good" );
		expect( check( 180 ) ).toBe( "improve" );
		expect( check( 250 ) ).toBe( "bad" );
	} );
} );

describe( "externalLinks", () => {
	it( "counts nofollow links as citing a source", () => {
		expect( status( "externalLinks", '<p>See <a href="https://other.org" rel="nofollow">this</a>.</p>' ) ).toBe( "good" );
	} );
	it( "only suggests adding links", () => {
		expect( status( "externalLinks", "<p>No links here.</p>" ) ).toBe( "improve" );
	} );
} );

describe( "numberTitle", () => {
	it( "is only a suggestion", () => {
		expect( status( "numberTitle", "<p>Text.</p>", { title: "Coffee guide" } ) ).toBe( "improve" );
		expect( status( "numberTitle", "<p>Text.</p>", { title: "7 coffee tips" } ) ).toBe( "good" );
	} );
} );

describe( "urlLength", () => {
	it( "does not apply without a URL", () => {
		expect( status( "urlLength", "<p>Text.</p>" ) ).toBeUndefined();
	} );
} );

describe( "schema", () => {
	const shopSettings = { blogPostsAndArticle: { status: false } };

	it( "checks product pages for Product schema", () => {
		expect( status( "schema", "<p>Text.</p>", { slug: "products/mug", shopSettings, hasProductSchema: true } ) ).toBe( "good" );
		expect( status( "schema", "<p>Text.</p>", { slug: "products/mug", shopSettings } ) ).toBe( "bad" );
	} );
	it( "does not apply to pages of unknown type", () => {
		expect( status( "schema", "<p>Text.</p>", { slug: "pages/about", shopSettings } ) ).toBeUndefined();
	} );
} );
