import React from 'react';
import ReactMarkdown from 'react-markdown';
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import {
    Box,
    Text
  } from "@chakra-ui/react";

export const JawiWiki = () => {
  const markdownContent = `
  # This is a Jawi Wiki Page

  Here's some **Markdown** content for your Jawi Wiki page.

  - List item 1
  - List item 2
  - List item 3
  `
  return (
    <Text fontSize="xl"> {/* You can customize the font size */}
    <ReactMarkdown components={ChakraUIRenderer()} children={markdownContent} skipHtml />
    </Text>
  );
};