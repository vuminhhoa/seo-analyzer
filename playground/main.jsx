// Playground: runs the analysis from src/ with hot reload. Edit any research or
// assessment and the results below update immediately.
import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
	AppProvider, Badge, BlockStack, Box, Card, Checkbox, Collapsible, InlineGrid, InlineStack,
	Layout, Page, Select, Text, TextField,
} from "@shopify/polaris";
import en from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";

import { CombinedAssessor, Paper } from "../src/index.js";
import getResearcher from "../src/languageProcessing/getResearcher.js";
import papers from "../spec/fixtures/papers.js";

const STATUS_TONE = { good: "success", improve: "warning", bad: "critical" };
const LOCALES = [ "en_US", "de_DE", "fr_FR", "es_ES", "it_IT", "nl_NL", "pt_PT", "ru_RU", "pl_PL", "sv_SE", "id_ID", "ja", "tr_TR" ];
const fromFixture = name => {
	const [ text, attributes ] = papers[ name ];
	return { text, keyword: "", title: "", description: "", slug: "", h1Count: "", productSchema: "", locale: "en_US", ...attributes };
};

/**
 * Runs the analysis the way a consumer does, and collects every research the assessments used.
 *
 * @param {Object} input The form state.
 *
 * @returns {Object} The score, the assessment results, the research outputs, or the error.
 */
function analyze( input ) {
	const { text, h1Count, productSchema, ...attributes } = input;
	try {
		const paper = new Paper( text, {
			...attributes,
			h1Count: h1Count === "" ? null : Number( h1Count ),
			productSchema: productSchema.trim() ? JSON.parse( productSchema ) : null,
		} );
		const researcher = new ( getResearcher( input.locale ) )( paper );

		const researches = {};
		const getResearch = researcher.getResearch.bind( researcher );
		researcher.getResearch = name => ( researches[ name ] = getResearch( name ) );

		const assessor = new CombinedAssessor( researcher );
		assessor.assess( paper );
		return { score: assessor.getScore(), assessments: assessor.assessments, researches };
	} catch ( error ) {
		return { error };
	}
}

const toJSON = value => JSON.stringify( value, ( key, item ) => ( [ "parent", "_parent", "sourceCodeLocation", "sourceCodeRange" ].includes( key ) ? undefined : item ), 2 );

function Result( { assessment } ) {
	return (
		<Box paddingBlock="200" borderBlockEndWidth="025" borderColor="border-secondary">
			<InlineStack gap="200" blockAlign="center">
				<Badge tone={ STATUS_TONE[ assessment.status ] }>{ assessment.status || "(none)" }</Badge>
				<Text as="span" variant="headingSm">{ assessment.title }</Text>
				<Text as="span" tone="subdued">{ assessment.id } · { assessment.priority } · { assessment.score } pts</Text>
			</InlineStack>
			<Box paddingBlockStart="100">{ assessment.body }</Box>
		</Box>
	);
}

function Playground() {
	const [ input, setInput ] = useState( () => fromFixture( "basic article" ) );
	const [ showResearches, setShowResearches ] = useState( false );
	const result = useMemo( () => analyze( input ), [ input ] );
	const field = name => ( { value: String( input[ name ] ?? "" ), onChange: value => setInput( { ...input, [ name ]: value } ), autoComplete: "off" } );

	return (
		<Page title="seo-analyzer playground" subtitle="Analysis runs from src/ with hot reload">
			<Layout>
				<Layout.Section variant="oneHalf">
					<Card>
						<BlockStack gap="300">
							<Select
								label="Sample paper"
								options={ [ { label: "Choose…", value: "" }, ...Object.keys( papers ).map( name => ( { label: name, value: name } ) ) ] }
								value=""
								onChange={ name => name && setInput( fromFixture( name ) ) }
							/>
							<InlineGrid columns={ 2 } gap="300">
								<TextField label="Focus keyword" { ...field( "keyword" ) } />
								<Select label="Locale" options={ LOCALES } { ...field( "locale" ) } />
							</InlineGrid>
							<TextField label="Meta title" { ...field( "title" ) } />
							<TextField label="Meta description" multiline={ 2 } { ...field( "description" ) } />
							<InlineGrid columns={ 2 } gap="300">
								<TextField label="URL slug" { ...field( "slug" ) } />
								<TextField label="h1Count (H1s outside the text)" type="number" { ...field( "h1Count" ) } />
							</InlineGrid>
							<TextField label="Content (HTML)" multiline={ 14 } monospaced { ...field( "text" ) } />
							<TextField
								label="Product schema (JSON-LD Product object, optional)"
								multiline={ 4 }
								monospaced
								placeholder='{ "name": "Red mug", "image": "…", "offers": { "price": "19", "priceCurrency": "EUR" } }'
								{ ...field( "productSchema" ) }
							/>
						</BlockStack>
					</Card>
				</Layout.Section>
				<Layout.Section variant="oneHalf">
					<BlockStack gap="400">
						{ result.error ? (
							<Card>
								<Text as="h2" variant="headingMd" tone="critical">Analysis threw</Text>
								<pre style={ { whiteSpace: "pre-wrap" } }>{ String( result.error.stack || result.error ) }</pre>
							</Card>
						) : (
							<>
								<Card>
									<InlineStack align="space-between" blockAlign="center">
										<Text as="h2" variant="heading2xl">{ String( result.score ) }</Text>
										<InlineStack gap="200">
											{ [ "bad", "improve", "good" ].map( status => (
												<Badge key={ status } tone={ STATUS_TONE[ status ] }>
													{ `${ result.assessments.filter( a => a.status === status ).length } ${ status }` }
												</Badge>
											) ) }
										</InlineStack>
									</InlineStack>
								</Card>
								<Card>
									{ [ ...result.assessments ]
										.sort( ( a, b ) => [ "bad", "improve", "good" ].indexOf( a.status ) - [ "bad", "improve", "good" ].indexOf( b.status ) )
										.map( assessment => <Result key={ assessment.id } assessment={ assessment } /> ) }
								</Card>
								<Card>
									<BlockStack gap="200">
										<Checkbox label="Show raw research output" checked={ showResearches } onChange={ setShowResearches } />
										<Collapsible open={ showResearches } id="researches">
											{ Object.entries( result.researches ).map( ( [ name, value ] ) => (
												<details key={ name }>
													<summary><code>{ name }</code></summary>
													<pre style={ { fontSize: 12, maxHeight: 300, overflow: "auto" } }>{ toJSON( value ) }</pre>
												</details>
											) ) }
										</Collapsible>
									</BlockStack>
								</Card>
							</>
						) }
					</BlockStack>
				</Layout.Section>
			</Layout>
		</Page>
	);
}

createRoot( document.getElementById( "root" ) ).render( <AppProvider i18n={ en }><Playground /></AppProvider> );
