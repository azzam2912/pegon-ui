import Head from "next/head";
import AppLayout from "../Page/AppLayout";
import {
  Card,
  Divider,
  Flex,
  Heading,
  IconButton,
  Select,
  Button,
  Spacer,
  Stack,
  Text,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import React from "react";
import { FaChevronDown, FaExchangeAlt, FaInfo } from "react-icons/fa";
import { TransliterateInput } from "./Fragments/TransliterateInput";

const TransliteratePage = () => {
  const [stemmingType, setStemmingType] = React.useState("Indonesian");
  return (
    <>
      <Head>
        <title>Transliterate Pegon - PegonDocs</title>
        <meta
          name="description"
          content="Transliterate Pegon to Latin and vice versa!"
        />
        <meta
          property="og:title"
          content="Transliterate Pegon - PegonDocs"
          key="title"
        />
        <meta
          property="og:description"
          content="Transliterate Pegon to Latin and vice versa!"
          key="description"
        />
        <meta property="og:image" content="logo.png" key="image" />
      </Head>
      <AppLayout>
        <VStack
          p={8}
          spacing={0}
          w="100%"
          h="100%"
          align={{ base: "stretch", md: "start" }}
        >
          <HStack py={3} w="100%" align="end" justify="end">
            <Menu>
              <MenuButton
                size="sm"
                as={Button}
                variant="outline"
                fontWeight="normal"
                gap={3}
                rightIcon={<FaChevronDown />}
              >
                {stemmingType}
              </MenuButton>
              <MenuList>
                <MenuItem
                  onClick={() => {
                    setStemmingType("Indonesian");
                  }}
                >
                  Indonesian
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setStemmingType("Javanese");
                  }}
                >
                  Javanese
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setStemmingType("Madurese");
                  }}
                >
                  Madurese
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setStemmingType("Sundanese");
                  }}
                >
                  Sundanese
                </MenuItem>
              </MenuList>
            </Menu>
            <Spacer />
            <IconButton
              colorScheme="primary"
              size="sm"
              icon={<FaInfo />}
              ml={3}
            />
          </HStack>
          <Stack
            direction={{
              base: "column",
              md: "row",
            }}
            spacing={0}
            pt={3}
            pb={{
              base: 8,
              md: 3,
            }}
            w="100%"
            align={{
              base: "stretch",
              md: "center",
            }}
          >
            <VStack
              pl={{
                base: 3,
                md: 0,
              }}
              spacing={0}
              align="start"
              flex={1}
            >
              <Text fontSize="xs" textColor="gray.500">
                Input
              </Text>
              <Heading size="lg" textColor="gray.300">
                Latin
              </Heading>
            </VStack>
            <Flex align="center">
              <Divider
                display={{
                  md: "none",
                }}
                flex={1}
                mr="3"
              />
              <IconButton
                textColor="primary.200"
                borderRadius="full"
                transform={{
                  base: "rotate(90deg)",
                  md: "none",
                }}
                bgColor="gray.700"
                icon={<FaExchangeAlt />}
              />
            </Flex>
            <VStack
              align={{
                base: "start",
                md: "end",
              }}
              pl={{
                base: 3,
                md: 0,
              }}
              spacing={0}
              flex={1}
            >
              <Text fontSize="xs" textColor="gray.500">
                Result
              </Text>
              <Heading
                size="lg"
                textAlign={{
                  base: "start",
                  md: "end",
                }}
                textColor="gray.300"
              >
                Pegon
              </Heading>
            </VStack>
          </Stack>
          <Card
            height={{
              base: "300px",
              md: "200px",
            }}
            width="100%"
          >
            <Stack
              height="100%"
              direction={{
                base: "column",
                md: "row",
              }}
              divider={
                <Divider
                  orientation={{
                    base: "horizontal",
                    md: "vertical",
                  }}
                  height={{
                    base: "1px",
                    md: "auto",
                  }}
                />
              }
              spacing={0}
              w="100%"
            >
              <TransliterateInput placeholder="Enter Text" label="Pegon" />
              <TransliterateInput
                placeholder="Transliteration"
                label="Latin"
                isReadOnly
              />
            </Stack>
          </Card>
        </VStack>
      </AppLayout>
    </>
  );
};

export default TransliteratePage;
