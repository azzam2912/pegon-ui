import type { PlainRule, RegexRule, Rule, InputMethodEditor } from "../core";
import {
  prepareRules,
  chainRule,
  ruleProduct,
  makeTransitive,
  transliterate,
  debugTransliterate,
  escape,
  isPlain,
  wordDelimitingPatterns,
  asWordBeginning,
  asWordEnding,
  asNotWordBeginning,
  asNotWordEnding,
  asInverse,
  patternList,
  genericIMEInit,
  fillTemplate,
  toSingleWord,
  toWordBeginning,
  toWordEnding,
  separate,
  getKeys,
  getValues,
  before,
  after,
  ruleKeyLengthDiff,
  stringLengthDiff,
  toRegexRule,
} from "../core";

// O means obsolete
// L means Low, H means High, M means Mid
const enum Thai {
  KoKaiM = "ก",

  KhoKhaiH = "ข",
  KhoKhuatHO = "ข",
  KhoKhwaiL = "ค",
  KhoKhonLO = "ฅ",
  KhoRakhangL = "ฆ",

  NgoNguL = "ง",

  ChoChanM = "จ",
  ChoChingH = "ฉ",
  ChoChangL = "ช",
  ChoChoeL = "ฌ",

  YoYingL = "ญ",
  YoYakL = "ย",

  DoChadaM = "ฎ",
  DoDekM = "ด",

  ToPatakM = "ฏ",
  ToTaoM = "ต",

  ThoThanH = "ฐ",
  ThoThungH = "ถ",
  ThoMonthoL = "ฑ",
  ThoPhuThaoL = "ฒ",
  ThoThahanL = "ท",
  ThoThongL = "ธ",

  NoNenL = "ณ",
  NoNuL = "น",

  BoBaimaiM = "บ",
  PoPlaM = "ป",

  PhoPhuengH = "ผ",
  PhoPhanL = "พ",
  PhoSamphaoL = "ภ",

  FoFaH = "ฝ",
  FoFanL = "ฟ",

  MoMaL = "ม",

  RoRueaL = "ร",

  LoLingL = "ล",
  LoChulaL = "ฬ",

  WoWaenL = "ว",

  SoSalaH = "ศ",
  SoRuesiH = "ษ",
  SoSueaH = "ส",
  SoSoL = "ซ",

  HoHipH = "ห",
  HoNokHukL = "ฮ",

  OAng = "อ",
  // vowel symbols
  NomNang = "ะ",
  MaiHanAkat = "ั",
  MaiTaikhu = "็",
  LakKhang = "า",
  LakKhangYao = "ๅ",
  FonThong = "̍",
  FanNu = "̎",
  Nikhahit = "ํ",

  _i = "ิ",
  _ii = "ี",
  _ue = "ึ",
  _uee = "ื",
  _u = "ุ",
  _uu = "ู",
  _e = "เ",
  _ae = "แ",
  _o = "โ",
  _aii = "ใ",
  _ai = "ไ",
  _am = "ำ",
  _r = "ฤ",
  _l = "ฦ",

  // punctuation
  PaiyanNoi = "ฯ",
  MaiYamok = "ๆ",
  FongMan = "๏",
  AngkhanKhu = "๚",
  KhoMut = "๛",
  Thanthakhat = "์",

  // numbers
  Zero = "๐",
  One = "๑",
  Two = "๒",
  Three = "๓",
  Four = "๔",
  Five = "๕",
  Six = "๖",
  Seven = "๗",
  Eight = "๘",
  Nine = "๙",

  // tones
  MaiEk = "่",
  MaiTho = "้",
  MaiTri = "๊",
  MaiChattawa = "๋",
}

