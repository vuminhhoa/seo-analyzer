const longText = "Healthy breakfast ideas help busy people start the day. ".repeat( 40 );

/**
 * Sample papers used by the regression snapshot. Add a fixture when you fix a bug,
 * so the snapshot locks in the corrected behaviour.
 */
export default {
	"basic article": [
		`<h1>Healthy breakfast ideas</h1>
<p>A healthy breakfast gives you energy for the whole morning. However, many people skip it.</p>
<h2>Why a healthy breakfast matters</h2>
<p>Eating well early helps focus. <a href="https://example.com/recipes">Recipes</a> and <a href="https://www.nhs.uk/">NHS advice</a>.</p>
<img src="oats.jpg" alt="Bowl of oats">`,
		{
			keyword: "healthy breakfast",
			title: "10 healthy breakfast ideas for busy mornings",
			description: "Quick and healthy breakfast ideas you can make in five minutes, with simple recipes for busy weekday mornings.",
			slug: "healthy-breakfast",
			permalink: "https://example.com/healthy-breakfast",
		},
	],
	"long article": [
		`<h1>Coffee</h1><p>${ longText }</p>
<p>Coffee beans. <a href="https://example.com/x">internal</a> <a href="https://other.org" rel="nofollow">external</a></p>
<img src="a.jpg" alt="coffee beans"><img src="b.jpg">
<h2>Brewing coffee</h2><ul><li>Grind coffee</li><li>Brew</li></ul>
<p>Also, therefore, coffee. Coffee coffee. Coffee is great. Coffee is hot. Coffee is dark.</p>`,
		{
			keyword: "coffee",
			title: "Coffee guide",
			description: "All about coffee.",
			slug: "coffee",
			permalink: "https://example.com/coffee",
			data: { related_keywords: [ "espresso", "beans" ], faqs: { status: false } },
		},
	],
	"empty paper": [ "", { keyword: "" } ],
	"german text": [
		"<p>Ein gesundes Frühstück gibt Energie. Außerdem ist es lecker. Das Frühstück wurde gegessen.</p>",
		{ keyword: "gesundes Frühstück", title: "Gesundes Frühstück", locale: "de_DE" },
	],
};
