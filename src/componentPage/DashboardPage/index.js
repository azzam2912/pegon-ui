import { Button, Flex, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";

const DashboardPage = () => {
  const router = useRouter();
  return (
    <Flex
      width="100vw"
      height="100vh"
      alignItems="center"
      justifyContent="center"
      direction="column"
    >
      <Heading textAlign="center" mb={3}>
        Logged In
      </Heading>
      <Button
        onClick={() => {
          localStorage.removeItem("token");
          router.push("/");
        }}
      >
        Log Out
      </Button>
    </Flex>
  );
};

export default DashboardPage;
