const scriptsData = {
  "Mon-Burmese": {
    variants: ["Mon", "Kayah Li"],
    rightToLeft: false,
  },
  Cham: {
    variants: [],
    rightToLeft: false,
  },
  Sukhothai: {
    variants: ["Thai"],
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
      }
      break;
  }
};

export { scriptsData, getFont };