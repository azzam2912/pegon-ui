import { useEffect, useState } from "react";
import { initIME } from "src/utils/transliterator/transliterate";
import { transliterateFromView } from "src/utils/transliterator/transliterateMain";

const axios = require("axios");

const useJawiMalayTransliterator = () => {
  const [leftText, setLeftText] = useState("");
  const [rightText, setRightText] = useState("");
  const [labels, setLabels] = useState({
    left: "Latin",
    right: "Jawi Malay",
  });
  const [loading, setLoading] = useState(false);

  const j2rUrl = "https://6b02-34-87-30-209.ngrok.io/j2r";
  const r2jUrl = "https://6b02-34-87-30-209.ngrok.io/r2j";

  const funcLatin = () => {
    setLoading(true);
    const req = {
      text: leftText,
    };

    axios
      .post(r2jUrl, req)
      .then((res) => {
        console.log("res:", res.data.jawi);
        setRightText(res.data.jawi);
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        setLoading(false); // Set loading back to false
      });
  };

  const funcJawi = () => {
    setLoading(true);
    const req = {
      text: leftText,
    };

    axios
      .post(j2rUrl, req)
      .then((res) => {
        console.log("res:", res.data.rumi);
        setRightText(res.data.rumi);
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        setLoading(false); // Set loading back to false
      });
  };

  const usedFunc = labels.left === "Latin" ? funcLatin : funcJawi;

  const onChange = (e) => {
    setLeftText(e.target.value);
  };

  useEffect(() => {
    usedFunc();
  }, [leftText, rightText]);

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
    leftText,
    rightText,
    labels,
    onChange,
    onSwitch,
    loading,
  };
};

export default useJawiMalayTransliterator;
