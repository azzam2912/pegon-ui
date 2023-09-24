import {
  Button,
  VStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
} from "@chakra-ui/react";
import { FaChevronDown } from "react-icons/fa";

export const ScriptTypeSelect = ({ value, onChange }) => {
  const scriptOptions = ["Pegon", "Jawi", "Cham", "Baybayin", "Kayah Li"];

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
          ml={4}
          rightIcon={<FaChevronDown />}
        >
          {value}
        </MenuButton>
        <MenuList>
          {scriptOptions.map((option) => (
            <MenuItem key={option} onClick={onChange}>
              {option}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </VStack>
  );
};
