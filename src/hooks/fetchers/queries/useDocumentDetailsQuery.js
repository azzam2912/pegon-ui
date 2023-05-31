import axios from "axios";
import { useFetchQuery } from "../reactQueryHooks";

export const useDocumentDetailsQuery = ({ config, id }) => {
  const _documentDetailsQuery = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_HOST}/documents/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            'Bypass-Tunnel-Reminder': 'true'
          },
          params: {
            populate: "*",
          },
        },
      );
      return data;
    } catch (error) {
      throw error;
    }
  };

  return useFetchQuery(["documentDetail", {id}], _documentDetailsQuery, config);
};