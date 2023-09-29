import { Page } from "src/componentPage/Page";
import { OCRPage } from "src/componentPage/OCRPage";

export default function Transilerator() {
  return <Page pageComponent={OCRPage} />;
}
