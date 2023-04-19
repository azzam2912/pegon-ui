import axios from "axios";
import { useFetchMutation } from "../reactQueryHooks";

export const useSignInMutation = ({ config }) => {
  const _signIn = async ({ identifier, password }) => {
    try {
      const { data } = await axios.post(
        `http://localhost:1337/api/auth/local`,
        {
          identifier,
          password,
        }
      );
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return useFetchMutation(_signIn, config);
};
