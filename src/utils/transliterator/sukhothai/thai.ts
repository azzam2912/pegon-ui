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

  // punctuation
  PaiyanNoi = "ฯ",
  MaiYamok = "ๆ",
  FongMan = "๏",
  AngkhanKhu = "๚",
  KhoMut = "๛",

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

const Consonants: PlainRule = [
  ["k_h/", Thai.KhoKhaiH],
  ["k_h\\", Thai.KhoKhwaiL],

  ["k", Thai.KoKaiM],

  ["g_h\\", Thai.KhoRakhangL],
  ["n_g\\", Thai.NgoNguL],

  ["c_h/", Thai.ChoChingH],
  ["c_h\\", Thai.ChoChangL],
  ["c_h", Thai.ChoChanM],

  ["j_h\\", Thai.ChoChoeL],

  ["y_n\\", Thai.YoYingL],
  ["y\\", Thai.YoYakL],

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
  ["n\\", Thai.NoNuL],

  ["p_h/", Thai.PhoPhuengH],
  ["p_h\\", Thai.PhoPhanL],
  ["b_h\\", Thai.PhoSamphaoL],

  ["b", Thai.BoBaimaiM],
  ["p", Thai.PoPlaM],

  ["f/", Thai.FoFaH],
  ["f\\", Thai.FoFanL],

  ["m\\", Thai.MoMaL],

  ["r\\", Thai.RoRueaL],
  ["l\\", Thai.LoLingL],

  ["w\\", Thai.WoWaenL],

  ["s_s/", Thai.SoSalaH],
  ["s_t/", Thai.SoRuesiH],
  ["s/", Thai.SoSueaH],
  ["s\\", Thai.SoSoL],
  ["h/", Thai.HoHipH],
  ["h\\", Thai.HoNokHukL],
  ["'", Thai.OAng],
];

const ruleKeyLengthDiff = ([a, _]: PlainRule, [b, __]: PlainRule): number =>
  b.length - a.length;

const LatinConsonants: string[] = prepareRules(Consonants)
  .map(([key, _]: PlainRule): string => key)
  .sort();

const toVowelOfOpenSyllable = ([key, val]: PlainRule): RegexRule => [
  new RegExp(`(${patternList(LatinConsonants).source})(${key})`),
  val,
];

const toVowelOfClosedSyllable = ([key, val]: PlainRule): RegexRule => [
  new RegExp(
    `(${patternList(LatinConsonants).source})(${key})(${
      patternList(LatinConsonants).source
    })`,
  ),
  val,
];

const OpenSyllableVowels: RegexRule[] = [
  // diphthongs
  ["iaa", `${Thai._e}$1${Thai._ii}${Thai.YoYakL}`],
  ["ia", `${Thai._e}$1${Thai._ii}${Thai.YoYakL}${Thai.NomNang}`],
  ["ueaa", `${Thai._e}$1${Thai._uee}${Thai.OAng}`],
  ["uea", `${Thai._e}$1${Thai._uee}${Thai.OAng}${Thai.NomNang}`],
  ["uaa", `$1${Thai.MaiHanAkat}${Thai.WoWaenL}`],
  ["ua", `$1${Thai.MaiHanAkat}${Thai.WoWaenL}${Thai.NomNang}`],
  ["aii", `${Thai._aii}$1`],
  ["ai", `${Thai._ai}$1`],
  ["aiy", `${Thai._ai}$1${Thai.YoYakL}`],

  // actually just vowel + w or y, but for completion's sake
  // TODO: decide to keep this or simply let it be parsed using regular w
  // phonetic diphthongs, long
  ["eeo", `${Thai._e}$1${Thai.WoWaenL}`],
  ["aaeo", `${Thai._e}${Thai._e}$1${Thai.WoWaenL}`],
  ["aao", `$1${Thai.LakKhang}${Thai.WoWaenL}`],
  ["iaao", `${Thai._e}$1${Thai._ii}${Thai.YoYakL}${Thai.WoWaenL}`],
  ["aay", `$1${Thai.LakKhang}${Thai.YoYakL}`],
  ["aawy", `$1${Thai.OAng}${Thai.YoYakL}`],
  ["ooy", `${Thai._o}$1${Thai.YoYakL}`],
  ["ooey", `${Thai._e}$1${Thai.YoYakL}`],
  ["uaay", `$1${Thai.MaiHanAkat}${Thai.WoWaenL}${Thai.YoYakL}`],
  ["ueaai", `${Thai._e}$1${Thai._uee}${Thai.OAng}${Thai.YoYakL}`],
  // phonetic diphthongs, short
  ["io", `$1${Thai._i}${Thai.WoWaenL}`],
  ["eo", `${Thai._e}$1${Thai.MaiHanAkat}${Thai.WoWaenL}`],
  ["ao", `${Thai._e}$1$${Thai.LakKhang}`],
  // TODO: what to do about Mai Han Akat + Yo Yak version of "ai"
  // [??, `$1${Thai.MaiHanAkat}${Thai.YoYakL}`],
  ["awy", `$1${Thai.MaiTaikhu}${Thai.OAng}${Thai.YoYakL}`],
  ["uy", `$1${Thai._u}${Thai.YoYakL}`],
  // base vowels, long
  ["aaw", `$1${Thai.OAng}`],
  ["aae", `${Thai._e}${Thai._e}$1`],
  ["ooe", `${Thai._e}$1${Thai.OAng}`],
  ["uue", `$1${Thai._uee}${Thai.OAng}`],
  ["aa", `$1${Thai.LakKhang}`],
  ["ee", `${Thai._e}$1`],
  ["ii", `$1${Thai._ii}`],
  ["oo", `${Thai._o}$1`],
  ["uu", `$1${Thai._uu}`],

  // base vowels, short
  ["ae", `${Thai._e}${Thai._e}$1${Thai.NomNang}`],
  ["aw", `${Thai._e}$1${Thai.LakKhang}${Thai.NomNang}`],
  ["oe", `${Thai._e}$1${Thai.OAng}${Thai.NomNang}`],
  ["ue", `$1${Thai._ue}`],
  ["i", `$1${Thai._i}`],
  ["u", `$1${Thai._u}`],
  ["o", `${Thai._o}$1${Thai.NomNang}`],
  ["e", `${Thai._e}$1${Thai.NomNang}`],
  ["a", `$1`],
]
  .sort(ruleKeyLengthDiff)
  .map(toVowelOfOpenSyllable);

