import {
  Badge,
  Divider,
  Flex,
  HStack,
  Heading,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import MeiliSearch from "meilisearch";
import Link from "next/link";
import React from "react";
import { FaFolderOpen, FaSearch } from "react-icons/fa";
import { useSearchBar } from "src/componentPage/Page";
import NextLink from "next/link";

export const SearchModal = () => {
  const { isOpen, onClose } = useSearchBar();
  const [search, setSearch] = React.useState("");

  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const client = new MeiliSearch({
    host: `${process.env.NEXT_PUBLIC_MEILI_HOST}`,
    apiKey: `${process.env.NEXT_PUBLIC_MEILI_KEY}`,
  });

  const searchDocuments = async (query) => {
    try {
      setLoading(true);
      const index = await client.getIndex("document");
      const searchResults = await index.search(query);
      setData(searchResults.hits);
      setLoading(false); // Process the search results
    } catch (error) {
      console.error("Error performing search:", error);
    }
  };

  React.useEffect(() => {
    searchDocuments(search);
  }, [search]);

  return (
    <Modal
      style={{
        padding: "0px",
      }}
      size="xl"
      isOpen={isOpen}
      onClose={onClose}
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader p={3}>
          <InputGroup width="100%" alignItems="center">
            <InputLeftElement>
              <FaSearch />
            </InputLeftElement>
            <Input
              type="text"
              placeholder="Search documents"
              colorScheme="blackAlpha"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
          {search ? <Divider mt={3} /> : null}
        </ModalHeader>

        {search && (
          <ModalBody p={3}>
            <VStack spacing={1}>
              {loading ? (
                <Flex
                  p={4}
                  minH="200px"
                  direction="column"
                  align="center"
                  justify="center"
                >
                  <Spinner size="xl" color="gray.500" />
                </Flex>
              ) : search ? (
                data.map((document) => <NewDocument {...document} />)
              ) : null}
              {!loading && data.length === 0 && (
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
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
};

const NewDocument = ({
  thumbnail,
  title,
  publishedAt,
  contributor,
  id,
  ...props
}) => {
  // from published at into string like 2 hours ago or something
  const [date, setDate] = React.useState("Just now");
  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);

    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1,
    };

    for (let interval in intervals) {
      const count = Math.floor(seconds / intervals[interval]);
      if (count >= 1) {
        return count === 1
          ? `${count} ${interval} ago`
          : `${count} ${interval}s ago`;
      }
    }

    return "Just now";
  };

  React.useEffect(() => {
    setDate(timeAgo(new Date(publishedAt)));
  }, [publishedAt]);

  return (
    <HStack
      as={NextLink}
      href={`/app/documents/${id}`}
      align="stretch"
      borderRadius="md"
      p={3}
      _hover={{
        bgColor: "gray.600",
      }}
      borderWidth="1px"
      width="100%"
    >
      <Flex width="128px">
        <Image
          fit="cover"
          src={
            thumbnail ? `${process.env.NEXT_PUBLIC_HOST}${thumbnail.url}` : null
          }
          alt={title}
          borderRadius="lg"
          boxSize="96px"
          fallbackSrc="https://via.placeholder.com/96"
        />
      </Flex>
      <VStack spacing={0} align="left" width="100%" p={3}>
        <HStack justify="space-between">
          <Text fontSize="sm" noOfLines={1} fontWeight="bold" width="60%">
            {title}
          </Text>
          <Text fontSize="xs" noOfLines={1} color="gray.400" textAlign="right">
            {date}
          </Text>
        </HStack>
        <Text fontSize="xs" color="gray.400">
          by {props.author ? props.author : "Anonymous"}
        </Text>
        <HStack justify="start">
          <Text noOfLines={1} fontSize="sm">
            <Badge colorScheme="blue">{props.language}</Badge>
          </Text>
          <Text fontSize="xs" color="gray.400">
            {props.documentType}
          </Text>
        </HStack>
      </VStack>
    </HStack>
  );
};
