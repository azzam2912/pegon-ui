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
const enum Lao {
  KoKaiM = "ກ",

  KhoKhaiH = "ຂ",
  // KhoKhuatHO = "ข",
  KhoKhwaiL = "ຄ",
  // KhoKhonLO = "ฅ",
  // KhoRakhangL = "ฆ",

  NgoNguL = "ງ",

  ChoChuaM = "ຈ",
  // ChoChingH = "ฉ",
  // ChoChangL = "ช",
  // ChoChoeL = "ฌ",

  SoSueaH = "ສ",
  SoSangL = "ซ",

  NyoNyungL = "ຍ",
  // YoYingL = "ญ",
  // YoYakL = "ย",

  // DoChadaM = "ฎ",
  DoDekM = "ດ",

  // ToPatakM = "ฏ",
  ToTaM = "ຕ",

  ThoThongH = "ຖ",
  ThoThungL = "ທ",

  // ThoMonthoL = "ฑ",
  // ThoPhuThaoL = "ฒ",
  // ThoThahanL = "ท",
  // ThoThongL = "ธ",

  NoNokL = "ນ",
  HoNoH = "ໜ",
  // NoNuL = "น",

  BoBeM = "ບ",
  PoPaM = "ປ",

  PhoPhuengH = "ຜ",
  PhoPhuL = "ພ",
  // PhoSamphaoL = "ภ",

  FoFonH = "ຝ",
  FoFayL = "ຟ",

  MoMewL = "ມ",
  HoMoM = "ໝ",

  YoYaM = "ຢ",

  RoRotL = "ຣ",
  LoLingL = "ລ",

  WoWiL = "ວ",

  HoHanH = "ຫ",
  HoTamL = "ຮ",

  OAng = "ອ",

  // vowel symbols
  NomNang = "ະ",
  LakKhang = "າ",
  MaiHanAkat = "ັ",
  MaiKon = "ົ",

  _i = "ິ",
  _ii = "ີ",

  _ue = "ຶ",
  _uee = "ື",

  _u = "ຸ",
  _uu = "ູ",

  _e = "ເ",
  _ae = "ແ",

  _o = "ໂ",

  NyoFyangSemi = "ຽ",
  LoSemi = "ຼ",

  _aii = "ໃ",
  _ai = "ໄ",

  // punctuation
  PaiyanNoi = "ฯ",
  MaiYamok = "ໆ",

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
  MaiEk = "່",
  MaiTho = "້",
  MaiTri = "໊",
  MaiChattawa = "໋",
}

