import { useToast } from "@chakra-ui/react";
import { useQuery, useMutation } from "@tanstack/react-query";

export const useFetchQuery = (key, fetcher, options) => {
  const createToast = useToast();
  return useQuery({
    queryKey: key,
    queryFn: fetcher,
    onError: (error) => {
      createToast({
        title: "Error",
        description: error.message,
        status: "error",
        position: "top-right",
        isClosable: true,
      });
    },
    ...options,
  });
};

export const useFetchMutation = (fetcher, options) => {
  const createToast = useToast();
  return useMutation({
    mutationFn: fetcher,
    onError: (error) => {
      createToast({
        title: "Error",
        description: error.message,
        position: "top-right",
        status: "error",
        isClosable: true,
      });
    },
    ...options,
  });
};
