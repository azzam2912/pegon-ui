import { Heading, SimpleGrid } from "@chakra-ui/react";
import React from "react";
import { CheatItem } from "./CheatItemMonBurmese";
import {
  cheatSheetBurmeseConsonant,
  cheatSheetBurmeseIndependentVowels,
  cheatSheetBurmeseDependentVowels,
  cheatSheetBurmeseMedialConsonants,
  cheatSheetBurmeseFinalDiacritics,
  cheatSheetBurmeseTones,
  cheatSheetBurmesePunctuations
} from "src/utils/burmeseInfo";

export const ArabCheatSheet = () => {
  return (
    <>
      <Heading as="h3" size="md" mb={4}>
        Burmese Consonants
      </Heading>
      <SimpleGrid mb={4} columns={3} spacing={5}>
        {cheatSheetBurmeseConsonant.map((item, index) => {
          return <CheatItem key={index} {...item} />;
        })}
      </SimpleGrid>
      <Heading as="h3" size="md" mb={4}>
        Burmese Medial Consonants
      </Heading>
      <SimpleGrid mb={4} columns={3} spacing={5}>
        {cheatSheetBurmeseMedialConsonants.map((item, index) => {
          return <CheatItem key={index} {...item} />;
        })}
      </SimpleGrid>
      <Heading as="h3" size="md" mb={4}>
        Burmese Independent Vowels
      </Heading>
      <SimpleGrid mb={4} columns={3} spacing={5}>
        {cheatSheetBurmeseIndependentVowels.map((item, index) => {
          return <CheatItem key={index} {...item} />;
        })}
      </SimpleGrid>
      <Heading as="h3" size="md" mb={4}>
        Burmese Dependent Vowels
      </Heading>
      <SimpleGrid mb={4} columns={3} spacing={5}>
        {cheatSheetBurmeseDependentVowels.map((item, index) => {
          return <CheatItem key={index} {...item} />;
        })}
      </SimpleGrid>
      <Heading as="h3" size="md" mb={4}>
        Burmese Asat and Virama
      </Heading>
      <SimpleGrid mb={4} columns={3} spacing={5}>
        {cheatSheetBurmeseFinalDiacritics.map((item, index) => {
          return <CheatItem key={index} {...item} />;
        })}
      </SimpleGrid>
      <Heading as="h3" size="md" mb={4}>
        Burmese Tones
      </Heading>
      <SimpleGrid mb={4} columns={3} spacing={5}>
        {cheatSheetBurmeseTones.map((item, index) => {
          return <CheatItem key={index} {...item} />;
        })}
      </SimpleGrid>
      <Heading as="h3" size="md" mb={4}>
        Burmese Punctuations
      </Heading>
      <SimpleGrid mb={4} columns={3} spacing={5}>
        {cheatSheetBurmesePunctuations.map((item, index) => {
          return <CheatItem key={index} {...item} />;
        })}
      </SimpleGrid>
    </>
  );
};