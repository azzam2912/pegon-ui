import Head from "next/head";
import AppLayout from "../Page/AppLayout";
import React from "react";

import {
  Box
} from "@chakra-ui/react";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ScriptTypeSelect } from "./Fragments/ScriptTypeSelect";
import { BaybayinWiki } from "./Scripts/baybayin";
import { ChamWiki } from "./Scripts/cham";
import { JawiWiki } from "./Scripts/jawi";
import { KayahLiWiki } from "./Scripts/kayahli";
import { PegonWiki } from "./Scripts/pegon";

const WikiPage = () => {
  const router = useRouter();
  const [script, setScript] = useState((router.query && router.query.script)? router.query.script : "Pegon");

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
        <ScriptTypeSelect value={script} onChange={handleScriptChange} />
        {script === 'Pegon' && <PegonWiki />}
        {script === 'Jawi' && <JawiWiki />}
        {script === 'Cham' && <ChamWiki />}
        {script === 'Baybayin' && <BaybayinWiki />}
        {script === 'Kayah Li' && <KayahLiWiki />}
        </Box>
      </AppLayout>
    </>
  );
};

export default WikiPage;
