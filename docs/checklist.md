# SEO checklist

The checks below run in `CombinedAssessor`. Each heading carries the assessment `id`, which is the key for translations (`SeoAnalyzer.<id>.*`), for `ignoredAssessments` / `skippedAssessments`, and the anchor that each result's "Learn more" link points to.

**Scoring.** Each check returns `good`, `improve` or `bad`, worth 100%, 50% or 0% of its weight. The weight depends on the check's priority: `high` = 100 points, `medium` = 75, `low` = 50. Checks with priority `info` are shown but not scored. The overall score is the points earned as a percentage of the points available from the checks that apply to the page.

**How to read this list.** Google's own guidance is the reference wherever it exists. The guiding principle is to write for people first: Google publishes [no ideal word count, keyword density or heading count](https://developers.google.com/search/docs/fundamentals/seo-starter-guide). Thresholds that Google doesn't define follow the current [Yoast SEO](https://github.com/Yoast/wordpress-seo/tree/trunk/packages/yoastseo) defaults, and their priority is kept low or medium. Every threshold below can be changed through the assessment's config (`parameters`).

_Last reviewed: October 2026._

## Technical SEO

<a name="singleh1"></a>
### H1 tag · `singleH1` · medium
**Good:** the page has exactly one H1. **Improve:** it has none, or more than one.

The H1 count is the `h1Count` paper attribute (H1s your template renders outside the text, such as a theme's product title) plus the `<h1>` tags in the text.

Google says multiple H1s are fine and don't hurt ranking. One clear main heading still helps screen-reader users, and Google uses the main heading as an input when it [generates title links](https://developers.google.com/search/docs/appearance/title-link). That's why this check only ever suggests an improvement.

<a name="metadescriptionlength"></a>
### Meta description length · `metaDescriptionLength` · high
**Good:** 120–160 characters. **Improve:** shorter or longer. **Bad:** missing.

Google sets [no length limit](https://developers.google.com/search/docs/appearance/snippet). It truncates snippets to the device width, which is roughly 120 characters on mobile and 155–160 on desktop. A missing description leaves Google to build the snippet from the page text.

<a name="urllength"></a>
### URL length · `urlLength` · low
**Good:** under 75 characters (domain and slug). **Bad:** longer. This check is skipped when the page has no slug.

Google gives no URL length limit. It asks for descriptive, readable URLs. Short URLs are easier to read and share, so this is a readability suggestion only.

<a name="internallinks"></a>
### Internal links · `internalLinks` · high
**Good:** at least one followed link to another page on the site.

[Links are the main way Google finds pages](https://developers.google.com/search/docs/fundamentals/seo-starter-guide), and internal links help both readers and crawlers move through the site.

<a name="externallinks"></a>
### External links · `externalLinks` · low
**Good:** at least one link to another site. **Improve:** none.

Outbound links are not a ranking factor. Citing trustworthy sources helps readers verify what you say. `nofollow` links count: Google [recommends `nofollow`](https://developers.google.com/search/docs/fundamentals/seo-starter-guide) for sources you don't want to vouch for.

<a name="titlewidth"></a>
### Meta title width · `titleWidth` · high
**Good:** 400–600 px, or about 40–60 characters. **Improve:** shorter. **Bad:** longer, which gets cut off.

Google sets [no title length limit](https://developers.google.com/search/docs/appearance/title-link) but truncates titles to the device width (about 600 px on desktop). For an exact check, pass the measured width as `titleWidth`. In the browser, `helpers.measureTextWidth( title )` measures it in Google's title font. Without a measured width, the check estimates from the character count.

<a name="textimages"></a>
### Alt text · `textImages` · high
**Good:** every image has alt text. **Improve:** an alt text repeats the keyword. **Bad:** one or more images have no alt text.

Google asks for [short, descriptive alt text](https://developers.google.com/search/docs/appearance/google-images) that explains the image in context, and warns that [filling alt attributes with keywords](https://developers.google.com/search/docs/appearance/google-images) can be treated as spam. Alt text is also essential for screen-reader users.

<a name="schema"></a>
### Schema · `schema` · high
**Good:** structured data is set up for the page type. **Bad:** it isn't. This check only runs when the page type is known from a Shopify URL: products and collections (`Product` schema) or blog posts (`Article` schema).

Structured data makes a page eligible for [rich results](https://developers.google.com/search/docs/appearance/structured-data/search-gallery) such as price, availability and ratings for products. It isn't a ranking factor in itself.

<a name="productschema"></a>
### Product structured data · `productSchema` · high
**Good:** the Product data has every required and recommended property. **Improve:** recommended properties are missing. **Bad:** required properties are missing. This check runs when you pass the page's Product JSON-LD object as the `productSchema` paper attribute.

Google's [merchant listing](https://developers.google.com/search/docs/appearance/structured-data/merchant-listing) structured data **requires** `name`, `image` and `offers` with a `price` above zero and a `priceCurrency`. It **recommends** `description`, `brand`, a GTIN, `sku`, `availability`, and `aggregateRating` or `review`. These make the product eligible for richer results, such as price, stock and ratings in Search and Shopping.

<a name="linktext"></a>
### Link text · `linkText` · medium
**Good:** every link has descriptive text. **Improve:** a link's text is generic ("click here", "read more", "here"…) or empty. This check only runs when the text has links.

Google asks for anchor text that is ["descriptive, reasonably concise, and relevant"](https://developers.google.com/search/docs/crawling-indexing/links-crawlable) and gives "Click here" and "Read more" as bad examples. Anchor text tells readers and Google what the linked page is about. The list of generic phrases is in `parameters.genericTexts`.

<a name="titleyear"></a>
### Year in meta title · `titleYear` · medium
**Good:** a year in the title is the current one. **Improve:** the title mentions a past year. This check only runs when the title contains a year.

Google may [rewrite title links that contain obsolete dates](https://developers.google.com/search/docs/appearance/title-link). If you update a "Best … 2025" page, update the year too. If the year is part of what the page is about (for example a historical event), you can ignore this.

<a name="imagefilenames"></a>
### Image file names · `imageFileNames` · low
**Good:** image file names describe the image. **Improve:** a file name is generic, such as `IMG_1234.jpg`, `image1.png`, `Screenshot…` or a hash. Shopify's size suffixes (`_800x`) are ignored.

Google recommends [short, descriptive file names](https://developers.google.com/search/docs/appearance/google-images) as a small signal about the image's subject.

<a name="singletitle"></a>
### Duplicate title · `singleTitle` · high
**Good:** the title is unique (`titleCount` is 1).

Google asks for [a distinct title for each page](https://developers.google.com/search/docs/appearance/title-link). Identical titles make pages hard to tell apart, and Google may rewrite them.

## Content SEO

<a name="keyphrase"></a>
### Use of main keyword · `keyphrase` · info
**Good:** a focus keyword is set. Most keyword checks need one, so this check reminds you to set it. It isn't scored, because setting a keyword says nothing about the page itself.

<a name="keyphraselength"></a>
### Keyword length · `keyphraseLength` · low
**Good:** 4 words or fewer. A focused keyword is easier to match naturally in the title, URL and text.

<a name="keyphrasedensity"></a>
### Main keyword density · `keyphraseDensity` · medium
**Good:** 0.5%–3% of the words. **Improve:** under 0.5%. **Bad:** over 3%.

Google publishes no ideal density. Its [spam policies](https://developers.google.com/search/docs/essentials/spam-policies) do prohibit keyword stuffing, so the upper bound is what matters. This is a sanity check, not a target to optimize for.

<a name="introductionkeyword"></a>
### Introduction keyword · `introductionKeyword` · low
**Good:** the keyword appears in a sentence of the first paragraph. This tells readers early that they're in the right place.

<a name="titlekeyword"></a>
### Keyword in meta title · `titleKeyword` · high
**Good:** the title contains the keyword once. **Improve:** it repeats the keyword. **Bad:** it doesn't contain the keyword. The title is one of the strongest signals of what a page is about, and Google treats [repeated terms in titles as spammy](https://developers.google.com/search/docs/appearance/title-link).

<a name="metadescriptionkeyword"></a>
### Meta description keyword · `metaDescriptionKeyword` · medium
**Good:** the description contains the keyword. The description doesn't affect ranking, but Google highlights matching words in snippets, which can help clicks. Don't write [lists of keywords](https://developers.google.com/search/docs/appearance/snippet).

<a name="slugkeyword"></a>
### Keyword in URL · `slugKeyword` · low
**Good:** the URL slug contains the keyword. Google says keywords in URLs have ["hardly any effect"](https://developers.google.com/search/docs/fundamentals/seo-starter-guide) on ranking beyond showing in breadcrumbs. A descriptive slug still helps users.

<a name="subheadingskeyword"></a>
### Keyword in subheading · `subheadingsKeyword` · medium
**Good:** at least one subheading (H2–H6) contains the keyword. Google uses headings to [understand the parts of a page](https://developers.google.com/search/docs/fundamentals/seo-starter-guide).

<a name="images"></a>
### Media · `images` · medium
**Good:** the text contains at least one image or video. Visuals help readers, and can bring traffic from image and video search.

<a name="textlength"></a>
### Text length · `textLength` · medium
**Good:** 300 words or more. **Improve:** 200–299. **Bad:** under 200. Languages counted in characters, such as Japanese, use twice these numbers.

Google says there is [no preferred word count](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), and writing to a word count is a sign of search-engine-first content. This check only flags thin pages. Add information that helps readers, not filler.

<a name="textparagraphtoolong"></a>
### Paragraph length · `textParagraphTooLong` · medium
**Good:** every paragraph is 150 words or fewer. **Improve:** the longest is 151–200. **Bad:** over 200.

<a name="subheadingdistribution"></a>
### Subheading distribution · `subheadingDistribution` · medium
**Good:** no section is longer than 300 words without a subheading. **Improve:** a section has 301–350 words. **Bad:** over 350 words, or a long text with no subheadings at all. This check only runs on texts over 300 words. Languages counted in characters, such as Japanese, use twice these numbers.

Subheadings let readers scan the text, and Google uses headings to [understand the parts of a page](https://developers.google.com/search/docs/fundamentals/seo-starter-guide).

<a name="textsentencelength"></a>
### Sentence length · `textSentenceLength` · medium
**Good:** 25% or fewer of the sentences have more than 20 words. **Improve:** 25–30%. **Bad:** over 30%.

<a name="sentencebeginnings"></a>
### Sentence beginnings · `sentenceBeginnings` · medium
**Good:** no three or more consecutive sentences start with the same word.

<a name="texttransitionwords"></a>
### Transition words · `textTransitionWords` · low
**Good:** enough sentences use transition words ("however", "also", "therefore"…) to connect ideas. This check only runs on texts over 200 words.

<a name="relatedkeywords"></a>
### Related keywords · `relatedKeywords` · medium
**Good:** at least one of the related keywords in `data.related_keywords` appears in the page, and none is over 1% of the words. **Improve:** one is over 1%. **Bad:** none appear.

Covering related terms shows the topic is treated thoroughly. Google asks whether content gives [a substantial, complete description of the topic](https://developers.google.com/search/docs/fundamentals/creating-helpful-content). Use the terms where they genuinely belong.
