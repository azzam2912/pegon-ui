import DocumentDetailsPage from "src/componentPage/DocumentDetailsPage";
import { Page } from "src/componentPage/Page";

export async function getServerSideProps(context) {
  const { id } = context.query;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/documents/${id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MASTER_TOKEN}`,
        },
        params: {
          populate: "*",
        },
      }
    );
    const data = await response.json();
    return {
      props: {
        data,
      },
    };
  } catch (error) {
    throw error;
  }
}

export default function DocumentDetails({ data }) {
  return <Page requireAuth pageComponent={DocumentDetailsPage} data={data}/>;
}
