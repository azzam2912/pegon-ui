import React from "react";
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
  Select,
  SkeletonCircle,
  SkeletonText,
  Spacer,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FaChevronLeft, FaChevronRight, FaFolderOpen, FaSearch } from "react-icons/fa";
import Link from "next/link";
import { useDocumentsQuery } from "src/hooks/fetchers/queries/useDocumentsQuery";
import Head from "next/head";

const DocumentsPage = () => {
  return (
    <AppLayout>
      <VStack w="100%" align="stretch" p={8}>
        <DataComponent />
      </VStack>
    </AppLayout>
  );
};

const DataComponent = () => {
  const [itemsPerPage, setItemsPerPage] = React.useState(5); // Number of items to display per page
  const [currentPage, setCurrentPage] = React.useState(1); // Current page number (can be dynamic)

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
    config: {
      onSuccess: (data) => {
        console.log(data);
      },
    },
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
      <Head>
        <title>Document List - PegonDocs</title>
        <meta name="description" content="View all of pegon documents here!" />
        <meta
          property="og:title"
          content="Document List - PegonDocs"
          key="title"
        />
        <meta
          property="og:description"
          content="View all of pegon documents here!"
          key="description"
        />
        <meta property="og:image" content="96.png" key="image" />
      </Head>
      <VStack align="left" mb={5}>
          <Heading size="lg">Explore Documents</Heading>
          <Text color="gray.500">{data?.meta.pagination.total} entries found</Text>
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
          aria-label="Search database"
          variant="outline"
          width="min-content"
        />
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
                }}
              >
                <Flex width="240px" align="center" flexShrink={0}>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_HOST}${item?.thumbnail.data.attributes.url}`}
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
                  By {item?.contributor.data.attributes.firstName}{" "}
                  {item?.contributor.data.attributes.lastName}
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
                  {item?.publishedAt ? item.publishedAt : "unknown date"}
                </Text>
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

export default DocumentsPage;
