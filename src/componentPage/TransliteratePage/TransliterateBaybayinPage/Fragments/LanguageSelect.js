import { Button } from "@chakra-ui/react";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import React from "react";
import { FaChevronDown } from "react-icons/fa";

export const LanguageSelect = ({value, onChange = () => {}}) => {
  return <Menu>
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
          onChange("Indonesia");
        }}
      >
        Indonesia
      </MenuItem>
      <MenuItem
        onClick={() => {
          onChange("Jawa");
        }}
      >
        Jawa
      </MenuItem>
      <MenuItem
        onClick={() => {
          onChange("Madura");
        }}
      >
        Madura
      </MenuItem>
    </MenuList>
  </Menu>;
};
