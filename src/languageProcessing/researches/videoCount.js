/**
 * Returns each match of `open` up to and including the first match of `close` after it.
 * Unlike a lazy regex such as /<video.*?<\/video>/gis, this doesn't rescan the rest of the text
 * for every unclosed opening tag, so it stays linear in the length of the text.
 *
 * @param {string} text  The text.
 * @param {RegExp} open  Global regex for the start of the element.
 * @param {RegExp} close Global regex for the end of the element.
 * @returns {string[]} The matched elements.
 */
const matchElements = (text, open, close) => {
  const matches = [];
  let start;
  open.lastIndex = 0;
  while ((start = open.exec(text))) {
    close.lastIndex = open.lastIndex;
    if (!close.exec(text)) {
      break;
    }
    matches.push(text.slice(start.index, close.lastIndex));
    open.lastIndex = close.lastIndex;
  }
  return matches;
};

/**
 * Checks the amount of videos in the text, including embedded video iframes and specific video sources.
 *
 * @param {Paper} paper The paper to check for videos.
 *
 * @returns {number} The amount of found videos.
 */
export default function countVideoInText(paper) {
  // Regular expression to match a video source (YouTube, Vimeo, Shopify CDN, etc.) in an <iframe> tag.
  const iframeVideoSrc = /src=["']https?:\/\/(?:www\.)?(youtube\.com|youtu\.be|vimeo\.com|cdn\.shopify\.com)[^"']*["']/i;

  // Regular expression to match any src attributes with common video file extensions.
  // The value can't contain quotes, so a src without a video extension doesn't scan the rest of the text.
  const videoSrcTag = /src=["'][^"']*?\.(mp4|webm|ogg|mov|m4v|avi|mkv|flv|wmv)(\?[^"']*)?["']/gi;

  // Match occurrences of <video> tags in the text.
  const videoMatches = matchElements(paper.getText(), /<video/gi, /<\/video>/gi);

  // Match occurrences of <iframe> tags with video sources in the text.
  const iframeVideoMatches = matchElements(paper.getText(), /<iframe/gi, />/g).filter(tag =>
    iframeVideoSrc.test(tag)
  );

  // Match occurrences of src attributes pointing to video files in the text.
  const videoSrcMatches = paper.getText().match(videoSrcTag) || [];

  // Combine all matches into a single set to remove duplicates.
  const allMatches = new Set([...videoMatches, ...iframeVideoMatches, ...videoSrcMatches]);

  // Return the unique count of all found matches.
  return allMatches.size;
}
