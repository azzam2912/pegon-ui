import { useEffect, useState } from "react";
import { initIME } from "src/utils/transliterator/transliterate";
import { transliterateFromView } from "src/utils/transliterator/transliterateMain";


// TODO: Replace with jawi cham transliterator
const useJawiChamTransliterator = () => {
  const [stemmingType, setStemmingType] = useState("Indonesia");
  const [leftText, setLeftText] = useState("");
  const [standardLatin, setStandardLatin] = useState("");
  const [rightText, setRightText] = useState("");
  const [labels, setLabels] = useState({
    left: "Latin",
    right: "Jawi Cham",
  });

  const ime = initIME();

  function inputMethodEdit(text) {
    const lastSpaceIndex = text.lastIndexOf(" ") + 1;
    const lastWord = text.slice(lastSpaceIndex);
    return text.slice(0, lastSpaceIndex).concat(ime.inputEdit(lastWord));
  }

  const funcLatin = () => {
    const transliterateResult = transliterateFromView(
      leftText,
      true,
      stemmingType
    );
    setRightText(transliterateResult.translitrateResult);
    setStandardLatin(transliterateResult.standardLatin);
  };

  const funcPegon = () => {
    setLeftText(inputMethodEdit(leftText));
    const transliterateResult = transliterateFromView(
      leftText,
      false,
      stemmingType
    );
    setRightText(transliterateResult.translitrateResult);
    setStandardLatin(transliterateResult.standardLatin);
  };

  const usedFunc = labels.left === "Latin" ? funcLatin : funcPegon;

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

export default useJawiChamTransliterator;
