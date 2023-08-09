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
import useJawiMalayTransliterator from "src/hooks/useJawiMalayTransliterator";

const JawiMalay = () => {
  const { leftText, rightText, labels, onChange, onSwitch, loading } =
    useJawiMalayTransliterator();

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
            isJawiMalay={labels.left === "Jawi Malay"}
            value={leftText}
            onChange={onChange}
          />
          {loading ? (
            <TransliterateInput
              placeholder="Transliteration"
              isJawiMalay={labels.right === "Jawi Malay"}
              isReadOnly
              value={"Loading..."}
            />
          ) : (
            <TransliterateInput
              placeholder="Transliteration"
              isJawiMalay={labels.right === "Jawi Malay"}
              isReadOnly
              value={rightText}
            />
          )}
        </Stack>
      </Card>
    </>
  );
};
export default JawiMalay;
