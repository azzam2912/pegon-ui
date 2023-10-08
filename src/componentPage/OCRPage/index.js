import { useEffect, useState } from "react";
import Head from "next/head";
import AppLayout from "../Page/AppLayout";
import {
  Alert,
  AlertIcon,
  AlertDescription,
  Button,
  Divider,
  Flex,
  HStack,
  Heading,
  Image,
  Input,
  Text,
  VStack,
  Spinner,
  AlertTitle,
} from "@chakra-ui/react";
import { FaExclamationTriangle } from "react-icons/fa";
import { VariantSelect } from "./VariantSelect";
import { scriptsData } from "src/utils/objects";

const axios = require("axios");

export const OCRPage = () => {
  const [status, setStatus] = useState("idle");
  const [imagePreview, setImagePreview] = useState(null);
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [variant, setVariant] = useState("Pegon");

  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];
    setFile(file);

    if (file) {
      // Display preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async () => {
    setStatus("loading");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `/api/ocr`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      setStatus("success");
      setResult(response.data.result.join(' '));
    } catch (error) {
      setStatus("error");
      console.error("Error uploading image:", error);
    }
  };

  const handleVariantChange = (event) => {
    const newVariant = event.target.innerText;
    setVariant(newVariant);
  };

  return (
    <>
      <Head>
        <title>OCR - Aksarantara</title>
        <meta name="description" content="On demand OCR for manuscripts!" />
        <meta property="og:title" content="OCR - Aksarantara" key="title" />
        <meta
          property="og:description"
          content="On demand OCR for manuscripts!"
          key="description"
        />
        <meta property="og:image" content="logo.png" key="image" />
      </Head>
      <AppLayout>
        <Flex p={5} direction={{ base: "column", md: "row" }} w="100%" h="100%">
          <Flex flex={1} direction="column" align="stretch">
            <Heading>OCR</Heading>
            <Text color="gray.400">
              Experience on-the-fly OCR for manuscripts in supported scripts.
            </Text>
            <Text color="gray.400">
              Simply upload your image, and instantly see the text within it
              transcribed and displayed.
            </Text>
            <HStack>
            <FaExclamationTriangle/>
            <Text color="gray.400">
              This feature uses experimental AI technology and may produce inaccurate results.
            </Text>
            </HStack>
            {/* <Alert
              mt={5}
              status="error"
              variant="subtle"
              flexDirection="column"
              borderWidth="1px"
              borderRadius="md"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              height={{
                base: "150px",
                md: "200px"
              }}
            >
              <AlertIcon boxSize="32px" mr={0} />
              <AlertDescription fontSize="sm" maxWidth="sm" mt={3}>
                OCR is unavailable due to server maintenance. Please try again later.
              </AlertDescription>
            </Alert> */}
            <Divider my={2} />
            <VariantSelect
              value={variant}
              options={["Pegon", "Jawi"]}
              onChange={handleVariantChange}
            />
            <Divider my={1} borderWidth={0} />
            <Flex
              position="relative"
              flex={1}
              p={5}
              bgColor="gray.700"
              borderRadius="md"
              borderWidth="1px"
            >
              <VStack
                w="100%"
                h="100%"
                align="center"
                justify="center"
                borderRadius="md"
                borderWidth="2px"
                borderStyle="dashed"
                p={3}
              >
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Uploaded image preview"
                    maxWidth="300px"
                    maxHeight="400px"
                    boxSize="100%"
                  />
                ) : (
                  <>
                    <Image boxSize="32px" src="/file.svg" />
                    <Text textAlign="center">
                      Drag and drop your image file here.
                    </Text>
                    <HStack width="256px">
                      <Divider />
                      <Text>or</Text>
                      <Divider />
                    </HStack>
                    <Button size="sm">Browse</Button>
                  </>
                )}
              </VStack>
              <Input
                type="file"
                height="100%"
                width="100%"
                position="absolute"
                top="0"
                left="0"
                opacity="0"
                aria-hidden="true"
                accept="image/*"
                onChange={handleFileInputChange}
              />
            </Flex>
            <Button
              marg
              mt={5}
              mb={{
                base: 5,
                md: 0,
              }}
              colorScheme="primary"
              onClick={onSubmit}
            >
              Process
            </Button>
            <Text fontSize="xs">​</Text>
            <Text color="gray.400" fontSize="sm">
This is made possible thanks to Tokopedia-UI AI Center and the Faculty of Computer Science Universitas Indonesia.
            </Text>
          </Flex>
          <Divider orientation="vertical" mx={3} />
          <VStack
            minH={{
              base: "600px",
              md: "100%",
            }}
            flex={1}
          >
            <Heading size="md">Detected Text</Heading>
            <Flex
              bgColor="gray.900"
              borderRadius="md"
              borderWidth="1px"
              width="100%"
              flex="1"
              p={3}
              sx={{
                "&::-webkit-scrollbar": {
                  width: "0.4em",
                },
                "&::-webkit-scrollbar-track": {
                  boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
                  webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgba(0,0,0,.2)",
                  borderRadius: "10px",
                },
              }}
              mb={{
                base: 5,
                md: 0,
              }}
              overflow="auto"
              justify="start"
              align="start"
            >
              <Flex
                direction="column"
                w="100%"
                h="100%"
                align="center"
                justify="center"
              >
                {status == "idle" && (
                  <Text color="gray.400">No OCR process running.</Text>
                )}
                {status == "loading" && (
                  <>
                    <Spinner size="xl" thickness="4px" />
                    <Text mt={2} fontWeight="bold">
                      Processing OCR...
                    </Text>
                    <Text color="gray.400">This may take a while.</Text>
                  </>
                )}
                {status == "success" && <Text fontSize="xl">{result}</Text>}
                {status == "error" && (
                  <>
                    <Alert
                      status="error"
                      variant="subtle"
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                      textAlign="center"
                      w="100%"
                      h="100%"
                      borderRadius="md"
                    >
                      <AlertIcon boxSize="40px" mr={0} />
                      <AlertTitle mt={4} mb={1} fontSize="lg">
                        We are sorry.
                      </AlertTitle>
                      <AlertDescription maxWidth="sm">
                        An error has occured while processing your OCR request.
                        This may be due to invalid input, server error, or queue
                        is full.
                      </AlertDescription>
                    </Alert>
                  </>
                )}
              </Flex>
              <Text textAlign="right" whiteSpace="pre-wrap"></Text>
            </Flex>
          </VStack>
        </Flex>
      </AppLayout>
    </>
  );
};
