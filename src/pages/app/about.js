import {Page} from "src/componentPage/Page";
import FAQPage from "../../componentPage/FAQPage";

export default function FAQ() {
  return <Page pageComponent={FAQPage} requireAuth />;
}
