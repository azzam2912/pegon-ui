import axios from "axios";
import { useFetchMutation } from "../reactQueryHooks";

export const useAddBookmarkMutation = ({ config }) => {
  const _bookmark = async (id) => {
    try {
      const { data } = await axios.post(`/api/bookmark/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return data;
    } catch (error) {
      throw error;
    }
  };

  return useFetchMutation(_bookmark, config);
};