const Consonants: PlainRule = [
  ["k_h/", Lao.KhoKhaiH],
  ["k_h\\", Lao.KhoKhwaiL],

  ["k", Lao.KoKaiM],

  ["n_g\\", Lao.NgoNguL],
  ["n_g/", `${Lao.HoHanH}${Lao.NgoNguL}`],

  ["c_h", Lao.ChoChuaM],

  ["n_y\\", Lao.NyoNyungL],
  ["n_y/", `${Lao.HoHanH}${Lao.NyoNyungL}`],

  ["y", Lao.YoYaM],

  ["d", Lao.DoDekM],

  ["t", Lao.ToTaM],

  ["t_h/", Lao.ThoThongH],
  ["t_h\\", Lao.ThoThungL],

  ["n\\", Lao.NoNokL],
  ["h/", Lao.HoNoH],

  ["p_h/", Lao.PhoPhuengH],
  ["p_h\\", Lao.PhoPhuL],

  ["b", Lao.BoBeM],
  ["p", Lao.PoPaM],

  ["f/", Lao.FoFonH],
  ["f\\", Lao.FoFayL],

  ["m\\", Lao.MoMewL],
  ["m/", Lao.HoMoM],

  ["r\\", Lao.RoRotL],

  ["l\\", Lao.LoLingL],
  ["l/", `${Lao.HoHanH}${Lao.LoSemi}`],

  ["w\\", Lao.WoWiL],
  ["w/", `${Lao.HoHanH}${Lao.WoWiL}`],

  ["h/", Lao.HoHanH],
  ["h\\", Lao.HoTamL],
  ["'", Lao.OAng],
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
  ["iaa", `${Lao._e}$1${Lao.NyoNyungL}`],
  ["ia", `${Lao._e}$1${Lao.MaiKon}${Lao.NyoNyungL}`],
  ["ueaa", `${Lao._e}$1${Lao._uee}${Lao.OAng}`],
  ["uea", `${Lao._e}$1${Lao._ue}${Lao.OAng}`],
  ["uaa", `$1${Lao.MaiHanAkat}${Lao.WoWaenL}`],
  ["ua", `$1${Lao.MaiHanAkat}${Lao.WoWaenL}${Lao.NomNang}`],
  ["aii", `${Lao._aii}$1`],
  ["ai", `${Lao._ai}$1`],
  ["aiy", `${Lao._ai}$1${Lao.YoYakL}`],

  // actually just vowel + w or y, but for completion's sake
  // TODO: decide to keep this or simply let it be parsed using regular w
  // phonetic diphthongs, long
  ["eeo", `${Lao._e}$1${Lao.WoWaenL}`],
  ["aaeo", `${Lao._e}${Lao._e}$1${Lao.WoWaenL}`],
  ["aao", `$1${Lao.LakKhang}${Lao.WoWaenL}`],
  ["iaao", `${Lao._e}$1${Lao._ii}${Lao.YoYakL}${Lao.WoWaenL}`],
  ["aay", `$1${Lao.LakKhang}${Lao.YoYakL}`],
  ["aawy", `$1${Lao.OAng}${Lao.YoYakL}`],
  ["ooy", `${Lao._o}$1${Lao.YoYakL}`],
  ["ooey", `${Lao._e}$1${Lao.YoYakL}`],
  ["uaay", `$1${Lao.MaiHanAkat}${Lao.WoWaenL}${Lao.YoYakL}`],
  ["ueaai", `${Lao._e}$1${Lao._uee}${Lao.OAng}${Lao.YoYakL}`],
  // phonetic diphthongs, short
  ["io", `$1${Lao._i}${Lao.WoWaenL}`],
  ["eo", `${Lao._e}$1${Lao.MaiHanAkat}${Lao.WoWaenL}`],
  ["ao", `${Lao._e}$1$${Lao.LakKhang}`],
  // TODO: what to do about Mai Han Akat + Yo Yak version of "ai"
  // [??, `$1${Lao.MaiHanAkat}${Lao.YoYakL}`],
  ["awy", `$1${Lao.MaiTaikhu}${Lao.OAng}${Lao.YoYakL}`],
  ["uy", `$1${Lao._u}${Lao.YoYakL}`],
  // base vowels, long
  ["aaw", `$1${Lao.OAng}`],
  ["aae", `${Lao._e}${Lao._e}$1`],
  ["ooe", `${Lao._e}$1${Lao.OAng}`],
  ["uue", `$1${Lao._uee}${Lao.OAng}`],
  ["aa", `$1${Lao.LakKhang}`],
  ["ee", `${Lao._e}$1`],
  ["ii", `$1${Lao._ii}`],
  ["oo", `${Lao._o}$1`],
  ["uu", `$1${Lao._uu}`],

  // base vowels, short
  ["ae", `${Lao._e}${Lao._e}$1${Lao.NomNang}`],
  ["aw", `${Lao._e}$1${Lao.LakKhang}${Lao.NomNang}`],
  ["oe", `${Lao._e}$1${Lao.OAng}${Lao.NomNang}`],
  ["ue", `$1${Lao._ue}`],
  ["i", `$1${Lao._i}`],
  ["u", `$1${Lao._u}`],
  ["o", `${Lao._o}$1${Lao.NomNang}`],
  ["e", `${Lao._e}$1${Lao.NomNang}`],
  ["a", `$1`],
]
  .sort(ruleKeyLengthDiff)
  .map(toVowelOfOpenSyllable);

