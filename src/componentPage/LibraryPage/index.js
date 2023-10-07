import React, { useEffect, useState } from "react";
import AppLayout from "src/componentPage/Page/AppLayout";
import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  IconButton,
  Image,
  Input,
  Select,
  Spacer,
  Stack,
  Tab,
  TabList,
  Tabs,
  Text,
  VStack,
  Show,
  CloseButton,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
} from "@chakra-ui/react";
import {
  FaBookmark,
  FaChevronLeft,
  FaChevronRight,
  FaFolderOpen,
  FaHistory,
  FaPenSquare,
  FaSearch,
  FaFilter,
} from "react-icons/fa";
import Link from "next/link";
import { useDocumentsQuery } from "src/hooks/fetchers/queries/useDocumentsQuery";
import Head from "next/head";
import { useUserInfoQuery } from "src/hooks/fetchers/queries/useUserInfoQuery";
import { MdBookmarkRemove } from "react-icons/md";
import { useRemoveBookmarkMutation } from "src/hooks/fetchers/mutations/useRemoveBookmarkMutation";
import { useQueryClient } from "@tanstack/react-query";
import FilterInput from "src/components/FilterInput";
import LanguageFilter from "src/components/LanguageFilter";
import { DocumentData } from "src/componentPage/DocumentsPage/Fragments/DocumentData";
import { DocumentSkeleton } from "src/componentPage/DocumentsPage/Fragments/DocumentSkeleton";
import { languages } from "src/utils/languageList";
import { useUserDocumentsQuery } from "src/hooks/fetchers/queries/useUserDocumentsQuery";

const LibraryPage = () => {
  return (
    <AppLayout>
      <Head>
        <title>My Library - Aksarantara</title>
        <meta
          property="og:title"
          content="My Library - Aksarantara"
          key="title"
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
  const [library, setLibrary] = React.useState(0); // 0 = History, 1 = Bookmark, 2 = My Document
  const [itemsPerPage, setItemsPerPage] = React.useState(5); // Number of items to display per page
  const [currentPage, setCurrentPage] = React.useState(1); // Current page number (can be dynamic)

  const [title, setTitle] = React.useState("");
  const [documentType, setDocumentType] = React.useState("");
  const [author, setAuthor] = React.useState("");
  const [collector, setCollector] = React.useState("");
  const [language, setLanguage] = React.useState("");
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const { data: user } = useUserInfoQuery({});

  const pageFilter = [
    {
      "filters[bookmarkBy][id][$in]": user?.id,
    },
    {
      "filters[viewedBy][id][$in]": user?.id,
    },
    {
      "filters[contributor][id][$eq]": user?.id,
      publicationState: "preview",
    },
  ];

  const queryClient = useQueryClient();
  const { mutate: removeBookmark, status: removeBookmarkStatus } =
    useRemoveBookmarkMutation({
      config: {
        onSuccess: (data) => {
          queryClient.invalidateQueries({ queryKey: ["documents"] });
          createToast({
            title: "Success",
            description: "Bookmark removed.",
            status: "success",
            position: "bottom-right",
            isClosable: true,
          });
        },
      },
    });

  const { data, status } = useUserDocumentsQuery({
    config: {
      enabled: !!user?.id,
    },
    page: currentPage,
    pageSize: itemsPerPage,
    queries: {
      populate: "*",
      "filters[language][$containsi]": language,
      "filters[documentType][$containsi]": documentType,
      "filters[author][$containsi]": author,
      "filters[collector][$containsi]": collector,
      "filters[title][$containsi]": title,
      ...pageFilter[library],
    },
  });

  const currentData = data?.data;

  useEffect(() => {
    setCurrentPage(1);
    setTitle("");
    setDocumentType("");
    setAuthor("");
    setCollector("");
    setLanguage("");
  }, [library]);

  return (
    <>
      <Stack
        direction={{
          base: "column",
          lg: "row",
        }}
        align="left"
        mb={{
          base: "0",
          lg: "5",
        }}
      >
        <Heading size="lg">My Library</Heading>
        <Spacer />
        <Tabs
          onChange={(e) => {
            setLibrary(e);
          }}
          colorScheme="primary"
          variant="soft-rounded"
          display={{ base: "none", lg: "block" }}
          index={library}
          align="end"
        >
          <TabList>
            <Tab>
              <FaBookmark />
              &nbsp;My Bookmarks
            </Tab>
            <Tab>
              <FaHistory />
              &nbsp;Viewed
            </Tab>
            <Tab>
              <FaPenSquare />
              &nbsp;Contributions
            </Tab>
          </TabList>
        </Tabs>
        <Tabs
          onChange={(e) => {
            setLibrary(e);
          }}
          colorScheme="primary"
          variant="soft-rounded"
          display={{ base: "block", lg: "none" }}
          index={library}
          align="end"
        >
          <TabList>
            <Tab>
              <FaBookmark />
              {library !== 0 ? null : <>&nbsp;Bookmarks</>}
            </Tab>
            <Tab>
              <FaHistory />
              {library !== 1 ? null : <>&nbsp;Viewed</>}
            </Tab>
            <Tab>
              <FaPenSquare />
              {library !== 2 ? null : <>&nbsp;Contributions</>}
            </Tab>
          </TabList>
        </Tabs>
      </Stack>
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
                p={4}
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
                <Text color="gray.500">
                  Add documents here or change the filter
                </Text>
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

export default LibraryPage;
