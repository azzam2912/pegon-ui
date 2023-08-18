import { initIME } from "src/utils/transliterator/pegon/transliterate";
import { transliterateFromView } from "src/utils/transliterator/pegon/transliterateMain";

const usePegonTransliterator = (
  variant,
  inputText,
  setInputText,
  isLatinInput,
) => {
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
      variant,
    );
    return {
      outputText: transliterateResult.translitrateResult,
      standardLatin: transliterateResult.standardLatin,
    };
  };

  return transliterate(isLatinInput);
};

export default usePegonTransliterator;
