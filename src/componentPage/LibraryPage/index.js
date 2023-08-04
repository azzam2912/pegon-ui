import React, { useEffect } from "react";
import AppLayout from "../Page/AppLayout";
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
  InputGroup,
  InputLeftElement,
  Select,
  SkeletonCircle,
  SkeletonText,
  Spacer,
  Stack,
  Tab,
  TabList,
  Tabs,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import {
  FaBookmark,
  FaChevronLeft,
  FaChevronRight,
  FaFolderOpen,
  FaHistory,
  FaPenSquare,
  FaSearch,
} from "react-icons/fa";
import Link from "next/link";
import { useDocumentsQuery } from "src/hooks/fetchers/queries/useDocumentsQuery";
import Head from "next/head";
import { useUserInfoQuery } from "src/hooks/fetchers/queries/useUserInfoQuery";
import { MdDelete } from "react-icons/md";
import { useRemoveBookmarkMutation } from "src/hooks/fetchers/mutations/useRemoveBookmarkMutation";
import { useQueryClient } from "@tanstack/react-query";

const LibraryPage = () => {
  return (
    <AppLayout>
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

  const [filter, setFilter] = React.useState({
    documentType: "",
    Author: "",
    Collector: "",
    language: "",
    title: "",
  });

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
  const createToast = useToast();
  const queryClient = useQueryClient();
  const { mutate: removeBookmark, status: removeBookmarkStatus } =
    useRemoveBookmarkMutation({
      config: {
        onSuccess: (data) => {
          queryClient.invalidateQueries({ queryKey: ["documents"] });
          createToast({
            title: "Success",
            description: "You have successfully removed a bookmark",
            status: "success",
            position: "bottom-right",
            isClosable: true,
          });
        },
      },
    });

  const { data, status } = useDocumentsQuery({
    config: {
      onSuccess: (data) => {
        console.log(data);
      },
      enabled: !!user?.id,
    },
    page: currentPage,
    pageSize: itemsPerPage,
    queries: {
      populate: "*",
      "filters[language][$containsi]": filter.language,
      "filters[documentType][$containsi]": filter.documentType,
      "filters[author][$containsi]": filter.author,
      "filters[collector][$containsi]": filter.collector,
      "filters[title][$containsi]": filter.title,
      ...pageFilter[library],
    },
  });

  const currentData = data?.data;

  const handleFilter = () => {
    setFilter({
      documentType: documentType,
      author: author,
      collector: collector,
      language: language,
      title: title,
    });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, library]);

  return (
    <>
      <Head>
        <title>My Library - Aksarantara</title>
        <meta
          property="og:title"
          content="My Library - Aksarantara"
          key="title"
        />
        <meta property="og:image" content="logo.png" key="image" />
      </Head>
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
      <Stack
        mt={5}
        direction={{
          base: "column",
          lg: "row",
        }}
        align="stretch"
        w="100%"
      >
        <InputGroup width="auto">
          <InputLeftElement pointerEvents="none">
            <FaSearch />
          </InputLeftElement>
          <Input
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="Document Title"
            value={title}
          />
        </InputGroup>
        <HStack>
          <Select
            flex={{
              base: "1",
              md: "auto",
            }}
            width="auto"
            htmlSize={10}
            defaultValue=""
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="">All Languages</option>
            <option value="Javanese">Javanese</option>
            <option value="Sundanese">Sundanese</option>
            <option value="Madurese">Madurese</option>
            <option value="Indonesian">Indonesian</option>
            <option value="Others">Others</option>
          </Select>
          <Input
            flex={{
              base: "1",
              md: "auto",
            }}
            htmlSize={10}
            width="auto"
            type="text"
            placeholder="Document Type"
            onChange={(e) => setDocumentType(e.target.value)}
            value={documentType}
          />
        </HStack>
        <HStack>
          <Input
            flex={{
              base: "1",
              md: "auto",
            }}
            htmlSize={10}
            width="auto"
            type="text"
            placeholder="Author"
            onChange={(e) => setAuthor(e.target.value)}
            value={author}
          />
          <Input
            flex={{
              base: "1",
              md: "auto",
            }}
            htmlSize={10}
            width="auto"
            type="text"
            placeholder="Collector"
            onChange={(e) => setCollector(e.target.value)}
            value={collector}
          />
        </HStack>
        <Spacer />
        <Button
          onClick={handleFilter}
          colorScheme="primary"
          htmlSize={10}
          width="auto"
        >
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
              <Flex
                key={index}
                align="center"
                justify="space-between"
                p="4"
                as={Link}
                href={`/app/documents/${id}`}
                minWidth="max-content"
                borderBottomWidth="1px"
                _hover={{
                  bg: "gray.800",
                  "& > button": {
                    opacity: 1,
                  },
                }}
                position="relative"
              >
                <Flex width="240px" align="center" flexShrink={0}>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_HOST}${item?.thumbnail.data?.attributes.url}`}
                    fallbackSrc="https://via.placeholder.com/48"
                    alt="Thumbnail"
                    objectFit="cover"
                    boxSize="48px"
                    borderRadius="full"
                  />
                  <Text noOfLines={1} fontSize="sm" ml={4}>
                    {item?.title}
                  </Text>
                </Flex>
                <Text
                  width="160px"
                  noOfLines={1}
                  fontSize="sm"
                  color="gray.500"
                  ml="4"
                >
                  By {item?.contributor.data?.attributes.firstName}{" "}
                  {item?.contributor.data?.attributes.lastName}
                </Text>
                <Text width="100px" noOfLines={1} fontSize="sm" ml="4">
                  <Badge colorScheme="blue">{item?.language}</Badge>
                </Text>
                <Text color="gray.500" width="80px" fontSize="sm" ml="4">
                  {item?.documentType}
                </Text>
                <Text color="gray.500" width="100px" fontSize="sm" ml="4">
                  {item?.author ? item.author : "Unknown Author"}
                </Text>
                <Text color="gray.500" width="100px" fontSize="sm" ml="4">
                  {item?.collector ? item.collector : "Unknown Collector"}
                </Text>
                <Text width="100px" fontSize="sm" ml="4" color="gray.500">
                  {item?.publishedAt ? item.publishedAt : "Unpublished"}
                </Text>
                {library === 0 ? (
                  <IconButton
                    position="absolute"
                    left="5"
                    top="auto"
                    borderRadius="full"
                    aria-label="Delete Bookmark"
                    colorScheme="red"
                    opacity={0}
                    icon={<MdDelete />}
                    onClick={(e) => {
                      e.preventDefault();
                      removeBookmark(id);
                    }}
                    isDisabled={removeBookmarkStatus === "loading"}
                    isLoading={removeBookmarkStatus === "loading"}
                  />
                ) : null}
              </Flex>
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
            {
              status !== "loading" && currentData?.length === 0 && (
                <Flex p={4} minH="200px" direction="column" align="center" justify="center">
                  <Heading size="4xl" color="gray.600"><FaFolderOpen/></Heading>
                  <Heading size="md" color="gray.500">No documents found</Heading>
                  <Text color="gray.500">Add documents here or change the filter</Text>
                </Flex>
              )
            }
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

const DocumentSkeleton = () => {
  return (
    <Flex
      align="center"
      justify="space-between"
      p="4"
      minWidth="max-content"
      borderBottomWidth="1px"
    >
      <Flex width="240px" align="center" as={Link} href="/" flexShrink={0}>
        <SkeletonCircle size="48px" />
        <SkeletonText noOfLines={1} fontSize="sm" ml={4} />
      </Flex>
      <SkeletonText
        width="160px"
        noOfLines={1}
        fontSize="sm"
        color="gray.500"
        ml="4"
      />
      <SkeletonText
        color="gray.500"
        noOfLines={1}
        width="80px"
        fontSize="sm"
        ml="4"
      />
      <SkeletonText width="100px" noOfLines={1} fontSize="sm" ml="4" />
      <SkeletonText
        color="gray.500"
        noOfLines={1}
        width="100px"
        fontSize="sm"
        ml="4"
      />
      <SkeletonText
        color="gray.500"
        noOfLines={1}
        width="100px"
        fontSize="sm"
        ml="4"
      />
      <SkeletonText
        width="100px"
        fontSize="sm"
        noOfLines={1}
        ml="4"
        color="gray.500"
      >
        2023-05-24T07:35:16.900Z
      </SkeletonText>
    </Flex>
  );
};

export default LibraryPage;
