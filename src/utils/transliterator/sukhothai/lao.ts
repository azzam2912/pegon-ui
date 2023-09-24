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
  SoSangL = "ຊ",

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
  MaiKan = "ັ",
  MaiKon = "ົ",
  Niggahita = "ໍ",

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
  Zero = "໐",
  One = "໑",
  Two = "໒",
  Three = "໓",
  Four = "໔",
  Five = "໕",
  Six = "໖",
  Seven = "໗",
  Eight = "໘",
  Nine = "໙",

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

  ["s/", Lao.SoSueaH],
  ["s\\", Lao.SoSangL],

  ["n_y\\", Lao.NyoNyungL],
  ["n_y/", `${Lao.HoHanH}${Lao.NyoNyungL}`],

  ["y", Lao.YoYaM],

  ["d", Lao.DoDekM],

  ["t_h/", Lao.ThoThongH],
  ["t_h\\", Lao.ThoThungL],

  ["t", Lao.ToTaM],

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

const OpenSyllableVowelsTemplate: PlainRule[] = [
  // diphthongs
  ["iaa", `${Lao._e}$1${Lao.NyoNyungL}`],
  ["ia", `${Lao._e}$1${Lao.MaiKan}${Lao.NyoNyungL}`],

  ["ueaa", `${Lao._e}$1${Lao._uee}${Lao.OAng}`],
  ["uea", `${Lao._e}$1${Lao._ue}${Lao.OAng}`],

  ["uaa", `$1${Lao.MaiKon}${Lao.WoWiL}`],
  ["ua", `$1${Lao.MaiKon}${Lao.WoWiL}${Lao.NomNang}`],

  // special diphthongs, short
  ["aii", `${Lao._aii}$1`],
  ["ai", `${Lao._ai}$1`],
  ["ao", `${Lao._e}$1${Lao.MaiKon}${Lao.LakKhang}`],
  ["am", `$1${Lao.Niggahita}${Lao.LakKhang}`],

  // base vowels, long
  ["aaw", `$1${Lao.Niggahita}`],
  ["aae", `${Lao._ae}$1`],
  ["ooe", `${Lao._e}$1${Lao._ii}`],
  ["uue", `$1${Lao._uee}${Lao.OAng}`],
  ["aa", `$1${Lao.LakKhang}`],
  ["ee", `${Lao._e}$1`],
  ["ii", `$1${Lao._ii}`],
  ["oo", `${Lao._o}$1`],
  ["uu", `$1${Lao._uu}`],

  // base vowels, short
  ["ae", `${Lao._ae}$1${Lao.NomNang}`],
  ["aw", `${Lao._e}$1${Lao.LakKhang}${Lao.NomNang}`],
  ["oe", `${Lao._e}$1${Lao._ii}`],
  ["ue", `$1${Lao._ue}`],
  ["i", `$1${Lao._i}`],
  ["u", `$1${Lao._u}`],
  ["o", `${Lao._o}$1${Lao.NomNang}`],
  ["e", `${Lao._e}$1${Lao.NomNang}`],
  ["a", `$1${Lao.NomNang}`],
].sort(ruleKeyLengthDiff);

const OpenSyllableVowels: RegexRule = OpenSyllableVowelsTemplate.map(
  toVowelOfOpenSyllable,
);

const ClosedSyllableVowelsTemplate: PlainRule[] = [
  // diphthongs
  ["iaa", `$1${Lao.NyoFyangSemi}$3`],
  ["ia", `$1${Lao.MaiKan}${Lao.NyoFyangSemi}$3`],

  ["ueaa", `${Lao._e}$1${Lao._uee}${Lao.OAng}`],
  ["uea", `${Lao._e}$1${Lao._ue}${Lao.OAng}`],

  ["uaa", `$1${Lao.WoWiL}$3`],
  ["ua", `$1${Lao.MaiKan}${Lao.WoWiL}$3`],

  // base vowels, long
  ["aaw", `$1${Lao.OAng}$3`],
  ["aae", `${Lao._ae}$1$3`],
  ["ooe", `${Lao._e}$1${Lao._ii}$3`],
  ["uue", `$1${Lao._uee}${Lao.OAng}$3`],
  ["aa", `$1${Lao.LakKhang}$3`],
  ["ee", `${Lao._e}$1$3`],
  ["ii", `$1${Lao._ii}$3`],
  ["oo", `${Lao._o}$1$3`],
  ["uu", `$1${Lao._uu}$3`],

  // base vowels, short
  ["ae", `${Lao._ae}$1${Lao.MaiKan}$3`],
  ["aw", `$1${Lao.MaiKan}${Lao.OAng}$3`],
  ["ue", `$1${Lao._ue}$3`],
  ["i", `$1${Lao._i}$3`],
  ["u", `$1${Lao._u}$3`],
  ["o", `$1${Lao.MaiKon}$3`],
  ["e", `${Lao._e}$1${Lao.MaiKan}$3`],
  ["a", `$1${Lao.MaiKan}$3`],
].sort(ruleKeyLengthDiff);

