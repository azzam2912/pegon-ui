import {
  Button,
  Divider,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Image
} from "@chakra-ui/react";
import React from "react";
import {
  MdArrowBack,
  MdMenu,
  MdHome,
  MdLibraryBooks,
  MdInfo,
  MdTranslate,
  MdDocumentScanner,
  MdLightbulb,
} from "react-icons/md";

import { SiBookstack } from "react-icons/si";
import { NavigationButton } from "./fragments/NavigationButton";
import { useModalSidebar } from "src/componentPage/Page";

import SvgTransliterate from "src/icons/Transliterate";

const Sidebar = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = React.useState(false);
  const { isOpen, onClose } = useModalSidebar();

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
          label="Home"
          icon={<MdHome />}
          href="/app"
          isSidebarExpanded={isSidebarExpanded}
        >
          Home
        </NavigationButton>
        <NavigationButton
          label="Explore Documents"
          icon={<MdLibraryBooks />}
          href="/app/documents"
          isSidebarExpanded={isSidebarExpanded}
        >
          Explore Documents
        </NavigationButton>
        <NavigationButton
          label="My Library"
          icon={<SiBookstack />}
          href="/app/library"
          isSidebarExpanded={isSidebarExpanded}
        >
          My Library
        </NavigationButton>
        <Divider my={3} />
        <NavigationButton
          label="Transliterator"
          icon={<SvgTransliterate />}
          href="/app/transliterator"
          isSidebarExpanded={isSidebarExpanded}
        >
          Transliterator
        </NavigationButton>
        <NavigationButton
          label="OCR"
          icon={<MdDocumentScanner />}
          href="/app/ocr"
          isSidebarExpanded={isSidebarExpanded}
        >
          OCR
        </NavigationButton>
        <Divider my={3} />
        <NavigationButton
          label="Tutorial"
          icon={<MdInfo />}
          href="/app/tutorial"
          isSidebarExpanded={isSidebarExpanded}
        >
          Tutorial
        </NavigationButton>
        <NavigationButton
          label="Wiki"
          icon={<MdLightbulb />}
          href="/app/wiki"
          isSidebarExpanded={isSidebarExpanded}
        >
          Wiki
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
              href="/app"
              isSidebarExpanded
            >
              Home
            </NavigationButton>
            <NavigationButton
              icon={<MdLibraryBooks />}
              href="/app/documents"
              isSidebarExpanded
            >
              Explore Documents
            </NavigationButton>
            <NavigationButton
              icon={<SiBookstack />}
              href="/app/library"
              isSidebarExpanded
            >
              My Library
            </NavigationButton>
            <Divider my={3} />
            <NavigationButton
              icon={<MdTranslate />}
              href="/app/transliterator"
              isSidebarExpanded
            >
              Transliterator
            </NavigationButton>
            <NavigationButton
              icon={<MdDocumentScanner />}
              href="/app/ocr"
              isSidebarExpanded
            >
              OCR
            </NavigationButton>
            <Divider my={3} />
            <NavigationButton
              icon={<MdInfo />}
              href="/app/tutorial"
              isSidebarExpanded
            >
              FAQ
            </NavigationButton>
            <NavigationButton
              icon={<MdLightbulb />}
              href="/app/wiki"
              isSidebarExpanded
            >
              Wiki
            </NavigationButton>
          </Flex>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Sidebar;
