import { describe, expect, it } from "vitest";
import { assessmentResult } from "./helpers/analyze.js";

const status = ( id, text, attributes = {} ) => assessmentResult( text, attributes, id )?.status;
const words = count => Array.from( { length: count }, ( _, i ) => `word${ i }` ).join( " " );

describe( "linkText", () => {
	it( "flags generic and empty anchor text", () => {
		expect( status( "linkText", '<p>Read <a href="/policy">click here</a>.</p>' ) ).toBe( "improve" );
		expect( status( "linkText", '<p>More: <a href="/a">Read more…</a></p>' ) ).toBe( "improve" );
		expect( status( "linkText", '<p><a href="/a"></a></p>' ) ).toBe( "improve" );
	} );
	it( "accepts descriptive anchor text, including image links with alt text", () => {
		expect( status( "linkText", '<p>See <a href="/returns">our return policy</a>.</p>' ) ).toBe( "good" );
		expect( status( "linkText", '<p><a href="/mug"><img src="mug.jpg" alt="Red ceramic mug"></a></p>' ) ).toBe( "good" );
	} );
	it( "does not apply without links", () => {
		expect( status( "linkText", "<p>No links.</p>" ) ).toBeUndefined();
	} );
} );

describe( "titleYear", () => {
	it( "flags a past year and accepts the current one", () => {
		const thisYear = new Date().getFullYear();
		expect( status( "titleYear", "<p>Text.</p>", { title: `Best mugs ${ thisYear - 2 }` } ) ).toBe( "improve" );
		expect( status( "titleYear", "<p>Text.</p>", { title: `Best mugs ${ thisYear }` } ) ).toBe( "good" );
	} );
	it( "does not apply when the title has no year", () => {
		expect( status( "titleYear", "<p>Text.</p>", { title: "Best mugs" } ) ).toBeUndefined();
	} );
} );

describe( "imageFileNames", () => {
	it( "flags camera and generic names, including Shopify CDN URLs", () => {
		expect( status( "imageFileNames", '<img src="https://cdn.shopify.com/s/files/1/0/files/IMG_1234.jpg?v=17">' ) ).toBe( "improve" );
		expect( status( "imageFileNames", '<img src="/image1.png">' ) ).toBe( "improve" );
		expect( status( "imageFileNames", '<img src="/3f2a9c1e8b7d6a5f4e3d.jpg">' ) ).toBe( "improve" );
	} );
	it( "accepts descriptive names, ignoring Shopify size suffixes", () => {
		expect( status( "imageFileNames", '<img src="/files/red-ceramic-mug_800x.jpg">' ) ).toBe( "good" );
	} );
} );

describe( "subheadingDistribution", () => {
	it( "only applies to texts over 300 words", () => {
		expect( status( "subheadingDistribution", `<p>${ words( 250 ) }</p>` ) ).toBeUndefined();
	} );
	it( "grades the longest section without a subheading", () => {
		expect( status( "subheadingDistribution", `<p>${ words( 200 ) }</p><h2>A</h2><p>${ words( 200 ) }</p>` ) ).toBe( "good" );
		expect( status( "subheadingDistribution", `<p>${ words( 320 ) }</p><h2>A</h2><p>${ words( 50 ) }</p>` ) ).toBe( "improve" );
		expect( status( "subheadingDistribution", `<p>${ words( 500 ) }</p>` ) ).toBe( "bad" );
	} );
} );

describe( "productSchema", () => {
	const complete = {
		name: "Red mug",
		image: [ "https://example.com/mug.jpg" ],
		description: "A red ceramic mug.",
		brand: { name: "Acme" },
		gtin13: "4006381333931",
		sku: "MUG-RED",
		aggregateRating: { ratingValue: 4.6, reviewCount: 12 },
		offers: { price: "19.00", priceCurrency: "EUR", availability: "https://schema.org/InStock" },
	};
	const check = productSchema => status( "productSchema", "<p>Text.</p>", { productSchema } );

	it( "accepts complete product data", () => expect( check( complete ) ).toBe( "good" ) );
	it( "fails without a required property", () => {
		expect( check( { ...complete, offers: { priceCurrency: "EUR" } } ) ).toBe( "bad" );
		expect( check( { ...complete, image: undefined } ) ).toBe( "bad" );
	} );
	it( "suggests recommended properties", () => {
		expect( check( { ...complete, gtin13: undefined, brand: undefined } ) ).toBe( "improve" );
	} );
	it( "supports offers arrays and priceSpecification", () => {
		expect( check( { ...complete, offers: [ { priceSpecification: { price: 19, priceCurrency: "EUR" }, availability: "InStock" } ] } ) ).toBe( "good" );
	} );
	it( "does not apply without product data", () => {
		expect( status( "productSchema", "<p>Text.</p>" ) ).toBeUndefined();
	} );
} );

describe( "keyword stuffing", () => {
	it( "flags a keyword repeated in the title", () => {
		expect( status( "titleKeyword", "<p>Coffee.</p>", { keyword: "coffee", title: "Coffee beans" } ) ).toBe( "good" );
		expect( status( "titleKeyword", "<p>Coffee.</p>", { keyword: "coffee", title: "Coffee, coffee beans, best coffee" } ) ).toBe( "improve" );
	} );
	it( "flags alt text that repeats the keyword", () => {
		expect( status( "textImages", '<p>Coffee.</p><img src="a.jpg" alt="coffee cup coffee beans coffee">', { keyword: "coffee" } ) ).toBe( "improve" );
		expect( status( "textImages", '<p>Coffee.</p><img src="a.jpg" alt="A cup of coffee on a table">', { keyword: "coffee" } ) ).toBe( "good" );
	} );
} );

describe( "keyphrase", () => {
	it( "is shown but not scored", () => {
		const result = assessmentResult( "<p>Text.</p>", { keyword: "coffee" }, "keyphrase" );
		expect( result.status ).toBe( "good" );
		expect( result.score ).toBe( 0 );
	} );
} );
