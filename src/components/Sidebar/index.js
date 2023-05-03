import {
  Button,
  Divider,
  Flex,
  Heading,
  Image,
  Spacer,
  Text,
} from "@chakra-ui/react";
import React from "react";
import {
  MdArrowBack,
  MdMenu,
  MdHome,
  MdLibraryBooks,
  MdBookmark,
  MdQuestionAnswer,
  MdInfo,
} from "react-icons/md";

const Sidebar = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = React.useState(false);

  return (
    <Flex
      style={{
        width: isSidebarExpanded ? "250px" : "64px",
        transition: "width 0.25s",
      }}
      height="100%"
      bgColor="gray.700"
      direction="column"
      alignItems="start"
      overflow="hidden"
      p={1}
    >
      <Flex alignItems="center">
        <Image width="56px" src="logo.png" alt="Pegon Logo" />
        <Flex flex={1} ml={3} overflowX="hidden" direction="column">
          <Heading size="md" noOfLines={1}>PegonDocs</Heading>
          <Text textColor="gray.400" fontSize="sm" noOfLines={1}>Digital Library</Text>
        </Flex>
      </Flex>
      <Divider my={2} />
      <Button
        iconSpacing={isSidebarExpanded ? 3 : 0}
        leftIcon={<MdHome />}
        justifyContent="left"
        variant="ghost"
        mb={1}
        width="100%"
        textColor="gray.400"
        sx={{
          "& svg": {
            fontSize: "1.25rem",
            textColor: "gray.300",
          },
        }}
        fontWeight="normal"
        fontSize="sm"
      >
        {isSidebarExpanded ? "Home" : null}
      </Button>
      <Button
        iconSpacing={isSidebarExpanded ? 3 : 0}
        leftIcon={<MdLibraryBooks />}
        justifyContent="left"
        variant="ghost"
        mb={1}
        width="100%"
        textColor="gray.400"
        fontWeight="normal"
        fontSize="sm"
        sx={{
          "& svg": {
            fontSize: "1.25rem",
            textColor: "gray.300",
          },
        }}
      >
        {isSidebarExpanded ? "All Documents" : null}
      </Button>
      <Button
        iconSpacing={isSidebarExpanded ? 3 : 0}
        leftIcon={<MdBookmark />}
        justifyContent="left"
        variant="ghost"
        mb={1}
        width="100%"
        textColor="gray.400"
        fontWeight="normal"
        fontSize="sm"
        sx={{
          "& svg": {
            fontSize: "1.25rem",
            textColor: "gray.300",
          },
        }}
      >
        {isSidebarExpanded ? "Bookmarks" : null}
      </Button>
      <Divider my={3} />
      <Button
        iconSpacing={isSidebarExpanded ? 3 : 0}
        leftIcon={<MdQuestionAnswer />}
        justifyContent="left"
        variant="ghost"
        mb={1}
        width="100%"
        textColor="gray.400"
        fontWeight="normal"
        fontSize="sm"
        sx={{
          "& svg": {
            fontSize: "1.25rem",
            textColor: "gray.300",
          },
        }}
      >
        {isSidebarExpanded ? "FAQ" : null}
      </Button>
      <Button
        iconSpacing={isSidebarExpanded ? 3 : 0}
        leftIcon={<MdInfo />}
        justifyContent="left"
        variant="ghost"
        mb={1}
        width="100%"
        textColor="gray.400"
        fontWeight="normal"
        fontSize="sm"
        sx={{
          "& svg": {
            fontSize: "1.25rem",
            textColor: "gray.300",
          },
        }}
      >
        {isSidebarExpanded ? "About" : null}
      </Button>
      <Spacer />
      <Divider my={1} />
      <Button
        iconSpacing={isSidebarExpanded ? 2 : 0}
        leftIcon={isSidebarExpanded ? null : <MdMenu />}
        rightIcon={isSidebarExpanded ? <MdArrowBack /> : null}
        variant="ghost"
        justifyContent={isSidebarExpanded ? "right" : "center"}
        width="100%"
        sx={{
          "& svg": {
            fontSize: "1.25rem",
          },
        }}
        textColor="gray.300"
        onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
      />
    </Flex>
  );
};

export default Sidebar;
