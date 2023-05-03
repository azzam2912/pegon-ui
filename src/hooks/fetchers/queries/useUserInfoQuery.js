import axios from "axios";
import { useFetchQuery } from "../reactQueryHooks";
import { useRouter } from "next/router";

export const useUserInfoQuery = ({ config }) => {
  const router = useRouter();
  const _userInfoQuery = async ({ identifier, password }) => {
    try {
      const { data } = await axios.get(`http://localhost:1337/api/users/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return data;
    } catch (error) {
      throw error;
    }
  };

  return useFetchQuery(["userInfo"], _userInfoQuery, config);
};
