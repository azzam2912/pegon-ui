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

const LoginPage = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const router = useRouter();
  const createToast = useToast();

  const { mutate: login, status: loginStatus } = useSignInMutation({
    config: {
      onSuccess: (data) => {
        createToast({
          title: "Success",
          description: "You have successfully logged in",
          status: "success",
          position: "top-right",
          isClosable: true,
        });
        localStorage.setItem("token", data.jwt);
        router.push("/app");
      },
    },
  });

  return (
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
          sm: "bg-surface",
        }}
        boxShadow={{
          base: "none",
          sm: "md",
        }}
        borderRadius={{
          base: "none",
          sm: "xl",
        }}
        w="100%"
        maxW="lg"
      >
        <Flex direction="column" w="100%" alignItems="center" mb={3}>
          <Image width="96px" src="logo.png" alt="Pegon Logo"/>
        </Flex>
        <Heading textAlign="center" mb={3}>
          Log in to your account
        </Heading>
        <HStack spacing="1" justify="center" mb={5}>
          <Text color="muted">Don't have an account?</Text>
          <Link href="/register">
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
        <Flex width="100%" justify="end" mt="1">
          <Button
            as={NextLink}
            colorScheme="primary"
            variant="link"
            href="/home"
            size="sm"
          >
            Forgot Password?
          </Button>
        </Flex>
        <Button
          colorScheme="primary"
          width="full"
          mt="5"
          onClick={() => login({ identifier: email, password })}
          isLoading={loginStatus === "loading"}
          isDisabled={loginStatus === "loading"}
        >
          Sign In
        </Button>
        <HStack my={5}>
          <Divider />
          <Text whiteSpace="nowrap" color="muted">
            or continue with
          </Text>
          <Divider />
        </HStack>
        <OAuthButtonGroup />
      </Flex>
    </Flex>
  );
};

export default LoginPage;