const Consonants: PlainRule[] = [
  ["k_h/", Thai.KhoKhaiH],
  ["k_h\\", Thai.KhoKhwaiL],

  ["k", Thai.KoKaiM],

  ["g_h\\", Thai.KhoRakhangL],
  ["n_g/", Thai.HoHipH + Thai.NgoNguL],
  ["n_g\\", Thai.NgoNguL],

  ["c_h/", Thai.ChoChingH],
  ["c_h\\", Thai.ChoChangL],
  ["c_h", Thai.ChoChanM],

  ["j_h\\", Thai.ChoChoeL],

  ["y_n/", Thai.HoHipH + Thai.YoYingL],
  ["y_n\\", Thai.YoYingL],

  ["y/", Thai.HoHipH + Thai.YoYakL],
  ["y\\", Thai.YoYakL],
  ["y", Thai.OAng + Thai.YoYakL],

  ["d", Thai.DoChadaM],
  ["d_t", Thai.DoDekM],

  ["t", Thai.ToPatakM],
  ["t_t", Thai.ToTaoM],

  ["t_h/", Thai.ThoThanH],
  ["t_t/", Thai.ThoThungH],

  ["t_d\\", Thai.ThoMonthoL],
  ["t_h\\", Thai.ThoPhuThaoL],
  ["d_h\\", Thai.ThoThongL],
  ["d\\", Thai.ThoThahanL],

  ["n_n\\", Thai.NoNenL],
  ["n/", Thai.HoHipH + Thai.NoNuL],
  ["n\\", Thai.NoNuL],

  ["p_h/", Thai.PhoPhuengH],
  ["p_h\\", Thai.PhoPhanL],
  ["b_h\\", Thai.PhoSamphaoL],

  ["b", Thai.BoBaimaiM],
  ["p", Thai.PoPlaM],

  ["f/", Thai.FoFaH],
  ["f\\", Thai.FoFanL],

  ["m/", Thai.HoHipH + Thai.MoMaL],
  ["m\\", Thai.MoMaL],

  ["r/", Thai.HoHipH + Thai.RoRueaL],
  ["r\\", Thai.RoRueaL],

  ["l/", Thai.HoHipH + Thai.LoLingL],
  ["l\\", Thai.LoLingL],

  ["l_n\\", Thai.LoChulaL],
  ["w/", Thai.HoHipH + Thai.WoWaenL],
  ["w\\", Thai.WoWaenL],

  ["s_s/", Thai.SoSalaH],
  ["s_t/", Thai.SoRuesiH],
  ["s/", Thai.SoSueaH],
  ["s\\", Thai.SoSoL],

  ["h/", Thai.HoHipH],
  ["h\\", Thai.HoNokHukL],

  ["'", Thai.OAng],
];

const Tones: PlainRule[] = [
  ["1", Thai.MaiEk],
  ["2", Thai.MaiTho],
  ["3", Thai.MaiTri],
  ["4", Thai.MaiChattawa],
];

const LatinConsonants: string[] = getKeys<PlainRule>(Consonants)
  .map(escape)
  .sort(stringLengthDiff);

const LatinTones: string[] = getKeys<PlainRule>(Tones).map(escape).sort();

const ThaiConsonants: string[] = getValues<PlainRule>(Consonants)
  .map(escape)
  .sort(stringLengthDiff);

const ThaiTones: string[] = getValues<PlainRule>(Tones).map(escape).sort();

