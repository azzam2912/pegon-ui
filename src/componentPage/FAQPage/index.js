import Head from "next/head";
import AppLayout from "../Page/AppLayout";
import React from "react";
import ReactMarkdown from 'react-markdown';
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import {
    Box,
    Text
} from "@chakra-ui/react";


const FAQPage = () => {
  const markdownContent = `
  # This is a FAQ Page

  Here's some **Markdown** content for your FAQ page.

  - List item 1
  - List item 2
  - List item 3
  `

  return (
    <>
      <Head>
        <title> FAQ - Aksarantara</title>
        <meta name="description" content="Aksarantara FAQ (Frequently Asked Questions)" />
        <meta property="og:title" content="FAQ - Aksarantara" key="title" />
        <meta
          property="og:description"
          content="Aksarantara FAQ (Frequently Asked Questions)"
          key="description"
        />
        <meta property="og:image" content="logo.png" key="image" />
      </Head>
      <AppLayout>
        <Box
        className="faq-container"
        p={3} // Add padding
        ml="auto" // Move to the right (adjust as needed)
        width="98%" // Adjust the width as needed
        > 
        <Text fontSize="xl"> {/* You can customize the font size */}
        <ReactMarkdown components={ChakraUIRenderer()} children={markdownContent} skipHtml />
        </Text>
        </Box>
      </AppLayout>
    </>
  );
};

export default FAQPage;