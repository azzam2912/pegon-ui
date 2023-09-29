import { Flex, HStack, Image, Text, VStack, Link } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { timeAgo } from './../../../utils/functions';

export const NewDocument = ({
  thumbnail,
  title,
  publishedAt,
  contributor,
  id,
}) => {
  const firstName = contributor?.data?.attributes.firstName;
  const lastName = contributor?.data?.attributes.lastName;
  const date = timeAgo(publishedAt);

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
          fallbackSrc="https://via.placeholder.com/96"
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
          Contributed by {firstName} {lastName}
        </Text>
      </VStack>
    </HStack>
  );
};
