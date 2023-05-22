import {
  Box,
  IconButton,
  Flex,
  HStack,
  Heading,
  Image,
  SimpleGrid,
  StackDivider,
  Text,
  VStack,
  Stack,
  Link,
  Divider,
  Avatar,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Spacer,
  Card,
  CardHeader,
  CardBody,
} from "@chakra-ui/react";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useUserInfoQuery } from "src/hooks/fetchers/queries/useUserInfoQuery";
import Sidebar from "src/components/Sidebar";
import { useDocumentsQuery } from "src/hooks/fetchers/queries/useDocumentsQuery";
import {
  MdAccountCircle,
  MdBookmarkAdd,
  MdOutlineExpandMore,
  MdLogout,
  MdSearch,
  MdMenu,
  MdPassword,
} from "react-icons/md";
import { useRouter } from "next/router";
import { useModalSidebar } from "..";

const AppLayout = ({ children }) => {
  const router = useRouter();
  const { data: user, status: userStatus } = useUserInfoQuery({
    config: {
      onSuccess: (data) => {
        console.log(data);
      },
    },
  });

  const { onOpen } = useModalSidebar();

  return (
    <VStack h="100vh" w="100vw" align="stretch" spacing="0">
      <Flex
        bgColor="gray.700"
        w="100vw"
        h="56px"
        borderBottom="1px"
        borderColor="gray.600"
        p={2}
        px={{ base: 5, md: 2 }}
        justify="space-between"
      >
        <Flex display={{ base: "none", md: "flex" }} alignItems="center">
          <Image width="48px" src="/logo.png" alt="Pegon Logo" />
          <Heading size="sm" ml={3}>
            PegonDocs
          </Heading>
        </Flex>
        <Flex display={{ md: "none" }} alignItems="center">
          <IconButton icon={<MdMenu />} variant="ghost" onClick={onOpen} />
        </Flex>
        <Flex
          alignItems="center"
          ml={3}
          w={{
            base: "100%",
            md: "auto",
          }}
        >
          <InputGroup mr={3}>
            <InputLeftElement pointerEvents="none" children={<MdSearch />} />
            <Input type="text" placeholder="Search Here" />
          </InputGroup>
          <Avatar size="sm" name={user?.firstName + " " + user?.lastName} />
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<MdOutlineExpandMore />}
              variant="link"
            />
            <MenuList>
              <MenuItem icon={<MdAccountCircle />}>Profile</MenuItem>
              <MenuItem
                icon={<MdLogout />}
                onClick={() => {
                  localStorage.removeItem("token");
                  router.push("/");
                }}
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
      <Flex
        style={{
          height: "calc(100vh - 56px)",
        }}
      >
        <Sidebar />
        <Box
          w="100%"
          h="100%"
          overflowY="auto"
        >
          {children}
        </Box>
      </Flex>
    </VStack>
  );
};

export default AppLayout;