const ClosedSyllableVowels: RegexRule[] = [
  // diphthongs
  ["iaa", `${Lao._e}$1${Lao._ii}${Lao.YoYakL}$3`],
  ["ueaa", `${Lao._e}$1${Lao._uee}${Lao.OAng}$3`],
  ["uaa", `$1${Lao.WoWaenL}$3`],

  // base vowels, long
  ["aaw", `$1${Lao.OAng}$3`],
  ["aae", `${Lao._e}${Lao._e}$1$3`],
  ["ooe", `${Lao._e}$1${Lao._i}$3`],
  ["uue", `$1${Lao._uee}$3`],
  ["aa", `$1${Lao.LakKhang}$3`],
  ["ee", `${Lao._e}$1$3`],
  ["ii", `$1${Lao._ii}$3`],
  ["oo", `${Lao._o}$1$3`],
  ["uu", `$1${Lao._uu}$3`],

  // base vowels, short
  ["ae", `${Lao._e}${Lao._e}$1${Lao.MaiTaikhu}$3`],
  ["aw", `$1${Lao.MaiTaikhu}${Lao.OAng}$3`],
  ["ue", `$1${Lao._ue}$3`],
  ["i", `$1${Lao._i}`],
  ["u", `$1${Lao._u}$3`],
  ["o", `$1$3`],
  ["e", `${Lao._e}$1${Lao.MaiTaikhu}$3`],
  ["a", `$1${Lao.MaiHanAkat}$3`],
]
  .sort(ruleKeyLengthDiff)
  .map(toVowelOfClosedSyllable);

const Punctuation: PlainRule[] = [
  [" ", "\u200C"],
  [".", " "],
  [`${Lao.PaiyanNoi}${Lao.LoLingL}${Lao.PaiyanNoi}`, " etc"],
  [Lao.MaiYamok, "2"],
  [Lao.PaiyanNoi, "."],
];