const ClosedSyllableVowels: RegexRule = ClosedSyllableVowelsTemplate.map(
  toVowelOfClosedSyllable,
);

const Punctuation: PlainRule[] = [
  [" ", "\u200C"],
  [".", " "],
  [`${Lao.PaiyanNoi}${Lao.LoLingL}${Lao.PaiyanNoi}`, " etc"],
];

const InversePunctuation: PlainRule[] = [
  [Lao.MaiYamok, "2"],
  [Lao.PaiyanNoi, "."],
  [" ", "."],
  ["\u200C", " "],
  ["etc", `${Lao.PaiyanNoi}${Lao.LoLingL}${Lao.PaiyanNoi}`],
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
  ClosedSyllableVowelsTemplate.map(
    ([key, val]: PlainRule): PlainRule => [val.replace(/(\$1|\$3)/g, `C`), key],
  )
    .sort(ruleKeyLengthDiff)
    .map(
      ([key, val]: PlainRule): RegexRule => [
        new RegExp(key.replace(/C/g, `(${patternList(LaoConsonants).source})`)),
        `$1${val}$2 `,
      ],
    ),
  OpenSyllableVowelsTemplate.map(
    ([key, val]: PlainRule): PlainRule => [val.replace(/\$1/g, `C`), key],
  )
    .sort(ruleKeyLengthDiff)
    .map(
      ([key, val]: PlainRule): RegexRule => [
        new RegExp(key.replace(/C/g, `(${patternList(LaoConsonants).source})`)),
        `$1${val} `,
      ],
    ),
  [
    [
      new RegExp(
        `(?<![${Lao._aii}${Lao._ai}${Lao._o}${Lao._e}aiueo])(${
          patternList(LaoConsonants).source
        })(?![aiueo])`,
      ),
      "a",
    ],
  ],

  // open, with nomnang first
  // diphthongs
  // [
  //   [`${Lao._e}(C)${Lao._ii}${Lao.YoYakL}${Lao.NomNang}`, "ia"],
  //   [`${Lao._e}(C)${Lao._uee}${Lao.OAng}${Lao.NomNang}`, "uea"],
  //   [`(C)${Lao.MaiKon}${Lao.WoWiL}${Lao.NomNang}`, "ua"],

  //   // base vowels, short
  //   [`${Lao._ae}(C)${Lao.NomNang}`, "ae"],
  //   [`${Lao._e}(C)${Lao.LakKhang}${Lao.NomNang}`, "aw"],
  //   [`${Lao._e}(C)${Lao.OAng}${Lao.NomNang}`, "oe"],
  //   [`${Lao._o}(C)${Lao.NomNang}`, "o"],
  //   [`${Lao._e}(C)${Lao.NomNang}`, "e"],
  //   // open, no nomnang
  //   // diphthongs
  //   [`${Lao._e}(C)${Lao._ii}${Lao.YoYakL}`, "iaa"],
  //   [`${Lao._e}(C)${Lao._uee}${Lao.OAng}`, "ueaa"],
  //   [`(C)${Lao.MaiKon}${Lao.WoWiL}`, "uaa"],

  //   [`${Lao._ai}(C)${Lao.YoYakL}`, "aiy"],
  //   [`${Lao._aii}(C)`, "aii"],
  //   [`${Lao._ai}(C)`, "ai"],

  //   // phonetic diphthongs, long
  //   [`${Lao._e}(C)${Lao.WoWiL}`, "eeo"],
  //   [`${Lao._ae}(C)${Lao.WoWiL}`, "aaeo"],
  //   [`(C)${Lao.LakKhang}${Lao.WoWiL}`, "aao"],
  //   [`${Lao._e}(C)${Lao._ii}${Lao.YoYakL}${Lao.WoWiL}`, "iaao"],
  //   [`(C)${Lao.LakKhang}${Lao.YoYakL}`, "aay"],
  //   [`(C)${Lao.OAng}${Lao.YoYakL}`, "aawy"],
  //   [`${Lao._o}(C)${Lao.YoYakL}`, "ooy"],
  //   [`${Lao._e}(C)${Lao.YoYakL}`, "ooey"],
  //   [`(C)${Lao.MaiKon}${Lao.WoWiL}${Lao.YoYakL}`, "uaay"],
  //   [`${Lao._e}(C)${Lao._uee}${Lao.OAng}${Lao.YoYakL}`, "ueaai"],
  //   // phonetic diphthongs, short
  //   [`(C)${Lao._i}${Lao.WoWiL}`, "io"],
  //   [`${Lao._e}(C)${Lao.MaiKon}${Lao.WoWiL}`, "eo"],
  //   [`${Lao._e}(C)${Lao.LakKhang}`, "ao"],
  //   [`(C)${Lao.MaiKon}${Lao.YoYakL}`, "ay"], // this should actually be capturable by the closed syllable regex but for completion's sake
  //   [`(C)${Lao.MaiTaikhu}${Lao.OAng}${Lao.YoYakL}`, "awy"],
  //   [`(C)${Lao._u}${Lao.YoYakL}`, "uy"],
  //   // base vowels, long
  //   [`(C)${Lao.OAng}`, "aaw"],
  //   [`${Lao._ae}(C)`, "aae"],
  //   [`${Lao._e}(C)${Lao.OAng}`, "ooe"],
  //   [`(C)${Lao._uee}${Lao.OAng}`, "uue"],
  //   [`(C)${Lao.LakKhang}`, "aa"],
  //   [`${Lao._e}(C)`, "ee"],
  //   [`(C)${Lao._ii}`, "ii"],
  //   [`${Lao._o}(C)`, "oo"],
  //   [`(C)${Lao._uu}`, "uu"],

  //   // base vowels, short
  //   [`(C)${Lao._ue}`, "ue"],
  //   [`(C)${Lao._i}`, "i"],
  //   [`(C)${Lao._u}`, "u"],
  //   [`(?<![${Lao._aii}${Lao._ai}${Lao._o}${Lao._e}aiueo])(C)(?![aiueo])`, "a"],
  // ].map(
  //   ([key, val]: PlainRule): RegexRule => [
  //     new RegExp(
  //       key.replace(/\(C\)/g, `(${patternList(LaoConsonants).source})`),
  //     ),
  //     `$1${val} `,
  //   ],
  // ),
);

