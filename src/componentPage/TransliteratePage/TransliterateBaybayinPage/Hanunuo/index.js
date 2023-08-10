import {
  Card,
  Divider,
  Stack,
  VStack
} from "@chakra-ui/react";
import React from "react";
import { TransliterateInput } from "./Fragments/TransliterateInput";
import { TransliterationHeader } from "./Fragments/TransliterationHeader";
import useHanunuoTransliterator from "src/hooks/useHanunuoTransliterator";

const Hanunuo = () => {
  const {
    stemmingType,
    setStemmingType,
    leftText,
    rightText,
    labels,
    onChange,
    onSwitch,
  } = useHanunuoTransliterator();

  return (
    <>
      <TransliterationHeader
        leftLabel={labels.left}
        rightLabel={labels.right}
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
            rtl={false}
            value={leftText}
            onChange={onChange}
          />
          <TransliterateInput
            placeholder="Transliteration"
            rtl={false}
            isReadOnly
            value={rightText}
          />
        </Stack>
      </Card>
      </>
  );
};
export default Hanunuo;
