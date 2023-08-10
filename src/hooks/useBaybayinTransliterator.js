import { useEffect, useState } from "react";
import { initIME,
         fromLatin,
         toLatin,
         toStandardLatin } from "src/utils/transliterator/baybayin/transliterate";

const useBaybayinTransliterator = () => {
  const [stemmingType, setStemmingType] = useState("Indonesia");
  const [leftText, setLeftText] = useState("");
  const [standardLatin, setStandardLatin] = useState("");
  const [rightText, setRightText] = useState("");
  const [labels, setLabels] = useState({
    left: "Latin",
    right: "Baybayin",
  });

  const ime = initIME();

  function inputMethodEdit(text) {
    const lastSpaceIndex = text.lastIndexOf(" ") + 1;
    const lastWord = text.slice(lastSpaceIndex);
    return text.slice(0, lastSpaceIndex).concat(ime.inputEdit(lastWord));
  }

  const funcLatin = () => {
    const transliterateResult = fromLatin(leftText);
    setRightText(transliterateResult);
    setStandardLatin(toStandardLatin(transliterateResult));
  };

  const funcNonLatin = () => {
    setLeftText(inputMethodEdit(leftText));
    const transliterateResult = toLatin(leftText);
    setRightText(transliterateResult);
    setStandardLatin(toStandardLatin(transliterateResult));
  };

  const usedFunc = labels.left === "Latin" ? funcLatin : funcNonLatin;

  const onChange = (e) => {
    setLeftText(e.target.value);
  };

  useEffect(() => {
    usedFunc();
  }, [leftText, rightText, stemmingType]);

  const onSwitch = () => {
    const tempLeft = leftText;
    setLeftText(rightText);
    setRightText(tempLeft);
    const tempLabel = labels.left;
    setLabels({
      left: labels.right,
      right: tempLabel,
    });
  };

  return {
    stemmingType,
    setStemmingType,
    leftText,
    rightText,
    labels,
    onChange,
    onSwitch,
  };
};

export default useBaybayinTransliterator;
