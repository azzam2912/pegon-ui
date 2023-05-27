import DocumentDetailsPage from "src/componentPage/DocumentDetailsPage";
import { Page } from "src/componentPage/Page";
import { useRouter } from "next/router";

export default function DocumentDetails() {
  const router = useRouter();
  const id = router.query.id;
  return <Page pageComponent={DocumentDetailsPage} id={id} />;
}
