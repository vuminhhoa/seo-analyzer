import ArabicResearcher from "./languages/ar/Researcher";
import CatalanResearcher from "./languages/ca/Researcher";
import CzechResearcher from "./languages/cs/Researcher";
import GermanResearcher from "./languages/de/Researcher";
import GreekResearcher from "./languages/el/Researcher";
import EnglishResearcher from "./languages/en/Researcher";
import SpanishResearcher from "./languages/es/Researcher";
import FarsiResearcher from "./languages/fa/Researcher";
import FrenchResearcher from "./languages/fr/Researcher";
import HebrewResearcher from "./languages/he/Researcher";
import HungarianResearcher from "./languages/hu/Researcher";
import IndonesianResearcher from "./languages/id/Researcher";
import ItalianResearcher from "./languages/it/Researcher";
import JapaneseResearcher from "./languages/ja/Researcher";
import NorwegianResearcher from "./languages/nb/Researcher";
import DutchResearcher from "./languages/nl/Researcher";
import PolishResearcher from "./languages/pl/Researcher";
import PortugueseResearcher from "./languages/pt/Researcher";
import RussianResearcher from "./languages/ru/Researcher";
import SlovakResearcher from "./languages/sk/Researcher";
import SwedishResearcher from "./languages/sv/Researcher";
import TurkishResearcher from "./languages/tr/Researcher";
import DefaultResearcher from "./languages/_default/Researcher";

/*
 * This factory is deliberately NOT re-exported from the package root (`src/index.js`). The plugin's
 * webpack build turns that root index into the core `analysis` bundle, and each language Researcher
 * transitively pulls in ~2.4 MB of language data (function words, stemmers, etc.). Re-exporting from
 * the root therefore inlines every language into the core bundle (verified: 883 KB → 2.82 MB). Keeping
 * the factory in its own module that the root never imports leaves the core bundle untouched; the plugin
 * keeps loading per-language Researchers from their separate `js/dist/languages/<lang>.js` bundles, while
 * non-plugin consumers (Node apps, the web worker) import this module directly via `yoastseo/getResearcher`.
 *
 * Importing this module does NOT cause the circular-dependency error that blocked exposing it from the
 * root: the language Researchers import the analysis core through the package root, but since the root no
 * longer imports the Researchers, loading them simply initializes the root index first and resolves cleanly.
 */
const researchers = {
	ar: ArabicResearcher,
	ca: CatalanResearcher,
	cs: CzechResearcher,
	de: GermanResearcher,
	el: GreekResearcher,
	en: EnglishResearcher,
	es: SpanishResearcher,
	fa: FarsiResearcher,
	fr: FrenchResearcher,
	he: HebrewResearcher,
	hu: HungarianResearcher,
	id: IndonesianResearcher,
	it: ItalianResearcher,
	ja: JapaneseResearcher,
	nb: NorwegianResearcher,
	nl: DutchResearcher,
	pl: PolishResearcher,
	pt: PortugueseResearcher,
	ru: RussianResearcher,
	sk: SlovakResearcher,
	sv: SwedishResearcher,
	tr: TurkishResearcher,
};

// A Map prevents a js/unvalidated-dynamic-method-call when looking up by an arbitrary language code.
const researchersMap = new Map( Object.entries( researchers ) );

/**
 * Resolves the language-specific Researcher class, falling back to the default Researcher when the
 * language is not supported.
 *
 * @param {string} language The language code to resolve the Researcher for.
 *
 * @returns {Function} The Researcher class (not an instance).
 */
export default function getResearcher( language ) {
	return researchersMap.get( language ) || DefaultResearcher;
}
