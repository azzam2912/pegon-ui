import Head from "next/head";
import AppLayout from "../Page/AppLayout";
import React from "react";

import { Box, Text, HStack } from "@chakra-ui/react";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { scriptsData } from "src/utils/objects";
import { customDefaults } from "src/utils/markdown";
import { ScriptTypeSelect } from "src/componentPage/TransliteratePage/Fragments/ScriptTypeSelect";
import { VariantSelect } from "src/componentPage/TransliteratePage/Fragments/VariantSelect";
import remarkGfm from "remark-gfm";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import ReactMarkdown from "react-markdown";

import bali from "src/componentPage/WikiPage/Scripts/bali.md";
import batak from "src/componentPage/WikiPage/Scripts/batak.md";
import baybayin from "src/componentPage/WikiPage/Scripts/baybayin.md";
import buhid from "src/componentPage/WikiPage/Scripts/buhid.md";
import cham from "src/componentPage/WikiPage/Scripts/cham.md";
import hanunoo from "src/componentPage/WikiPage/Scripts/hanunoo.md";
import jawa from "src/componentPage/WikiPage/Scripts/jawa.md";
import jawi from "src/componentPage/WikiPage/Scripts/jawi.md";
import kayahli from "src/componentPage/WikiPage/Scripts/kayah li.md";
import lao from "src/componentPage/WikiPage/Scripts/lao.md";
import lontara from "src/componentPage/WikiPage/Scripts/lontara.md";
import rejang from "src/componentPage/WikiPage/Scripts/rejang.md";
import makasar from "src/componentPage/WikiPage/Scripts/makasar.md";
import monburmese from "src/componentPage/WikiPage/Scripts/mon-burmese.md";
import pegon from "src/componentPage/WikiPage/Scripts/pegon.md";
import sunda from "src/componentPage/WikiPage/Scripts/sunda.md";
import tagbanwa from "src/componentPage/WikiPage/Scripts/tagbanwa.md";
import taile from "src/componentPage/WikiPage/Scripts/taile.md"; // needs to be added
import taiviet from "src/componentPage/WikiPage/Scripts/taiviet.md"; // needs to be added
import thai from "src/componentPage/WikiPage/Scripts/thai.md";

const WikiPage = () => {
  const router = useRouter();
  const [mdContent, setMdContent] = useState("");
  const [script, setScript] = useState(
    router.query && router.query.script ? router.query.script : "Pegon",
  );
  const [variant, setVariant] = useState(
    router.query && router.query.variant
      ? router.query.variant
      : scriptsData[script].variants.length > 0
      ? scriptsData[script].variants[0]
      : "",
  );

  console.debug(router.query);
  const fileStrMD = (script, variant) => {
    switch (script) {
      case "Pegon":
        return pegon;
      case "Jawi":
        return jawi;
      case "Cham":
        return cham;
      case "Mon-Burmese":
        switch (variant) {
          case "Kayah Li":
            return kayahli;
        }
        return monburmese;
      case "Baybayin":
        switch (variant) {
          case "Buhid":
            return buhid;
          case "Hanuno'o":
            return hanunoo;
          case "Tagbanwa":
            return tagbanwa;
        }
        return baybayin;
      case "Batak":
        return batak;
      case "Lontara":
        switch (variant) {
          case "Makassar":
            return makasar;
          case "Bugis":
            return lontara;
        }
        break;
      case "Rejang":
        return rejang;
      case "Sukhothai":
        switch (variant) {
          case "Thai":
            return thai;
          case "Lao":
            return lao;
          case "Tai Viet":
            return taiviet;
        }
        break;
      case "Hanacaraka":
        switch (variant) {
          case "Jawa":
            return jawa;
          case "Sunda":
            return sunda;
          case "Bali":
            return bali;
          case "Sasak":
            return bali;
        }
    }
  };

  const handleScriptChange = (event) => {
    const newScript = event.target.innerText;
    setScript(newScript);
    setVariant(scriptsData[newScript]["variants"][0]);
  };

  const handleVariantChange = (event) => {
    const newVariant = event.target.innerText;
    setVariant(newVariant);
  };

  useEffect(() => {
    const fileStr = fileStrMD(script, variant);
    setMdContent(fileStr);
  }, [script, variant]);

  useEffect(() => {
    // Get the query parameter from the router
    const { query } = router.query;

    // Check if the query parameter exists and update the state
    if (query && query.script) {
      setScript(query.script);
    }

    if (query && query.variant) {
      setVariant(query.variant);
    }
  }, [router]);
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
          <HStack>
            <ScriptTypeSelect
              value={script}
              options={Object.keys(scriptsData)}
              onChange={handleScriptChange}
            />
            <VariantSelect
              value={variant}
              options={scriptsData[script]["variants"]}
              onChange={handleVariantChange}
            />
          </HStack>
          <Text fontSize="xl">
            {" "}
            {/* You can customize the font size */}
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={ChakraUIRenderer(customDefaults)}
              skipHtml
              children={mdContent}
            ></ReactMarkdown>
          </Text>
        </Box>
      </AppLayout>
    </>
  );
};

export default WikiPage;
