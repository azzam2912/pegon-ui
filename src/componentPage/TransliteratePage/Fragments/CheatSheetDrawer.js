import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
} from "@chakra-ui/react";
import { Tfoot, TableCaption } from "@chakra-ui/react";
import React from "react";
import { AboutTransliterator } from "./AboutTransliterator";
import { PegonCheatSheet } from "./PegonCheatSheet";
import { ArabCheatSheet } from "./ArabCheatSheet";

export const CheatSheetDrawer = ({ isOpen, onClose }) => {
  return (
    <Drawer size="md" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Cheatsheet</DrawerHeader>
        <DrawerBody
          sx={{
            "&::-webkit-scrollbar": {
              width: "0.4em",
            },
            "&::-webkit-scrollbar-track": {
              boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
              webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0,0,0,.2)",
              borderRadius: "10px",
            },
          }}
        >
          <Tabs colorScheme="green">
            <TabList>
              <Tab>About Transliterator</Tab>
              <Tab>Pegon</Tab>
              <Tab>Arab</Tab>
            </TabList>
            <TabPanels
              borderLeftWidth="1px"
              borderBottomWidth="1px"
              borderRightWidth="1px"
            >
              <TabPanel>
                <AboutTransliterator />
              </TabPanel>
              <TabPanel>
                <PegonCheatSheet />
              </TabPanel>
              <TabPanel>
                <ArabCheatSheet />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </DrawerBody>
        <DrawerFooter />
      </DrawerContent>
    </Drawer>
  );
};
