import {
  Flex,
  HStack, Image, Text,
  VStack,
  Link
} from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";

export const NewDocument = ({ thumbnail, title, publishedAt, contributor, id }) => {
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
          src={thumbnail
            ? `${process.env.NEXT_PUBLIC_HOST}${thumbnail.data?.attributes.url}`
            : null}
          alt={title}
          borderRadius="lg"
          boxSize="96px"
          fallbackSrc="https://via.placeholder.com/96" />
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
