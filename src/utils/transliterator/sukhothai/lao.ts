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
  ruleKeyLengthDiff,
  stringLengthDiff,
  getKeys,
  getValues,
  toSingleWord,
  toWordBeginning,
  toWordEnding,
  after,
  before,
  separate,
  toRegexRule,
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

const Consonants: PlainRule[] = [
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

const Tones: PlainRule[] = [
  ["1", Lao.MaiEk],
  ["2", Lao.MaiTho],
  ["3", Lao.MaiTri],
  ["4", Lao.MaiChattawa],
];

const LatinConsonants: string[] = getKeys<PlainRule>(Consonants)
  .map(escape)
  .sort(stringLengthDiff);

const LatinTones: string[] = getKeys<PlainRule>(Tones).map(escape).sort();

const LaoConsonants: string[] = getValues<PlainRule>(Consonants)
  .map(escape)
  .sort(stringLengthDiff);

const LaoTones: string[] = getValues<PlainRule>(Tones).map(escape).sort();

const OpenSyllableVowelsTemplate: PlainRule[] = (
  [
    // diphthongs
    ["iaa", `${Lao._e}CT${Lao.NyoNyungL}`],
    ["ia", `${Lao._e}CT${Lao.MaiKan}${Lao.NyoNyungL}`],

    ["ueaa", `${Lao._e}CT${Lao._uee}${Lao.OAng}`],
    ["uea", `${Lao._e}CT${Lao._ue}${Lao.OAng}`],

    ["uaa", `CT${Lao.MaiKon}${Lao.WoWiL}`],
    ["ua", `CT${Lao.MaiKon}${Lao.WoWiL}${Lao.NomNang}`],

    // special diphthongs, short
    ["aii", `${Lao._aii}CT`],
    ["ai", `${Lao._ai}CT`],
    ["ao", `${Lao._e}CT${Lao.MaiKon}${Lao.LakKhang}`],
    ["am", `CT${Lao.Niggahita}${Lao.LakKhang}`],

    // base vowels, long
    ["^oo", `${Lao._o}CT`],
    ["aae", `${Lao._ae}CT`],
    ["ooe", `${Lao._e}CT${Lao._ii}`],
    ["uue", `CT${Lao._uee}${Lao.OAng}`],
    ["aa", `CT${Lao.LakKhang}`],
    ["ee", `${Lao._e}CT`],
    ["ii", `CT${Lao._ii}`],
    ["oo", `CT${Lao.Niggahita}`],
    ["uu", `CT${Lao._uu}`],

    // base vowels, short
    ["ae", `${Lao._ae}CT${Lao.NomNang}`],
    ["^o", `${Lao._o}CT${Lao.NomNang}`],
    ["oe", `${Lao._e}CT${Lao._ii}`],
    ["ue", `CT${Lao._ue}`],
    ["i", `CT${Lao._i}`],
    ["u", `CT${Lao._u}`],
    ["o", `${Lao._e}CT${Lao.LakKhang}${Lao.NomNang}`],
    ["e", `${Lao._e}CT${Lao.NomNang}`],
    ["a", `CT${Lao.NomNang}`],
  ] as PlainRule[]
).map(([key, val]: PlainRule): PlainRule => ["CT" + key, val] as PlainRule);

const OpenSyllableVowels: RegexRule[] = fillTemplate(
  prepareRules(
    OpenSyllableVowelsTemplate.sort(ruleKeyLengthDiff),
  ) as PlainRule[],
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
    ["iaa", `CT${Lao.NyoFyangSemi}X`],
    ["ia", `CT${Lao.MaiKan}${Lao.NyoFyangSemi}X`],

    ["ueaa", `${Lao._e}CT${Lao._uee}${Lao.OAng}`],
    ["uea", `${Lao._e}CT${Lao._ue}${Lao.OAng}`],

    ["uaa", `CT${Lao.WoWiL}X`],
    ["ua", `CT${Lao.MaiKan}${Lao.WoWiL}X`],

    // base vowels, long
    ["^oo", `${Lao._o}CTX`],
    ["aae", `${Lao._ae}CTX`],
    ["ooe", `${Lao._e}CT${Lao._ii}X`],
    ["uue", `CT${Lao._uee}${Lao.OAng}X`],
    ["aa", `CT${Lao.LakKhang}X`],
    ["ee", `${Lao._e}CTX`],
    ["ii", `CT${Lao._ii}X`],
    ["uu", `CT${Lao._uu}X`],
    ["oo", `CT${Lao.OAng}X`],

    // base vowels, short
    ["ae", `${Lao._ae}CT${Lao.MaiKan}X`],
    ["^o", `CT${Lao.MaiKon}X`],
    ["ue", `CT${Lao._ue}X`],
    ["o", `CT${Lao.MaiKan}${Lao.OAng}X`],
    ["i", `CT${Lao._i}X`],
    ["u", `CT${Lao._u}X`],
    ["e", `${Lao._e}CT${Lao.MaiKan}X`],
    ["a", `CT${Lao.MaiKan}X`],
  ] as PlainRule[]
).map(([key, val]: PlainRule): PlainRule => ["CT" + key + "X", val]);

