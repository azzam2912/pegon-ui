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

  SoSoL = "ซ",

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

  BoMid = "บ",
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

  HoHipH = "ห",
  HoNokHukL = "ฮ",

  OAng = "อ",
  // vowel symbols
  NomNang = "ะ",
  MaiHanAkat = "ั",
  MaiTaiKhu = "็",
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
  _ai_maimuan = "ใ",
  _ai_maimalai = "ไ",

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

  ["n_y\\", Thai.YoYingL],
  ["y\\", Thai.YoYakL],

  ["d", Thai.DoChadaM],
  ["d_t", Thai.DoDekM],

  ["t", Thai.ToPatakM],
  ["t_d", Thai.ToTaoM],

  ["t_h/", Thai.ThoThanH],
  ["t_t/", Thai.ThoThungH],

  ["t_d\\", Thai.ThoMonthoL],
  ["t_t\\", Thai.ThoPhuThaoL],
  ["d_h\\", Thai.ThoThongL],
  ["d\\", Thai.ThoThahanL],

  ["n_n", Thai.NoNenL],
  ["n", Thai.NoNuL],

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

  ["h/", Thai.HoHipH],
  ["h\\", Thai.HoNokHukL],
  ["'", Thai.OAng],
];

const LatinConsonants: string[] = Consonants.map(([key, _]) => key).sort(
  (a, b) => a.length - b.length,
);

const toVowelOfOpenSyllable = (key: string, val: string): RegexRule => [
  new RegExp(`(${patternList(LatinConsonants)})(${key})`),
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
  ["aii", `${Thai._ai_maimuan}$1`],
  ["ai", `${Thai._ai_maimalai}$1`],

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
  ["eeuy", `${Thai.OAng}$1${Thai.YoYakL}`],
  ["uaay", `$1${Thai.MaiHanAkat}${Thai.WoWaenL}${Thai.YoYakL}`],
  ["ueaai", `${Thai._e}$1${Thai._uee}${Thai.OAng}${Thai.YoYakL}`],
  // phonetic diphthongs, short
  ["io", `$1${Thai._i}${Thai.WoWaenL}`],
  ["eo", `${Thai._e}$1${Thai.MaiHanAkat}${Thai.WoWaenL}`],
  ["ao", `${Thai._e}$1$${Thai.LakKhang}`],
  // TODO: what to do about Mai Han Akat + Yo Yak version of "ai"
  // [??, `$1${Thai.MaiHanAkat}${Thai.YoYakL}`],
  ["awy", `$1${Thai.MaiTaiKhu}${Thai.OAng}${Thai.YoYakL}`],
  ["uy", `$1${Thai._u}${Thai.YoYakL}`],
  // base vowels, long
  ["aaw", `$1${Thai.OAng}`],
  ["aae", `${Thai._e}${Thai._e}$1`],
  ["eeu", `${Thai._e}$1${Thai.OAng}`],
  ["uue", `$1${Thai._uee}${Thai.OAng}`],
  ["aa", `$1${Thai.LakKhang}`],
  ["ae", `${Thai._e}${Thai._e}$1${Thai.NomNang}`],
  ["ee", `${Thai._e}$1`],
  ["ii", `$1${Thai._ii}`],
  ["oo", `${Thai._o}$1`],
  ["aw", `${Thai._e}$1${Thai.LakKhang}${Thai.NomNang}`],

  // base vowels, short
  ["eu", `${Thai._e}$1${Thai.OAng}${Thai.NomNang}`],
  ["ue", `$1${Thai._ue}`],
  ["uu", `$1${Thai._uu}`],
  ["i", `$1{Thai._i}`],
  ["u", `$1${Thai._u}`],
  ["o", `${Thai._o}$1${Thai.NomNang}`],
  ["e", `${Thai._e}$1${Thai.NomNang}`],
  ["a", `$1${Thai.NomNang}`],
]
  .sort(([a, _], [b, _]) => a.length - b.length)
  .map(toVowelOfOpenSyllable);

const toVowelOfClosedSyllable = (key: string, val: string): RegexRule => [
  new RegExp(
    `(${patternList(LatinConsonants)})(${key})(${patternList(
      LatinConsonants,
    )})`,
  ),
  val,
];

const ClosedSyllableVowels: RegexRule[] = [
  // diphthongs
  ["iaa", `${Thai._e}$1${Thai._ii}${Thai.YoYakL}$3`],
  ["ueaa", `${Thai._e}$1${Thai._uee}${Thai.OAng}$3`],
  ["uaa", `$1${Thai.WoWaenL}$3`],

  // base vowels
  ["aaw", `$1${Thai.OAng}$3`],
  ["aae", `${Thai._e}${Thai._e}$1$3`],
  ["eeu", `${Thai._e}$1${Thai._i}$3`],
  ["uue", `$1${Thai._uee}$3`],
  ["aa", `$1${Thai.LakKhang}$3`],
  ["ae", `${Thai._e}${Thai._e}$1${Thai.NomNang}`],
  ["ee", `${Thai._e}$1`],
  ["ii", `$1${Thai._ii}`],
  ["oo", `${Thai._o}$1`],
  ["aw", `${Thai._e}$1${Thai.LakKhang}${Thai.NomNang}`],

  ["eu", `${Thai._e}$1${Thai.OAng}${Thai.NomNang}`],
  ["ue", `$1${Thai._ue}`],
  ["uu", `$1${Thai._uu}`],
  ["i", `$1{Thai._i}`],
  ["u", `$1${Thai._u}`],
  ["o", `${Thai._o}$1${Thai.NomNang}`],
  ["e", `${Thai._e}$1${Thai.NomNang}`],
  ["a", `$1${Thai.MaiHanAkat}`],
]
  .sort(([a, _], [b, _]) => a.length - b.length)
  .map(toVowelOfClosedSyllable);

// TODO: turn spaces into nothing/ZNWJ, and double spaces to actual space?
// or final stop to actual space
const Punctuation: PlainRule[] = prepareRules([
  [" ", "\u200C"],
  [".", " "],
]);
// TODO: Numbers
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

const FromLatinScheme: Rule[] = chainRule<Rule>(
  ClosedSyllableVowels,
  OpenSyllableVowels,
  Consonants,
);

export const fromLatin = (input: string): string =>
  transliterate(input, FromLatinScheme);

const ToLatinScheme: Rule[] = [[]];

export const toLatin = (input: string): string =>
  transliterate(input, ToLatinScheme);

const StandardLatinScheme: Rule[] = [["k_h/", "kh"]];

export const toStandardLatin = (input: string): string =>
  transliterate(input, StandardLatinScheme);

const IMEScheme: Rule[] = [[]];

export const initIME = genericIMEInit(IMEScheme);
