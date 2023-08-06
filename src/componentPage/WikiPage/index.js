import Head from "next/head";
import AppLayout from "../Page/AppLayout";
import React from "react";

const WikiPage = () => {
  return (
    <>
      <Head>
        <title>Change Password - Aksarantara</title>
        <meta
          name="description"
          content="Let's explore Pegon together and contribute to the community!"
        />
        <meta property="og:title" content="Dashboard - Aksarantara" key="title" />
        <meta
          property="og:description"
          content="Let's explore Pegon together and contribute to the community!"
          key="description"
        />
        <meta property="og:image" content="logo.png" key="image" />
      </Head>
      <AppLayout>
      </AppLayout>
    </>
  );
};

export default WikiPage;