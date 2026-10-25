// Polaris reads matchMedia at import time; jsdom does not implement it.
window.matchMedia = window.matchMedia || ( () => ( {
	matches: false,
	addListener() {},
	removeListener() {},
	addEventListener() {},
	removeEventListener() {},
} ) );
