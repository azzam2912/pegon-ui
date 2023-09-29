import React from "react";
import { useColorMode, useDisclosure } from "@chakra-ui/react";

export const ModelSidebarContext = React.createContext();
export const SearchBarContext = React.createContext();

const ModalSidebarContextProvider = ({ children }) => {
  const modalSidebar = useDisclosure();
  return (
    <ModelSidebarContext.Provider value={modalSidebar}>
      {children}
    </ModelSidebarContext.Provider>
  );
};

export const SearchBarContextProvider = ({ children }) => {
  const searchBar = useDisclosure();
  return (
    <SearchBarContext.Provider value={searchBar}>
      {children}
    </SearchBarContext.Provider>
  );
};

export const useModalSidebar = () => {
  const context = React.useContext(ModelSidebarContext);
  return context;
};

export const useSearchBar = () => {
  const context = React.useContext(SearchBarContext);
  return context;
};

export const Page = ({ pageComponent: Page, ...props }) => {
  const { colorMode, toggleColorMode } = useColorMode();

  React.useEffect(() => {
    if (colorMode == "light") {
      toggleColorMode();
    }
  }, []);
  return (
    <SearchBarContextProvider>
      <ModalSidebarContextProvider>
        <Page {...props} />
      </ModalSidebarContextProvider>
    </SearchBarContextProvider>
  );
};
