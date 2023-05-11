import React from "react";
import AppLayout from "../Page/AppLayout";
import {
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Image,
  Input,
  InputGroup,
  Select,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { TextInput } from "src/components/Input";

const NewDocumentPage = () => {
  return (
    <AppLayout>
      <Flex w="100%" h="100%" direction={{ base: "column-reverse", lg: "row" }}>
        <Flex flex={1} p={5} display={{ base: "none", lg: "block" }}>
          <PdfInputBig/>
        </Flex>
        <VStack
          height="100%"
          flex={1}
          overflowY="auto"
          sx={{
            "::-webkit-scrollbar": {
              display: "none",
            },
          }}
          p={5}
          spacing={5}
        >
          <Heading w="100%">New Document</Heading>
          <TextInput label="Title" placeholder="Title" type="text" isRequired />
          <TextInput label="Author" placeholder="Author" type="text" />
          <HStack width="100%">
            <TextInput
              label="Document Type"
              placeholder="Ex: Tassawuf, Fiqh, etc"
              type="text"
              isRequired
            />
            <FormControl isRequired>
              <FormLabel mb={0}>Language</FormLabel>
              <InputGroup size="md">
                <Select placeholder="Javanese">
                  <option value="option1">Javanese</option>
                  <option value="option2">Sundanese</option>
                  <option value="option3">Madurese</option>
                  <option value="option3">Indonesia</option>
                </Select>
              </InputGroup>
            </FormControl>
          </HStack>
          <HStack width="100%">
            <FormControl>
              <FormLabel mb={0}>Year Written</FormLabel>
              <InputGroup size="md">
                <Input type="number" />
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel mb={0}>Location Written</FormLabel>
              <InputGroup size="md">
                <Input
                  type="text"
                  placeholder="ex: Central Java, Lombok, etc"
                />
              </InputGroup>
            </FormControl>
          </HStack>
          <HStack width="100%">
            <TextInput label="Ink" placeholder="ex: masi, etc" />
            <TextInput label="Illumination" placeholder="ex: Bingkai, etc" />
          </HStack>
          <FormControl>
            <FormLabel mb={0}>Description</FormLabel>
            <InputGroup size="md">
              <Textarea placeholder="Insert description here" />
            </InputGroup>
          </FormControl>
          <FileInput />
          <PdfInputSmall/>
        </VStack>
      </Flex>
    </AppLayout>
  );
};

export default NewDocumentPage;

const FileInput = () => {
  return (
    <FormControl h="640px" w="100%" isRequired>
      <FormLabel mb={0}>Thumbnail</FormLabel>
      <InputGroup size="md">
        <Flex
          position="relative"
          flex={1}
          p={5}
          bgColor="gray.700"
          borderRadius="md"
          borderWidth="1px"
        >
          <VStack
            w="100%"
            h="100%"
            align="center"
            justify="center"
            borderRadius="md"
            borderWidth="2px"
            borderStyle="dashed"
            p={5}
          >
            <Image boxSize="48px" src="/file.svg" />
            <Text>Drag and drop your Thumbnail file here</Text>
            <HStack width="256px">
              <Divider />
              <Text>or</Text>
              <Divider />
            </HStack>
            <Button>Browse</Button>
          </VStack>
          <Input
            type="file"
            height="100%"
            width="100%"
            position="absolute"
            top="0"
            left="0"
            opacity="0"
            aria-hidden="true"
            accept="application/pdf"
          />
        </Flex>
      </InputGroup>
    </FormControl>
  );
};
const PdfViewer = () => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js">
      <div style={{ height: "100%", width: "100%" }}>
        <Viewer
          fileUrl="/test.pdf"
          plugins={[defaultLayoutPluginInstance]}
          theme="dark"
        />
      </div>
    </Worker>
  );
};

const PdfInputSmall = () => {
  return (
    <FormControl h="640px" w="100%" isRequired display={{base: 'auto', lg: 'none'}}>
      <FormLabel mb={0}>Document</FormLabel>
      <InputGroup size="md">
        <Flex
          position="relative"
          flex={1}
          p={5}
          bgColor="gray.700"
          borderRadius="md"
          borderWidth="1px"
        >
          <VStack
            w="100%"
            h="100%"
            align="center"
            justify="center"
            borderRadius="md"
            borderWidth="2px"
            borderStyle="dashed"
            p={5}
          >
            <Image boxSize="48px" src="/file.svg" />
            <Text>Drag and drop your PDF file here</Text>
            <HStack width="256px">
              <Divider />
              <Text>or</Text>
              <Divider />
            </HStack>
            <Button>Browse</Button>
          </VStack>
          <Input
            type="file"
            height="100%"
            width="100%"
            position="absolute"
            top="0"
            left="0"
            opacity="0"
            aria-hidden="true"
            accept="application/pdf"
          />
        </Flex>
      </InputGroup>
    </FormControl>
  );
};

const PdfInputBig = () => {
  return (
    <Flex
      h="100%"
      position="relative"
      flex={1}
      p={5}
      bgColor="gray.700"
      borderRadius="md"
      borderWidth="1px"
    >
      <VStack
        w="100%"
        h="100%"
        align="center"
        justify="center"
        borderRadius="md"
        borderWidth="2px"
        borderStyle="dashed"
      >
        <Image boxSize="128px" src="/file.svg" />
        <Text>Drag and drop your PDF file here</Text>
        <HStack width="256px">
          <Divider />
          <Text>or</Text>
          <Divider />
        </HStack>
        <Button>Browse</Button>
      </VStack>
      <Input
        type="file"
        height="100%"
        width="100%"
        position="absolute"
        top="0"
        left="0"
        opacity="0"
        aria-hidden="true"
        accept="application/pdf"
      />
    </Flex>
  );
};
