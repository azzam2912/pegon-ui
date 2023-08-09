import {
  Box,
  IconButton,
  Flex,
  Heading,
  Image,
  VStack,
  Avatar,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Text,
  Spacer,
} from "@chakra-ui/react";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import React from "react";
import { useUserInfoQuery } from "src/hooks/fetchers/queries/useUserInfoQuery";
import Sidebar from "src/components/Sidebar";
import {
  MdAccountCircle,
  MdOutlineExpandMore,
  MdLogout,
  MdSearch,
  MdMenu,
  MdLock,
} from "react-icons/md";
import { useRouter } from "next/router";
import { useModalSidebar, useSearchBar } from "..";
import { SearchModal } from "./fragments/SearchModal";
import { FaSearch } from "react-icons/fa";

const AppLayout = ({ children }) => {
  const router = useRouter();
  const { data: user, status: userStatus } = useUserInfoQuery({});

  const { onOpen } = useModalSidebar();
  const { onOpen: onOpenSearch } = useSearchBar();

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
          <Image p={2} width="48px" src="/logo.png" alt="Pegon Logo" />
          <Heading size="sm" ml={3}>
            Aksarantara
          </Heading>
        </Flex>
        <Flex display={{ md: "none" }} alignItems="center">
          <IconButton icon={<MdMenu />} variant="ghost" onClick={onOpen} />
        </Flex>
        <Spacer />
        <Flex
          alignItems="center"
          ml={3}
        >
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
            <Text ml="3" fontWeight="normal" color="whiteAlpha.400"> Search Here </Text>
          </Button>
          <Avatar size="sm" name={user?.firstName + " " + user?.lastName} />
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<MdOutlineExpandMore />}
              variant="link"
            />
            <MenuList>
            <MenuItem
                icon={<MdLock />}
                onClick={() => {
                  router.push("/app/change-password");
                }}
              >
                Change Password
              </MenuItem>
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
        <SearchModal />
        <Box w="100%" h="100%" overflowY="auto">
          {children}
        </Box>
      </Flex>
    </VStack>
  );
};

export default AppLayout;
