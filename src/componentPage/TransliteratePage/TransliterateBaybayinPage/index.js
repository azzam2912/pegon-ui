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
import Tagbanwa from "./Tagbanwa";

const TransliterateBaybayinPage = () => {
    const [languageVariant, setLanguageVariant] = React.useState("Baybayin");

  const languageVariantMap = {
    Baybayin: <Baybayin />,
    Hanunuo: <Hanunuo />,
    Buhid: <Buhid />,
    Tagbanwa: <Tagbanwa />
  }

  return (
    <VStack
      px={5}
      spacing={0}
      w="100%"
      h="100%"
      align={{ base: "stretch", md: "start" }}
      >
      <LanguageVariantSelect
        value={languageVariant}
        onChange={setLanguageVariant} />
      {languageVariantMap[languageVariant]}
      </VStack>
  );
};
export default TransliterateBaybayinPage;
