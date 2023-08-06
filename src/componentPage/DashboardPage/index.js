import {
  Flex,
  HStack,
  Heading,
  Image,
  SimpleGrid,
  Text,
  VStack,
  Divider,
  Button,
  Spacer,
  Card,
  CardHeader,
  CardBody,
  Skeleton,
} from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useUserInfoQuery } from "src/hooks/fetchers/queries/useUserInfoQuery";
import { useDocumentsQuery } from "src/hooks/fetchers/queries/useDocumentsQuery";
import { useRouter } from "next/router";
import AppLayout from "../Page/AppLayout";
import Head from "next/head";
import { NewDocument } from "./Fragments/NewDocument";

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
      page: 1,
      pageSize: 4,
      queries: {
        populate: "*",
      },
    });

  const { data: publishedDocuments, status: publishedDocumentsStatus } =
    useDocumentsQuery({
      config: {
        onSuccess: (data) => {
          console.log(data);
        },
      },
      page: 1,
      pageSize: 4,
      queries: {
        "filters[contributor][id][$eq]": user?.id,
      },
    });

  const { data: unpublishedDocuments, status: unpublishedDocumentsStatus } =
    useDocumentsQuery({
      config: {
        onSuccess: (data) => {
          console.log(data);
        },
      },
      page: 1,
      pageSize: 4,
      queries: {
        "filters[contributor][id][$eq]": user?.id,
        "filters[publishedAt][$null]": "true",
        "publicationState":"preview",
      },
    });

  const { data: bookmarkedDocuments, status: bookmarkedDocumentsStatus } =
    useDocumentsQuery({
      config: {
        onSuccess: (data) => {
          console.log(data);
        },
      },
      page: 1,
      pageSize: 4,
      queries: {
        "filters[bookmarkBy][id][$in]": user?.id,
      },
    });

  const { data: viewedDocuments, status: viewedDocumentsStatus } =
    useDocumentsQuery({
      config: {
        onSuccess: (data) => {
          console.log(data);
        },
      },
      page: 1,
      pageSize: 4,
      queries: {
        "filters[viewedBy][id][$in]": user?.id,
      },
    });

  return (
    <>
      <Head>
        <title>Dashboard - Aksarantara</title>
        <meta
          name="description"
          content="Let's explore Southeast Asian scripts together and contribute to the community!"
        />
        <meta property="og:title" content="Dashboard - Aksarantara" key="title" />
        <meta
          property="og:description"
          content="Let's explore Southeast Asian scripts together and contribute to the community!"
          key="description"
        />
        <meta property="og:image" content="logo.png" key="image" />
      </Head>
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
              bg="primary.500"
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
                bgColor="primary.800"
                borderRadius="md"
              >
                <Heading size="md" color="white">
                  Welcome, {userStatus === "success" ? user?.firstName : "..."}!
                </Heading>
                <Text>
                  Let's explore Southeast Asian scripts together and contribute to the community!
                </Text>
                <Spacer />
                <HStack justify="end" width="100%">
                  <Button
                    as={NextLink}
                    href="/app/documents/new"
                    colorScheme="primary"
                    variant="outline"
                  >
                    Contribute
                  </Button>
                  <Button
                    as={NextLink}
                    href="/app/documents"
                    colorScheme="primary"
                  >
                    Explore
                  </Button>
                </HStack>
              </VStack>
            </SimpleGrid>
            <Divider orientation="vertical" mx="3" />
            <VStack height="100%" spacing={2} flex={1} align="left">
              <Heading size="sm">Current User Status</Heading>
              <SimpleGrid flex={1} minChildWidth="128px" spacing={3}>
                <Card borderWidth="1px" borderColor="gray.600">
                  <CardHeader>
                    <Heading size="sm">Published Documents</Heading>
                  </CardHeader>
                  <Spacer />
                  <CardBody>
                    <Text fontSize="2xl">
                      {publishedDocumentsStatus === "success"
                        ? publishedDocuments.meta?.pagination.total
                        : "..."}
                    </Text>
                  </CardBody>
                </Card>
                <Card borderWidth="1px" borderColor="gray.600">
                  <CardHeader>
                    <Heading size="sm">Unpublished Documents</Heading>
                  </CardHeader>
                  <Spacer />
                  <CardBody>
                    <Text fontSize="2xl">
                      {unpublishedDocumentsStatus === "success"
                        ? unpublishedDocuments.meta?.pagination.total
                        : "..."}
                    </Text>
                  </CardBody>
                </Card>
                <Card borderWidth="1px" borderColor="gray.600">
                  <CardHeader>
                    <Heading size="sm">Viewed Documents</Heading>
                  </CardHeader>
                  <Spacer />
                  <CardBody>
                    <Text fontSize="2xl">
                      {viewedDocumentsStatus === "success"
                        ? viewedDocuments.meta?.pagination.total
                        : "..."}
                    </Text>
                  </CardBody>
                </Card>
                <Card borderWidth="1px" borderColor="gray.600">
                  <CardHeader>
                    <Heading size="sm">Bookmarks</Heading>
                  </CardHeader>
                  <Spacer />
                  <CardBody>
                    <Text fontSize="2xl">
                      {bookmarkedDocumentsStatus === "success"
                        ? bookmarkedDocuments.meta?.pagination.total
                        : "..."}
                    </Text>
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
              {latestDocumentsStatus === "success" ? (
                latestDocuments.data?.map(({ id, attributes }) => (
                  <NewDocument key={id} id={id} {...attributes} />
                ))
              ) : (
                <>
                  <Skeleton borderRadius="md">
                    <NewDocument />
                  </Skeleton>
                  <Skeleton borderRadius="md">
                    <NewDocument />
                  </Skeleton>
                  <Skeleton borderRadius="md">
                    <NewDocument />
                  </Skeleton>
                  <Skeleton borderRadius="md">
                    <NewDocument />
                  </Skeleton>
                </>
              )}
            </SimpleGrid>
          </VStack>
        </VStack>
      </AppLayout>
    </>
  );
};

export default DashboardPage;
