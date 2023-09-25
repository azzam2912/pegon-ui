import { Flex, HStack, IconButton, Text, Textarea } from "@chakra-ui/react";
import React from "react";
import { MdContentCopy } from "react-icons/md";
import "@fontsource/noto-sans-cham";
import "@fontsource/noto-sans-tagalog";
import "@fontsource/noto-sans-buhid";
import "@fontsource/noto-sans-hanunoo";
import "@fontsource/noto-sans-tagbanwa";

import "@fontsource/noto-sans-kayah-li";
import "@fontsource/noto-sans-myanmar";

import "@fontsource/noto-sans-buginese";
import "@fontsource/noto-serif-makasar";
import "@fontsource/noto-sans-rejang";
import "@fontsource/noto-serif-thai";
import "@fontsource/noto-serif-lao";
import "@fontsource/noto-sans-javanese";
import "@fontsource/noto-sans-sundanese";
import "@fontsource/noto-sans-balinese";
import { getFont } from "src/utils/objects";

export const TransliterateInput = ({
  isReadOnly,
  value,
  onChange,
  isRightToLeft,
  isLoading,
  script,
  variant,
  standardLatin,
  ...props
}) => {
  const fontFamily = getFont;

  return (
    <Flex direction="column" flex={1} p={4}>
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
      <HStack justify="space-between">
        <Text fontSize="sm" textColor="gray.300">
          {standardLatin}
        </Text>
        <IconButton
          onClick={() => {
            navigator.clipboard.writeText(value);
          }}
          variant="ghost"
          icon={<MdContentCopy />}
        />
      </HStack>
    </Flex>
  );
};
