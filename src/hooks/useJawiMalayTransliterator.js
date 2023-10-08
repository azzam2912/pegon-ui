import axios from "axios";

const useJawiMalayTransliterator = async (
  inputText,
  setInputText,
  isLatinInput,
  setIsLoading,
) => {
  const req = {
    text: inputText,
    mode : isLatinInput ? "/r2j" : "/j2r"
  };

  const apiEndpoint = "/api/trans-jawi" 

  try {
    const response = await axios.post(apiEndpoint, req);
    setIsLoading(true);
    const outputText = isLatinInput ? response.data.jawi : response.data.rumi;
    return { outputText: outputText, standardLatin: isLatinInput? inputText : outputText };
  } catch (error) {
    console.error("Error: ", error);
    return { outputText: "" };
  } finally {
    setIsLoading(false);
  }
};

export default useJawiMalayTransliterator;
