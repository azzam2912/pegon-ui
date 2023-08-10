import { Heading, SimpleGrid } from "@chakra-ui/react";
import React from "react";
import { CheatItem } from "./CheatItem";
import {
  cheatSheetPegonConsonant,
  cheatSheetPegonVocal,
  cheatSheetPegonVocalSundanese,
} from "src/utils/pegonInfo";

// ga harus ngikut ginian
export const PegonCheatSheet = () => {
  return (
    <>
      <Heading as="h3" size="md" mb={4}>
        Pegon Vowel
      </Heading>
      <SimpleGrid mb={4} columns={3} spacing={5}>
        {cheatSheetPegonVocal.map((item, index) => {
          return (
            <CheatItem
              key={index}
              {...item}
            />
          );
        })}
      </SimpleGrid>
      {/* <Heading as="h3" size="md" mb={4}>
        Vocal Sunda Pegon
      </Heading>
      <SimpleGrid mb={4} columns={3} spacing={5}>
        {cheatSheetPegonVocalSundanese.map(
          (item, index) => {
            return (
              <CheatItem
                key={index}
                {...item}
              />
            );
          }
        )}
      </SimpleGrid> */}
      <Heading as="h3" size="md" mb={4}>
        Pegon Abjad
      </Heading>
      <SimpleGrid mb={4} columns={3} spacing={5}>
        {cheatSheetPegonConsonant.map((item, index) => {
          return (
            <CheatItem
              key={index}
              {...item}
            />
          );
        })}
      </SimpleGrid>
    </>
  );
};