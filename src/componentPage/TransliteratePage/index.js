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
import { FaInfo } from "react-icons/fa";
import { CheatSheetDrawer } from "./Fragments/CheatSheetDrawer";
import usePegonTransliterator from "./../../hooks/usePegonTransliterator";
import useJawiChamTransliterator from "./../../hooks/useJawiChamTransliterator";
import useJawiMalayTransliterator from "./../../hooks/useJawiMalayTransliterator";
import useChamTransliterator from "./../../hooks/useChamTransliterator";
import useKayahliTransliterator from "./../../hooks/useKayahliTransliterator";
import useBaybayinTransliterator from "./../../hooks/useBaybayinTransliterator";
import useBuhidTransliterator from "./../../hooks/useBuhidTransliterator";
import useHanunuoTransliterator from "./../../hooks/useHanunuoTransliterator";
import useTagbanwaTransliterator from "./../../hooks/useTagbanwaTransliterator";
import { scriptsData } from "./../../utils/objects";

const TransliteratePage = () => {
  const [script, setScript] = useState("Pegon");
  const [variant, setVariant] = useState("Indonesian");
  const [inputText, setInputText] = useState("");
  const [isLatinInput, setIsLatinInput] = useState(true);
  const [outputText, setOutputText] = useState("");
  const [standardLatin, setStandardLatin] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const transliterate = () => {
    switch (script) {
      case "Pegon":
        return usePegonTransliterator(
          variant,
          inputText,
          setInputText,
          isLatinInput,
        );
      case "Jawi":
        switch (variant) {
          case "Malay":
            return useJawiMalayTransliterator(
              inputText,
              setInputText,
              isLatinInput,
              setIsLoading,
            );
          case "Cham":
            return useJawiChamTransliterator(
              inputText,
              setInputText,
              isLatinInput,
            );
        }
        break;
      case "Cham":
        return useChamTransliterator(inputText, setInputText, isLatinInput);
      case "Kayah Li":
        return useKayahliTransliterator(inputText, setInputText, isLatinInput);
      case "Baybayin":
        switch (variant) {
          case "Baybayin":
            return useBaybayinTransliterator(
              inputText,
              setInputText,
              isLatinInput,
            );
          case "Buhid":
            return useBuhidTransliterator(
              inputText,
              setInputText,
              isLatinInput,
            );
          case "Hanuno'o":
            return useHanunuoTransliterator(
              inputText,
              setInputText,
              isLatinInput,
            );
          case "Tagbanwa":
            return useTagbanwaTransliterator(
              inputText,
              setInputText,
              isLatinInput,
            );
        }
        break;
    }
  };

  const handleScriptChange = (event) => {
    const newScript = event.target.innerText;
    setScript(newScript);
    setVariant(scriptsData[newScript]["variants"][0]);
    setInputText("");
    setOutputText("");
  };

  const handleVariantChange = (event) => {
    const newVariant = event.target.innerText;
    setVariant(newVariant);
    setInputText("");
    setOutputText("");
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
              options={scriptsData[script]["variants"]}
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
                  isRightToLeft={
                    isLatinInput ? false : scriptsData[script]["rightToLeft"]
                  }
                  value={inputText}
                  onChange={handleInputTextChange}
                  variant={script + " " + variant}
                  standardLatin={isLatinInput ? null : standardLatin}
                />
                <TransliterateInput
                  placeholder="Transliteration"
                  isRightToLeft={
                    isLatinInput ? scriptsData[script]["rightToLeft"] : false
                  }
                  value={outputText}
                  isLoading={isLoading}
                  isReadOnly
                  variant={script + " " + variant}
                  standardLatin={isLatinInput ? standardLatin : null}
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
