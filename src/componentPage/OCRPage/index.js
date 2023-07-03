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

export const OCRPage = () => {
  const status = "idle";
  return (
    <>
      <Head>
        <title>OCR - Pegonizer</title>
        <meta
          name="description"
          content="On demand OCR for Pegon script documents!"
        />
        <meta property="og:title" content="OCR - Pegonizer" key="title" />
        <meta
          property="og:description"
          content="On demand OCR for Pegon script documents!"
          key="description"
        />
        <meta property="og:image" content="logo.png" key="image" />
      </Head>
      <AppLayout>
        <Flex p={5} direction={{ base: "column", md: "row" }} w="100%" h="100%">
          <Flex flex={1} direction="column" align="stretch">
            <Heading>OCR</Heading>
            <Text color="gray.400">
              On demand OCR for Pegon script documents! Upload your Image file and
              we will do the rest.
            </Text>
            <Alert
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
            </Alert>
            <Divider my={5} />
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
                <Image boxSize="32px" src="/file.svg" />
                <Text textAlign="center">Drag and drop your image file here</Text>
                <HStack width="256px">
                  <Divider />
                  <Text>or</Text>
                  <Divider />
                </HStack>
                <Button size="sm">Browse</Button>
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
              />
            </Flex>
            <Button
              mt={5}
              mb={{
                base: 5,
                md: 0,
              }}
              colorScheme="primary"
            >
              Start
            </Button>
          </Flex>
          <Divider orientation="vertical" mx={3} />
          <VStack
            minH={{
              base: "600px",
              md: "100%",
            }}
            flex={1}
          >
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
                  <Text color="gray.400">No OCR process running</Text>
                )}
                {status == "loading" && (
                  <>
                    <Spinner size="xl" thickness="4px" />
                    <Text mt={2} fontWeight="bold">
                      Processing OCR...
                    </Text>
                    <Text color="gray.400">This may take a while</Text>
                  </>
                )}
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
                        Error While Processing OCR
                      </AlertTitle>
                      <AlertDescription maxWidth="sm">
                        An error has occured while processing your OCR request.
                        This may be due to invalid input, server error, or queue is full.
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
