import React, { useEffect } from "react";
import AppLayout from "../Page/AppLayout";
import {
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Image,
  Input,
  InputGroup,
  Select,
  Text,
  Textarea,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { useDocumentDetailsQuery } from "src/hooks/fetchers/queries/useDocumentDetailsQuery";

const DocumentDetailsPage = ({ id }) => {
  const { data: documentDetails, status: documentDetailsStatus } =
    useDocumentDetailsQuery({
      config: {
        onSuccess: (data) => {
          console.log("Success");
        },
      },
      id: id,
    });

  const PdfViewer = ({ fileUrl }) => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    return (
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js">
        <div style={{ height: "100%", width: "100%" }}>
          <Viewer
            fileUrl={fileUrl}
            plugins={[defaultLayoutPluginInstance]}
            theme="dark"
          />
        </div>
      </Worker>
    );
  };

  let content = null;

  if (documentDetailsStatus === "success") {
    console.log(documentDetails.data.attributes);
    const url = `${process.env.NEXT_PUBLIC_HOST}${documentDetails.data.attributes.file.data.attributes.url}`;
    const {
      title,
      author,
      collector,
      documentType,
      language,
      yearWritten,
      locationWritten,
      ink,
      illumination,
      description,
    } = documentDetails.data.attributes;
    content = (
      <AppLayout>
        <Flex
          w="100%"
          h="100%"
          direction={{ base: "column-reverse", lg: "row" }}
        >
          <Flex flex={1} p={5} display={{ base: "none", lg: "block" }}>
            {!url ? null : <PdfViewer fileUrl={url} />}
          </Flex>
          <Flex height="100%" flex={1} direction="column">
            <VStack overflowY="auto" p={5} spacing={5} w="100%">
              <Heading as="h1" size="lg" mb={4}>
                {title}
              </Heading>
              <Text>
                <strong>Author:</strong> {author ? author : "-"}
              </Text>
              <Text>
                <strong>Collector:</strong> {collector ? collector : "-"}
              </Text>
              <Text>
                <strong>Document Type:</strong> {documentType}
              </Text>
              <Text>
                <strong>Language:</strong> {language}
              </Text>
              <Text>
                <strong>Year Written:</strong> {yearWritten ? yearWritten : "-"}
              </Text>
              <Text>
                <strong>Location Written:</strong>{" "}
                {locationWritten ? locationWritten : "-"}
              </Text>
              <Text>
                <strong>Ink:</strong> {ink ? ink : "-"}
              </Text>
              <Text>
                <strong>Illumination:</strong>{" "}
                {illumination ? illumination : "-"}
              </Text>
              <Text>
                <strong>Description:</strong> {description ? description : "-"}
              </Text>
            </VStack>
          </Flex>
        </Flex>
      </AppLayout>
    );
  } else {
    content = <AppLayout></AppLayout>;
  }

  return content;
};

export default DocumentDetailsPage;
