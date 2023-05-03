import React from "react";
import { useRouter } from "next/router";
import { useToast } from "@chakra-ui/react";

const Page = ({ pageComponent: Page, requireAuth }) => {
  const router = useRouter();
  const createToast = useToast();
  React.useEffect(() => {
    // check if jwt is present
    const token = localStorage?.getItem("token");
    if (!token && requireAuth) {
      createToast({
        title: "Error",
        description: "You need to be logged in to access this page",
        position: "top-right",
        status: "error",
        isClosable: true,
      });
      router.push("/");
    }
  }, []);
  return <Page />;
};

export default Page;
