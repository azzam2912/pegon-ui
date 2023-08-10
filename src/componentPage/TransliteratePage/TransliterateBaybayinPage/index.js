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
import Baybayin from "./Baybayin";
import Hanunuo from "./Hanunuo";
import Buhid from "./Buhid";

const TransliterateBaybayinPage = () => {
    const [languageVariant, setLanguageVariant] = React.useState("Baybayin");

  const languageVariantMap = {
    Baybayin: <Baybayin/>,
    Hanunuo: <Hanunuo/>,
    Buhid: <Buhid/>

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
export default TransliterateBaybayinPage;
