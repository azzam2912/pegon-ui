import { useEffect, useState } from "react";
import { transliterateLatinToBaybayin, transliterateBaybayinToLatin } from "src/utils/transliterator/baybayintrans"


const useBaybayinTransliterator = () => {
  const [stemmingType, setStemmingType] = useState("Indonesia");
  const [leftText, setLeftText] = useState("");
  const [standardLatin, setStandardLatin] = useState("");
  const [rightText, setRightText] = useState("");
  const [labels, setLabels] = useState({
    left: "Latin",
    right: "Baybayin",
  });

  const funcLatin = () => {
    const transliterateResult = transliterateLatinToBaybayin(leftText);
    setRightText(transliterateResult);
  };

  const funcPegon = () => {
    const transliterateResult = transliterateBaybayinToLatin(leftText);
    setRightText(transliterateResult);
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

export default useBaybayinTransliterator;
