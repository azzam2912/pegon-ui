import React from "react";
import AppLayout from "../Page/AppLayout";
import TransliteratePegonPage from "./TransliteratePegonPage";
import Head from "next/head";
import {
  HStack,
  IconButton,
  Spacer,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { ScriptTypeSelect } from "./Fragments/ScriptTypeSelect";
import TransliterateJawiPage from "./TransilerateJawiPage";
import TransliterateChamPage from "./TransilterateCham";
import { FaInfo } from "react-icons/fa";
import { CheatSheetDrawer } from "./Fragments/CheatSheetDrawer";

const TransliteratePage = () => {
  const [documentScript, setDocumentScript] = React.useState("Pegon");
  const componentPage = {
    Pegon: <TransliteratePegonPage />,
    Jawi: <TransliterateJawiPage />,
    Cham: <TransliterateChamPage />,
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Head>
        <title>Transliterate - Aksarantara</title>
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
            value={documentScript}
            onChange={setDocumentScript}
            ml={4}
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
          <CheatSheetDrawer isOpen={isOpen} onClose={onClose} documentScript={documentScript}/>
          {componentPage[documentScript]}
        </VStack>
      </AppLayout>
    </>
  );
};

export default TransliteratePage;
