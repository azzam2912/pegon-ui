import React from "react";
import {
  Divider,
  Flex,
  Heading,
  IconButton,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FaExchangeAlt } from "react-icons/fa";

export const TransliterationHeader = ({
  leftLabel,
  rightLabel,
  onSwitchClicked,
}) => {
  return (
    <Stack
      direction={{ base: "column", md: "row" }}
      spacing={0}
      pt={3}
      pb={{ base: 8, md: 3 }}
      w="100%"
      align={{ base: "stretch", md: "center" }}
    >
      <VStack pl={{ base: 3, md: 0 }} spacing={0} align="start" flex={1}>
        <Text fontSize="sm" textColor="gray.500">
          Input
        </Text>
        <Heading size="lg" textColor="gray.300">
          {leftLabel}
        </Heading>
      </VStack>
      <Flex align="center">
        <Divider display={{ md: "none" }} flex={1} mr="3" />
        <IconButton
          textColor="primary.200"
          borderRadius="full"
          transform={{ base: "rotate(90deg)", md: "none" }}
          bgColor="gray.700"
          onClick={onSwitchClicked}
          icon={<FaExchangeAlt />}
        />
      </Flex>
      <VStack
        align={{ base: "start", md: "end" }}
        pl={{ base: 3, md: 0 }}
        spacing={0}
        flex={1}
      >
        <Text fontSize="sm" textColor="gray.500">
          Output
        </Text>
        <Heading
          size="lg"
          textAlign={{ base: "start", md: "end" }}
          textColor="gray.300"
        >
          {rightLabel}
        </Heading>
      </VStack>
    </Stack>
  );
};
