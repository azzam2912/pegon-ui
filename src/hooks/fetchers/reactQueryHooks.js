import { useToast } from "@chakra-ui/react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";

export const useFetchQuery = (key, fetcher, options) => {
  const createToast = useToast();
  const router = useRouter();
  return useQuery({
    queryKey: key,
    queryFn: fetcher,
    onError: (error) => {
      if (error.response?.status === 401) {
        localStorage?.removeItem("token");
        router.push("/");
      } else if (error.response?.status === 403) {
        // Handle 403 error: Forbidden
        createToast({
          title: "Error",
          description: "Forbidden",
          status: "error",
          position: "bottom-right",
          isClosable: true,
        });
      } else {
        createToast({
          title: "Error",
          description: error.message,
          status: "error",
          position: "bottom-right",
          isClosable: true,
        });
      }
    },
    ...options,
  });
};

export const useFetchMutation = (fetcher, options) => {
  const createToast = useToast();
  const router = useRouter();
  return useMutation({
    mutationFn: fetcher,
    onError: (error) => {
      if (error.response?.status === 401) {
        localStorage?.removeItem("token");
        router.push("/");
      } else if (error.response?.status === 403) {
        // Handle 403 error: Forbidden
        createToast({
          title: "Error",
          description: "Forbidden",
          status: "error",
          position: "bottom-right",
          isClosable: true,
        });
      } else if (error.response?.status === 413) {
        // Handle 413 error: Request Entity Too Large
        createToast({
          title: "Error",
          description: "Your document file is too large.",
          status: "error",
          position: "bottom-right",
          isClosable: true,
        });
      } else {
        createToast({
          title: "Error",
          description: error.message,
          status: "error",
          position: "bottom-right",
          isClosable: true,
        });
      }
    },
    ...options,
  });
};
