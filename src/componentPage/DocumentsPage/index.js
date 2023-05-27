import React from "react";
import AppLayout from "../Page/AppLayout";
import {
  Button,
  Divider,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Spacer,
  Stack,
  VStack,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";

const DocumentsPage = () => {
  return (
    <AppLayout>
      <VStack w="100%" align="left" p={5}>
        <Heading size="lg">Documents</Heading>
        <Stack direction={{
            base: "column",
            md: "row",
        }} w="100%" justify="space-between">
          <InputGroup w={{
                base: "100%",
                md: "50%",
          }}>
            <InputLeftElement pointerEvents="none">
              <FaSearch color="gray.300" />
            </InputLeftElement>
            <Input type="text" placeholder="Search Documents" />
          </InputGroup>
          <Divider orientation="vertical" />
          <HStack flex={1}>
            <Select w="50%" placeholder="Document Language">
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </Select>
            <Spacer/>
            <Button w="20%">Search</Button>
          </HStack>
        </Stack>
      </VStack>
    </AppLayout>
  );
};

export default DocumentsPage;
