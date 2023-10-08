import React from "react";
import { Badge, Flex, Image, Text } from "@chakra-ui/react";
import Link from "next/link";
import { timeAgo } from './../../../utils/functions';

export const DocumentData = ({ index, id, item }) => {
  const firstName = item?.contributor?.data?.attributes.firstName;
  const lastName = item?.contributor?.data?.attributes.lastName;

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
      <Image
        src={`${process.env.NEXT_PUBLIC_HOST}${item?.thumbnail.data?.attributes.url}`}
        fallbackSrc="https://via.placeholder.com/48"
        alt="Thumbnail"
        objectFit="cover"
        boxSize="48px"
        borderRadius="full"
      />
      <Text width="160px" noOfLines={3} fontSize="sm" ml={4}>
        {item?.title}
      </Text>
      <Text width="160px" noOfLines={3} fontSize="sm" ml="4">
        {firstName + " " + lastName}
      </Text>
      <Text width="100px" fontSize="sm" ml="4">
        <Badge colorScheme="blue">{item?.language}</Badge>
      </Text>
      <Text width="80px" noOfLines={3} fontSize="sm" ml="4">
        {item?.documentType}
      </Text>
      <Text width="100px" noOfLines={3} fontSize="sm" ml="4">
        {item?.author ? item.author : "Unknown Author"}
      </Text>
      <Text width="100px" noOfLines={3} fontSize="sm" ml="4">
        {item?.collector ? item.collector : "Unknown Collector"}
      </Text>
      <Text width="100px" noOfLines={3} fontSize="sm" ml="4">
        {item?.publishedAt ? timeAgo(item.publishedAt) : "Unknown Date"}
      </Text>
    </Flex>
  );
};