const OpenSyllableVowelsTemplate: PlainRule[] = (
  [
    // diphthongs
    ["iaa", `${Thai._e}CT${Thai._ii}${Thai.YoYakL}`],
    ["ia", `${Thai._e}CT${Thai._ii}${Thai.YoYakL}${Thai.NomNang}`],
    ["uuea", `${Thai._e}CT${Thai._uee}${Thai.OAng}`],
    ["uea", `${Thai._e}CT${Thai._uee}${Thai.OAng}${Thai.NomNang}`],
    ["uaa", `CT${Thai.MaiHanAkat}${Thai.WoWaenL}`],
    ["ua", `CT${Thai.MaiHanAkat}${Thai.WoWaenL}${Thai.NomNang}`],
    ["aii", `${Thai._aii}CT`],
    ["ai", `${Thai._ai}CT`],
    ["aiy", `${Thai._ai}CT${Thai.YoYakL}`],
    // actually just vowel + w or y, but for completion's sake
    // TODO: decide to keep this or simply let it be parsed using regular w
    // phonetic diphthongs, long
    ["eeo", `${Thai._e}CT${Thai.WoWaenL}`],
    ["aaeo", `${Thai._ae}CT${Thai.WoWaenL}`],
    ["aao", `CT${Thai.LakKhang}${Thai.WoWaenL}`],
    ["iaao", `${Thai._e}CT${Thai._ii}${Thai.YoYakL}${Thai.WoWaenL}`],
    ["aay", `CT${Thai.LakKhang}${Thai.YoYakL}`],
    ["aawy", `CT${Thai.OAng}${Thai.YoYakL}`],
    ["ooy", `${Thai._o}CT${Thai.YoYakL}`],
    ["ooey", `${Thai._e}CT${Thai.YoYakL}`],
    ["uaay", `CT${Thai.MaiHanAkat}${Thai.WoWaenL}${Thai.YoYakL}`],
    ["uueay", `${Thai._e}CT${Thai._uee}${Thai.OAng}${Thai.YoYakL}`],
    // phonetic diphthongs, short
    ["io", `CT${Thai._i}${Thai.WoWaenL}`],
    ["eo", `${Thai._e}CT${Thai.MaiHanAkat}${Thai.WoWaenL}`],
    ["ao", `${Thai._e}CT${Thai.LakKhang}`],
    // [??, `CT${Thai.MaiHanAkat}${Thai.YoYakL}`],
    // this should be automatic from "ay"
    ["awy", `CT${Thai.MaiTaikhu}${Thai.OAng}${Thai.YoYakL}`],
    ["uy", `CT${Thai._u}${Thai.YoYakL}`],
    // base vowels, long
    ["aaw", `CT${Thai.OAng}`],
    ["aae", `${Thai._ae}CT`],
    ["ooe", `${Thai._e}CT${Thai.OAng}`],
    ["uue", `CT${Thai._uee}${Thai.OAng}`],
    ["aa", `CT${Thai.LakKhang}`],
    ["ee", `${Thai._e}CT`],
    ["ii", `CT${Thai._ii}`],
    ["oo", `${Thai._o}CT`],
    ["uu", `CT${Thai._uu}`],

    // base vowels, short
    ["ae", `${Thai._ae}CT${Thai.NomNang}`],
    ["aw", `${Thai._e}CT${Thai.LakKhang}${Thai.NomNang}`],
    ["oe", `${Thai._e}CT${Thai.OAng}${Thai.NomNang}`],
    ["ue", `CT${Thai._ue}`],
    ["i", `CT${Thai._i}`],
    ["u", `CT${Thai._u}`],
    ["o", `${Thai._o}CT${Thai.NomNang}`],
    ["e", `${Thai._e}CT${Thai.NomNang}`],
    ["a", `CT`],
  ] as PlainRule[]
).map(([key, val]: PlainRule): PlainRule => ["CT" + key, val] as PlainRule);

const OpenSyllableVowels: RegexRule[] = fillTemplate(
  OpenSyllableVowelsTemplate.sort(ruleKeyLengthDiff),
  [
    ["C", `((${patternList(LatinConsonants).source})+)`],
    ["T", `(${patternList(LatinTones).source})?`],
  ],
  [
    ["C", "$1"],
    ["T", "$3"],
  ],
).map(toSingleWord);

const ClosedSyllableVowelsTemplate: PlainRule[] = (
  [
    // diphthongs
    ["iaa", `${Thai._e}CT${Thai._ii}${Thai.YoYakL}X`],
    ["uuea", `${Thai._e}CT${Thai._uee}${Thai.OAng}X`],
    ["uaa", `CT${Thai.WoWaenL}X`],

    // base vowels, long
    ["aaw", `CT${Thai.OAng}X`],
    ["aae", `${Thai._ae}CTX`],
    ["ooe", `${Thai._e}CT${Thai._i}X`],
    ["uue", `CT${Thai._uee}X`],
    ["aa", `CT${Thai.LakKhang}X`],
    ["ee", `${Thai._e}CTX`],
    ["ii", `CT${Thai._ii}X`],
    ["oo", `${Thai._o}CTX`],
    ["uu", `CT${Thai._uu}X`],

    // base vowels, short
    ["ae", `${Thai._ae}CT${Thai.MaiTaikhu}X`],
    ["aw", `CT${Thai.MaiTaikhu}${Thai.OAng}X`],
    ["ue", `CT${Thai._ue}X`],
    ["i", `CT${Thai._i}`],
    ["u", `CT${Thai._u}X`],
    ["o", `CTX`],
    ["e", `${Thai._e}CT${Thai.MaiTaikhu}X`],
    ["a", `CT${Thai.MaiHanAkat}X`],
  ] as PlainRule[]
).map(([key, val]: PlainRule): PlainRule => ["CT" + key + "X", val]);

