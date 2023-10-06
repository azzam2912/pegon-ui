import React, { useState } from "react";
import NextLink from "next/link";
import Head from "next/head";
import {
  VStack,
  HStack,
  Stack,
  Flex,
  Spacer,
  Text,
  Select,
  IconButton,
  InputGroup,
  Input,
  InputRightElement,
  CloseButton,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Button,
  Heading,
  Box,
  Show,
} from "@chakra-ui/react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaFileUpload,
  FaFilter,
  FaFolderOpen,
} from "react-icons/fa";
import AppLayout from "src/componentPage/Page/AppLayout";
import FilterInput from "src/components/FilterInput";
import LanguageFilter from "src/components/LanguageFilter";
import { DocumentData } from "src/componentPage/DocumentsPage/Fragments/DocumentData";
import { DocumentSkeleton } from "src/componentPage/DocumentsPage/Fragments/DocumentSkeleton";
import { useDocumentsQuery } from "src/hooks/fetchers/queries/useDocumentsQuery";
import { languages } from "src/utils/languageList";

const DocumentsPage = () => (
  <AppLayout>
    <Head>
      <title>Explore Documents - Aksarantara</title>
      <meta
        name="description"
        content="View all of available documents and manuscripts here!"
      />
      <meta
        property="og:title"
        content="Explore Documents - Aksarantara"
        key="title"
      />
      <meta
        property="og:description"
        content="View all of available documents and manuscripts here!"
        key="description"
      />
      <meta property="og:image" content="logo.png" key="image" />
    </Head>
    <VStack w="100%" align="stretch" p={8}>
      <DataComponent />
    </VStack>
  </AppLayout>
);

const DataComponent = () => {
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [title, setTitle] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [author, setAuthor] = useState("");
  const [collector, setCollector] = useState("");
  const [language, setLanguage] = useState("");
  const { data, status } = useDocumentsQuery({
    config: {},
    page: currentPage,
    pageSize: itemsPerPage,
    queries: {
      populate: "*",
      "filters[title][$containsi]": title,
      "filters[language][$containsi]": language,
      "filters[documentType][$containsi]": documentType,
      "filters[author][$containsi]": author,
      "filters[collector][$containsi]": collector,
    },
  });

  const currentData = data?.data;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return (
    <>
      <VStack align="left" mb={5}>
        <HStack>
          <Heading size="lg">Explore Documents</Heading>
          <Spacer />
          <Show above="sm">
            <Button
              as={NextLink}
              href="/app/documents/new"
              size={["sm", "md"]}
              leftIcon={<FaFileUpload />}
              colorScheme="primary"
              variant="solid"
            >
              Contribute
            </Button>
          </Show>
        </HStack>
        <Text color="gray.500">
          {data?.meta.pagination.total} entries found
        </Text>
      </VStack>

      <Show above="md">
        <Stack mt={5} direction="row" align="stretch" w="100%">
          <HStack mr={3}>
            <FaFilter color="primary" />
            <Text color="primary">Filter</Text>
          </HStack>
          <FilterInput placeholder="Title" value={title} setValue={setTitle} />
          <LanguageFilter language={language} setLanguage={setLanguage} />
          <FilterInput
            placeholder="Document Type"
            value={documentType}
            setValue={setDocumentType}
          />
          <FilterInput
            placeholder="Author"
            value={author}
            setValue={setAuthor}
          />
          <FilterInput
            placeholder="Collector"
            value={collector}
            setValue={setCollector}
          />
        </Stack>
      </Show>

      <Show below="md">
        <Accordion allowToggle>
          <AccordionItem>
            <AccordionButton>
              <HStack>
                <FaFilter />
                <Text>Filter</Text>
              </HStack>
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Stack
                direction={{ base: "column", lg: "row" }}
                align="stretch"
                w="100%"
              >
                <FilterInput
                  placeholder="Title"
                  value={title}
                  setValue={setTitle}
                />
                <LanguageFilter language={language} setLanguage={setLanguage} />
                <FilterInput
                  placeholder="Document Type"
                  value={documentType}
                  setValue={setDocumentType}
                />
                <FilterInput
                  placeholder="Author"
                  value={author}
                  setValue={setAuthor}
                />
                <FilterInput
                  placeholder="Collector"
                  value={collector}
                  setValue={setCollector}
                />
              </Stack>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Show>

      <VStack pt={3} align="stretch">
        <Box width="100%">
          <VStack
            bg="gray.700"
            borderWidth="1px"
            borderRadius="md"
            spacing={0}
            align="stretch"
            overflowX="auto"
            width="100%"
          >
            <Flex
              align="center"
              justify="space-between"
              p="4"
              minWidth="max-content"
              borderBottomWidth="1px"
            >
              <Text as="b" width="48px" fontSize="sm"></Text>
              <Text as="b" width="160px" fontSize="sm" ml="4">
                Title
              </Text>
              <Text as="b" width="160px" fontSize="sm" ml="4">
                Contributor
              </Text>
              <Text as="b" width="100px" fontSize="sm" ml="4">
                Language
              </Text>
              <Text as="b" width="80px" fontSize="sm" ml="4">
                Document Type
              </Text>
              <Text as="b" width="100px" fontSize="sm" ml="4">
                Author
              </Text>
              <Text as="b" width="100px" fontSize="sm" ml="4">
                Collector
              </Text>
              <Text as="b" width="100px" fontSize="sm" ml="4">
                Publication Date
              </Text>
            </Flex>
            {currentData?.map(({ id, attributes: item }, index) => (
              <DocumentData key={id} index={index} id={id} item={item} />
            ))}
            {status === "loading" && (
              <>
                <DocumentSkeleton />
                <DocumentSkeleton />
                <DocumentSkeleton />
                <DocumentSkeleton />
                <DocumentSkeleton />
              </>
            )}
            {status !== "loading" && currentData?.length === 0 && (
              <Flex
                minH="200px"
                direction="column"
                align="center"
                justify="center"
              >
                <Heading size="4xl" color="gray.600">
                  <FaFolderOpen />
                </Heading>
                <Heading size="md" color="gray.500">
                  No documents found
                </Heading>
              </Flex>
            )}
          </VStack>
          <Flex align="center" pt={4}>
            <Select
              width="fit-content"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(parseInt(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </Select>
            <Text mx="3" fontSize="sm" color="gray.500">
              items per page
            </Text>
            <Spacer />
            <Flex align="center" justify="flex-end">
              <IconButton
                aria-label="Previous Page"
                icon={<FaChevronLeft />}
                size="sm"
                variant="ghost"
                onClick={() => setCurrentPage(currentPage - 1)}
                isDisabled={currentPage === 1}
              />
              <Text mx="3" fontSize="sm" color="gray.500">
                {startIndex + 1} - {endIndex} of {data?.meta.pagination.total}
              </Text>
              <IconButton
                aria-label="Next Page"
                icon={<FaChevronRight />}
                size="sm"
                variant="ghost"
                onClick={() => setCurrentPage(currentPage + 1)}
                isDisabled={endIndex >= data?.meta.pagination.total}
              />
            </Flex>
          </Flex>
        </Box>
      </VStack>
    </>
  );
};

export default DocumentsPage;
