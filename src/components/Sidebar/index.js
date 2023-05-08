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
import { NavigationButton } from "./fragments/NavigationButton";

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
          <Heading size="md" noOfLines={1}>
            PegonDocs
          </Heading>
          <Text textColor="gray.400" fontSize="sm" noOfLines={1}>
            Digital Library
          </Text>
        </Flex>
      </Flex>
      <Divider my={2} />
      <NavigationButton icon={<MdHome />} isSidebarExpanded={isSidebarExpanded}>
        Home
      </NavigationButton>
      <NavigationButton icon={<MdLibraryBooks />} isSidebarExpanded={isSidebarExpanded}>
        All Documents
      </NavigationButton>
      <NavigationButton icon={<MdBookmark />} isSidebarExpanded={isSidebarExpanded}>
        Bookmarks
      </NavigationButton>
      <Divider my={3} />
      <NavigationButton icon={<MdQuestionAnswer />} isSidebarExpanded={isSidebarExpanded}>
        FAQ
      </NavigationButton>
      <NavigationButton icon={<MdInfo />} isSidebarExpanded={isSidebarExpanded}>
        About
      </NavigationButton>
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
