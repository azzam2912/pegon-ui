import DocumentDetailsPage from "src/componentPage/DocumentDetailsPage";
import { Page } from "src/componentPage/Page";
import { useRouter } from "next/router";

export default function DocumentDetails() {
  return <Page pageComponent={DocumentDetailsPage}/>;
}