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

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { TextInput } from "src/components/Input";
import { useAddDocumentMutation } from "src/hooks/fetchers/mutations/useAddDocumentMutation";
import { useRouter } from "next/router";

const NewDocumentPage = () => {
  const [file, setFile] = React.useState(null);
  const [url, setUrl] = React.useState(null);

  const [thumbnail, setThumbnail] = React.useState(null);
  const [thumbUrl, setThumbUrl] = React.useState(null);

  const [title, setTitle] = React.useState("");
  const [collector, setCollector] = React.useState("");
  const [author, setAuthor] = React.useState("");
  const [documentType, setDocumentType] = React.useState("");
  const [language, setLanguage] = React.useState("");
  const [yearWritten, setYearWritten] = React.useState(0);
  const [locationWritten, setLocationWritten] = React.useState("");
  const [ink, setInk] = React.useState("");
  const [illumination, setIllumination] = React.useState("");
  const [description, setDescription] = React.useState("");

  const router = useRouter();
  const createToast = useToast();

  // useAddDocumentMutation({
  const { mutate: addDocument, status: addDocumentStatus } =
    useAddDocumentMutation({
      config: {
        onSuccess: (data) => {
          createToast({
            title: "Success",
            description: "You have successfully created an entry. please wait until it's published.",
            status: "success",
            position: "bottom-right",
            isClosable: true,
          });
          router.push("/app");
        },
      },
    });

  const handleSubmit = async () => {
    const data = {
        title,
        author,
        collector,
        type: documentType,
        language,
        yearWritten,
        locationWritten,
        ink,
        illumination,
        description,
      }

    const req = new FormData();
    req.append("files.file", file);
    req.append("files.thumbnail", thumbnail);
    req.append("data", JSON.stringify(data));
    addDocument(req);
  };

  return (
    <AppLayout>
      <Flex w="100%" h="100%" direction={{ base: "column-reverse", lg: "row" }}>
        <Flex flex={1} p={5} display={{ base: "none", lg: "block" }}>
          {!url ? (
            <PdfInputBig
              onChange={(e) => {
                setUrl(URL.createObjectURL(e.target.files[0]));
                setFile(e.target.files[0]);
              }}
            />
          ) : (
            <PdfViewer fileUrl={url} />
          )}
        </Flex>
        <Flex height="100%" flex={1} direction="column">
          <VStack overflowY="auto" p={5} spacing={5} w="100%">
            <Heading w="100%">New Document</Heading>
            <TextInput
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              label="Title"
              placeholder="Title"
              type="text"
              isRequired
            />
            <HStack width="100%">
              <TextInput
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                label="Author"
                placeholder="Author"
                type="text"
              />
              <TextInput
                value={collector}
                onChange={(e) => setCollector(e.target.value)}
                label="Collector"
                placeholder="Collector"
                type="text"
              />
            </HStack>
            <HStack width="100%">
              <TextInput
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                label="Document Type"
                placeholder="Ex: Tassawuf, Fiqh, etc"
                type="text"
                isRequired
              />
              <FormControl isRequired>
                <FormLabel mb={0}>Language</FormLabel>
                <InputGroup size="md">
                  <Select
                    placeholder="Select One"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="Javanese">Javanese</option>
                    <option value="Sundanese">Sundanese</option>
                    <option value="Madurese">Madurese</option>
                    <option value="Indonesian">Indonesian</option>
                    <option value="Others">Others</option>
                  </Select>
                </InputGroup>
              </FormControl>
            </HStack>
            <HStack width="100%">
              <FormControl>
                <FormLabel mb={0}>Year Written</FormLabel>
                <InputGroup size="md">
                  <Input
                    value={yearWritten}
                    onChange={(e) => setYearWritten(e.target.value)}
                    type="number"
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <FormLabel mb={0}>Location Written</FormLabel>
                <InputGroup size="md">
                  <Input
                    value={locationWritten}
                    onChange={(e) => setLocationWritten(e.target.value)}
                    type="text"
                    placeholder="ex: Central Java, Lombok, etc"
                  />
                </InputGroup>
              </FormControl>
            </HStack>
            <HStack width="100%">
              <TextInput
                value={ink}
                onChange={(e) => setInk(e.target.value)}
                label="Ink"
                placeholder="ex: masi, etc"
              />
              <TextInput
                value={illumination}
                onChange={(e) => setIllumination(e.target.value)}
                label="Illumination"
                placeholder="ex: Bingkai, etc"
              />
            </HStack>
            <FormControl>
              <FormLabel mb={0}>Description</FormLabel>
              <InputGroup size="md">
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Insert description here"
                />
              </InputGroup>
            </FormControl>
            <ImageInput
              onChange={(e) => {
                setThumbUrl(URL.createObjectURL(e.target.files[0]));
                setThumbnail(e.target.files[0]);
              }}
              value={thumbUrl}
            />
            <PdfInputSmall
              onChange={(e) => {
                setUrl(URL.createObjectURL(e.target.files[0]));
                setFile(e.target.files[0]);
              }}
              fileUrl={url}
              filename={file?.name}
            />
          </VStack>
          <HStack align="center" justify="end" p={5}>
            <Button
              onClick={handleSubmit}
              isLoading={addDocumentStatus === "loading"}
              colorScheme="primary"
            >
              Save Document
            </Button>
          </HStack>
        </Flex>
      </Flex>
    </AppLayout>
  );
};

