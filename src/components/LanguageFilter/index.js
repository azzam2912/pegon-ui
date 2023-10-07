import React from "react";
import {
  VStack,
  HStack,
  Stack,
  Flex,
  Spacer,
  Text,
  Select,
  IconButton,
  InputGroup,
  Input,
  InputRightElement,
  CloseButton,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Button,
  Heading,
  Box,
  Show,
} from "@chakra-ui/react";
import {
  AutoComplete,
  AutoCompleteGroup,
  AutoCompleteGroupTitle,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";

import { languages } from "src/utils/languageList";

const LanguageFilter = ({ language, setLanguage }) => (
  <AutoComplete
    openOnFocus
    defaultValues={[""]}
    restoreOnBlurIfEmpty={false}
    onChange={(val) => setLanguage(val)}
  >
    <InputGroup>
      <AutoCompleteInput
        value={language}
        onChange={(event) => setLanguage(event.target.value)}
        placeholder="Language"
      />
      {language && (
        <InputRightElement>
          <CloseButton onClick={() => setLanguage("")} />
        </InputRightElement>
      )}
    </InputGroup>
    <AutoCompleteList>
      {Object.entries(languages).map(([family, langs], lf_id) => (
        <AutoCompleteGroup key={lf_id} showDivider>
          <AutoCompleteGroupTitle>{family}</AutoCompleteGroupTitle>
          {langs.map((language, idx) => (
            <AutoCompleteItem key={idx} value={language}>
              {language}
            </AutoCompleteItem>
          ))}
        </AutoCompleteGroup>
      ))}
    </AutoCompleteList>
  </AutoComplete>
);

export default LanguageFilter;
