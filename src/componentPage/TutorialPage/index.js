import Head from "next/head";
import AppLayout from "../Page/AppLayout";
import React from "react";
import ReactMarkdown from "react-markdown";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import { customDefaults } from "src/utils/markdown";
import { Box, Text } from "@chakra-ui/react";

const TutorialPage = () => {
  const markdownContent = require("./tutorial.md").default;

  return (
    <>
      <Head>
        <title> Tutorial - Aksarantara</title>
        <meta name="description" content="Aksarantara Tutorial" />
        <meta
          property="og:title"
          content="Tutorial - Aksarantara"
          key="title"
        />
        <meta
          property="og:description"
          content="Aksarantara Tutorial"
          key="description"
        />
        <meta property="og:image" content="logo.png" key="image" />
      </Head>
      <AppLayout>
        <Box
          className="tutorial-container"
          p={3} // Add padding
          ml="auto" // Move to the right (adjust as needed)
          width="98%" // Adjust the width as needed
        >
          <Text>
            <ReactMarkdown
              components={ChakraUIRenderer(customDefaults)}
              children={markdownContent}
              skipHtml
            />
          </Text>
        </Box>
      </AppLayout>
    </>
  );
};

export default TutorialPage;
