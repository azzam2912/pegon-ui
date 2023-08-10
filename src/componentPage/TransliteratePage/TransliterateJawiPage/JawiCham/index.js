import {
  Card,
  Divider,
  IconButton,
  Spacer,
  Stack,
  VStack,
  HStack,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { TransliterateInput } from "./Fragments/TransliterateInput";
import { TransliterationHeader } from "./Fragments/TransliterationHeader";
import useJawiChamTransliterator from "src/hooks/useJawiChamTransliterator";

const JawiCham = () => {
  const {
    stemmingType,
    setStemmingType,
    leftText,
    rightText,
    labels,
    onChange,
    onSwitch,
  } = useJawiChamTransliterator();

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
            isJawiCham={labels.left === "Jawi Cham"}
            value={leftText}
            onChange={onChange}
          />
          <TransliterateInput
            placeholder="Transliteration"
            isJawiCham={labels.right === "Jawi Cham"}
            isReadOnly
            value={rightText}
          />
        </Stack>
      </Card>
      </>
  );
};
export default JawiCham;
