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

const JawiMalay = () => {
  const [labels, setLabels] = React.useState({
    left: "Latin",
    right: "Jawi Malay",
  });

  const [leftText, setLeftText] = React.useState("");
  const [rightText, setRightText] = React.useState("");

  // TODO: Transliteration logic using api

  const switchLabels = () => {
    const tempLeft = labels.left;
    setLabels({
      left: labels.right,
      right: tempLeft,
    });

    const tempText = leftText;
    setLeftText(rightText);
    setRightText(tempText);
  };

  return (
    <>
      <TransliterationHeader
        leftLabel={labels.left}
        rightLabel={labels.right}
        onSwitchClicked={switchLabels}
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
            onChange={(e) => {
              setLeftText(e.target.value);
              setRightText(e.target.value);
            }}
          />
          <TransliterateInput
            placeholder="Transliteration"
            isJawiMalay={labels.right === "Jawi Malay"}
            isReadOnly
            value={rightText}
          />
        </Stack>
      </Card>
    </>
  );
};
export default JawiMalay;
