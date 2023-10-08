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
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ScriptTypeSelect } from "./Fragments/ScriptTypeSelect";
import { VariantSelect } from "./Fragments/VariantSelect";
import { TransliterateInput } from "./Fragments/TransliterateInput";
import { TransliterationHeader } from "./Fragments/TransliterationHeader";
import { MdLightbulb } from "react-icons/md";
import { FaInfo, FaExclamationTriangle } from "react-icons/fa";
import { CheatSheetDrawer } from "./Fragments/CheatSheetDrawer";
import { scriptsData } from "src/utils/objects";

import {
  usePegonJavaneseTransliterator,
  usePegonSundaneseTransliterator,
  usePegonMadureseTransliterator,
  usePegonIndonesianTransliterator,
} from "src/hooks/usePegonTransliterator";

import useJawiMalayTransliterator from "src/hooks/useJawiMalayTransliterator";
import {
  useChamTransliterator,
  useBaybayinTransliterator,
  useBuhidTransliterator,
  useHanunooTransliterator,
  useTagbanwaTransliterator,
  useJawiChamTransliterator,
  useTobaTransliterator,
  useKaroTransliterator,
  useMandailingTransliterator,
  usePakpakTransliterator,
  useSimalungunTransliterator,
  useRejangTransliterator,
  useBugisTransliterator,
  useMakassarTransliterator,
  useThaiTransliterator,
  useLaoTransliterator,
  useTaiVietTransliterator,
  useKayahLiTransliterator,
  useMonTransliterator,
  useBurmeseTransliterator,
  useKarenTransliterator,
  useTaiLeTransliterator,
  useCarakanTransliterator,
  useSundaTransliterator,
  useBaliTransliterator,
  useSasakTransliterator,
} from "src/hooks/genericTransliteratorHooks";

const selectTransliterator = (script, variant) => {
  switch (script) {
    case "Pegon":
      switch (variant) {
        case "Jawa":
          return usePegonJavaneseTransliterator;
        case "Sunda":
          return usePegonSundaneseTransliterator;
        case "Madura":
          return usePegonMadureseTransliterator;
        case "Indonesia":
          return usePegonIndonesianTransliterator;
      }
      break;
    case "Jawi":
      switch (variant) {
        case "Malay":
          return useJawiMalayTransliterator;
        case "Cham":
          return useJawiChamTransliterator;
      }
      break;
    case "Cham":
      return useChamTransliterator;
    case "Mon-Burmese":
      switch (variant) {
        case "Myanmar":
          return useBurmeseTransliterator;
        case "Mon":
          return useMonTransliterator;
        case "Kayah Li":
          return useKayahLiTransliterator;
        case "S'gaw Karen":
          return useKarenTransliterator;
        case "Tai Le":
          return useTaiLeTransliterator;
      }
      break;
    case "Rejang":
      return useRejangTransliterator;
    case "Baybayin":
      switch (variant) {
        case "Baybayin":
          return useBaybayinTransliterator;
        case "Buhid":
          return useBuhidTransliterator;
        case "Hanuno'o":
          return useHanunooTransliterator;
        case "Tagbanwa":
          return useTagbanwaTransliterator;
      }
      break;
    case "Batak":
      switch (variant) {
        case "Toba":
          return useTobaTransliterator;
        case "Karo":
          return useKaroTransliterator;
        case "Simalungun":
          return useSimalungunTransliterator;
        case "Angkola-Mandailing":
          return useMandailingTransliterator;
        case "Pakpak":
          return usePakpakTransliterator;
      }
      break;
    case "Lontara":
      switch (variant) {
        case "Makassar":
          return useMakassarTransliterator;
        case "Bugis":
          return useBugisTransliterator;
      }
      break;
    case "Sukhothai":
      switch (variant) {
        case "Thai":
          return useThaiTransliterator;
        case "Lao":
          return useLaoTransliterator;
        case "Tai Viet":
          return useTaiVietTransliterator;
      }
      break;
    case "Hanacaraka":
      switch (variant) {
        case "Jawa":
          return useCarakanTransliterator;
        case "Sunda":
          return useSundaTransliterator;
        case "Bali":
          return useBaliTransliterator;
        case "Sasak":
          return useSasakTransliterator;
      }
      break;
  }
};