const ClosedSyllableVowels: RegexRule[] = fillTemplate(
  ClosedSyllableVowelsTemplate.sort(ruleKeyLengthDiff),
  [
    ["C", `((${patternList(LatinConsonants).source})+)`],
    ["T", `(${patternList(LatinTones).source})?`],
    ["X", `(${patternList(LatinConsonants).source})`],
  ],
  [
    ["C", `$1`],
    ["T", `$3`],
    ["X", `$4`],
  ],
).map(toSingleWord);

const Punctuation: PlainRule[] = [
  ["-", "\u200C"],
  [" ", "\u200C"],
  [".", " "],
];
const InversePunctuation: PlainRule[] = chainRule<PlainRule>(
  asInverse(Punctuation.reverse()),
  [
    [`${Thai.PaiyanNoi}${Thai.LoLingL}${Thai.PaiyanNoi}`, " etc"],
    [Thai.MaiYamok, "2"],
    [Thai.PaiyanNoi, "."],
  ],
);

const Numbers: PlainRule[] = [
  ["0", Thai.Zero],
  ["1", Thai.One],
  ["2", Thai.Two],
  ["3", Thai.Three],
  ["4", Thai.Four],
  ["5", Thai.Five],
  ["6", Thai.Six],
  ["7", Thai.Seven],
  ["8", Thai.Eight],
  ["9", Thai.Nine],
];

const SpecialSanskritEnding: PlainRule = ["am", Thai._am];
const SpecialSanskritVowels: PlainRule[] = [
  ["ruue", Thai._r + Thai.LakKhangYao],
  ["luue", Thai._l + Thai.LakKhangYao],
  ["rue", Thai._r],
  ["lue", Thai._l],
];
const SpecialSanskrit: Rule[] = [
  toWordEnding(SpecialSanskritEnding),
  ...SpecialSanskritVowels,
];
const InverseSpecialSanskrit: Rule[] = asInverse([
  SpecialSanskritEnding,
  ...SpecialSanskritVowels,
]);

const SpecialWords: PlainRule[] = [["kaaw", Thai.KoKaiM + Thai.MaiTaikhu]];

// second pass
const SpecialFromLatin: RegexRule[] = [
  after(
    new RegExp(
      patternList(ThaiConsonants).source +
        `(${patternList(ThaiTones).source})?`,
    ),
    [`${Thai.MaiHanAkat}${Thai.OAng}`, `${Thai.NomNang}`],
  ),
];

const ThaiVowelPrefixLetters: string[] = [];
const ThaiVowelSuffixLetters: string[] = [];

{
  let a: string[] = [];
  let b: string[] = [];

  for (const [_, val] of OpenSyllableVowelsTemplate) {
    if (!(val.startsWith("CT") || val.endsWith("CT"))) {
      const [prefix, suffix] = val.split("CT", 2);
      a.push(prefix);
      b.push(suffix);
    }
  }

  a = [...new Set(a)].sort(stringLengthDiff);
  b = [...new Set(b)].sort(stringLengthDiff);

  ThaiVowelPrefixLetters.push(...a);
  ThaiVowelSuffixLetters.push(...b);
}

const CircumfixSpellingTemplate: PlainRule[] = [
  ["CT\u200cPCTS", "$3$1$2\u200c$4$5$6"],
];

const CircumfixSpelling: RegexRule[] = fillTemplate(
  CircumfixSpellingTemplate,
  [
    ["C", `(${patternList(ThaiConsonants).source})`],
    ["T", `(${patternList(ThaiTones).source})?`],
    ["P", `(${patternList(ThaiVowelPrefixLetters).source})`],
    ["S", `(${patternList(ThaiVowelSuffixLetters).source})`],
  ],
  [],
).map(toSingleWord);
// TODO: special single word spellings

const FromLatinScheme: Rule[] = chainRule<Rule>(
  SpecialWords.map<RegexRule>(toSingleWord),
  ClosedSyllableVowels,
  OpenSyllableVowels,
  [after(patternList(LatinConsonants), ["x", Thai.Thanthakhat])],
  Tones.map(
    (rule: PlainRule): RegexRule => after(patternList(LatinConsonants), rule),
  ),
  prepareRules(Consonants.sort(ruleKeyLengthDiff)),
  Numbers,
  prepareRules(Punctuation),
  SpecialSanskrit,
  // second pass
  SpecialFromLatin,
  CircumfixSpelling,
);

