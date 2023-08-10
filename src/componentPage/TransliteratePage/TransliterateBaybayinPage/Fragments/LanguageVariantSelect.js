import { Button } from "@chakra-ui/react";
import { Menu,
         MenuButton,
         MenuList,
         MenuItem,
         Text,
         VStack } from "@chakra-ui/react";
import React from "react";
import { FaChevronDown } from "react-icons/fa";

export const LanguageVariantSelect = ({value, onChange = () => {}}) => {
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
          onChange("Baybayin");
        }}
      >
      Baybayin
      </MenuItem>
      <MenuItem
        onClick={() => {
          onChange("Buhid");
        }}
    >
    Buhid
    </MenuItem>
      <MenuItem
        onClick={() => {
          onChange("Hanunó'o");
        }}
    >
    Hanunó'o
    </MenuItem>
      <MenuItem
      onClick={() => {
          onChange("Tagbanwa");
      }}
      >
      Tagbanwa
      </MenuItem>
      </MenuList>
      </Menu>
      </VStack>
  );
};
