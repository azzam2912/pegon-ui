import axios from "axios";
import { useFetchMutation } from "../reactQueryHooks";

export const useRemoveBookmarkMutation = ({ config }) => {
  const _removeBookmark = async (id) => {
    try {
      const { data } = await axios.delete(`/api/bookmark/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,  
        },
      });
      return data;
    } catch (error) {
      throw error;
    }
  };

  return useFetchMutation(_removeBookmark, config);
};
