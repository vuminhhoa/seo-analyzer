import Assessor from './assessor';
import ImageFileNameAssessment from '../assessments/seo/ImageFileNameAssessment';
import LinkTextAssessment from '../assessments/seo/LinkTextAssessment';
import ProductSchemaAssessment from '../assessments/seo/ProductSchemaAssessment';
import TitleYearAssessment from '../assessments/seo/TitleYearAssessment';
import IntroductionKeywordAssessment from '../assessments/seo/IntroductionKeywordAssessment';
import KeyphraseLengthAssessment from '../assessments/seo/KeyphraseLengthAssessment';
import MetaDescriptionKeywordAssessment from '../assessments/seo/MetaDescriptionKeywordAssessment';
import MetaDescriptionLength from '../assessments/seo/MetaDescriptionLengthAssessment';
import SubheadingsKeyword from '../assessments/seo/SubHeadingsKeywordAssessment';
import OutboundLinks from '../assessments/seo/OutboundLinksAssessment';
import KeyphraseDensityAssessment from '../assessments/seo/KeywordDensityAssessment';
import InternalLinksAssessment from '../assessments/seo/InternalLinksAssessment';
import SlugKeywordAssessment from '../assessments/seo/UrlKeywordAssessment';
import ImageCount from '../assessments/seo/ImageCountAssessment';
import TextLength from '../assessments/seo/TextLengthAssessment';
import TitleWidth from '../assessments/seo/PageTitleWidthAssessment';
import SingleH1Assessment from '../assessments/seo/SingleH1Assessment';
import KeyphraseAssessment from '../assessments/seo/KeyphraseAssessment';
import SingleTitleAssessment from '../assessments/seo/SingleTitleAssessment';
import UrlLengthAssessment from '../assessments/seo/UrlLengthAssessment';
import TextImagesAssessment from '../assessments/seo/TextImagesAssessment';
import MetaTitleKeywordAssessment from '../assessments/seo/MetaTitleKeywordAssessment';
import SchemaAssessment from '@seo-analyzer/scoring/assessments/seo/SchemaAssessment';

/**
 * The SEOAssessor class is used for the general SEO analysis.
 */
export default class SEOAssessor extends Assessor {
  /**
   * Creates a new SEOAssessor instance.
   * @param {Researcher}	researcher	The researcher to use.
   * @param {Object}		[config]	The assessor config.
   */
  constructor(researcher, config) {
    super(researcher, config);
    this.type = 'SEOAssessor';

    this._assessments = [
      new MetaTitleKeywordAssessment(),
      new TextImagesAssessment(),
      new IntroductionKeywordAssessment(),
      new KeyphraseLengthAssessment(),
      new MetaDescriptionKeywordAssessment(),
      new MetaDescriptionLength(),
      new SubheadingsKeyword(),
      new OutboundLinks(),
      new KeyphraseDensityAssessment(),
      new ImageCount(),
      new UrlLengthAssessment(),
      new TextLength(),
      new SingleTitleAssessment(),
      new KeyphraseAssessment(),
      new InternalLinksAssessment(),
      new TitleWidth(),
      new SlugKeywordAssessment(),
      new SingleH1Assessment(),
      new SchemaAssessment(),
      new ProductSchemaAssessment(),
      new LinkTextAssessment(),
      new TitleYearAssessment(),
      new ImageFileNameAssessment()
    ];
  }
}
