import DocumentsPage from "src/componentPage/DocumentsPage";
import { Page } from "src/componentPage/Page";

export default function NewDocument() {
  return <Page pageComponent={DocumentsPage} requireAuth />;
}