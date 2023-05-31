import axios from "axios";
import { useFetchQuery } from "../reactQueryHooks";

export const useDocumentsQuery = ({ config, page, pageSize, queries }) => {
  const _documentsQuery = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/documents`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          'Bypass-Tunnel-Reminder': 'true'
          // "ngrok-skip-browser-warning":"any"
        },
        params: {
          "pagination[page]": page ? page : 1,
          "pagination[pageSize]": pageSize ? pageSize : 10,
          "sort[0]" : "publishedAt:desc",
          ...queries
        }
      });
      return data;
    } catch (error) {
      throw error;
    }
  };

  return useFetchQuery(["documents", {page, pageSize, queries}], _documentsQuery, config);
};
