# SEO checklist

The checks below run in `CombinedAssessor`. Each heading carries its assessment `id`, which is the key used for translations (`SeoAnalyzer.<id>.*`), for `ignoredAssessments` / `skippedAssessments`, and as the anchor that the "Learn more" link in each result points to.

Priority sets each check's weight in the overall score: `high` counts more than `medium`, and `medium` more than `low`.

## Technical SEO

<a name="singleh1"></a>
### H1 tag · `singleH1` · high
The page should have exactly one `<h1>` that names its main topic. A missing H1 fails the check. More than one H1 is flagged for improvement.

<a name="metadescriptionlength"></a>
### Meta description length · `metaDescriptionLength` · high
Write a unique meta description of about 150-160 characters. A missing description fails the check. One that is shorter or longer than that range is flagged for improvement.

<a name="urllength"></a>
### URL length · `urlLength` · high
Keep the URL under 75 characters. Short URLs are easier to read and share.

<a name="internallinks"></a>
### Internal links · `internalLinks` · high
Link to other relevant pages on the same site. Links that are all `nofollow` don't count.

<a name="externallinks"></a>
### External links · `externalLinks` · high
Link to relevant, authoritative external sources to support your content.

<a name="titlewidth"></a>
### Meta title width · `titleWidth` · high
Aim for a meta title of 50-70 characters, so search results show it without truncation.

<a name="textimages"></a>
### Alt text · `textImages` · high
Every image needs descriptive alt text, for accessibility and for image search.

<a name="schema"></a>
### Schema · `schema` · high
Add structured data (schema.org markup) so search engines understand the page and can show rich results.

<a name="singletitle"></a>
### Duplicate title · `singleTitle` · high
Every page needs a unique title. Duplicate titles compete with each other in search results.

## Content SEO

<a name="keyphrase"></a>
### Use of main keyword · `keyphrase` · high
Set a main keyword and use it throughout the text.

<a name="keyphraselength"></a>
### Keyword length · `keyphraseLength` · low
Keep the main keyword under 4 words.

<a name="keyphrasedensity"></a>
### Main keyword density · `keyphraseDensity` · high
Keep keyword density between 1% and 1.5% of the text. Below that the topic is unclear, and above it the text reads as keyword stuffing.

<a name="introductionkeyword"></a>
### Introduction keyword · `introductionKeyword` · low
Use the main keyword in the first sentence of the text.

<a name="titlekeyword"></a>
### Keyword in meta title · `titleKeyword` · high
Include the main keyword in the meta title.

<a name="metadescriptionkeyword"></a>
### Meta description keyword · `metaDescriptionKeyword` · high
Include the main keyword at least once in the meta description.

<a name="slugkeyword"></a>
### Keyword in URL · `slugKeyword` · medium
Include the main keyword in the URL slug.

<a name="subheadingskeyword"></a>
### Keyword in subheading · `subheadingsKeyword` · medium
Use the main keyword in at least one subheading (H2-H6).

<a name="numbertitle"></a>
### Number in meta title · `numberTitle` · high
A number in the title ("7 ways to…") tends to raise click-through rate.

<a name="images"></a>
### Media · `images` · high
Add images or videos to break up the text and keep readers engaged.

<a name="textlength"></a>
### Text length · `textLength` · high
Thin content rarely ranks. Aim for at least 600 words, and longer for competitive topics.

<a name="textparagraphtoolong"></a>
### Paragraph length · `textParagraphTooLong` · high
Keep paragraphs under 150 words.

<a name="textsentencelength"></a>
### Sentence length · `textSentenceLength` · high
Keep most sentences under 20 words.

<a name="sentencebeginnings"></a>
### Sentence beginnings · `sentenceBeginnings` · medium
Avoid starting several sentences in a row with the same word.

<a name="texttransitionwords"></a>
### Transition words · `textTransitionWords` · low
Use transition words ("however", "also", "therefore"…) to connect ideas and improve flow.

<a name="relatedkeywords"></a>
### Related keywords · `relatedKeywords` · high
Use related keywords to build topical relevance, at a density of about 0.5-1% each. This check reads `related_keywords` from the paper's `data` attribute.