const TransliteratePage = () => {
  const router = useRouter();

  const [script, setScript] = useState("Pegon");
  const [variant, setVariant] = useState("Indonesia");
  const [inputText, setInputText] = useState("");
  const [isLatinInput, setIsLatinInput] = useState(true);
  const [outputText, setOutputText] = useState("");
  const [standardLatin, setStandardLatin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transliterateHook, setTransliterateHook] = useState(
    () => usePegonIndonesianTransliterator,
  );

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
    setTransliterateHook(() => selectTransliterator(script, variant));
  }, [script, variant]);


  const asyncTransliterate = async() =>{ 
    let result = await transliterateHook(
      inputText,
      setInputText,
      isLatinInput,
      setIsLoading,
    );
    setOutputText(result.outputText);
    setStandardLatin(result.standardLatin);
  }
  
  const getTimeout = (script, variant) => {
    if (script === "Jawi" && variant === "Malay") {
      return 1000;
    }
    else {
      return 0
    }
  }

  useEffect(() => {
    const timer = setTimeout(asyncTransliterate(), getTimeout(script, variant));
    return () => clearTimeout(timer);
  }, [inputText]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleWikiButtonClick = () => {
    // Use the router to navigate to the desired page
    let paramScript, paramVariant;
    switch (script) {
      case "Pegon":
        paramScript = "Pegon";
        paramVariant = "";
        break;
      case "Jawi":
        paramScript = "Jawi";
        paramVariant = "";
        break;
      case "Cham":
        paramScript = "Cham";
        paramVariant = "";
        break;
      case "Mon-Burmese":
        paramScript = "Mon-Burmese";
        paramVariant = "";
        switch (variant) {
          case "Kayah Li":
            paramVariant = "Kayah Li";
            break;
        }
        break;
      case "Baybayin":
        paramScript = "Baybayin";
        paramVariant = "";
        switch (variant) {
          case "Buhid":
            paramVariant = "Buhid";
            break;
          case "Hanuno'o":
            paramVariant = "Hanuno'o";
            break;
          case "Tagbanwa":
            paramVariant = "Tagbanwa";
            break;
        }
        break;
      case "Batak":
        paramScript = "Batak";
        paramVariant = "";
        break;
      case "Lontara":
        paramScript = "Lontara";
        paramVariant = "";
        switch (variant) {
          case "Bugis":
            paramVariant = "Bugis";
            break;
          case "Makassar":
            paramVariant = "Makassar";
            break;
        }
        break;
      case "Rejang":
        paramScript = "Rejang";
        paramVariant = "";
        break;
      case "Sukhothai":
        paramScript = "Sukhothai";
        paramVariant = "";
        switch (variant) {
          case "Thai":
            paramVariant = "Thai";
            break;
          case "Lao":
            paramVariant = "Lao";
            break;
        }
        break;
      case "Hanacaraka":
        paramScript = "Hanacaraka";
        paramVariant = "";
        switch (variant) {
          case "Jawa":
            paramVariant = "Jawa";
            break;
          case "Sunda":
            paramVariant = "Sunda";
            break;
          case "Bali":
            paramVariant = "Bali";
            break;
          case "Sasak":
            paramVariant = "Sasak";
            break;
        }
    }
    router.push("/app/wiki?script=" + paramScript + "&variant=" + paramVariant);
  };
  
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
            <ScriptTypeSelect
              value={script}
              options={Object.keys(scriptsData)}
              onChange={handleScriptChange}
            />
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
            <IconButton
              colorScheme="primary"
              size="sm"
              icon={<MdLightbulb />}
              ml={5}
              onClick={handleWikiButtonClick}
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
            <Card height={{ base: "450px", md: "350px" }} width="100%">
              <Stack
                height="100%"
                direction={{ base: "column", md: "row" }}
                divider={
                  <Divider
                    borderWidth="2px"
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
                  script={script}
                  variant={variant}
                  isLatinInput={isLatinInput}
                  standardLatin={isLatinInput ? standardLatin : null}
                />
                <TransliterateInput
                  placeholder="Transliteration result"
                  isRightToLeft={
                    isLatinInput ? scriptsData[script]["rightToLeft"] : false
                  }
                  value={outputText}
                  isLoading={isLoading}
                  isReadOnly
                  script={script}
                  variant={variant}
                  isLatinInput={isLatinInput}
                  standardLatin={isLatinInput ? null : standardLatin}
                />
              </Stack>
            </Card>
            <Text>​</Text>
            {(script === "Jawi" && variant === "Malay") ?   
              <HStack>
                <FaExclamationTriangle size={13}/>
                <Text color="gray.400" fontSize="xs">
                  This feature uses experimental AI technology and may produce inaccurate results.
                </Text>
              </HStack> : "" 
            }
          </VStack>
        </VStack>
      </AppLayout>
    </>
  );
};

export default TransliteratePage;
