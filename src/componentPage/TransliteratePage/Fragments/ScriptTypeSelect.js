import {
  Button,
  VStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { FaChevronDown } from "react-icons/fa";

export const ScriptTypeSelect = ({ value, onChange = () => {}, ...props }) => {
  return (
    <VStack align="flex-start">
      <Text fontSize="sm" textColor="gray.500">
        Script
      </Text>
      <Menu>
        <MenuButton
          size="sm"
          as={Button}
          variant="outline"
          fontWeight="normal"
          gap={3}
          {...props}
          rightIcon={<FaChevronDown />}
        >
          {value}
        </MenuButton>
        <MenuList>
          <MenuItem
            onClick={() => {
              onChange("Pegon");
            }}
          >
            Pegon
          </MenuItem>
          <MenuItem
            onClick={() => {
              onChange("Jawi");
            }}
          >
            Jawi
          </MenuItem>
          <MenuItem
            onClick={() => {
              onChange("Cham");
            }}
          >
            Cham
          </MenuItem>
        </MenuList>
      </Menu>
    </VStack>
  );
};
