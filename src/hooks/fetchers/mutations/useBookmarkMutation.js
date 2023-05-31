import axios from "axios";
import { useFetchMutation } from "../reactQueryHooks";

export const useBookmarkMutation = ({ config }) => {
  const _bookmark = async (id) => {
    try {
      const { data } = await axios.post(`/api/bookmark/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          'Bypass-Tunnel-Reminder': 'true'
        },
      });
      return data;
    } catch (error) {
      throw error;
    }
  };

  return useFetchMutation(_bookmark, config);
};
