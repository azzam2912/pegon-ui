import { Box, Flex} from "@chakra-ui/react";
import React from "react";
import { useUserInfoQuery } from "src/hooks/fetchers/queries/useUserInfoQuery";
import Sidebar from "src/components/Sidebar";

const DashboardPage = () => {
  const { data, status } = useUserInfoQuery({
    config: {
      onSuccess: (data) => {
        console.log(data);
      },
    },
  });

  return (
    <Flex width="100vw" height="100vh" direction="row">
      <Sidebar/>
      <Box Flex={1} height="100%">

      </Box>
    </Flex>
  );
};

export default DashboardPage;
