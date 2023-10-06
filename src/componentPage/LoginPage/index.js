import {
  Flex,
  Heading,
  Button,
  Divider,
  Text,
  HStack,
  useToast,
  Image,
} from "@chakra-ui/react";
import { TextInput } from "src/components/Input";
import NextLink from "next/link";
import { OAuthButtonGroup } from "./Fragments/OAuthButtonGroup";
import { useSignInMutation } from "src/hooks/fetchers/mutations/useSignInMutation";
import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";

const LoginPage = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const router = useRouter();
  const createToast = useToast();

  const returnUrl = router.query.returnUrl || "/app";

  const { mutate: login, status: loginStatus } = useSignInMutation({
    config: {
      onSuccess: (data) => {
        localStorage.setItem("token", data?.jwt);
        router.push(returnUrl);
      },
      onError: () => {
        createToast({
          title: "Error",
          description: "Invalid email or password.",
          status: "error",
          position: "bottom-right",
          isClosable: true,
        });
      },
    },
  });

  return (
    <>
      <Head>
        <title>Login - Aksarantara</title>
        <meta
          name="description"
          content="Please log in to view all of documents and manuscripts here!"
        />
        <meta property="og:title" content="Login - Aksarantara" key="title" />
        <meta
          property="og:description"
          content="Please log in to view all of documents and manuscripts here!"
          key="description"
        />
        <meta property="og:image" content="logo.png" key="image" />
      </Head>
      <Flex
        width="100vw"
        height="100vh"
        alignItems="center"
        justifyContent="center"
        direction="column"
      >
        <Flex
          direction="column"
          py={{
            base: "0",
            sm: "8",
          }}
          px={{
            base: "4",
            sm: "10",
          }}
          bg={{
            base: "transparent",
            sm: "gray.700",
          }}
          boxShadow={{
            base: "none",
            sm: "md",
          }}
          borderRadius={{
            base: "none",
            sm: "md",
          }}
          w="100%"
          maxW="lg"
        >
          <Flex direction="column" w="100%" alignItems="center" p={3} mb={3}>
            <Link href="/app">
              <Image width="64px" src="/logo.png" alt="Pegon Logo" />
            </Link>
          </Flex>
          <Heading textAlign="center" mb={3}>
            Log in to your account
          </Heading>
          <HStack spacing="1" justify="center" mb={5}>
            <Text color="muted">Don't have an account?</Text>
            <Link href="/app/register">
              <Button variant="link" colorScheme="primary">
                Sign up
              </Button>
            </Link>
          </HStack>
          <Flex direction="column" width="full">
            <TextInput
              label="Email"
              placeholder="abc@mail.com"
              type="email"
              mb={5}
              isRequired
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextInput
              label="Password"
              placeholder="Password"
              type="password"
              isRequired
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Flex>
          <Button
            colorScheme="primary"
            width="full"
            mt="5"
            onClick={() => login({ identifier: email, password })}
            isLoading={loginStatus === "loading"}
            isDisabled={loginStatus === "loading"}
          >
            Log in
          </Button>
        </Flex>
      </Flex>
    </>
  );
};

export default LoginPage;
