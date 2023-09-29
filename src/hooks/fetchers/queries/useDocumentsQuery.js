import axios from "axios";
import { useFetchQuery } from "../reactQueryHooks";

export const useDocumentsQuery = ({ config, page, pageSize, queries }) => {
  const _documentsQuery = async () => {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_HOST}/documents`,
      {
        params: {
          "pagination[page]": page ? page : 1,
          "pagination[pageSize]": pageSize ? pageSize : 10,
          "sort[0]": "publishedAt:desc",
          ...queries,
        },
      },
    );
    return data;
  };

  return useFetchQuery(
    ["documents", { page, pageSize, queries }],
    _documentsQuery,
    config,
  );
};