const ClosedSyllableVowels: RegexRule[] = [
  // diphthongs
  ["iaa", `${Thai._e}$1${Thai._ii}${Thai.YoYakL}$3`],
  ["ueaa", `${Thai._e}$1${Thai._uee}${Thai.OAng}$3`],
  ["uaa", `$1${Thai.WoWaenL}$3`],

  // base vowels, long
  ["aaw", `$1${Thai.OAng}$3`],
  ["aae", `${Thai._e}${Thai._e}$1$3`],
  ["ooe", `${Thai._e}$1${Thai._i}$3`],
  ["uue", `$1${Thai._uee}$3`],
  ["aa", `$1${Thai.LakKhang}$3`],
  ["ee", `${Thai._e}$1$3`],
  ["ii", `$1${Thai._ii}$3`],
  ["oo", `${Thai._o}$1$3`],
  ["uu", `$1${Thai._uu}$3`],

  // base vowels, short
  ["ae", `${Thai._e}${Thai._e}$1${Thai.MaiTaikhu}$3`],
  ["aw", `$1${Thai.MaiTaikhu}${Thai.OAng}$3`],
  ["ue", `$1${Thai._ue}$3`],
  ["i", `$1${Thai._i}`],
  ["u", `$1${Thai._u}$3`],
  ["o", `$1$3`],
  ["e", `${Thai._e}$1${Thai.MaiTaikhu}$3`],
  ["a", `$1${Thai.MaiHanAkat}$3`],
]
  .sort(ruleKeyLengthDiff)
  .map(toVowelOfClosedSyllable);

const Punctuation: PlainRule[] = [
  [" ", "\u200C"],
  [".", " "],
];

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

// TODO: special single word spellings
// TODO: circumfix vowels wrapping around an inherent vowel consonants behind them
// TODO: TONES
// TODO: NomNang only for last syllables

const FromLatinScheme: Rule[] = chainRule<Rule>(
  ClosedSyllableVowels,
  OpenSyllableVowels,
  prepareRules(Consonants.sort(ruleKeyLengthDiff)),
  Numbers,
  prepareRules(Punctuation),
);

export const fromLatin = (input: string): string =>
  transliterate(input, FromLatinScheme);

const ThaiConsonants: string[] = prepareRules(Consonants)
  .map(([_, val]: PlainRule): string => val)
  .sort();

