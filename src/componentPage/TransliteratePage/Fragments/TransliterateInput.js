import { Flex, IconButton, Textarea } from "@chakra-ui/react";
import React from "react";
import { MdContentCopy } from "react-icons/md";
import "@fontsource/noto-sans-cham";
import "@fontsource/noto-sans-tagalog";
import "@fontsource/noto-sans-buhid";
import "@fontsource/noto-sans-hanunoo";
import "@fontsource/noto-sans-tagbanwa";
import "@fontsource/noto-sans-kayah-li";

export const TransliterateInput = ({
  isReadOnly,
  value,
  onChange,
  isRightToLeft,
  isLoading,
  variant,
  ...props
}) => {
  const variantsStyles = {
    "Cham undefined": {
      fontFamily: "Noto Sans Cham",
    },
    "Baybayin Baybayin": {
      fontFamily: "Noto Sans Tagalog",
    },
    "Baybayin Buhid": {
      fontFamily: "Noto Sans Buhid",
    },
    "Baybayin Hanuno'o": {
      fontFamily: "Noto Sans Hanunoo",
    },
    "Baybayin Tagbanwa": {
      fontFamily: "Noto Sans Tagbanwa",
    },
    "Kayah Li undefined": {
      fontFamily: "Noto Sans Kayah Li",
    },
  };

  const fontFamily = variantsStyles[variant]?.fontFamily || null;

  return (
    <Flex direction="column" align="end" flex={1} p={4}>
      <Textarea
        style={fontFamily ? { fontFamily } : null}
        flex={1}
        textColor={isReadOnly ? "gray.300" : "primary.200"}
        textAlign={isRightToLeft ? "right" : "left"}
        resize="none"
        borderWidth={0}
        height="100%"
        focusBorderColor="transparent"
        // make scrollbar translucent
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
        onChange={onChange}
        isReadOnly={isReadOnly}
        value={isLoading ? "Transliterating..." : value}
        {...props}
      />
      <IconButton
        onClick={() => {
          navigator.clipboard.writeText(value);
        }}
        variant="ghost"
        icon={<MdContentCopy />}
      />
    </Flex>
  );
};
