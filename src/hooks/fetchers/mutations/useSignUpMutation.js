import axios from "axios";
import { useFetchMutation } from "../reactQueryHooks";

export const useSignUpMutation = ({ config }) => {
  const _signUp = async ({ username, email, password }) => {
    try {
      const { data } = await axios.post(
        `http://localhost:1337/api/auth/local/register`,
        {
          username,
          email,
          password
        }
      );
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return useFetchMutation(_signUp, config);
};
