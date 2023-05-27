import {
  Button,
  Divider,
  Drawer,
  DrawerContent,
  DrawerOverlay,
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
import { useModalSidebar } from "src/componentPage/Page";
import { useRouter } from "next/router";

const Sidebar = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = React.useState(false);
  const { isOpen, onOpen, onClose } = useModalSidebar();
  const router = useRouter();

  return (
    <>
      <Flex
        style={{
          width: isSidebarExpanded ? "250px" : "64px",
        }}
        display={{
          base: "none",
          md: "block",
        }}
        borderRightWidth="1px"
        height="100%"
        bgColor="gray.700"
        direction="column"
        alignItems="start"
        overflow="hidden"
        p={1}
      >
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
        <Divider my={2} />
        <NavigationButton
          icon={<MdHome />}
          onClick={() => router.push("/app")}
          isSidebarExpanded={isSidebarExpanded}
        >
          Home
        </NavigationButton>
        <NavigationButton
          icon={<MdLibraryBooks />}
          onClick={() => router.push("/app/documents")}
          isSidebarExpanded={isSidebarExpanded}
        >
          All Documents
        </NavigationButton>
        <NavigationButton
          icon={<MdBookmark />}
          onClick={() => router.push("/app/bookmarks")}
          isSidebarExpanded={isSidebarExpanded}
        >
          Bookmarks
        </NavigationButton>
        <Divider my={3} />
        <NavigationButton
          icon={<MdInfo />}
          onClick={() => router.push("/app/about")}
          isSidebarExpanded={isSidebarExpanded}
        >
          About
        </NavigationButton>
      </Flex>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <Flex
            w="100%"
            height="100%"
            bgColor="gray.700"
            direction="column"
            alignItems="start"
            overflow="hidden"
            p={1}
          >
            <Button
              iconSpacing={2}
              rightIcon={<MdArrowBack />}
              variant="ghost"
              justifyContent="right"
              width="100%"
              sx={{
                "& svg": {
                  fontSize: "1.25rem",
                },
              }}
              textColor="gray.300"
              onClick={onClose}
            />
            <Divider my={2} />
            <NavigationButton
              icon={<MdHome />}
              onClick={() => router.push("/app")}
              isSidebarExpanded
            >
              Home
            </NavigationButton>
            <NavigationButton
              icon={<MdLibraryBooks />}
              onClick={() => router.push("/app/documents")}
              isSidebarExpanded
            >
              All Documents
            </NavigationButton>
            <NavigationButton
              icon={<MdBookmark />}
              onClick={() => router.push("/app/bookmarks")}
              isSidebarExpanded
            >
              Bookmarks
            </NavigationButton>
            <Divider my={3} />
            <NavigationButton
              icon={<MdInfo />}
              onClick={() => router.push("/app/about")}
              isSidebarExpanded
            >
              About
            </NavigationButton>
          </Flex>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Sidebar;
