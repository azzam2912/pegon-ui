import axios from "axios";
import { useFetchMutation } from "../reactQueryHooks";

export const useSignInMutation = ({ config }) => {
  const _signIn = async ({ identifier, password }) => {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_HOST}/auth/local`,
      {
        identifier,
        password,
      },
    );
    return data;
  };

  return useFetchMutation(_signIn, config);
};
