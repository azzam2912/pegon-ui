import { initIME } from "src/utils/transliterator/pegon/transliterate";
import { transliterateFromView } from "src/utils/transliterator/pegon/transliterateMain";

const usePegonGenericTransliterator =
  (lang) => (inputText, setInputText, isLatinInput, setIsLoading) => {
    const ime = initIME();

    const inputMethodEdit = (text) => {
      const lastSpaceIndex = text.lastIndexOf(" ") + 1;
      const lastWord = text.slice(lastSpaceIndex);
      return text.slice(0, lastSpaceIndex).concat(ime.inputEdit(lastWord));
    };

    const transliterate = (useLatinInput) => {
      if (!useLatinInput) {
        setInputText(inputMethodEdit(inputText));
      }
      const transliterateResult = transliterateFromView(
        inputText,
        useLatinInput,
        lang,
      );
      return {
        outputText: transliterateResult.translitrateResult,
        standardLatin: transliterateResult.standardLatin,
      };
    };

    return transliterate(isLatinInput);
  };

export const usePegonIndonesianTransliterator =
  usePegonGenericTransliterator("Indonesian");
export const usePegonJavaneseTransliterator =
  usePegonGenericTransliterator("Jawa");
export const usePegonSundaneseTransliterator =
  usePegonGenericTransliterator("Sunda");
export const usePegonMadureseTransliterator =
  usePegonGenericTransliterator("Madura");
