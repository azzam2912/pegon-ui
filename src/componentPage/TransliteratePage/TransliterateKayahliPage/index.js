import {
  Card,
  Divider,
  Stack,
  VStack
} from "@chakra-ui/react";
import React from "react";
import { TransliterateInput } from "./Fragments/TransliterateInput";
import { TransliterationHeader } from "./Fragments/TransliterationHeader";
import useKayahliTransliterator from "src/hooks/useKayahliTransliterator";

const TransliterateKayahliPage = () => {
  const {
    leftText,
    rightText,
    labels,
    onChange,
    onSwitch,
  } = useKayahliTransliterator();

  return (
    <VStack
      p={5}
      spacing={0}
      w="100%"
      h="100%"
      align={{ base: "stretch", md: "start" }}
    >
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
            isJawiCham={labels.left === "Kayah Li"}
            value={leftText}
            onChange={onChange}
          />
          <TransliterateInput
            placeholder="Transliteration"
            isJawiCham={labels.right === "Kayah Li"}
            isReadOnly
            value={rightText}
          />
        </Stack>
      </Card>
      </VStack>
  );
};
export default TransliterateKayahliPage;