export default NewDocumentPage;

const ImageInput = ({ onChange, value }) => {
  return (
    <FormControl h="640px" w="100%" isRequired>
      <FormLabel mb={0}>Thumbnail</FormLabel>
      <InputGroup size="md">
        <Flex
          position="relative"
          flex={1}
          p={5}
          bgColor="gray.700"
          borderRadius="md"
          borderWidth="1px"
        >
          <VStack
            w="100%"
            h="100%"
            align="center"
            justify="center"
            borderRadius="md"
            borderWidth="2px"
            borderStyle="dashed"
            p={5}
          >
            <Image boxSize="48px" src="/file.svg" />
            <Text textAlign="center">
              Drag and drop your Thumbnail file here {value && "or"}
            </Text>
            {!value && (
              <HStack width="256px">
                <Divider />
                <Text>or</Text>
                <Divider />
              </HStack>
            )}
            <Button>Browse</Button>
          </VStack>
        </Flex>
        {value && (
          <Image
            height="100%"
            width="100%"
            fit="cover"
            position="absolute"
            top="0"
            left="0"
            src={value}
            flex={1 / 2}
          />
        )}
        <Input
          type="file"
          height="100%"
          width="100%"
          position="absolute"
          top="0"
          left="0"
          opacity="0"
          aria-hidden="true"
          accept="image/*"
          onChange={onChange}
        />
      </InputGroup>
    </FormControl>
  );
};

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

const PdfInputSmall = ({ onChange, value, fileUrl, filename }) => {
  const [display, setDisplay] = React.useState({ base: "auto", lg: "none" });

  useEffect(() => {
    if (fileUrl) {
      setDisplay({ base: "auto", lg: "auto" });
    } else {
      setDisplay({ base: "auto", lg: "none" });
    }
  }, [fileUrl]);

  return (
    <FormControl h="640px" w="100%" isRequired display={display}>
      <FormLabel mb={0}>Document</FormLabel>
      <InputGroup size="md">
        <Flex
          position="relative"
          flex={1}
          p={5}
          bgColor="gray.700"
          borderRadius="md"
          borderWidth="1px"
        >
          <VStack
            w="100%"
            h="100%"
            align="center"
            justify="center"
            borderRadius="md"
            borderWidth="2px"
            borderStyle="dashed"
            p={5}
          >
            <Image boxSize="48px" src="/file.svg" />
            {fileUrl ? (
              <>
                <Text>{filename}</Text>
                <Text>Drag and drop your PDF file here to change files</Text>
              </>
            ) : (
              <Text>Drag and drop your PDF file here</Text>
            )}
            <HStack width="256px">
              <Divider />
              <Text>or</Text>
              <Divider />
            </HStack>
            <Button>Browse</Button>
          </VStack>
          <Input
            type="file"
            height="100%"
            width="100%"
            position="absolute"
            top="0"
            left="0"
            opacity="0"
            aria-hidden="true"
            accept="application/pdf"
            onChange={onChange}
            value={value}
          />
        </Flex>
      </InputGroup>
    </FormControl>
  );
};

const PdfInputBig = ({ onChange, value }) => {
  return (
    <Flex
      h="100%"
      position="relative"
      flex={1}
      p={5}
      bgColor="gray.700"
      borderRadius="md"
      borderWidth="1px"
    >
      <VStack
        w="100%"
        h="100%"
        align="center"
        justify="center"
        borderRadius="md"
        borderWidth="2px"
        borderStyle="dashed"
      >
        <Image boxSize="128px" src="/file.svg" />
        <Text>Drag and drop your PDF file here</Text>
        <HStack width="256px">
          <Divider />
          <Text>or</Text>
          <Divider />
        </HStack>
        <Button>Browse</Button>
      </VStack>
      <Input
        type="file"
        height="100%"
        width="100%"
        position="absolute"
        top="0"
        left="0"
        opacity="0"
        aria-hidden="true"
        accept="application/pdf"
        onChange={onChange}
        value={value}
      />
    </Flex>
  );
};