// do NOT use "C" to denote anything other than consonants on the left side of the rule here!
const InverseSyllableVowels: RegexRule[] = chainRule<RegexRule>(
  [
    [`${Thai._e}(C)${Thai._ii}${Thai.YoYakL}(C)`, "iaa"],
    [`${Thai._e}(C)${Thai._uee}${Thai.OAng}(C)`, "ueaa"],
    [`(C)${Thai.WoWaenL}(C)`, "uaa"],

    // base vowels, long
    [`(C)${Thai.OAng}(C)`, "aaw"],
    [`${Thai._e}${Thai._e}(C)(C)`, "aae"],
    [`${Thai._e}(C)${Thai._i}(C)`, "ooe"],
    [`(C)${Thai._uee}(C)`, "uue"],
    [`(C)${Thai.LakKhang}(C)`, "aa"],
    [`${Thai._e}(C)(C)`, "ee"],
    [`(C)${Thai._ii}(C)`, "ii"],
    [`${Thai._o}(C)(C)`, "oo"],
    [`(C)${Thai._uu}(C)`, "uu"],

    // base vowels, short
    [`${Thai._e}${Thai._e}(C)${Thai.MaiTaikhu}(C)`, "ae"],
    [`(C)${Thai.MaiTaikhu}${Thai.OAng}(C)`, "aw"],
    [`(C)${Thai._ue}(C)`, "ue"],
    [`(C)${Thai._i}`, "i"],
    [`(C)${Thai._u}(C)`, "u"],
    [`${Thai._e}(C)${Thai.MaiTaikhu}(C)`, "e"],
    [`(C)${Thai.MaiHanAkat}(C)`, "a"],
    [`(?<![${Thai._aii}${Thai._ai}${Thai._o}${Thai._e}])(C)(C)`, "o"],
  ].map(
    ([key, val]: PlainRule): RegexRule => [
      new RegExp(
        key.replace(/\(C\)/g, `(${patternList(ThaiConsonants).source})`),
      ),
      `$1${val}$2 `,
    ],
  ),

  // open, with nomnang first
  // diphthongs
  [
    [`${Thai._e}(C)${Thai._ii}${Thai.YoYakL}${Thai.NomNang}`, "ia"],
    [`${Thai._e}(C)${Thai._uee}${Thai.OAng}${Thai.NomNang}`, "uea"],
    [`(C)${Thai.MaiHanAkat}${Thai.WoWaenL}${Thai.NomNang}`, "ua"],

    // base vowels, short
    [`${Thai._e}${Thai._e}(C)${Thai.NomNang}`, "ae"],
    [`${Thai._e}(C)${Thai.LakKhang}${Thai.NomNang}`, "aw"],
    [`${Thai._e}(C)${Thai.OAng}${Thai.NomNang}`, "oe"],
    [`${Thai._o}(C)${Thai.NomNang}`, "o"],
    [`${Thai._e}(C)${Thai.NomNang}`, "e"],
    // open, no nomnang
    // diphthongs
    [`${Thai._e}(C)${Thai._ii}${Thai.YoYakL}`, "iaa"],
    [`${Thai._e}(C)${Thai._uee}${Thai.OAng}`, "ueaa"],
    [`(C)${Thai.MaiHanAkat}${Thai.WoWaenL}`, "uaa"],

    [`${Thai._ai}(C)${Thai.YoYakL}`, "aiy"],
    [`${Thai._aii}(C)`, "aii"],
    [`${Thai._ai}(C)`, "ai"],

    // phonetic diphthongs, long
    [`${Thai._e}(C)${Thai.WoWaenL}`, "eeo"],
    [`${Thai._e}${Thai._e}(C)${Thai.WoWaenL}`, "aaeo"],
    [`(C)${Thai.LakKhang}${Thai.WoWaenL}`, "aao"],
    [`${Thai._e}(C)${Thai._ii}${Thai.YoYakL}${Thai.WoWaenL}`, "iaao"],
    [`(C)${Thai.LakKhang}${Thai.YoYakL}`, "aay"],
    [`(C)${Thai.OAng}${Thai.YoYakL}`, "aawy"],
    [`${Thai._o}(C)${Thai.YoYakL}`, "ooy"],
    [`${Thai._e}(C)${Thai.YoYakL}`, "ooey"],
    [`(C)${Thai.MaiHanAkat}${Thai.WoWaenL}${Thai.YoYakL}`, "uaay"],
    [`${Thai._e}(C)${Thai._uee}${Thai.OAng}${Thai.YoYakL}`, "ueaai"],
    // phonetic diphthongs, short
    [`(C)${Thai._i}${Thai.WoWaenL}`, "io"],
    [`${Thai._e}(C)${Thai.MaiHanAkat}${Thai.WoWaenL}`, "eo"],
    [`${Thai._e}(C)$${Thai.LakKhang}`, "ao"],
    [`(C)${Thai.MaiHanAkat}${Thai.YoYakL}`, "ay"], // this should actually be capturable by the closed syllable regex but for completion's sake
    [`(C)${Thai.MaiTaikhu}${Thai.OAng}${Thai.YoYakL}`, "awy"],
    [`(C)${Thai._u}${Thai.YoYakL}`, "uy"],
    // base vowels, long
    [`(C)${Thai.OAng}`, "aaw"],
    [`${Thai._e}${Thai._e}(C)`, "aae"],
    [`${Thai._e}(C)${Thai.OAng}`, "ooe"],
    [`(C)${Thai._uee}${Thai.OAng}`, "uue"],
    [`(C)${Thai.LakKhang}`, "aa"],
    [`${Thai._e}(C)`, "ee"],
    [`(C)${Thai._ii}`, "ii"],
    [`${Thai._o}(C)`, "oo"],
    [`(C)${Thai._uu}`, "uu"],

    // base vowels, short
    [`(C)${Thai._ue}`, "ue"],
    [`(C)${Thai._i}`, "i"],
    [`(C)${Thai._u}`, "u"],
    [
      `(?<![${Thai._aii}${Thai._ai}${Thai._o}${Thai._e}aiueo])(C)(?![aiueo])`,
      "a",
    ],
  ].map(
    ([key, val]: PlainRule): RegexRule => [
      new RegExp(
        key.replace(/\(C\)/g, `(${patternList(ThaiConsonants).source})`),
      ),
      `$1${val} `,
    ],
  ),
);

