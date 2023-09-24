import Head from "next/head";
import AppLayout from "../Page/AppLayout";
import React from "react";

import {
  Box,
  Text
} from "@chakra-ui/react";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import ReactMarkdown from 'react-markdown';
import { scriptsData } from "src/utils/objects";
import { ScriptTypeSelect } from "src/componentPage/TransliteratePage/Fragments/ScriptTypeSelect";

const WikiPage = () => {
  const router = useRouter();
  const [script, setScript] = useState((router.query && router.query.script)? router.query.script : "Pegon");
  const [mdContent, setMdContent] = useState("");

  const handleScriptChange = (event) => {
    const newScript = event.target.innerText;
    setScript(newScript);
  };

  useEffect(() => {
    // Get the query parameter from the router
    const { query } = router.query;
  
    // Check if the query parameter exists and update the state
    if (query && query.script) {
      setScript(query.script);
    }
  }, [router]);

  useEffect(() => {
    // Update the URL with the current state
    router.replace({ query: { script: script } });
  }, [script, router]);

  useEffect(() => {
    // Update the URL with the current state
    try {
      const markdownContent = require(`${"./Scripts/" + script.toLowerCase() + ".md"}`).default;
      setMdContent(markdownContent);
    } catch (error) {
      console.error('Error loading Markdown file:', error);
    }
  }, [script]);
  
  
  return (
    <>
      <Head>
        <title> {script} Wiki - Aksarantara</title>
        <meta name="description" content="Wiki for our supported scripts" />
        <meta property="og:title" content="Wiki - Aksarantara" key="title" />
        <meta
          property="og:description"
          content="Wiki for our supported scripts"
          key="description"
        />
        <meta property="og:image" content="logo.png" key="image" />
      </Head>
      <AppLayout>
        <Box
        className="pegon-wiki-container"
        p={3} // Add padding
        ml="auto" // Move to the right (adjust as needed)
        width="98%" // Adjust the width as needed
        > 
        <ScriptTypeSelect
              value={script}
              options={Object.keys(scriptsData)}
              onChange={handleScriptChange}
            />
        <Text fontSize="xl"> {/* You can customize the font size */}
          <ReactMarkdown components={ChakraUIRenderer()} skipHtml>{mdContent}</ReactMarkdown>
        </Text>

        </Box>
      </AppLayout>
    </>
  );
};

export default WikiPage;
