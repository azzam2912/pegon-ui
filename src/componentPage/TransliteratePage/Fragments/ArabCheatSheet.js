import { Heading, SimpleGrid } from "@chakra-ui/react";
import React from "react";
import { CheatItem } from "./CheatItem";
import {
  cheatSheetArabConsonant,
  cheatSheetArabSpecial,
  cheatSheetArabHarakat,
} from "src/utils/arabInfo";

export const ArabCheatSheet = () => {
  return (
    <>
      <Heading as="h3" size="md" mb={4}>
        Harakat Arab
      </Heading>
      <SimpleGrid mb={4} columns={3} spacing={5}>
        {cheatSheetArabHarakat.map((item, index) => {
          return <CheatItem key={index} {...item} />;
        })}
      </SimpleGrid>
      <Heading as="h3" size="md" mb={4}>
        Alif Lam Arab
      </Heading>
      <SimpleGrid mb={4} columns={3} spacing={5}>
        {cheatSheetArabSpecial.map((item, index) => {
          return <CheatItem key={index} {...item} />;
        })}
      </SimpleGrid>
      <Heading as="h3" size="md" mb={4}>
        Abjad Arab
      </Heading>
      <SimpleGrid mb={4} columns={3} spacing={5}>
        {cheatSheetArabConsonant.map((item, index) => {
          return <CheatItem key={index} {...item} />;
        })}
      </SimpleGrid>
    </>
  );
};
