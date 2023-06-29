import React from "react";
import { useRouter } from "next/router";
import { useDisclosure, useToast } from "@chakra-ui/react";

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

export const Page = ({ pageComponent: Page, requireAuth, ...props }) => {
  const router = useRouter();
  const createToast = useToast();
  React.useEffect(() => {
    // check if jwt is present
    const token = localStorage?.getItem("token");
    if (!token && requireAuth) {
      createToast({
        title: "Error",
        description: "You need to be logged in to access this page",
        position: "bottom-right",
        status: "error",
        isClosable: true,
      });
      router.push("/");
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