const ClosedSyllableVowels: RegexRule[] = fillTemplate(
  prepareRules(
    ClosedSyllableVowelsTemplate.sort(ruleKeyLengthDiff),
  ) as PlainRule[],
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
    [`${Lao.PaiyanNoi}${Lao.LoLingL}${Lao.PaiyanNoi}`, " etc"],
    [Lao.MaiYamok, "2"],
    [Lao.PaiyanNoi, "."],
    ["\\.", ". "],
  ],
);

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

const FromLatinScheme: Rule[] = chainRule<Rule>(
  ClosedSyllableVowels,
  OpenSyllableVowels,
  Tones.map(
    (rule: PlainRule): RegexRule => after(patternList(LatinConsonants), rule),
  ),
  prepareRules(Consonants.sort(ruleKeyLengthDiff)),
  Numbers,
  prepareRules(Punctuation),
);

export const fromLatin = (input: string): string =>
  transliterate(input, FromLatinScheme);

const InverseSyllableVowels: RegexRule[] = fillTemplate(
  chainRule<PlainRule>(
    asInverse(ClosedSyllableVowelsTemplate).sort(ruleKeyLengthDiff),
    asInverse(OpenSyllableVowelsTemplate).sort(ruleKeyLengthDiff),
    [["CT", "CTa"]],
  ),
  [
    ["C", `((${patternList(LaoConsonants).source})+)`],
    ["T", `(${patternList(LaoTones).source})?`],
    ["X", `(${patternList(LaoConsonants).source})`],
  ],
  [
    ["C", `$1`],
    ["T", `$3`],
    ["X", `$4`],
  ],
).map(toSingleWord);

const ToLatinScheme: Rule[] = chainRule<Rule>(
  InversePunctuation,
  InverseSyllableVowels,
  asInverse(Consonants),
  [[/$ /g, ""]],
  asInverse(Numbers),
);

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
  ["^oo", "ô̄"],
  ["^o", "ô"],
  ["oo", "ō"],
  ["aae", "è̄"],
  ["ooe", "ēu"],
  ["uue", "ư̄"],
  ["aa", "ā"],
  ["ee", "é̄"],
  ["ii", "ī"],
  ["oo", "ō"],
  ["uu", "ū"],

  // base vowels, short
  ["ae", "è"],
  ["o", "o"],
  ["oe", "eu"],
  ["ue", "ư"],
  ["i", "i"],
  ["u", "u"],
  ["e", "é"],
  ["a", "a"],
];

const StandardLatinFinalConsonants: PlainRule[] = [
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

  ["w\\", "w"],
  ["w/", "w"],

  ["h/", ""],
  ["h\\", ""],

  ["'", ""],
];

const StandardLatinSonorantFinals: string[] = ["ng", "m", "n", "w", "y"];
const StandardLatinStopFinals: string[] = ["p", "t", "k"];

// v is short vowel, V is long vowel, W is any vowel
// S is sonorant, P is stop/plosive
// consonants: M is mid, L is low, H is high
// tone markers: l: low, f: falling, h: high, r: rising, m: mid
// no tone goes first so that it matches the narrowest rule
// in case any of the other rules reduce the tones and
// make the diacritic disappear
const StandardLatinTonesTemplate: PlainRule[] = [
  // no tone mark
  // plosive, long vowel
  ["HVP", "HVlfP"],
  ["MVP", "MVlfP"],
  ["LvP", "LVhfP"],
  // plosive, short vowel
  ["HvP", "HvhP"],
  ["MvP", "MvhP"],
  ["LvP", "LvmP"],
  // sonorant
  ["HWS", "HWrS"],
  ["MWS", "MWrS"],
  ["LWS", "LWhS"],
  // no final consonant
  ["HWX", "HWr"],
  ["MWX", "MWr"],
  ["LWX", "LWh"],
  // mai chattawa / tone 4
  ["C4W", "CWr"],
  // mai tri / tone 3
  ["C3W", "CWh"],
  // mai tho / tone 2
  ["H2W", "HWlf"],
  ["M2W", "MWhf"],
  ["L2W", "LWhf"],
  // mai ek / tone 1
  ["H1W", "HWm"],
  ["M1W", "MWm"],
  ["L1W", "LWm"],
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

const StandardLatinAllVowels: string[] =
  getValues(StandardLatinVowels).sort(stringLengthDiff);

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
    ["r", "\u030C"], // caron
    ["m", ""],
    ["lf", "\u1DC6"], // macron-grave
    ["l", "\u0300"], // grave
    ["hf", "\u0302"], // circumflex
    ["h", "\u0301"], // acute

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
  asWordEnding(StandardLatinFinalConsonants),
  prepareRules(StandardLatinVowels),
  StandardLatinTones,
  prepareRules(StandardLatinConsonants),
  StandardLatinDiacriticRepositioning,
);

export const toStandardLatin = (input: string): string =>
  transliterate(input, StandardLatinScheme);

const IMEScheme: Rule[] = [[" ", "\u200C"]];

export const initIME = genericIMEInit(IMEScheme);