const Numbers: PlainRule[] = [
  ["0", Lao.Zero],
  ["1", Lao.One],
  ["2", Lao.Two],
  ["3", Lao.Three],
  ["4", Lao.Four],
  ["5", Lao.Five],
  ["6", Lao.Six],
  ["7", Lao.Seven],
  ["8", Lao.Eight],
  ["9", Lao.Nine],
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

const LaoConsonants: string[] = prepareRules(Consonants)
  .map(([_, val]: PlainRule): string => val)
  .sort();

// do NOT use "C" to denote anything other than consonants on the left side of the rule here!
const InverseSyllableVowels: RegexRule[] = chainRule<RegexRule>(
  [
    [`${Lao._e}(C)${Lao._ii}${Lao.YoYakL}(C)`, "iaa"],
    [`${Lao._e}(C)${Lao._uee}${Lao.OAng}(C)`, "ueaa"],
    [`(C)${Lao.WoWaenL}(C)`, "uaa"],

    // base vowels, long
    [`(C)${Lao.OAng}(C)`, "aaw"],
    [`${Lao._e}${Lao._e}(C)(C)`, "aae"],
    [`${Lao._e}(C)${Lao._i}(C)`, "ooe"],
    [`(C)${Lao._uee}(C)`, "uue"],
    [`(C)${Lao.LakKhang}(C)`, "aa"],
    [`${Lao._e}(C)(C)`, "ee"],
    [`(C)${Lao._ii}(C)`, "ii"],
    [`${Lao._o}(C)(C)`, "oo"],
    [`(C)${Lao._uu}(C)`, "uu"],

    // base vowels, short
    [`${Lao._e}${Lao._e}(C)${Lao.MaiTaikhu}(C)`, "ae"],
    [`(C)${Lao.MaiTaikhu}${Lao.OAng}(C)`, "aw"],
    [`(C)${Lao._ue}(C)`, "ue"],
    [`(C)${Lao._i}`, "i"],
    [`(C)${Lao._u}(C)`, "u"],
    [`${Lao._e}(C)${Lao.MaiTaikhu}(C)`, "e"],
    [`(C)${Lao.MaiHanAkat}(C)`, "a"],
    [`(?<![${Lao._aii}${Lao._ai}${Lao._o}${Lao._e}])(C)(C)`, "o"],
  ].map(
    ([key, val]: PlainRule): RegexRule => [
      new RegExp(
        key.replace(/\(C\)/g, `(${patternList(LaoConsonants).source})`),
      ),
      `$1${val}$2 `,
    ],
  ),

  // open, with nomnang first
  // diphthongs
  [
    [`${Lao._e}(C)${Lao._ii}${Lao.YoYakL}${Lao.NomNang}`, "ia"],
    [`${Lao._e}(C)${Lao._uee}${Lao.OAng}${Lao.NomNang}`, "uea"],
    [`(C)${Lao.MaiHanAkat}${Lao.WoWaenL}${Lao.NomNang}`, "ua"],

    // base vowels, short
    [`${Lao._e}${Lao._e}(C)${Lao.NomNang}`, "ae"],
    [`${Lao._e}(C)${Lao.LakKhang}${Lao.NomNang}`, "aw"],
    [`${Lao._e}(C)${Lao.OAng}${Lao.NomNang}`, "oe"],
    [`${Lao._o}(C)${Lao.NomNang}`, "o"],
    [`${Lao._e}(C)${Lao.NomNang}`, "e"],
    // open, no nomnang
    // diphthongs
    [`${Lao._e}(C)${Lao._ii}${Lao.YoYakL}`, "iaa"],
    [`${Lao._e}(C)${Lao._uee}${Lao.OAng}`, "ueaa"],
    [`(C)${Lao.MaiHanAkat}${Lao.WoWaenL}`, "uaa"],

    [`${Lao._ai}(C)${Lao.YoYakL}`, "aiy"],
    [`${Lao._aii}(C)`, "aii"],
    [`${Lao._ai}(C)`, "ai"],

    // phonetic diphthongs, long
    [`${Lao._e}(C)${Lao.WoWaenL}`, "eeo"],
    [`${Lao._e}${Lao._e}(C)${Lao.WoWaenL}`, "aaeo"],
    [`(C)${Lao.LakKhang}${Lao.WoWaenL}`, "aao"],
    [`${Lao._e}(C)${Lao._ii}${Lao.YoYakL}${Lao.WoWaenL}`, "iaao"],
    [`(C)${Lao.LakKhang}${Lao.YoYakL}`, "aay"],
    [`(C)${Lao.OAng}${Lao.YoYakL}`, "aawy"],
    [`${Lao._o}(C)${Lao.YoYakL}`, "ooy"],
    [`${Lao._e}(C)${Lao.YoYakL}`, "ooey"],
    [`(C)${Lao.MaiHanAkat}${Lao.WoWaenL}${Lao.YoYakL}`, "uaay"],
    [`${Lao._e}(C)${Lao._uee}${Lao.OAng}${Lao.YoYakL}`, "ueaai"],
    // phonetic diphthongs, short
    [`(C)${Lao._i}${Lao.WoWaenL}`, "io"],
    [`${Lao._e}(C)${Lao.MaiHanAkat}${Lao.WoWaenL}`, "eo"],
    [`${Lao._e}(C)$${Lao.LakKhang}`, "ao"],
    [`(C)${Lao.MaiHanAkat}${Lao.YoYakL}`, "ay"], // this should actually be capturable by the closed syllable regex but for completion's sake
    [`(C)${Lao.MaiTaikhu}${Lao.OAng}${Lao.YoYakL}`, "awy"],
    [`(C)${Lao._u}${Lao.YoYakL}`, "uy"],
    // base vowels, long
    [`(C)${Lao.OAng}`, "aaw"],
    [`${Lao._e}${Lao._e}(C)`, "aae"],
    [`${Lao._e}(C)${Lao.OAng}`, "ooe"],
    [`(C)${Lao._uee}${Lao.OAng}`, "uue"],
    [`(C)${Lao.LakKhang}`, "aa"],
    [`${Lao._e}(C)`, "ee"],
    [`(C)${Lao._ii}`, "ii"],
    [`${Lao._o}(C)`, "oo"],
    [`(C)${Lao._uu}`, "uu"],

    // base vowels, short
    [`(C)${Lao._ue}`, "ue"],
    [`(C)${Lao._i}`, "i"],
    [`(C)${Lao._u}`, "u"],
    [`(?<![${Lao._aii}${Lao._ai}${Lao._o}${Lao._e}aiueo])(C)(?![aiueo])`, "a"],
  ].map(
    ([key, val]: PlainRule): RegexRule => [
      new RegExp(
        key.replace(/\(C\)/g, `(${patternList(LaoConsonants).source})`),
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
