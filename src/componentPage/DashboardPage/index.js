import {
  Box,
  IconButton,
  Flex,
  HStack,
  Heading,
  Image,
  SimpleGrid,
  Text,
  VStack,
  Link,
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
import { MdBookmarkAdd } from "react-icons/md";
import { useRouter } from "next/router";
import AppLayout from "../Page/AppLayout";
import Head from "next/head";

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
        <title>Dashboard - PegonDocs</title>
        <meta
          name="description"
          content="Let's explore Pegon together and contribute to the community!"
        />
        <meta property="og:title" content="Dashboard - PegonDocs" key="title" />
        <meta
          property="og:description"
          content="Let's explore Pegon together and contribute to the community!"
          key="description"
        />
        <meta property="og:image" content="96.png" key="image" />
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
                  Let's explore Pegon together and contribute to the community!
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
const NewDocument = ({ thumbnail, title, publishedAt, contributor, id }) => {
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
      align="stretch"
      borderRadius="md"
      p={3}
      bgColor="gray.700"
      borderWidth="1px"
    >
      <Flex width="128px">
        <Image
          fit="cover"
          src={
            thumbnail
              ? `${process.env.NEXT_PUBLIC_HOST}${thumbnail.data?.attributes.url}`
              : null
          }
          alt={title}
          borderRadius="lg"
          boxSize="96px"
          fallbackSrc="96.png"
        />
      </Flex>
      <VStack spacing={0} align="left" width="100%" p={3}>
        <HStack justify="space-between">
          <Link
            as={NextLink}
            href={`/app/documents/${id}`}
            fontSize="sm"
            noOfLines={1}
            fontWeight="bold"
            width="60%"
          >
            {title}
          </Link>
          <Text fontSize="xs" noOfLines={1} color="gray.400" textAlign="right">
            {date}
          </Text>
        </HStack>
        <Text fontSize="xs" color="gray.400">
          by {contributor?.data?.attributes.firstName}{" "}
          {contributor?.data?.attributes.lastName}
        </Text>
      </VStack>
    </HStack>
  );
};
