import axios from "axios";
import { useFetchMutation } from "../reactQueryHooks";

export const useAddDocumentMutation = ({ config }) => {
  const _addDocument = async (documentInfo) => {
    try {
      const { data } = await axios.post(
        "/api/contribute",
        documentInfo,{
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        }
      );
      return data;
    } catch (error) {
      throw error;
    }
  };

  return useFetchMutation(_addDocument, config);
};
