import axios from "axios";
import { useFetchMutation } from "../reactQueryHooks";

export const useChangePasswordMutation = ({ config }) => {
  const _changePassword = async ({
    currentPassword,
    password,
    confirmPassword,
  }) => {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_HOST}/auth/change-password`,
        {
          currentPassword,
          password,
          passwordConfirmation: confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,   
          },
        }
      );
      return data;
    } catch (error) {
      throw error;
    }
  };

  return useFetchMutation(_changePassword, config);
};
