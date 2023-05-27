import axios from "axios";
import { useFetchQuery } from "../reactQueryHooks";

export const useDocumentDetailsQuery = ({ config, id }) => {
  const _documentDetailsQuery = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_HOST}/documents/1`,
        {
          headers: {
            Authorization: `Bearer bef644480f3b08f0d3a9c1bdd21a93e0e53e0218664d32ec86bd479af4ec874d7fd85893dc42d6d0a18d8e9e02e32f0e1608db59cb817c107836af74a155e72cec89803a1c8989ed1d2a1c29522e53c7b332f4ca094e91c5e7c78ae12ae57ae94df3eeccecda3ea136c29beadfc7e50f8b674be6570b4f244980308f8f206bd3`,
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

  return useFetchQuery(null, _documentDetailsQuery, config);
};
