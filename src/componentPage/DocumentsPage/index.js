import React from "react";
import AppLayout from "../Page/AppLayout";
import {
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  IconButton,
  Input,
  Select,
  Spacer,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaFolderOpen,
  FaSearch,
} from "react-icons/fa";
import { useDocumentsQuery } from "src/hooks/fetchers/queries/useDocumentsQuery";
import Head from "next/head";
import { useSearchBar } from "../Page";
import { DocumentSkeleton } from "./Fragments/DocumentSkeleton";
import { DocumentData } from "./Fragments/DocumentData";

import {
  AutoComplete,
  AutoCompleteGroup,
  AutoCompleteGroupTitle,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import { languages } from "src/utils/languageList";

languages["All"] = ["All Languages"];

const DocumentsPage = () => {
  return (
    <AppLayout>
      <Head>
        <title>Documents and Manuscripts - Aksarantara</title>
        <meta
          name="description"
          content="View all of available documents and manuscripts here!"
        />
        <meta
          property="og:title"
          content="Documents and Manuscripts - Aksarantara"
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
};

const DataComponent = () => {
  const [itemsPerPage, setItemsPerPage] = React.useState(5); // Number of items to display per page
  const [currentPage, setCurrentPage] = React.useState(1); // Current page number (can be dynamic)
  const { onOpen } = useSearchBar();

  const [filter, setFilter] = React.useState({
    documentType: "",
    Author: "",
    Collector: "",
    language: "",
  });

  const [documentType, setDocumentType] = React.useState("");
  const [author, setAuthor] = React.useState("");
  const [collector, setCollector] = React.useState("");
  const [language, setLanguage] = React.useState("");
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const { data, status } = useDocumentsQuery({
    config: {},
    page: currentPage,
    pageSize: itemsPerPage,
    queries: {
      populate: "*",
      "filters[language][$containsi]": filter.language,
      "filters[documentType][$containsi]": filter.documentType,
      "filters[author][$containsi]": filter.author,
      "filters[collector][$containsi]": filter.collector,
    },
  });

  const currentData = data?.data;

  const handleFilter = () => {
    setFilter({
      documentType: documentType,
      author: author,
      collector: collector,
      language: language,
    });
    setCurrentPage(1);
  };

  return (
    <>
      <VStack align="left" mb={5}>
        <Heading size="lg">Explore Documents</Heading>
        <Text color="gray.500">
          {data?.meta.pagination.total} entries found
        </Text>
      </VStack>
      <Stack
        mt={5}
        direction={{
          base: "column",
          lg: "row",
        }}
        align="stretch"
        w="100%"
      >
        <IconButton
          icon={<FaSearch />}
          onClick={onOpen}
          aria-label="Search database"
          variant="outline"
          width="min-content"
        />
        <HStack>
          <Flex base="1" md="auto" htmlSize="10">
            <AutoComplete openOnFocus onChange={(val) => setLanguage(val)}>
              <AutoCompleteInput placeholder="All Languages" />
              <AutoCompleteList>
                {Object.entries(languages).map(([family, langs], lf_id) => (
                  <AutoCompleteGroup key={lf_id} showDivider>
                    <AutoCompleteGroupTitle>{family}</AutoCompleteGroupTitle>
                    {langs.map((language, idx) => (
                      <AutoCompleteItem key={idx} value={language}>
                        {language}
                      </AutoCompleteItem>
                    ))}
                  </AutoCompleteGroup>
                ))}
              </AutoCompleteList>
            </AutoComplete>
          </Flex>
          <Input
            flex={{
              base: "1",
              md: "auto",
            }}
            width="auto"
            type="text"
            placeholder="Document Type"
            onChange={(e) => setDocumentType(e.target.value)}
          />
        </HStack>
        <HStack>
          <Input
            flex={{
              base: "1",
              md: "auto",
            }}
            width="auto"
            type="text"
            placeholder="Author"
            onChange={(e) => setAuthor(e.target.value)}
          />
          <Input
            flex={{
              base: "1",
              md: "auto",
            }}
            width="auto"
            type="text"
            placeholder="Collector"
            onChange={(e) => setCollector(e.target.value)}
          />
        </HStack>
        <Spacer />
        <Button onClick={handleFilter} colorScheme="primary" width="auto">
          Filter
        </Button>
      </Stack>
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
            {currentData?.map(({ id, attributes: item }, index) => (
              <DocumentData index={index} id={id} item={item} />
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
          {/* Pagination */}
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
              Items per page
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
