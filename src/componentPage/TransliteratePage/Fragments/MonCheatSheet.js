import { Heading, SimpleGrid } from "@chakra-ui/react";
import React from "react";
import { CheatItem } from "./CheatItemMonBurmese";
import {
  cheatSheetMonConsonant,
  cheatSheetMonIndependentVowels,
  cheatSheetMonDependentVowels,
  cheatSheetMonMedialConsonants,
  cheatSheetMonFinalDiacritics,
  cheatSheetMonTones,
  cheatSheetMonPunctuations
} from "src/utils/monInfo";

export const MonCheatSheet = () => {
  return (
    <>
      <Heading as="h3" size="md" mb={4}>
        Mon Consonants
      </Heading>
      <SimpleGrid mb={4} columns={3} spacing={5}>
        {cheatSheetMonConsonant.map((item, index) => {
          return <CheatItem key={index} {...item} />;
        })}
      </SimpleGrid>
      <Heading as="h3" size="md" mb={4}>
        Mon Medial Consonants
      </Heading>
      <SimpleGrid mb={4} columns={3} spacing={5}>
        {cheatSheetMonMedialConsonants.map((item, index) => {
          return <CheatItem key={index} {...item} />;
        })}
      </SimpleGrid>
      <Heading as="h3" size="md" mb={4}>
        Mon Independent Vowels
      </Heading>
      <SimpleGrid mb={4} columns={3} spacing={5}>
        {cheatSheetMonIndependentVowels.map((item, index) => {
          return <CheatItem key={index} {...item} />;
        })}
      </SimpleGrid>
      <Heading as="h3" size="md" mb={4}>
        Mon Dependent Vowels
      </Heading>
      <SimpleGrid mb={4} columns={3} spacing={5}>
        {cheatSheetMonDependentVowels.map((item, index) => {
          return <CheatItem key={index} {...item} />;
        })}
      </SimpleGrid>
      <Heading as="h3" size="md" mb={4}>
        Mon Asat and Virama
      </Heading>
      <SimpleGrid mb={4} columns={3} spacing={5}>
        {cheatSheetMonFinalDiacritics.map((item, index) => {
          return <CheatItem key={index} {...item} />;
        })}
      </SimpleGrid>
      <Heading as="h3" size="md" mb={4}>
        Mon Tones
      </Heading>
      <SimpleGrid mb={4} columns={3} spacing={5}>
        {cheatSheetMonTones.map((item, index) => {
          return <CheatItem key={index} {...item} />;
        })}
      </SimpleGrid>
      <Heading as="h3" size="md" mb={4}>
        Mon Punctuations
      </Heading>
      <SimpleGrid mb={4} columns={3} spacing={5}>
        {cheatSheetMonPunctuations.map((item, index) => {
          return <CheatItem key={index} {...item} />;
        })}
      </SimpleGrid>
    </>
  );
};
