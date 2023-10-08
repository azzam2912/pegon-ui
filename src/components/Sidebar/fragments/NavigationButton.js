import { Button, Tooltip } from "@chakra-ui/react";
import Link from "next/link";

export const NavigationButton = ({ isSidebarExpanded, icon, children, label, ...props }) => {
  return (
    <>
      {isSidebarExpanded ? (
        <Button
          iconSpacing={isSidebarExpanded ? 3 : 0}
          leftIcon={icon}
          as={Link}
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
        </Button>
      ) : (
        <Tooltip label={label}>
          <Button
            iconSpacing={isSidebarExpanded ? 3 : 0}
            leftIcon={icon}
            as={Link}
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
          </Button>
        </Tooltip>
      )}
    </>
  );
};