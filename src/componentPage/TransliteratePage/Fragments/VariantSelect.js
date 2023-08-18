import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  VStack,
  Text,
} from "@chakra-ui/react";
import { FaChevronDown } from "react-icons/fa";

export const VariantSelect = ({ value, options, onChange }) => {
  if (options.length === 0) {
    return null;
  }

  return (
    <VStack align="flex-start">
      <Text fontSize="sm" textColor="gray.500">
        Variant
      </Text>
      <Menu>
        <MenuButton
          size="sm"
          as={Button}
          variant="outline"
          fontWeight="normal"
          gap={3}
          ml={4}
          rightIcon={<FaChevronDown />}
        >
          {value}
        </MenuButton>
        <MenuList>
          {options.map((option) => (
            <MenuItem key={option} onClick={onChange}>
              {option}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </VStack>
  );
};
