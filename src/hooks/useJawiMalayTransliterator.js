import axios from "axios";

const useJawiMalayTransliterator = async (
  inputText,
  setInputText,
  isLatinInput,
  setIsLoading,
) => {
  const req = {
    text: inputText,
  };

  const baseURL = process.env.NEXT_PUBLIC_ML_API_HOST;
  const apiEndpoint = isLatinInput ? "/r2j" : "/j2r";
  const url = baseURL + apiEndpoint;

  try {
    const response = await axios.post(url, req);
    setIsLoading(true);
    const outputText = isLatinInput ? response.data.jawi : response.data.rumi;
    return { outputText: outputText };
  } catch (error) {
    console.error("Error: ", error);
    return { outputText: "" };
  } finally {
    setIsLoading(false);
  }
};

export default useJawiMalayTransliterator;
