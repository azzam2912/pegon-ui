import Head from "next/head";
import AppLayout from "../Page/AppLayout";
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
import { FaInfo } from "react-icons/fa";
import { TransliterateInput } from "./Fragments/TransliterateInput";
import { LanguageSelect } from "./Fragments/LanguageSelect";
import { CheatSheetDrawer } from "./Fragments/CheatSheetDrawer";
import { TransliterationHeader } from "./Fragments/TransliterationHeader";
import useTransliterator from "src/hooks/useTransliterator";

const TransliteratePage = () => {
  const {
    stemmingType,
    setStemmingType,
    leftText,
    rightText,
    labels,
    onChange,
    onSwitch,
  } = useTransliterator();

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Head>
        <title>Transliterate Pegon - Pegonizer</title>
        <meta
          name="description"
          content="Transliterate Pegon to Latin and vice versa!"
        />
        <meta
          property="og:title"
          content="Transliterate Pegon - Pegonizer"
          key="title"
        />
        <meta
          property="og:description"
          content="Transliterate Pegon to Latin and vice versa!"
          key="description"
        />
        <meta property="og:image" content="logo.png" key="image" />
      </Head>
      <AppLayout>
        <VStack
          p={5}
          spacing={0}
          w="100%"
          h="100%"
          align={{ base: "stretch", md: "start" }}
        >
          <HStack py={3} w="100%" align="end" justify="end">
            <LanguageSelect value={stemmingType} onChange={setStemmingType} />
            <Spacer />
            <IconButton
              colorScheme="primary"
              size="sm"
              icon={<FaInfo />}
              ml={3}
              onClick={onOpen}
            />
            <CheatSheetDrawer isOpen={isOpen} onClose={onClose} />
          </HStack>
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
      </AppLayout>
    </>
  );
};

export default TransliteratePage;
