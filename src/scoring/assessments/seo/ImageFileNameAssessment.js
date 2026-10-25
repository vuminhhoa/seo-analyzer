import {merge} from 'lodash';
import React from 'react';
import {Text} from '@shopify/polaris';
import AssessmentResult from '../../../values/AssessmentResult';
import Assessment from '../assessment';

// Camera, phone and tool defaults (IMG_1234, DSC0012, PXL_2026…, Screenshot…, image1, untitled),
// bare numbers and hash/UUID-like names.
const GENERIC_NAME = new RegExp(
  [
    '^(img|image|dsc|dscn|dscf|pxl|photo|pic|picture|screenshot|screen[-_ ]?shot|untitled|capture|whatsapp[-_ ]image|file|download)[-_ ]?[\\d\\s_-]*$',
    '^[\\d_-]+$',
    '^[0-9a-f]{16,}$',
    '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
  ].join('|'),
  'i'
);

/**
 * Represents the assessment that checks whether images have descriptive file names.
 */
export default class ImageFileNameAssessment extends Assessment {
  /**
   * Sets the identifier and the config.
   *
   * @param {object} config The configuration to use.
   *
   * @returns {void}
   */
  constructor(config = {}) {
    super();

    const defaultConfig = {
      id: 'imageFileNames',
      priority: 'low',
      docUrl: 'https://github.com/vuminhhoa/seo-analyzer/blob/main/docs/checklist.md#imagefilenames',
      fixPosition: 'description',
      ctaType: 'fix',
      title: 'Image file names',
      content: {
        good: 'Images have descriptive file names.',
        improve:
          'Some images have generic file names ({examples}). Use short, descriptive names such as "red-ceramic-mug.jpg".'
      }
    };

    this.identifier = 'imageFileNames';
    this._config = merge(defaultConfig, config);
  }

  /**
   * Returns the file names (without extension) of the images in the text.
   *
   * @param {Paper} paper The paper.
   * @returns {string[]} The image file names.
   */
  getFileNames(paper) {
    const doc = new DOMParser().parseFromString(paper.getText(), 'text/html');

    return Array.from(doc.querySelectorAll('img[src]'))
      .map(img => img.getAttribute('src').split(/[?#]/)[0].split('/').pop())
      .map(name => {
        try {
          return decodeURIComponent(name);
        } catch (error) {
          return name;
        }
      })
      .filter(name => name && !name.startsWith('data:'));
  }

  /**
   *
   * @param paper
   * @param i18n
   * @returns {{score: number, body: React.JSX.Element, status: string}}
   */
  calculateResult(paper, i18n) {
    // Shopify appends "_<width>x" or "_<uuid>" to uploads; ignore such suffixes.
    const generic = this.getFileNames(paper).filter(name => {
      const base = name.replace(/\.[a-z0-9]+$/i, '').replace(/_(\d+x\d*|[0-9a-f-]{36})$/i, '');
      return GENERIC_NAME.test(base);
    });
    const status = generic.length === 0 ? 'good' : 'improve';
    const examples = [...new Set(generic)].slice(0, 3).join(', ');

    const score = this.getScore(this._config.priority, status);

    return {
      score,
      status,
      body: (
        <Text as={'span'}>
          {this._config.content[status].replace('{examples}', examples)}{' '}
          {this._config.docUrl && (
            <a href={this._config.docUrl} target="_blank" rel="noreferrer">
              {i18n ? i18n.translate(`SeoAnalyzer.Button.learnMore`) : 'Learn more'}
            </a>
          )}
        </Text>
      )
    };
  }

  /**
   *
   * @param paper
   * @param researcher
   * @param i18n
   * @returns {AssessmentResult}
   */
  getResult({paper, researcher, i18n}) {
    const calculatedResult = this.calculateResult(paper, i18n);
    const assessmentResult = new AssessmentResult({config: this._config});

    assessmentResult.setScore(calculatedResult.score);
    assessmentResult.setStatus(calculatedResult.status);
    assessmentResult.setBody(calculatedResult.body);

    return assessmentResult;
  }

  /**
   * Checks whether the text contains images with a file URL.
   *
   * @param {Paper} paper The paper to check.
   *
   * @returns {boolean} Whether the assessment applies.
   */
  isApplicable(paper) {
    return paper.hasText() && this.getFileNames(paper).length > 0;
  }
}
