import { Flex, IconButton, Textarea } from "@chakra-ui/react";
import React from "react";
import { MdContentCopy } from "react-icons/md";

export const TransliterateInput = ({
  isReadOnly,
  value,
  onChange,
  isRightToLeft,
  ...props
}) => {
  return (
    <Flex direction="column" align="end" flex={1} p={4}>
      <Textarea
        flex={1}
        textColor={isReadOnly ? "gray.300" : "primary.200"}
        textAlign={isRightToLeft ? "right" : "left"}
        fontWeight="semibold"
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
        value={value}
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
