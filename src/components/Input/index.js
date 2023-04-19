import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
} from "@chakra-ui/react";

export const TextInput = ({
  label,
  errorMessage,
  helperText,
  isRequired,
  ...props
}) => {
  return (
    <FormControl isInvalid={errorMessage} isRequired={isRequired}>
      <FormLabel mb={0}>{label}</FormLabel>
      <Input {...props} />
      {helperText & !errorMessage ? (
        <FormHelperText>{helperText}</FormHelperText>
      ) : null}
      {errorMessage && <FormErrorMessage>{errorMessage}</FormErrorMessage>}
    </FormControl>
  );
};
