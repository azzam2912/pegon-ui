import {
  Flex,
  Heading,
  Button,
  Divider,
  Text,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { TextInput } from "src/components/Input";
import NextLink from "next/link";
import { OAuthButtonGroup } from "./Fragments/OAuthButtonGroup";
import { useSignInMutation } from "src/hooks/fetchers/mutations/useSignInMutation";
import React from "react";
import { useRouter } from "next/router";

const SignUpPage = () => {
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const router = useRouter();
  const createToast = useToast();

  const { mutate: signUp, status: signUpStatus } = useSignUpMutation({
    config: {
      onSuccess: (data) => {
        createToast({
          title: "Success",
          description: "You have successfully signed up",
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
        <Heading textAlign="center" mb={3}>
          Sign up your new account
        </Heading>
        <HStack spacing="1" justify="center" mb={5}>
          <Text color="muted">Already have an account?</Text>
          <Button variant="link" colorScheme="primary">
            Sign In
          </Button>
        </HStack>
        <Flex direction="column" width="full">
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
            isRequired
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextInput
            label="Confirm Password"
            placeholder="Password"
            type="password"
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
  );
};

export default LoginPage;
