import axios from "axios";
import { useFetchQuery } from "../reactQueryHooks";

export const useViewDocumentQuery = ({ config, id }) => {
  const _viewDocumentQuery = async () => {
    try {
      const { data } = await axios.get(
        `/api/documents/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        },
      );
      return data;
    } catch (error) {
      throw error;
    }
  };

  return useFetchQuery(["viewDocument", {id}], _viewDocumentQuery, config);
};
