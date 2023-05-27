import { Button } from "@chakra-ui/react";

export const NavigationButton= ({isSidebarExpanded, icon, children, ...props}) => {
    return <Button
      iconSpacing={isSidebarExpanded ? 3 : 0}
      leftIcon={icon}
      justifyContent="left"
      variant="ghost"
      mb={1}
      width="100%"
      textColor="gray.400"
      sx={{
        "& svg": {
          fontSize: "1.25rem",
          textColor: "gray.300",
        },
      }}
      fontWeight="normal"
      fontSize="sm"
      {...props}
    >
      {isSidebarExpanded ? children : null}
    </Button>;
  }