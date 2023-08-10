import { Button } from "@chakra-ui/react";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import React from "react";
import { FaChevronDown } from "react-icons/fa";

export const LanguageVariantSelect = ({value, onChange = () => {}}) => {
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
          onChange("Hanunuo");
        }}
    >
    Hanunu'o
    </MenuItem>
    </MenuList>
    </Menu>;
};
