const scriptsData = {
  Pegon: {
    variants: ["Indonesian", "Javanese", "Madurese"],
    rightToLeft: true,
  },
  Jawi: {
    variants: ["Malay", "Cham"],
    rightToLeft: true,
  },
  Cham: {
    variants: [],
    rightToLeft: false,
  },
  Baybayin: {
    variants: ["Baybayin", "Buhid", "Hanuno'o", "Tagbanwa"],
    rightToLeft: false,
  },
  "Kayah Li": {
    variants: [],
    rightToLeft: false,
  },
};

const variantsStyles = {
  "Cham undefined": {
    fontFamily: "Noto Sans Cham",
  },
  "Baybayin Baybayin": {
    fontFamily: "Noto Sans Tagalog",
  },
  "Baybayin Buhid": {
    fontFamily: "Noto Sans Buhid",
  },
  "Baybayin Hanuno'o": {
    fontFamily: "Noto Sans Hanunoo",
  },
  "Baybayin Tagbanwa": {
    fontFamily: "Noto Sans Tagbanwa",
  },
  "Kayah Li undefined": {
    fontFamily: "Noto Sans Kayah Li",
  },
};

export { scriptsData, variantsStyles };
