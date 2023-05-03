import { Button, Flex, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";

const DashboardPage = () => {
  const router = useRouter();
  const [token, setToken] = React.useState();

  React.useEffect(()=>{
    setToken(localStorage.getItem("token"))
  }, [token])

  return (
    <Flex
      width="100vw"
      height="100vh"
      alignItems="center"
      justifyContent="center"
      direction="column"
    >
      <Heading textAlign="center" mb={3}>
        Logged In {
          token
        }
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