export const fromLatin = (input: string): string =>
  transliterate(input, FromLatinScheme);

const [CircumfixOpenSyllableVowelsTemplate, SuffixOpenSyllableVowelsTemplate] =
  separate(
    OpenSyllableVowelsTemplate,
    ([key, val]: PlainRule): boolean => !val.startsWith("CT"),
  );

const [
  CircumfixClosedSyllableVowelsTemplate,
  SuffixClosedSyllableVowelsTemplate,
] = separate(
  ClosedSyllableVowelsTemplate,
  ([key, val]: PlainRule): boolean => !val.startsWith("CT"),
);

const UnsafeFinalThaiConsonants: string[] = [
  Thai.WoWaenL,
  Thai.OAng,
  Thai.YoYakL,
];

const SafeFinalThaiConsonants: string[] = ThaiConsonants.filter(
  (c: string): boolean => !UnsafeFinalThaiConsonants.includes(c),
);

const InverseSyllableVowels: RegexRule[] = chainRule<PlainRule>(
  fillTemplate(
    asInverse(
      chainRule<PlainRule>(
        (
          [
            ...CircumfixClosedSyllableVowelsTemplate,
            ["CTooeX", `${Thai._e}CT${Thai.OAng}X`],
          ] as PlainRule[]
        ).sort(ruleKeyLengthDiff),
        CircumfixOpenSyllableVowelsTemplate.sort(ruleKeyLengthDiff),
        SuffixClosedSyllableVowelsTemplate.sort(ruleKeyLengthDiff),
        [["CTa", `CT${Thai.NomNang}`]],
        SuffixOpenSyllableVowelsTemplate.sort(ruleKeyLengthDiff),
      ),
    ),
    [
      ["C", `((${patternList(ThaiConsonants).source})+)`],
      ["T", `(${patternList(ThaiTones).source})?`],
      ["X", `(${patternList(SafeFinalThaiConsonants).source})`],
    ],
    [
      ["C", `$1`],
      ["T", `$3`],
      ["X", `$4`],
    ],
  ),
  fillTemplate(
    asInverse(ClosedSyllableVowelsTemplate).sort(ruleKeyLengthDiff),
    [
      ["C", `((${patternList(ThaiConsonants).source})+)`],
      ["T", `(${patternList(ThaiTones).source})?`],
      ["X", `(${patternList(UnsafeFinalThaiConsonants).source})`],
    ],
    [
      ["C", `$1`],
      ["T", `$3`],
      ["X", `$4`],
    ],
  ),
).map(toSingleWord);

const ToLatinScheme: Rule[] = chainRule<Rule>(
  asInverse(SpecialWords).map(toSingleWord),
  [[Thai.Thanthakhat, "x"]],
  InverseSyllableVowels,
  InverseSpecialSanskrit,
  asInverse(Tones).map(
    (rule: PlainRule): RegexRule => after(patternList(ThaiConsonants), rule),
  ),
  asInverse(Consonants).sort(ruleKeyLengthDiff),
  [[/$ /g, ""]],
  asInverse(Numbers),
  InversePunctuation,
);

export const toLatin = (input: string): string =>
  transliterate(input, ToLatinScheme);

const StandardLatinSpecialVowels: RegexRule[] = [
  before(["r\\r\\", "a"], patternList(LatinConsonants)),
  toWordEnding([escape("r\\r\\"), "an"]),
];

const StandardLatinVowels: PlainRule[] = (
  [
    // diphthongs
    ["iaa", "īa"],
    ["ia", "ia"],
    ["uuea", "ư̄a"],
    ["uea", "ưa"],
    ["uaa", "ūa"],
    ["ua", "ua"],
    ["aii", "ai"],
    ["ai", "ai"],
    ["aiy", "ai"],
    ["ay", "ai"],
    // actually just vowel + w or y, but for completion's sake
    // TODO: decide to keep this or simply let it be parsed using regular w
    // phonetic diphthongs, long
    ["eeo", "ēo"],
    ["aaeo", "ǣo"],
    ["aao", "āo"],
    ["iaao", "īao"],
    ["aay", "āy"],
    ["aawy", "ōi"],
    ["ooy", "ōi"],
    ["ooey", "œ̄i"],
    ["uaay", "ūai"],
    ["uueay", "ư̄ai"],
    // phonetic diphthongs, short
    ["io", "io"],
    ["eo", "eo"],
    ["ao", "ao"],
    ["awy", "oi"],
    ["uy", "ui"],
    // base vowels, long
    ["aaw", "ō"],
    ["aae", "ǣ"],
    ["ooe", "œ̄"],
    ["uue", "ư̄"],
    ["aa", "ā"],
    ["ee", "ē"],
    ["ii", "ī"],
    ["oo", "ō"],
    ["uu", "ū"],

    // base vowels, short
    ["ae", "æ"],
    ["aw", "o"],
    ["oe", "œ"],
    ["ue", "ư"],
    ["i", "i"],
    ["u", "u"],
    ["o", "o"],
    ["e", "e"],
    ["a", "a"],
  ] as PlainRule[]
).sort(ruleKeyLengthDiff);

