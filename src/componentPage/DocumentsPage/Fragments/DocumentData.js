import React from "react";
import { Badge, Flex, Image, Text } from "@chakra-ui/react";
import Link from "next/link";

export const DocumentData = ({ index, id, item }) => {
  return (
    <Flex
      key={index}
      align="center"
      justify="space-between"
      p="4"
      as={Link}
      href={`/app/documents/${id}`}
      minWidth="max-content"
      borderBottomWidth="1px"
      _hover={{
        bg: "gray.800",
      }}
    >
      <Flex width="240px" align="center" flexShrink={0}>
        <Image
          src={`${process.env.NEXT_PUBLIC_HOST}${item?.thumbnail.data?.attributes.url}`}
          fallbackSrc="https://via.placeholder.com/48"
          alt="Thumbnail"
          objectFit="cover"
          boxSize="48px"
          borderRadius="full" />
        <Text noOfLines={1} fontSize="sm" ml={4}>
          {item?.title}
        </Text>
      </Flex>
      <Text width="160px" noOfLines={1} fontSize="sm" color="gray.500" ml="4">
        By {item?.contributor.data?.attributes.firstName}{" "}
        {item?.contributor.data?.attributes.lastName}
      </Text>
      <Text width="100px" noOfLines={1} fontSize="sm" ml="4">
        <Badge colorScheme="blue">{item?.language}</Badge>
      </Text>
      <Text color="gray.500" width="80px" fontSize="sm" ml="4">
        {item?.documentType}
      </Text>
      <Text color="gray.500" width="100px" fontSize="sm" ml="4">
        {item?.author ? item.author : "Unknown Author"}
      </Text>
      <Text color="gray.500" width="100px" fontSize="sm" ml="4">
        {item?.collector ? item.collector : "Unknown Collector"}
      </Text>
      <Text width="100px" fontSize="sm" ml="4" color="gray.500">
        {item?.publishedAt ? item.publishedAt : "unknown date"}
      </Text>
    </Flex>
  );
};
