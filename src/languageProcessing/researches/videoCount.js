/**
 * Checks the amount of videos in the text, including embedded video iframes and specific video sources.
 *
 * @param {Paper} paper The paper to check for videos.
 *
 * @returns {number} The amount of found videos.
 */
export default function countVideoInText(paper) {
  // Regular expression to match <video> tags.
  const videoTag = /<video.*?<\/video>/gis;

  // Regular expression to match <iframe> tags with video sources (YouTube, Vimeo, Shopify CDN, etc.).
  const iframeVideoTag = /<iframe[^>]*src=["']https?:\/\/(?:www\.)?(youtube\.com|youtu\.be|vimeo\.com|cdn\.shopify\.com)[^"']*["'][^>]*>/gis;

  // Regular expression to match any src attributes with common video file extensions.
  const videoSrcTag = /src=["'].*?\.(mp4|webm|ogg|mov|m4v|avi|mkv|flv|wmv)(\?.*?)?["']/gis;

  // Match occurrences of <video> tags in the text.
  const videoMatches = paper.getText().match(videoTag) || [];

  // Match occurrences of <iframe> tags with video sources in the text.
  const iframeVideoMatches = paper.getText().match(iframeVideoTag) || [];

  // Match occurrences of src attributes pointing to video files in the text.
  const videoSrcMatches = paper.getText().match(videoSrcTag) || [];

  // Combine all matches into a single set to remove duplicates.
  const allMatches = new Set([...videoMatches, ...iframeVideoMatches, ...videoSrcMatches]);

  // Return the unique count of all found matches.
  return allMatches.size;
}
