import {
  Card,
  Divider,
  Spacer,
  Stack,
  VStack,
  HStack,
} from "@chakra-ui/react";
import React from "react";
import { TransliterateInput } from "./Fragments/TransliterateInput";
import { LanguageSelect } from "./Fragments/LanguageSelect";
import { TransliterationHeader } from "./Fragments/TransliterationHeader";
import usePegonTransliterator from "src/hooks/usePegonTransliterator";

const TransliteratePegonPage = () => {
  const {
    stemmingType,
    setStemmingType,
    leftText,
    rightText,
    labels,
    onChange,
    onSwitch,
  } = usePegonTransliterator();

  return (
    <VStack
      px={5}
      spacing={0}
      w="100%"
      h="100%"
      align={{ base: "stretch", md: "start" }}
    >
      <LanguageSelect value={stemmingType} onChange={setStemmingType} />
      <TransliterationHeader
        leftLabel={labels.left}
        rightLabel={labels.right}
        language={stemmingType}
        onSwitchClicked={onSwitch}
      />
      <Card
        height={{
          base: "300px",
          md: "200px",
        }}
        width="100%"
      >
        <Stack
          height="100%"
          direction={{
            base: "column",
            md: "row",
          }}
          divider={
            <Divider
              orientation={{
                base: "horizontal",
                md: "vertical",
              }}
              height={{
                base: "1px",
                md: "auto",
              }}
            />
          }
          spacing={0}
          w="100%"
        >
          <TransliterateInput
            placeholder="Enter Text"
            isPegon={labels.left === "Pegon"}
            value={leftText}
            onChange={onChange}
          />
          <TransliterateInput
            placeholder="Transliteration"
            isPegon={labels.right === "Pegon"}
            isReadOnly
            value={rightText}
          />
        </Stack>
      </Card>
    </VStack>
  );
};
export default TransliteratePegonPage;