const ToLatinScheme: Rule[] = chainRule<Rule>(
  InverseSyllableVowels,
  asInverse(Consonants),
  [[/$ /g, ""]],
  asInverse(Numbers),
  // asInverse(Punctuation.reverse()),
);

export const toLatin = (input: string): string =>
  transliterate(input, ToLatinScheme);

const StandardLatinVowels: PlainRule[] = [
  // diphthongs
  ["iaa", "ia"],
  ["ia", "ia"],
  ["ueaa", "uea"],
  ["uea", "uea"],
  ["uaa", "ua"],
  ["ua", "ua"],
  ["aii", "ai"],
  ["ai", "ai"],
  ["aiy", "ai"],
  ["ay", "ai"],
  // actually just vowel + w or y, but for completion's sake
  // TODO: decide to keep this or simply let it be parsed using regular w
  // phonetic diphthongs, long
  ["eeo", "eo"],
  ["aaeo", "aeo"],
  ["aao", "ao"],
  ["iaao", "iao"],
  ["aay", "ay"],
  ["aawy", "oi"],
  ["ooy", "oi"],
  ["ooey", "oei"],
  ["uaay", "uai"],
  ["ueaai", "ueai"],
  // phonetic diphthongs, short
  ["io", "io"],
  ["eo", "eo"],
  ["ao", "ao"],
  ["awy", "oi"],
  ["uy", "ui"],
  // base vowels, long
  ["aaw", "o"],
  ["aae", "ae"],
  ["ooe", "oe"],
  ["uue", "ue"],
  ["aa", "a"],
  ["ee", "e"],
  ["ii", "i"],
  ["oo", "o"],
  ["uu", "u"],

  // base vowels, short
  ["ae", "ae"],
  ["aw", "o"],
  ["oe", "oe"],
  ["ue", "ue"],
  ["i", "i"],
  ["u", "u"],
  ["o", "o"],
  ["e", "e"],
  ["a", "a"],
].sort(ruleKeyLengthDiff);

const StandardLatinFinalConsonants: Rule[] = asWordEnding([
  ["k_h/", "k"],
  ["k_h\\", "k"],
  ["g_h\\", "k"],

  ["k", "k"],

  ["n_g\\", "ng"],

  ["c_h/", ""],
  ["c_h\\", "t"],
  ["c_h", "t"],

  ["j_h\\", "t"],

  ["y_n\\", "n\\"],
  // add rules later for cases like phinyo
  ["y\\", "y"],

  ["d", "t"],
  ["d_t", "t"],

  ["t", "t"],
  ["t_t", "t"],

  ["t_h/", "t"],
  ["t_t/", "t"],

  ["t_d\\", "th"],
  ["t_h\\", "th"],
  ["d_h\\", "th"],
  ["d\\", "t"],

  ["n_n\\", "n"],
  ["n\\", "n"],

  ["p_h/", ""],
  ["p_h\\", "p"],
  ["b_h\\", "p"],

  ["b", "p"],
  ["p", "p"],

  ["f/", ""],
  ["f\\", "p"],

  ["m\\", "m"],

  ["r\\", "n"],
  ["l\\", "n"],

  ["w\\", "w"],

  ["s_s/", "t"],
  ["s_t/", "t"],
  ["s/", "t"],
  ["s\\", "t"],

  ["h/", ""],
  ["h\\", "h"],
  ["'", ""],
]);

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
  StandardLatinFinalConsonants,
  StandardLatinConsonants,
  StandardLatinVowels,
  [[" ", ""]],
);

console.debug(StandardLatinScheme);

export const toStandardLatin = (input: string): string =>
  debugTransliterate(input, StandardLatinScheme);

const IMEScheme: Rule[] = [];

export const initIME = genericIMEInit(IMEScheme);
