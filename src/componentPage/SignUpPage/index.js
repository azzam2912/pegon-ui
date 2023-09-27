import {
  Flex,
  Heading,
  Button,
  Text,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { TextInput } from "src/components/Input";
import React from "react";
import { useRouter } from "next/router";
import { useSignUpMutation } from "src/hooks/fetchers/mutations/useSignUpMutation";
import Link from "next/link";
import Head from "next/head";

const SignUpPage = () => {
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const router = useRouter();
  const createToast = useToast();

  const { mutate: signUp, status: signUpStatus } = useSignUpMutation({
    config: {
      onSuccess: (data) => {
        createToast({
          title: "Success",
          description: "You have successfully signed up",
          status: "success",
          position: "bottom-right",
          isClosable: true,
        });
        localStorage.setItem("token", data?.jwt);
        router.push("/app");
      },
    },
  });

  React.useEffect(() => {
    // check if jwt is present
    const token = localStorage?.getItem("token");
    if (token) {
      router.push("/app");
    }
  });

  return (
    <>
      <Head>
        <title>Sign Up - Aksarantara</title>
        <meta name="description" content="Join us and contribute to pegon" />
        <meta property="og:title" content="Sign up - Aksarantara" key="title" />
        <meta
          property="og:description"
          content="Join us and contribute to pegon"
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
        overflowY="auto"
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
          <Heading size="lg" textAlign="center" mb={3}>
            Sign up for a new account
          </Heading>
          <HStack spacing="1" justify="center" mb={5}>
            <Text color="muted">Already have an account?</Text>
            <Link href="/app/login">
              <Button variant="link" colorScheme="primary">
                Log in
              </Button>
            </Link>
          </HStack>
          <Flex direction="column" w="100%">
            <HStack mb={5}>
              <TextInput
                label="First Name"
                placeholder="First Name"
                type="text"
                isRequired
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <TextInput
                label="Last Name"
                placeholder="Last Name"
                type="text"
                isRequired
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </HStack>
            <TextInput
              label="Username"
              placeholder="abc"
              type="text"
              mb={5}
              isRequired
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
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
              mb={5}
              isRequired
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextInput
              label="Confirm Password"
              placeholder="Confirm Password"
              type="password"
              mb={5}
              isRequired
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Flex>
          <Button
            colorScheme="primary"
            width="full"
            mt="5"
            onClick={() => {
              signUp({
                firstName,
                lastName,
                username,
                email,
                password,
              });
            }}
            isDisabled={
              signUpStatus === "loading" ||
              username === "" ||
              email === "" ||
              password === "" ||
              confirmPassword === "" ||
              password !== confirmPassword ||
              signUpStatus === "success"
            }
            isLoading={signUpStatus === "loading"}
          >
            Sign Up
          </Button>
        </Flex>
      </Flex>
    </>
  );
};

export default SignUpPage;