const ToLatinScheme: Rule[] = chainRule<Rule>(
  InversePunctuation,
  InverseSyllableVowels,
  asInverse(Consonants),
  [[/$ /g, ""]],
  asInverse(Numbers),
);

console.debug(ToLatinScheme);

export const toLatin = (input: string): string =>
  transliterate(input, ToLatinScheme);

const StandardLatinVowels: PlainRule[] = [
  // diphthongs
  ["iaa", "īa"],
  ["ia", "ia"],
  ["ueaa", "ư̄a"],
  ["uea", "ưa"],
  ["uaa", "ūa"],
  ["ua", "ua"],

  // special diphthongs, short
  ["aii", "ai"],
  ["ai", "ai"],
  ["ao", "ao"],
  ["am", "am"],

  // base vowels, long
  ["o", "ô"],
  ["aaw", "ō"],
  ["aae", "è̄"],
  ["ooe", "ēu"],
  ["uue", "ūe"],
  ["aa", "ā"],
  ["ee", "é̄"],
  ["ii", "ī"],
  ["oo", "ō"],
  ["uu", "ū"],

  // base vowels, short
  ["ae", "è"],
  ["aw", "o"],
  ["oe", "eu"],
  ["ue", "ue"],
  ["i", "i"],
  ["u", "u"],
  ["e", "é"],
  ["a", "a"],
];

const StandardLatinFinalConsonants: Rule[] = asWordEnding([
  ["k_h/", ""],
  ["k_h\\", ""],

  ["k", "k"],

  ["n_g\\", "ng"],
  ["n_g/", "ng"],

  ["c_h", ""],

  ["s/", ""],
  ["s\\", ""],

  ["n_y\\", "y"],
  ["n_y/", "y"],

  ["y", "y"],

  ["t", "t"],

  ["t_h/", ""],
  ["t_h\\", ""],

  ["n\\", "n"],
  ["n/", "n"],

  ["p_h/", ""],
  ["p_h\\", ""],

  ["b", "p"],
  ["p", ""],

  ["f/", ""],
  ["f\\", ""],

  ["m\\", "m"],
  ["m/", "m"],

  ["r\\", ""],

  ["l\\", ""],
  ["l/", ""],

  ["w\\", "o"],
  ["w/", "o"],

  ["h/", ""],
  ["h\\", ""],

  ["'", ""],
]);

const StandardLatinConsonants: Rule[] = [
  ["k_h/", "kh"],
  ["k_h\\", "kh"],

  ["k", "k"],

  ["n_g\\", "ng"],
  ["n_g/", "ng"],

  ["c_h", "ch"],

  ["s/", "s"],
  ["s\\", "s"],

  ["n_y\\", "y"],
  ["n_y/", "y"],

  ["y", "y"],

  ["t_h/", "th"],
  ["t_h\\", "th"],

  ["t", "t"],

  ["n\\", "n"],
  ["n/", "n"],

  ["p_h/", "ph"],
  ["p_h\\", "ph"],

  ["b", "p"],
  ["p", "p"],

  ["f/", "f"],
  ["f\\", "f"],

  ["m\\", "m"],
  ["m/", "m"],

  ["r\\", "r"],

  ["l\\", "l"],
  ["l/", "l"],

  ["w\\", "w"],
  ["w/", "w"],

  ["h/", "h"],
  ["h\\", "h"],

  ["'", ""],
];

const StandardLatinScheme: Rule[] = chainRule<Rule>(
  StandardLatinFinalConsonants,
  prepareRules(StandardLatinConsonants),
  StandardLatinVowels,
  [[" ", ""]],
);

export const toStandardLatin = (input: string): string =>
  debugTransliterate(input, StandardLatinScheme);

const IMEScheme: Rule[] = [];

export const initIME = genericIMEInit(IMEScheme);
