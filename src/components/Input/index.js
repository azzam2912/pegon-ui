import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  InputRightElement,
  InputGroup,
  IconButton,
} from "@chakra-ui/react";
import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export const TextInput = ({
  label,
  errorMessage,
  helperText,
  isRequired,
  type,
  ...props
}) => {
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  return (
    <FormControl isInvalid={errorMessage} isRequired={isRequired}>
      <FormLabel mb={0}>{label}</FormLabel>
      <InputGroup size="md">
        <Input
          pr="4.5rem"
          {...props}
          type={type === "password" ? (show ? "text" : "password") : type}
        />
        {type === "password" ? (
          <InputRightElement>
            <IconButton
              h="1.75rem" 
              size="sm"
              onClick={handleClick}
              icon={!show ? <FaEyeSlash /> : <FaEye />}
            />
          </InputRightElement>
        ) : null}
      </InputGroup>
      {helperText & !errorMessage ? (
        <FormHelperText>{helperText}</FormHelperText>
      ) : null}
      {errorMessage && <FormErrorMessage>{errorMessage}</FormErrorMessage>}
    </FormControl>
  );
};
