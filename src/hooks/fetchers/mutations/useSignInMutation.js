import axios from "axios";
import { useFetchMutation } from "../reactQueryHooks";

export const useSignInMutation = ({ config }) => {
  const _signIn = async ({ identifier, password }) => {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_HOST}/auth/local`,
        {
          identifier,
          password,
        },
      );
      return data;
    } catch (error) {
      throw error;
    }
  };

  return useFetchMutation(_signIn, config);
};
