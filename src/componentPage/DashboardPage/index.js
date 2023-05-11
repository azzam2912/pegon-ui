import {
  Box,
  IconButton,
  Flex,
  HStack,
  Heading,
  Image,
  SimpleGrid,
  StackDivider,
  Text,
  VStack,
  Stack,
  Link,
  Divider,
  Avatar,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Spacer,
  Card,
  CardHeader,
  CardBody,
} from "@chakra-ui/react";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useUserInfoQuery } from "src/hooks/fetchers/queries/useUserInfoQuery";
import Sidebar from "src/components/Sidebar";
import { useDocumentsQuery } from "src/hooks/fetchers/queries/useDocumentsQuery";
import {
  MdAccountCircle,
  MdBookmarkAdd,
  MdOutlineExpandMore,
  MdLogout,
  MdSearch,
  MdMenu,
} from "react-icons/md";
import { useRouter } from "next/router";
import AppLayout from "../Page/AppLayout";

const DashboardPage = () => {
  const router = useRouter();
  const { data: user, status: userStatus } = useUserInfoQuery({
    config: {
      onSuccess: (data) => {
        console.log(data);
      },
    },
  });

  const { data: latestDocuments, status: latestDocumentsStatus } =
    useDocumentsQuery({
      config: {
        onSuccess: (data) => {
          console.log(data);
        },
      },
    });

  return (
    <AppLayout>
      <VStack w="100%">
        <Flex
          p={5}
          direction={{
            base: "column",
            md: "row",
          }}
          spacing="20px"
          w="100%"
          align="stretch"
        >
          <SimpleGrid
            minChildWidth="300px"
            flex={1}
            bg="purple.500"
            borderRadius="md"
            mb={{
              base: 5,
              md: 0,
            }}
          >
            <Image
              height="192px"
              src="reading.svg"
              alt="Welcome"
              ml={8}
              pt={3}
            />
            <VStack
              align={{
                base: "start",
                lg: "end",
              }}
              textAlign={{
                base: "start",
                lg: "end",
              }}
              width="100%"
              p={3}
              bgColor="purple.800"
              borderRadius="md"
            >
              <Heading size="md" color="white">
                Welcome, {user?.firstName}!
              </Heading>
              <Text>
                Let's explore Pegon together and contribute to the community!
              </Text>
              <Spacer />
              <HStack justify="end" width="100%">
                <Button as={NextLink} href="/app/documents" colorScheme="primary" variant="outline">
                  Contribute
                </Button>
                <Button colorScheme="primary">Explore</Button>
              </HStack>
            </VStack>
          </SimpleGrid>
          <Divider orientation="vertical" mx="3" />
          <VStack height="100%" spacing={2} flex={1} align="left">
            <Heading size="sm">Current Status</Heading>
            <SimpleGrid flex={1} minChildWidth="128px" spacing={3}>
              <Card borderWidth="1px" borderColor="gray.600">
                <CardHeader>
                  <Heading size="sm">Published Documents</Heading>
                </CardHeader>
                <Spacer />
                <CardBody>
                  <Text fontSize="2xl">20</Text>
                </CardBody>
              </Card>
              <Card borderWidth="1px" borderColor="gray.600">
                <CardHeader>
                  <Heading size="sm">Unpublished Documents</Heading>
                </CardHeader>
                <Spacer />
                <CardBody>
                  <Text fontSize="2xl">69</Text>
                </CardBody>
              </Card>
              <Card borderWidth="1px" borderColor="gray.600">
                <CardHeader>
                  <Heading size="sm">Users</Heading>
                </CardHeader>
                <Spacer />
                <CardBody>
                  <Text fontSize="2xl">8</Text>
                </CardBody>
              </Card>
              <Card borderWidth="1px" borderColor="gray.600">
                <CardHeader>
                  <Heading size="sm">Bookmarks</Heading>
                </CardHeader>
                <Spacer />
                <CardBody>
                  <Text fontSize="2xl">7</Text>
                </CardBody>
              </Card>
            </SimpleGrid>
          </VStack>
        </Flex>
        <VStack p={3} width="100%" align="left" spacing={3}>
          <Heading ml={3} size="md">
            Latest Documents
          </Heading>
          <SimpleGrid
            columns={{ base: 1, md: 2 }}
            p={3}
            width="100%"
            spacing={3}
          >
            <NewDocument />
            <NewDocument />
            <NewDocument />
            <NewDocument />
          </SimpleGrid>
        </VStack>
      </VStack>
    </AppLayout>
  );
};

export default DashboardPage;
const NewDocument = () => {
  return (
    <HStack align="stretch" borderRadius="md" p={3} bgColor="gray.700" borderWidth="1px">
      <Image
        objectFit="cover"
        src="https://892f-152-118-231-115.ngrok-free.app/uploads/thumbnail_111_3b06423791.png"
        alt="Tarikhul Auliya"
        borderRadius="lg"
        boxSize="96px"
        fallbackSrc="96.png"
      />
      <VStack spacing={0} align="left" width="100%" p={3}>
        <HStack justify="space-between">
          <Link
            as={NextLink}
            href="/app"
            fontSize="sm"
            noOfLines={1}
            fontWeight="bold"
            width="60%"
          >
            Tarikhul Auliya
          </Link>
          <Text fontSize="xs" noOfLines={1} color="gray.400" textAlign="right">
            2 hours ago
          </Text>
        </HStack>
        <Text fontSize="xs" color="gray.400">
          by Surya Murya
        </Text>
        <HStack justify="right" pt={3}>
          <IconButton icon={<MdBookmarkAdd />} size="sm" />
        </HStack>
      </VStack>
    </HStack>
  );
};