const StandardLatinFinalConsonants: PlainRule[] = [
  ["k_h/", "k"],
  ["k_h\\", "k"],
  ["g_h\\", "k"],

  ["k", "k"],

  ["n_g\\", "ng"],

  ["c_h\\", "t"],
  ["c_h", "t"],

  ["j_h\\", "t"],

  ["y_n\\", "n"],
  // add rules later for cases like phinyo
  ["y\\", "y"],

  ["d", "t"],
  ["d_t", "t"],

  ["t", "t"],
  ["t_t", "t"],

  ["t_h/", "t"],
  ["t_t/", "t"],

  ["t_d\\", "t"],
  ["t_h\\", "t"],
  ["d_h\\", "t"],

  ["d\\", "t"],

  ["n_n\\", "n"],
  ["n\\", "n"],

  ["p_h\\", "p"],
  ["b_h\\", "p"],

  ["b", "p"],
  ["p", "p"],

  ["f\\", "p"],

  ["m\\", "m"],

  ["r\\", "n"],
  ["l\\", "n"],
  ["l_n\\", "n"],

  ["w\\", "w"],

  ["s_s/", "t"],
  ["s_t/", "t"],
  ["s/", "t"],
  ["s\\", "t"],

  ["'", ""],
];

const StandardLatinSonorantFinals: string[] = [
  "ng",
  "m",
  "n",
  "w",
  "y",
  "o",
  "i",
];
const StandardLatinStopFinals: string[] = ["p", "t", "k"];

// v is short vowel, V is long vowel, W is any vowel
// right side: 0 is mid tone, 1 is falling, 2 is low, 3 is high, 4 is rising
// S is sonorant, P is stop/plosive
// consonants: M is mid, L is low, H is high
// X is no consonant
// no tone goes first so that it matches the narrowest rule
// in case any of the other rules reduce the tones and
// make the diacritic disappear
const StandardLatinTonesTemplate: PlainRule[] = [
  // none
  // long vowel
  // high
  ["HVX", "HV4"],
  // low/mid
  ["LVX", "LV0"],
  ["MVX", "MV0"],
  // short vowel
  // low
  ["LvX", "Lv3"],
  // mid/high
  ["MvX", "Mv2"],
  ["HvX", "Hv2"],
  // mai chattawa / tone 4
  ["C4W", "CW4"],
  // mai tri / tone 3
  ["C3W", "CW3"],
  // mai tho / tone 2
  // mid/high
  ["M2W", "MW1"],
  ["H2W", "HW1"],
  // low
  ["L2W", "LW3"],
  // mai ek / tone 1
  // mid/high
  ["M1W", "MW2"],
  ["H1W", "HW2"],
  // low
  ["L1W", "LW1"],

  // no tone mark
  // sonorant
  ["LWS", "LW0S"],
  ["MWS", "MW0S"],

  ["HWS", "HW4S"],
  // plosive
  ["MWP", "MW2P"],
  ["HWP", "HW2P"],

  ["LVP", "LV1P"],
  ["LvP", "Lv3P"],
];

const LatinHighConsonants: string[] = [];
const LatinMidConsonants: string[] = [];
const LatinLowConsonants: string[] = [];

for (const consonant of LatinConsonants) {
  if (consonant.endsWith("/")) {
    LatinHighConsonants.push(consonant);
  } else if (consonant.endsWith("\\")) {
    LatinLowConsonants.push(consonant);
  } else {
    LatinMidConsonants.push(consonant);
  }
}

