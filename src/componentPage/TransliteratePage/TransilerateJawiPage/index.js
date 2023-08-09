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
import { LanguageVariantSelect } from "./Fragments/LanguageVariantSelect";
import JawiCham from "./JawiCham";
import JawiMalay from "./JawiMalay";

const TransliterateJawiPage = () => {
  const [languageVariant, setLanguageVariant] = React.useState("Malay");

  const languageVariantMap = {
    Malay: <JawiMalay/>,
    Cham: <JawiCham/>,
  }

  return (
    <VStack
      p={5}
      spacing={0}
      w="100%"
      h="100%"
      align={{ base: "stretch", md: "start" }}
    >
      {languageVariantMap[languageVariant]}
      <HStack py={3} w="100%" align="end" justify="end">
        <LanguageVariantSelect value={languageVariant} onChange={setLanguageVariant} />
        <Spacer />
      </HStack>
    </VStack>
  );
};
export default TransliterateJawiPage;
