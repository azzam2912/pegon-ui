import { useEffect, useState } from "react";
import AppLayout from "../Page/AppLayout";
import Head from "next/head";
import {
  HStack,
  IconButton,
  Spacer,
  VStack,
  Card,
  Stack,
  Divider,
  useDisclosure,
} from "@chakra-ui/react";
import { ScriptTypeSelect } from "./Fragments/ScriptTypeSelect";
import { VariantSelect } from "./Fragments/VariantSelect";
import { TransliterateInput } from "./Fragments/TransliterateInput";
import { TransliterationHeader } from "./Fragments/TransliterationHeader";
TransliterationHeader;
import { FaInfo } from "react-icons/fa";
import { CheatSheetDrawer } from "./Fragments/CheatSheetDrawer";
import usePegonTransliterator from "./../../hooks/usePegonTransliterator";

const variants = {
  Pegon: ["Indonesian", "Javanese", "Madurese"],
  Jawi: ["Malay", "Cham"],
  Cham: [],
  Baybayin: ["Baybayin", "Buhid", "Hanuno'o", "Tagbanwa"],
  "Kayah Li": [],
};

const TransliteratePage = () => {
  const [script, setScript] = useState("Pegon");
  const [variant, setVariant] = useState("Indonesian");
  const [inputText, setInputText] = useState("");
  const [isLatinInput, setIsLatinInput] = useState(true);
  const [outputText, setOutputText] = useState("");
  const [standardLatin, setStandardLatin] = useState("");

  const transliterate = () => {
    switch (script) {
      case "Pegon":
        return usePegonTransliterator(
          variant,
          inputText,
          setInputText,
          isLatinInput,
        );
    }
  };

  const handleScriptChange = (event) => {
    const newScript = event.target.innerText;
    setScript(newScript);
    setVariant(variants[newScript][0]);
  };

  const handleVariantChange = (event) => {
    const newVariant = event.target.innerText;
    setVariant(newVariant);
  };

  const handleInputTextChange = (event) => {
    const newInputText = event.target.value;
    setInputText(newInputText);
  };

  const handleSwap = () => {
    setIsLatinInput(!isLatinInput);
    const temp = inputText;
    setInputText(outputText);
    setOutputText(temp);
  };

  useEffect(() => {
    const result = transliterate();
    setOutputText(result.outputText);
    setStandardLatin(result.standardLatin);
  }, [inputText, script, variant]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Head>
        <title>Transliterator - Aksarantara</title>
        <meta
          name="description"
          content="Transliterate various Southeast Asian scripts to Latin and vice versa!"
        />
        <meta
          property="og:title"
          content="Transliterate - Aksarantara"
          key="title"
        />
        <meta
          property="og:description"
          content="Transliterate various Southeast Asian scripts to Latin and vice versa!"
          key="description"
        />
        <meta property="og:image" content="logo.png" key="image" />
      </Head>
      <AppLayout>
        <VStack pt={3} align="start">
          <HStack px={5} w="100%">
            <ScriptTypeSelect value={script} onChange={handleScriptChange} />
            <VariantSelect
              value={variant}
              options={variants[script]}
              onChange={handleVariantChange}
            />
            <Spacer />
            <IconButton
              colorScheme="primary"
              size="sm"
              icon={<FaInfo />}
              ml={5}
              onClick={onOpen}
            />
          </HStack>
          <CheatSheetDrawer
            isOpen={isOpen}
            onClose={onClose}
            documentScript={script}
          />
          <VStack
            px={5}
            spacing={0}
            w="100%"
            h="100%"
            align={{ base: "stretch", md: "start" }}
          >
            <TransliterationHeader
              leftLabel={
                isLatinInput
                  ? "Latin"
                  : `${script} ${variant ? ` (${variant})` : ""}`
              }
              rightLabel={
                isLatinInput
                  ? `${script} ${variant ? ` (${variant})` : ""}`
                  : "Latin"
              }
              onSwitchClicked={handleSwap}
            />
            <Card height={{ base: "300px", md: "200px" }} width="100%">
              <Stack
                height="100%"
                direction={{ base: "column", md: "row" }}
                divider={
                  <Divider
                    orientation={{ base: "horizontal", md: "vertical" }}
                    height={{ base: "1px", md: "auto" }}
                  />
                }
                spacing={0}
                w="100%"
              >
                <TransliterateInput
                  placeholder="Enter text"
                  isRightToLeft={!isLatinInput}
                  value={inputText}
                  onChange={handleInputTextChange}
                />
                <TransliterateInput
                  placeholder="Transliteration"
                  isRightToLeft={isLatinInput}
                  value={outputText}
                  isReadOnly
                />
              </Stack>
            </Card>
          </VStack>
        </VStack>
      </AppLayout>
    </>
  );
};

export default TransliteratePage;