const StandardLatinAllVowels: string[] = getValues(
  StandardLatinVowels.filter(
    ([key, val]: PlainRule): boolean =>
      // skip dipthongs
      !(key.endsWith("y") || (key != "o" && key != "oo" && key.endsWith("o"))),
  ),
).sort(stringLengthDiff);

const [StandardLatinLongVowels, StandardLatinShortVowels] = separate<string>(
  StandardLatinAllVowels,
  (vowel: string): boolean => vowel.includes("\u0304"), // macron symbol, i.e. ̄
);

const StandardLatinTones: Rule[] = fillTemplate(
  StandardLatinTonesTemplate,
  [
    ["H", `(${patternList(LatinHighConsonants).source})`],
    ["M", `(${patternList(LatinMidConsonants).source})`],
    ["L", `(${patternList(LatinLowConsonants).source})`],
    ["C", `(${patternList(LatinConsonants).source})`],

    ["V", `(${patternList(StandardLatinLongVowels).source})`],
    ["v", `(${patternList(StandardLatinShortVowels).source})`],
    ["W", `(${patternList(StandardLatinAllVowels).source})`],

    ["P", `(${patternList(StandardLatinStopFinals).source})`],
    ["S", `(${patternList(StandardLatinSonorantFinals).source})`],
    ["X", `(?=$|[${wordDelimitingPatterns}])`],
  ],
  [
    ["0", ""],
    ["1", "\u030C"],
    ["2", "\u0300"],
    ["3", "\u0301"],
    ["4", "\u0302"],

    ["H", "$1"],
    ["M", "$1"],
    ["L", "$1"],
    ["C", "$1"],

    ["V", "$2"],
    ["v", "$2"],
    ["W", "$2"],

    ["P", "$3"],
    ["S", "$3"],
  ],
).map(toRegexRule);

const MonographStandardLatinVowel: string[] = StandardLatinAllVowels.filter(
  (v: string): boolean => v.length == 1,
);

const StandardLatinDiacriticRepositioning: RegexRule[] = fillTemplate(
  [["(V)(\u0304)?((W)+)(X)", "$1$2$5$3"]],
  [
    ["V", patternList(MonographStandardLatinVowel).source],
    ["W", patternList(["m", ...MonographStandardLatinVowel]).source],
    ["X", patternList(["\u030C", "\u0300", "\u0301", "\u0302"]).source],
  ],
  [],
).map(toRegexRule);

const StandardLatinConsonants: Rule[] = [
  ["k_h/", "kh"],
  ["k_h\\", "kh"],
  ["g_h\\", "kh"],

  ["k", "k"],

  ["n_g\\", "ng"],

  ["c_h/", "ch"],
  ["c_h\\", "ch"],
  ["c_h", "ch"],

  ["j_h\\", "ch"],

  ["y_n\\", "y"],
  ["y\\", "y"],

  ["d", "d"],
  ["d_t", "d"],

  ["t", "t"],
  ["t_t", "t"],

  ["t_h/", "th"],
  ["t_t/", "th"],

  ["t_d\\", "th"],
  ["t_h\\", "th"],
  ["d_h\\", "th"],
  ["d\\", "th"],

  ["n_n\\", "n"],
  ["n\\", "n"],

  ["p_h/", "ph"],
  ["p_h\\", "ph"],
  ["b_h\\", "ph"],

  ["b", "b"],
  ["p", "p"],

  ["f/", "f"],
  ["f\\", "f"],

  ["m\\", "m"],

  ["r\\", "r"],
  ["l\\", "l"],
  ["l_n\\", "l"],

  ["w\\", "w"],

  ["s_s/", "s"],
  ["s_t/", "s"],
  ["s/", "s"],
  ["s\\", "s"],

  ["h/", "h"],
  ["h\\", "h"],
  ["'", ""],
];

const StandardLatinScheme: Rule[] = chainRule<Rule>(
  [
    ["-", ""],
    [`(${patternList(LatinConsonants).source})x`, ""],
  ],
  StandardLatinSpecialVowels,
  asWordEnding(StandardLatinFinalConsonants),
  StandardLatinVowels,
  StandardLatinTones,
  prepareRules(StandardLatinConsonants),
  StandardLatinDiacriticRepositioning,
);

export const toStandardLatin = (input: string): string =>
  transliterate(input, StandardLatinScheme);

const IMEScheme: Rule[] = [[" ", "\u200C"]];

export const initIME = genericIMEInit(IMEScheme);
