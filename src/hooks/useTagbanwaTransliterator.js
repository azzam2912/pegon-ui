import {
  initIME,
  fromLatin,
  toLatin,
  toStandardLatin,
} from "src/utils/transliterator/tagbanwa/transliterate";

const useTagbanwaTransliterator = (inputText, setInputText, isLatinInput) => {
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
    const outputText = useLatinInput
      ? fromLatin(inputText)
      : toLatin(inputText);
    const standardLatin = toStandardLatin(outputText);
    return { outputText, standardLatin };
  };

  return transliterate(isLatinInput);
};

export default useTagbanwaTransliterator;
