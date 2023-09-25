const scriptsData = {
  "Mon-Burmese": {
    variants: ["Myanmar", "Mon", "Kayah Li", "S'gaw Karen"],
    rightToLeft: false,
  },
  Cham: {
    variants: [],
    rightToLeft: false,
  },
  Sukhothai: {
    variants: ["Thai", "Lao"],
    rightToLeft: false,
  },
  Jawi: {
    variants: ["Malay", "Cham"],
    rightToLeft: true,
  },
  Batak: {
    variants: ["Toba", "Karo", "Simalungun", "Angkola-Mandailing", "Pakpak"],
    rightToLeft: false,
  },
  Rejang: {
    variants: [],
    rightToLeft: false,
  },
  Pegon: {
    variants: ["Indonesian", "Javanese", "Madurese", "Sundanese"],
    rightToLeft: true,
  },
  Lontara: {
    variants: ["Bugis", "Makassar"],
    rightToLeft: false,
  },
  Baybayin: {
    variants: ["Baybayin", "Buhid", "Hanuno'o", "Tagbanwa"],
    rightToLeft: false,
  },
  Hanacaraka: {
    variants: ["Javanese", "Sundanese", "Balinese", "Sasak"],
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
    case "Mon-Burmese":
      switch (variant) {
        case "Myanmar":
          return "Noto Sans Myanmar";
        case "S'gaw Karen":
          return "Noto Sans Myanmar";
        case "Mon":
          return "Noto Sans Myanmar";
        case "Kayah Li":
          return "Noto Sans Kayah Li";
      }
      break;
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
    case "Batak":
      return "Noto Sans Batak";
    case "Lontara":
      switch (variant) {
        case "Bugis":
          return "Noto Sans Buginese";
        case "Makassar":
          return "Noto Serif Makasar";
      }
      break;
    case "Rejang":
      return "Noto Sans Rejang";
    case "Sukhothai":
      switch (variant) {
        case "Thai":
          return "Noto Serif Thai";
        case "Lao":
          return "Noto Serif Lao";
      }
      break;
    case "Carakan":
      return "Noto Sans Javanese";
    case "Sunda":
      return "Noto Sans Sundanese";
    case "Bali":
      switch (variant) {
        case "Balinese":
          return "Noto Sans Balinese";
        case "Sasak":
          return "Noto Sans Balinese";
      }
  }
};

export { scriptsData, getFont };
