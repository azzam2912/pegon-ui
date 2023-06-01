import axios from "axios";
import { useFetchMutation } from "../reactQueryHooks";

export const useSignUpMutation = ({ config }) => {
  const _signUp = async ({
    firstName,
    lastName,
    username,
    email,
    password,
  }) => {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_HOST}/auth/local/register`,
        {
          firstName,
          lastName,
          username,
          email,
          password,
        }
      );
      return data;
    } catch (error) {
      throw error;
    }
  };

  return useFetchMutation(_signUp, config);
};
