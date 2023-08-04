import Head from "next/head";
import AppLayout from "../Page/AppLayout";
import {
  Button,
  Divider,
  Flex,
  Heading,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { TextInput } from "src/components/Input";
import React from "react";
import { useRouter } from "next/router";
import { useChangePasswordMutation } from "src/hooks/fetchers/mutations/useChangePasswordMutation";

const ChangePasswordPage = () => {
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const createToast = useToast();
  const router = useRouter();

  const { mutate, isLoading } = useChangePasswordMutation({
    config: {
      onSuccess: (data) => {
        createToast({
          title: "Success",
          description: "Your password has been changed",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        router.push("/app");
      },
      onError: (error) => {
        createToast({
          title: "Error",
          description: error?.response?.data?.message[0]?.messages[0]?.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      },
    },
  });
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
        <Flex w="100%" p={5} align="center" justify="center">
          <VStack align="start" spacing={4}>
            <Heading size="lg">Change Password</Heading>
            <Text>
              Keep your account more secure by using a unique password
            </Text>
            <Divider />
            <TextInput
              label="Type your current password"
              placeholder="password"
              type="password"
              isRequired
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <TextInput
              label="Type your new password"
              placeholder="password"
              type="password"
              isRequired
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextInput
              label="Retype your new password"
              placeholder="password"
              type="password"
              isRequired
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              onClick={() => {
                mutate({
                  currentPassword,
                  password,
                  confirmPassword,
                });
              }}
              isLoading={isLoading}
              colorScheme="primary"
            >
              Change Password
            </Button>
          </VStack>
        </Flex>
      </AppLayout>
    </>
  );
};

export default ChangePasswordPage;
