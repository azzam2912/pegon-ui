import { Button } from "@chakra-ui/react";
import { Menu, MenuButton, MenuList, MenuItem, VStack, Text } from "@chakra-ui/react";
import React from "react";
import { FaChevronDown } from "react-icons/fa";

export const LanguageSelect = ({ value, onChange = () => {} }) => {
  return (
    <VStack align="flex-start">
      <Text fontSize="sm" textColor="gray.500">
        Language
      </Text>
      <Menu>
        <MenuButton
          size="sm"
          as={Button}
          variant="outline"
          fontWeight="normal"
          gap={3}
          rightIcon={<FaChevronDown />}
        >
          {value}
        </MenuButton>
        <MenuList>
          <MenuItem
            onClick={() => {
              onChange("Indonesian");
            }}
          >
            Indonesian
          </MenuItem>
          <MenuItem
            onClick={() => {
              onChange("Javanese");
            }}
          >
            Javanese
          </MenuItem>
          <MenuItem
            onClick={() => {
              onChange("Madurese");
            }}
          >
            Madurese
          </MenuItem>
        </MenuList>
      </Menu>
    </VStack>
  );
};
