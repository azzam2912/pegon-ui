import { Box, Flex, HStack, Heading, Image, StackDivider, VStack } from "@chakra-ui/react";
import React from "react";
import { useUserInfoQuery } from "src/hooks/fetchers/queries/useUserInfoQuery";
import Sidebar from "src/components/Sidebar";
import { useDocumentsQuery } from "src/hooks/fetchers/queries/useDocumentsQuery";

const DashboardPage = () => {
  const { data: user, status: userStatus } = useUserInfoQuery({
    config: {
      onSuccess: (data) => {
        console.log(data);
      },
    },
  });

  const { data: latestDocuments, status: latestDocumentsStatus } = useDocumentsQuery({
    config: {
      onSuccess: (data) => {
        console.log(data);
      }
    }
  })

  return (
    <Flex width="100vw" height="100vh" direction="row">
      <Sidebar />
      <Box Flex={1} height="100%" width="100%" overflowY="auto">
        <HStack height="100%" width="100%" p={5}>
          <VStack height="100%" spacing={4} flex={1} align='left'>
            <Heading size="md">New Documents</Heading>
            <VStack divider={<StackDivider/>} width="100%" bgColor="gray.700" spacing={3} align='stretch'>
              {latestDocuments?.data?.map((document) => (
                <HStack key={document.attributes.id} p={3} spacing={3}>
                  <Image src={document.attributes.thumbnail} width="100px" height="100px" />
                  <VStack align="start" spacing={0}>
                    <Heading size="sm">{document.attributes.title}</Heading>
                    <Heading size="xs">{document.attributes.author}</Heading>
                  </VStack>
                </HStack>
              ))}
            </VStack>
          </VStack>
          <VStack height="100%" spacing={4} flex={1} align='left'>
            <Heading size="md">New Documents</Heading>
            <VStack divider={<StackDivider/>} width="100%" bgColor="gray.700" spacing={3} align='stretch'>
              {latestDocuments?.data?.map((document) => (
                <HStack key={document.attributes.id} p={3} spacing={3}>
                  <Image src={document.attributes.thumbnail} width="100px" height="100px" />
                  <VStack align="start" spacing={0}>
                    <Heading size="sm">{document.attributes.title}</Heading>
                    <Heading size="xs">{document.attributes.author}</Heading>
                  </VStack>
                </HStack>
              ))}
            </VStack>
          </VStack>
        </HStack>
      </Box>
    </Flex>
  );
};

export default DashboardPage;
