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
import { PegonCheatSheet } from "./PegonCheatSheet";
import { ArabCheatSheet } from "./ArabCheatSheet";
import { BurmeseCheatSheet } from "./BurmeseCheatSheet"
import { MonCheatSheet } from "./MonCheatSheet"
import { SgawKarenCheatSheet } from "./SgawKarenCheatSheet";

export const CheatSheetDrawer = ({ isOpen, onClose, documentScript }) => {
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
              {documentScript == "Pegon" && (
                <>
                  <Tab>Pegon</Tab>
                  <Tab>Arab</Tab>
                </>
              )}
              {/* kalo mau nambah2 sini */}
              {documentScript == "Jawi" && (
                <>
                  <Tab>Jawi</Tab>
                </>
              )}
              {documentScript == "Cham" && (
                <>
                  <Tab>Cham</Tab>
                </>
              )}
              {documentScript == "Mon-Burmese" && (
                <>
                  <Tab>Burmese</Tab>
                  <Tab>Mon</Tab>
                  <Tab>Sgaw Karen</Tab>
                </>
              )}
            </TabList>
            <TabPanels
              borderLeftWidth="1px"
              borderBottomWidth="1px"
              borderRightWidth="1px"
            >
              {documentScript == "Pegon" && (
                <>
                  <TabPanel>
                    <PegonCheatSheet />
                  </TabPanel>
                  <TabPanel>
                    <ArabCheatSheet />
                  </TabPanel>
                </>
              )}
              {/* jangan lupa tambah kasus jawi sama cham disini, contoh line atas ini */}
              {documentScript == "Mon-Burmese" && (
                <>
                  <TabPanel>
                    <BurmeseCheatSheet />
                  </TabPanel>
                  <TabPanel>
                    <MonCheatSheet />
                  </TabPanel>
                  <TabPanel>
                    <SgawKarenCheatSheet />
                  </TabPanel>
                </>
              )}
            </TabPanels>
          </Tabs>
        </DrawerBody>
        <DrawerFooter />
      </DrawerContent>
    </Drawer>
  );
};
