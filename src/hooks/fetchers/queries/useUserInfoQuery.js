import axios from "axios";
import { useFetchQuery } from "../reactQueryHooks";

export const useUserInfoQuery = ({ config }) => {
  const _userInfoQuery = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/users/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          // "ngrok-skip-browser-warning":"any"
        },
      });
      return data;
    } catch (error) {
      throw error;
    }
  };

  return useFetchQuery(["userInfo"], _userInfoQuery, config);
};
