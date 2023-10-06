import {
  Box,
  IconButton,
  Flex,
  Heading,
  Image,
  HStack,
  VStack,
  Avatar,
  Button,
  Text,
  Spacer,
  Link,
} from "@chakra-ui/react";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import React from "react";
import { useUserInfoQuery } from "src/hooks/fetchers/queries/useUserInfoQuery";
import Sidebar from "src/components/Sidebar";
import {
  MdOutlineExpandMore,
  MdLogin,
  MdLogout,
  MdMenu,
  MdLock,
} from "react-icons/md";
import { useRouter } from "next/router";
import { useModalSidebar, useSearchBar } from "..";
import { SearchModal } from "./fragments/SearchModal";
import { FaSearch } from "react-icons/fa";

const AppLayout = ({ children }) => {
  const router = useRouter();
  let userStatus = "error";
  const token = localStorage?.getItem("token");
  if (token) {
    userStatus = "success";
  }

  const { onOpen } = useModalSidebar();
  const { onOpen: onOpenSearch } = useSearchBar();

  const linkStyles = {
    textDecoration: "none",
  };

  if (userStatus === "success") {
    const { data: user } = useUserInfoQuery({});

    return (
      <VStack h="100vh" w="100vw" align="stretch" spacing="0">
        <Flex
          bgColor="gray.700"
          w="100vw"
          h="56px"
          borderBottom="1px"
          borderColor="gray.600"
          p={2}
          px={{ base: 2, md: 2 }}
          justify="space-between"
        >
          <Flex display={{ base: "none", md: "flex" }} alignItems="center">
            <Link href="/app" style={linkStyles}>
              <Image p={2} width="48px" src="/logo.png" alt="Pegon Logo" />
            </Link>
            <Link href="/app" style={linkStyles}>
              <Heading size="sm" ml={3}>
                Aksarantara
              </Heading>
            </Link>
          </Flex>
          <Flex display={{ md: "none" }} alignItems="center">
            <IconButton icon={<MdMenu />} variant="ghost" onClick={onOpen} />
          </Flex>
          <Spacer />
          <Flex alignItems="center" ml={3} mr={3}>
            <Button
              leftIcon={<FaSearch />}
              variant="outline"
              mr={5}
              onClick={onOpenSearch}
              justifyContent="start"
              _hover={{
                bg: "whiteAlpha.0",
                borderColor: "whiteAlpha.500",
              }}
            >
              <Text ml="3" fontWeight="normal" color="whiteAlpha.400">
                Search documents
              </Text>
            </Button>
            <Menu>
              <MenuButton as="button" spacing={1}>
                <HStack spacing={2}>
                  <Avatar
                    size="sm"
                    name={user?.firstName + " " + user?.lastName}
                    aria-label="User Menu"
                  />
                  <MdOutlineExpandMore />
                </HStack>
              </MenuButton>
              <MenuList>
                <MenuItem
                  icon={<MdLock />}
                  onClick={() => {
                    router.push("/app/change-password");
                  }}
                >
                  Change password
                </MenuItem>
                <MenuItem
                  icon={<MdLogout />}
                  onClick={() => {
                    localStorage.removeItem("token");
                    router.push("/");
                  }}
                >
                  Log out
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
          <SearchModal />
          <Box w="100%" h="100%" overflowY="auto">
            {children}
          </Box>
        </Flex>
      </VStack>
    );
  }

  return (
    <VStack h="100vh" w="100vw" align="stretch" spacing="0">
      <Flex
        bgColor="gray.700"
        w="100vw"
        h="56px"
        borderBottom="1px"
        borderColor="gray.600"
        p={2}
        px={{ base: 2, md: 2 }}
        justify="space-between"
      >
        <Flex display={{ base: "none", md: "flex" }} alignItems="center">
          <Link href="/app" style={linkStyles}>
            <Image p={2} width="48px" src="/logo.png" alt="Pegon Logo" />
          </Link>
          <Link href="/app" style={linkStyles}>
            <Heading size="sm" ml={3}>
              Aksarantara
            </Heading>
          </Link>
        </Flex>
        <Flex display={{ md: "none" }} alignItems="center">
          <IconButton icon={<MdMenu />} variant="ghost" onClick={onOpen} />
        </Flex>
        <Spacer />
        <Flex alignItems="center" ml={3} mr={3}>
          <Button
            leftIcon={<FaSearch />}
            variant="outline"
            mr={5}
            onClick={onOpenSearch}
            justifyContent="start"
            _hover={{
              bg: "whiteAlpha.0",
              borderColor: "whiteAlpha.500",
            }}
          >
            <Text ml="3" fontWeight="normal" color="whiteAlpha.400">
              Search documents
            </Text>
          </Button>
          <Button
            leftIcon={<MdLogin />}
            colorScheme="primary"
            variant="solid"
            onClick={() => {
              router.push("/app/login");
            }}
          >
            Log in
          </Button>
        </Flex>
      </Flex>
      <Flex
        style={{
          height: "calc(100vh - 56px)",
        }}
      >
        <Sidebar />
        <SearchModal />
        <Box w="100%" h="100%" overflowY="auto">
          {children}
        </Box>
      </Flex>
    </VStack>
  );
};

export default AppLayout;
