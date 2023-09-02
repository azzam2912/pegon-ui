const scriptsData = {
  Pegon: {
    variants: ["Indonesian", "Javanese", "Madurese", "Sundanese"],
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

const getFont = (script, variant) => {
  switch (script) {
    case "Pegon":
      return "Noto Naskh Arabic";
    case "Jawi":
      return "Noto Naskh Arabic";
    case "Cham":
      return "Noto Sans Cham";
    case "Kayah Li":
      return "Noto Sans Kayah Li";
    case "Baybayin":
      switch (variant) {
        case "Baybayin":
          return "Noto Sans Tagalog";
        case "Buhid":
          return "Noto Sans Buhid";
        case "Hanuno'o":
          return "Noto Sans Hanunoo";
        case "Tagbanwa":
          return "Noto Sans Tagbanwa";
      }
      break;
  }
};

export { scriptsData, getFont };
