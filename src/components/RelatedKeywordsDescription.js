import React, {useMemo, useState} from 'react';
import {Badge, BlockStack, Button, InlineStack, Text} from '@shopify/polaris';
import './RelatedKeywordsDescription.scss';

const RelatedKeywordDescription = ({words, i18n}) => {
  const [viewMore, setViewMore] = useState(false);
  const arr = useMemo(() => {
    if (words) {
      const wordsArr = Object.keys(words);
      return wordsArr?.length > 2 && !viewMore ? wordsArr.slice(0, 2) : wordsArr;
    }
    return [];
  }, [words, viewMore]);

  return (
    <div className="SeoAnalyzer-RelatedKeywords__Description">
      {words && (
        <>
          <BlockStack gap="200">
            {arr.map(key => (
              <InlineStack key={key} gap="200">
                <Badge>{key}:</Badge>
                <Text as="span">{words[key].length} words</Text>
                <Text as="span">|</Text>
                <Text as="span">{words[key].percentage}% used</Text>
              </InlineStack>
            ))}
          </BlockStack>
          {Object.keys(words).length > 2 && (
            <div className="SeoAnalyzer-RelatedKeywords__Description-Backdrop">
              <Button size="medium" variant="plain" onClick={() => setViewMore(!viewMore)}>
                {viewMore
                  ? i18n.translate('SeoAnalyzer.Button.viewLess')
                  : i18n.translate('SeoAnalyzer.Button.viewMore')}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RelatedKeywordDescription;
