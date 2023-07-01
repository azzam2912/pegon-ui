import React from "react";
import {
  Flex, SkeletonCircle,
  SkeletonText
} from "@chakra-ui/react";
import Link from "next/link";

export const DocumentSkeleton = () => {
  return (
    <Flex
      align="center"
      justify="space-between"
      p="4"
      minWidth="max-content"
      borderBottomWidth="1px"
    >
      <Flex width="240px" align="center" as={Link} href="/" flexShrink={0}>
        <SkeletonCircle size="48px" />
        <SkeletonText noOfLines={1} fontSize="sm" ml={4} />
      </Flex>
      <SkeletonText
        width="160px"
        noOfLines={1}
        fontSize="sm"
        color="gray.500"
        ml="4" />
      <SkeletonText
        color="gray.500"
        noOfLines={1}
        width="80px"
        fontSize="sm"
        ml="4" />
      <SkeletonText width="100px" noOfLines={1} fontSize="sm" ml="4" />
      <SkeletonText
        color="gray.500"
        noOfLines={1}
        width="100px"
        fontSize="sm"
        ml="4" />
      <SkeletonText
        color="gray.500"
        noOfLines={1}
        width="100px"
        fontSize="sm"
        ml="4" />
      <SkeletonText
        width="100px"
        fontSize="sm"
        noOfLines={1}
        ml="4"
        color="gray.500"
      >
        2023-05-24T07:35:16.900Z
      </SkeletonText>
    </Flex>
  );
};
