import { Heading, SimpleGrid } from "@chakra-ui/react";
import React from "react";
import { CheatItem } from "./CheatItemMonBurmese";
import {
  cheatSheetSgawKarenConsonant,
  cheatSheetSgawKarenIndependentVowels,
  cheatSheetSgawKarenDependentVowels,
  cheatSheetSgawKarenMedialConsonants,
  cheatSheetSgawKarenFinalDiacritics,
  cheatSheetSgawKarenTones,
  cheatSheetSgawKarenPunctuations
} from "src/utils/sgawKarenInfo";

export const ArabCheatSheet = () => {
  return (
    <>
      <Heading as="h3" size="md" mb={4}>
        Sgaw Karen Consonants
      </Heading>
      <SimpleGrid mb={4} columns={3} spacing={5}>
        {cheatSheetSgawKarenConsonant.map((item, index) => {
          return <CheatItem key={index} {...item} />;
        })}
      </SimpleGrid>
      <Heading as="h3" size="md" mb={4}>
        Sgaw Karen Medial Consonants
      </Heading>
      <SimpleGrid mb={4} columns={3} spacing={5}>
        {cheatSheetSgawKarenMedialConsonants.map((item, index) => {
          return <CheatItem key={index} {...item} />;
        })}
      </SimpleGrid>
      <Heading as="h3" size="md" mb={4}>
        Sgaw Karen Independent Vowels
      </Heading>
      <SimpleGrid mb={4} columns={3} spacing={5}>
        {cheatSheetSgawKarenIndependentVowels.map((item, index) => {
          return <CheatItem key={index} {...item} />;
        })}
      </SimpleGrid>
      <Heading as="h3" size="md" mb={4}>
        Sgaw Karen Dependent Vowels
      </Heading>
      <SimpleGrid mb={4} columns={3} spacing={5}>
        {cheatSheetSgawKarenDependentVowels.map((item, index) => {
          return <CheatItem key={index} {...item} />;
        })}
      </SimpleGrid>
      <Heading as="h3" size="md" mb={4}>
        Sgaw Karen Asat and Virama
      </Heading>
      <SimpleGrid mb={4} columns={3} spacing={5}>
        {cheatSheetSgawKarenFinalDiacritics.map((item, index) => {
          return <CheatItem key={index} {...item} />;
        })}
      </SimpleGrid>
      <Heading as="h3" size="md" mb={4}>
        Sgaw Karen Tones
      </Heading>
      <SimpleGrid mb={4} columns={3} spacing={5}>
        {cheatSheetSgawKarenTones.map((item, index) => {
          return <CheatItem key={index} {...item} />;
        })}
      </SimpleGrid>
      <Heading as="h3" size="md" mb={4}>
        Sgaw Karen Punctuations
      </Heading>
      <SimpleGrid mb={4} columns={3} spacing={5}>
        {cheatSheetSgawKarenPunctuations.map((item, index) => {
          return <CheatItem key={index} {...item} />;
        })}
      </SimpleGrid>
    </>
  );
};