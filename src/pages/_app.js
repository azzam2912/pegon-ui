// pages/_app.js
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { colors } from "src/theme";
// Import the styles provided by the react-pdf-viewer packages
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import Head from "next/head";

// 2. Add your color mode config
const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme({
  colors,
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },
  styles: {
    global: {
      "html, body": {
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      },
    },
  },
  config,
});

function MyApp({ Component, pageProps }) {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <>
      <Head>
        <meta name="application-name" content="Pegonizer" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Pegonizer" />
        <meta
          name="description"
          content="A Progressive Web Application for managing Pegon manuscripts"
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />

        <meta name="msapplication-TileColor" content="#2e3841" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#2e3841" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://pegon.works" />
        <meta name="twitter:title" content="Pegonizer" />
        <meta
          name="twitter:description"
          content="A Progressive Web Application for managing Pegon manuscripts"
        />
        <meta name="twitter:image" content="https://pegon.works/logo.png" />
        <meta name="twitter:creator" content="@YourTwitterHandle" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Pegonizer" />
        <meta
          property="og:description"
          content="A Progressive Web Application for managing Pegon manuscripts"
        />
        <meta property="og:site_name" content="Pegonizer" />
        <meta property="og:url" content="https://pegon.works" />
        <meta property="og:image" content="https://pegon.works/logo.png" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
