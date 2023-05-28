import React from "react";
import AppLayout from "../Page/AppLayout";
import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  Flex,
  HStack,
  Heading,
  Image,
  Link,
  SimpleGrid,
  Spacer,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { useDocumentDetailsQuery } from "src/hooks/fetchers/queries/useDocumentDetailsQuery";
import { useRouter } from "next/router";
import { MdBookmarkAdd, MdDownload, MdShare } from "react-icons/md";
import axios from "axios";
import { useBookmarkMutation } from "src/hooks/fetchers/mutations/useBookmarkMutation";
import { useViewDocumentQuery } from "src/hooks/fetchers/queries/useViewDocumentQuery";
import Head from "next/head";

const DocumentDetailsPage = ({ data: documentDetails }) => {
  const router = useRouter();
  const createToast = useToast();
  const { id } = router.query;

  useViewDocumentQuery({
    config: {
      enabled: !!id,
    },
    id: id,
  });

  const PdfViewer = ({ fileUrl }) => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    return (
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js">
        <div style={{ height: "100%", width: "100%" }}>
          <Viewer
            fileUrl={fileUrl}
            plugins={[defaultLayoutPluginInstance]}
            theme="dark"
          />
        </div>
      </Worker>
    );
  };

  const { mutate: bookmark, status: bookmarkStatus } = useBookmarkMutation({
    config: {
      onSuccess: (data) => {
        createToast({
          title: "Success",
          description: "Bookmark added!",
          status: "success",
          position: "bottom-right",
          isClosable: true,
        });
      },
    },
  });

  const handleBookmark = () => {
    bookmark(id);
  };

  const handleShare = () => {
    navigator.share({
      title: "PegonDocs",
      text: "Check out this document!",
      url: window.location.href,
    });
  };

  const url = `${process.env.NEXT_PUBLIC_HOST}${documentDetails.data.attributes.file.data.attributes.url}`;
  const thumbUrl = `${process.env.NEXT_PUBLIC_HOST}${documentDetails.data.attributes.thumbnail.data.attributes.url}`;
  const {
    title,
    author,
    collector,
    documentType,
    language,
    yearWritten,
    locationWritten,
    ink,
    illumination,
    description,
    contributor,
  } = documentDetails.data.attributes;
  return (
    <>
      <Head>
        <title>{title} - PegonDocs</title>
        <meta name="description" content={description} />
        <meta
          property="og:title"
          content={`${title} - PegonDocs`}
          key="title"
        />
        <meta
          property="og:description"
          content={description}
          key="description"
        />
        <meta property="og:image" content={thumbUrl} key="image" />
      </Head>
      <AppLayout>
        <Flex
          w="100%"
          h="100%"
          direction={{ base: "column-reverse", lg: "row" }}
        >
          <Flex flex={1} p={5} display={{ base: "none", lg: "block" }}>
            {!url ? null : <PdfViewer fileUrl={url} />}
          </Flex>
          <Flex height="100%" flex={1} direction="column">
            <VStack spacing={3} align="stretch" overflowY="auto" p={5} w="100%">
              <Heading as="h1" size="lg">
                {title}
              </Heading>
              <HStack justify="space-between" w="100%">
                <Text noOfLines={1} fontSize="sm" color="gray.400">
                  Authored by{" "}
                  <strong>{author ? author : "Unknown Author"}</strong>
                </Text>
              </HStack>
              <Image
                src={thumbUrl}
                alt="Document Thumbnail"
                fallbackSrc="https://via.placeholder.com/150"
                borderRadius="md"
                w="100%"
                h="200px"
                objectFit="cover"
                display={{ base: "block", lg: "none" }}
              />
              <Divider />
              <Text color="gray.300">{description ? description : "-"}</Text>
              <ButtonGroup isAttached variant="outline">
                <Button
                  leftIcon={<MdBookmarkAdd />}
                  isLoading={bookmarkStatus == "loading"}
                  isDisabled={bookmarkStatus == "loading"}
                  onClick={handleBookmark}
                >
                  Bookmark
                </Button>
                <Button leftIcon={<MdShare />} onClick={handleShare}>
                  Share
                </Button>
                <Spacer />
                <Button as={Link} href={url} leftIcon={<MdDownload />}>
                  Download
                </Button>
              </ButtonGroup>
              <VStack
                p={5}
                borderRadius="md"
                borderWidth="1px"
                spacing={3}
                align="stretch"
                bgColor="gray.700"
              >
                <Text fontWeight="bold" fontSize="md" color="gray.300">
                  Details
                </Text>
                <Divider mb={4} />
                <SimpleGrid columns={2} spacing={3}>
                  <VStack spacing={0} align="left">
                    <Text fontSize="sm" color="gray.300">
                      Collector
                    </Text>
                    <Text fontWeight="bold" fontSize="sm" color="gray.400">
                      {collector ? collector : "Unknown Collector"}
                    </Text>
                  </VStack>
                  <VStack spacing={0} align="left">
                    <Text fontSize="sm" color="gray.300">
                      Document Type
                    </Text>
                    <Text fontWeight="bold" fontSize="sm" color="gray.400">
                      {documentType}
                    </Text>
                  </VStack>
                  <VStack spacing={0} align="left">
                    <Text fontSize="sm" color="gray.300">
                      Language
                    </Text>
                    <Text fontWeight="bold" fontSize="sm" color="gray.400">
                      {language}
                    </Text>
                  </VStack>
                  <VStack spacing={0} align="left">
                    <Text fontSize="sm" color="gray.300">
                      Year Written
                    </Text>
                    <Text fontWeight="bold" fontSize="sm" color="gray.400">
                      {yearWritten ? yearWritten : "Not Stated"}
                    </Text>
                  </VStack>
                  <VStack spacing={0} align="left">
                    <Text fontSize="sm" color="gray.300">
                      Location Written
                    </Text>
                    <Text fontWeight="bold" fontSize="sm" color="gray.400">
                      {locationWritten ? locationWritten : "Not Stated"}
                    </Text>
                  </VStack>
                  <VStack spacing={0} align="left">
                    <Text fontSize="sm" color="gray.300">
                      Ink
                    </Text>
                    <Text fontWeight="bold" fontSize="sm" color="gray.400">
                      {ink ? ink : "Not Stated"}
                    </Text>
                  </VStack>
                  <VStack spacing={0} align="left">
                    <Text fontSize="sm" color="gray.300">
                      Illumination
                    </Text>
                    <Text fontWeight="bold" fontSize="sm" color="gray.400">
                      {illumination ? illumination : "Not Stated"}
                    </Text>
                  </VStack>
                </SimpleGrid>
              </VStack>
            </VStack>
          </Flex>
        </Flex>
      </AppLayout>
    </>
  );
};

export default DocumentDetailsPage;
