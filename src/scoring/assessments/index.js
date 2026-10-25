// Readability assessments.
import ParagraphTooLongAssessment from './readability/ParagraphTooLongAssessment';
import SentenceBeginningsAssessment from './readability/SentenceBeginningsAssessment';
import SentenceLengthInTextAssessment from './readability/SentenceLengthInTextAssessment';
import TransitionWordsAssessment from './readability/TransitionWordsAssessment';

// SEO assessments.
import InternalLinksAssessment from './seo/InternalLinksAssessment';
import IntroductionKeywordAssessment from './seo/IntroductionKeywordAssessment';
import KeyphraseLengthAssessment from './seo/KeyphraseLengthAssessment';
import KeyphraseDensityAssessment from './seo/KeywordDensityAssessment';
import MetaDescriptionKeywordAssessment from './seo/MetaDescriptionKeywordAssessment';
import MetaDescriptionLengthAssessment from './seo/MetaDescriptionLengthAssessment';
import OutboundLinksAssessment from './seo/OutboundLinksAssessment';
import PageTitleWidthAssessment from './seo/PageTitleWidthAssessment';
import SingleH1Assessment from './seo/SingleH1Assessment';
import SubheadingsKeywordAssessment from './seo/SubHeadingsKeywordAssessment';
import TextLengthAssessment from './seo/TextLengthAssessment';
import SlugKeywordAssessment from './seo/UrlKeywordAssessment';
import ImageCountAssessment from './seo/ImageCountAssessment';
import KeyphraseAssessment from './seo/KeyphraseAssessment';
import SingleTitleAssessment from './seo/SingleTitleAssessment';
import UrlLengthAssessment from './seo/UrlLengthAssessment';
import NumberInMetaTitleAssessment from './seo/NumberInMetaTitleAssessment';
import TextImagesAssessment from './seo/TextImagesAssessment';
import MetaTitleKeywordAssessment from './seo/MetaTitleKeywordAssessment';
import SchemaAssessment from './seo/SchemaAssessment';
import RelatedKeywordsAssessment from '@seo-analyzer/scoring/assessments/readability/RelatedKeywordsAssessment';

const readability = {
  ParagraphTooLongAssessment,
  SentenceBeginningsAssessment,
  SentenceLengthInTextAssessment,
  TransitionWordsAssessment
};

// We expose the deprecated assessments for backwards compatibility.
const seo = {
  ImageCountAssessment,
  NumberInMetaTitleAssessment,
  InternalLinksAssessment,
  TextImagesAssessment,
  MetaTitleKeywordAssessment,
  IntroductionKeywordAssessment,
  SingleTitleAssessment,
  KeyphraseLengthAssessment,
  UrlLengthAssessment,
  KeyphraseDensityAssessment,
  MetaDescriptionKeywordAssessment,
  MetaDescriptionLengthAssessment,
  OutboundLinksAssessment,
  PageTitleWidthAssessment,
  SingleH1Assessment,
  SubheadingsKeywordAssessment,
  TextLengthAssessment,
  SlugKeywordAssessment,
  KeyphraseAssessment,
  SchemaAssessment,
  RelatedKeywordsAssessment
};

export {readability, seo};
