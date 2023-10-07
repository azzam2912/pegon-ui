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
const enum TaiViet {
  KoL = "ꪀ",
  KoH = "ꪁ",

  KhoL = "ꪂ",
  KhoH = "ꪃ",

  KhhoL = "ꪄ",
  KhhoH = "ꪅ",

  GoL = "ꪆ",
  GoH = "ꪇ",

  NgoL = "ꪈ",
  NgoH = "ꪉ",

  CoL = "ꪊ",
  CoH = "ꪋ",

  ChoL = "ꪌ",
  ChoH = "ꪍ",

  SoL = "ꪎ",
  SoH = "ꪏ",

  NyoL = "ꪐ",
  NyoH = "ꪑ",

  DoL = "ꪒ",
  DoH = "ꪓ",

  ToL = "ꪔ",
  ToH = "ꪕ",

  ThoL = "ꪖ",
  ThoH = "ꪗ",

  NoL = "ꪘ",
  NoH = "ꪙ",

  BoL = "ꪚ",
  BoH = "ꪛ",

  PoL = "ꪜ",
  PoH = "ꪝ",

  PhoL = "ꪞ",
  PhoH = "ꪟ",

  FoL = "ꪠ",
  FoH = "ꪡ",

  MoL = "ꪢ",
  MoH = "ꪣ",

  YoL = "ꪤ",
  YoH = "ꪥ",

  RoL = "ꪦ",
  RoH = "ꪧ",

  LoL = "ꪨ",
  LoH = "ꪩ",

  VoL = "ꪪ",
  VoH = "ꪫ",

  HoL = "ꪬ",
  HoH = "ꪭ",

  OL = "ꪮ",
  OH = "ꪯ",

  // vowel symbols
  MaiKang = "ꪰ",
  LakKhang = "ꪱ",
  _i = "ꪲ",
  _ue = "ꪳ",
  _u = "ꪴ",
  ee_ = "ꪵ",
  o_ = "ꪶ",
  MaiKhit = "ꪷ",
  _ia = "ꪸ",
  uea_ = "ꪹ",
  _ua = "ꪺ",
  aue_ = "ꪻ",
  ai_ = "ꪼ",
  _an = "ꪽ",
  _am = "ꪾ",

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
  MaiEk = "꪿",
  MaiTho = "꫁",
  MaiNueng = "ꫀ",
  MaiSong = "ꫂ",
}

const DigraphConsonants: PlainRule[] = [
  ["k_h/", TaiViet.KhoH],
  ["k_h\\", TaiViet.KhoL],
  ["c_h/", TaiViet.ChoH],
  ["c_h\\", TaiViet.ChoL],
  ["n_g/", TaiViet.NgoH],
  ["n_g\\", TaiViet.NgoL],
  ["n_y/", TaiViet.NyoH],
  ["n_y\\", TaiViet.NyoL],
  ["p_h/", TaiViet.PhoH],
  ["p_h\\", TaiViet.PhoL],
];

const MonographConsonants: PlainRule[] = [
  ["k/", TaiViet.KoH],
  ["k\\", TaiViet.KoL],
  ["x/", TaiViet.KhhoH],
  ["x\\", TaiViet.KhhoL],
  ["g/", TaiViet.GoH],
  ["g\\", TaiViet.GoL],
  ["c/", TaiViet.CoH],
  ["c\\", TaiViet.CoL],
  ["s/", TaiViet.SoH],
  ["s\\", TaiViet.SoL],
  ["d/", TaiViet.DoH],
  ["d\\", TaiViet.DoL],
  ["t/", TaiViet.ToH],
  ["t\\", TaiViet.ToL],
  ["th/", TaiViet.ThoH],
  ["th\\", TaiViet.ThoL],
  ["n/", TaiViet.NoH],
  ["n\\", TaiViet.NoL],
  ["b/", TaiViet.BoH],
  ["b\\", TaiViet.BoL],
  ["p/", TaiViet.PoH],
  ["p\\", TaiViet.PoL],
  ["f/", TaiViet.FoH],
  ["f\\", TaiViet.FoL],
  ["m/", TaiViet.MoH],
  ["m\\", TaiViet.MoL],
  ["y/", TaiViet.YoH],
  ["y\\", TaiViet.YoL],
  ["r/", TaiViet.RoH],
  ["r\\", TaiViet.RoL],
  ["l/", TaiViet.LoH],
  ["l\\", TaiViet.LoL],
  ["v/", TaiViet.VoH],
  ["v\\", TaiViet.VoL],
  ["h/", TaiViet.HoH],
  ["h\\", TaiViet.HoL],
  ["'/", TaiViet.OH],
  ["'\\", TaiViet.OL],
];

const Consonants: PlainRule[] = chainRule<PlainRule>(
  DigraphConsonants,
  MonographConsonants,
);

const Tones: PlainRule[] = [
  ["1", TaiViet.MaiEk],
  ["2", TaiViet.MaiTho],
  ["^1", TaiViet.MaiNueng],
  ["^2", TaiViet.MaiSong],
];

const LatinConsonants: string[] = getKeys<PlainRule>(Consonants)
  .map(escape)
  .sort(stringLengthDiff);

const LatinTones: string[] = getKeys<PlainRule>(Tones).map(escape).sort();

const TaiVietConsonants: string[] = getValues(Consonants)
  .map(escape)
  .sort(stringLengthDiff);

const TaiVietTones: string[] = getValues<PlainRule>(Tones).map(escape).sort();

const SyllableVowelsTemplate: PlainRule[] = (
  [
    ["a", `CT${TaiViet.MaiKang}`],
    ["aa", `CT${TaiViet.LakKhang}`],
    ["i", `CT${TaiViet._i}`],
    ["ue", `CT${TaiViet._ue}`],
    ["u", `CT${TaiViet._u}`],
    ["ee", `${TaiViet.ee_}CT`],
    ["o", `${TaiViet.o_}CT`],
    ["aw", `CT${TaiViet.MaiKhit}`],
    ["ia", `CT${TaiViet._ia}`],
    ["uea", `${TaiViet.uea_}CT`],
    ["ua", `CT${TaiViet._ua}`],
    ["aue", `${TaiViet.aue_}CT`],
    ["ai", `${TaiViet.ai_}CT`],
    ["an", `CT${TaiViet._an}`],
    ["am", `CT${TaiViet._am}`],
    ["e", `${TaiViet.uea_}CT${TaiViet._ia}`],
    ["^e", `${TaiViet.uea_}CT${TaiViet.MaiKhit}`],
    ["ao", `${TaiViet.uea_}CT${TaiViet.LakKhang}`],
    ["ap", `CT${TaiViet.BoL}${TaiViet._am}`],
  ] as PlainRule[]
).map(([key, val]: PlainRule): PlainRule => ["CT" + key, val] as PlainRule);

const SyllableVowels: RegexRule[] = fillTemplate(
  prepareRules(SyllableVowelsTemplate.sort(ruleKeyLengthDiff)) as PlainRule[],
  [
    ["C", `((${patternList(LatinConsonants).source})+)`],
    ["T", `(${patternList(LatinTones).source})?`],
  ],
  [
    ["C", "$1"],
    ["T", "$3"],
  ],
).map(toWordBeginning);

const Punctuation: PlainRule[] = [
  // ["-", "\u200C"],
  // [" ", "\u200C"],
  // [".", " "],
];

const InversePunctuation: PlainRule[] = chainRule<PlainRule>(
  asInverse(Punctuation.reverse()),
  // [["\\.", ". "]],
);

const Numbers: PlainRule[] = [
  ["0", TaiViet.Zero],
  ["1", TaiViet.One],
  ["2", TaiViet.Two],
  ["3", TaiViet.Three],
  ["4", TaiViet.Four],
  ["5", TaiViet.Five],
  ["6", TaiViet.Six],
  ["7", TaiViet.Seven],
  ["8", TaiViet.Eight],
  ["9", TaiViet.Nine],
];

// second pass
const SpecialFromLatin: RegexRule[] = [
  before([TaiViet.MaiKhit, TaiViet.OL], patternList(TaiVietConsonants)),
  [
    new RegExp(
      `([${TaiVietConsonants.join("")}]+)([${TaiVietTones.join("")}])?${
        TaiViet._an
      }\\\\`,
    ),
    `$1$2${TaiViet.MaiKang}${TaiViet.NoL}`,
  ],
];

const SpecialToLatin: RegexRule[] = [
  before([TaiViet.OL, TaiViet.MaiKhit], patternList(TaiVietConsonants)),
];

const FromLatinScheme: Rule[] = chainRule<Rule>(
  SyllableVowels,
  Tones.map(
    (rule: PlainRule): RegexRule => after(patternList(LatinConsonants), rule),
  ),
  prepareRules(Consonants.sort(ruleKeyLengthDiff)),
  Numbers,
  prepareRules(Punctuation),

  SpecialFromLatin,
);

export const fromLatin = (input: string): string =>
  transliterate(input, FromLatinScheme);

const InverseSyllableVowels: RegexRule[] = fillTemplate(
  asInverse(SyllableVowelsTemplate).sort(ruleKeyLengthDiff),
  [
    ["C", `((${patternList(TaiVietConsonants).source})+)`],
    ["T", `(${patternList(TaiVietTones).source})?`],
    ["X", `(${patternList(TaiVietConsonants).source})`],
  ],
  [
    ["C", `$1`],
    ["T", `$3`],
    ["X", `$4`],
  ],
).map(toWordBeginning);

const ToLatinScheme: Rule[] = chainRule<Rule>(
  SpecialToLatin,
  InversePunctuation,
  InverseSyllableVowels,
  asInverse(Consonants),
  [[/$ /g, ""]],
  asInverse(Numbers),
);

export const toLatin = (input: string): string =>
  transliterate(input, ToLatinScheme);

const StandardLatinVowels: PlainRule[] = [
  ["a", "a"],
  ["aa", "ā"],
  ["i", `i`],
  ["ue", `ư`],
  ["u", `u`],
  ["ee", `ē`],
  ["o", `o`],
  ["aw", `o`],
  ["ia", `ia`],
  ["uea", `ưa`],
  ["ua", `ua`],
  ["aue", `əw`],
  ["ai", `ai`],
  ["an", `an`],
  ["am", `am`],
  ["e", `e`],
  ["^e", `ə`],
  ["ao", `ao`],
  ["ap", `ap`],
];

const StandardLatinFinalConsonants: PlainRule[] = [
  ["kh/", ""],
  ["kh\\", ""],
  ["ng/", ""],
  ["ng\\", ""],
  ["ch/", ""],
  ["ch\\", ""],
  ["ny/", ""],
  ["ny\\", ""],
  ["th/", ""],
  ["th\\", ""],
  ["ph/", ""],
  ["ph\\", ""],
  ["x/", ""],
  ["x\\", ""],
  ["k/", ""],
  ["k\\", "k"],
  ["g/", ""],
  ["g\\", ""],
  ["c/", ""],
  ["c\\", ""],
  ["s/", ""],
  ["s\\", ""],
  ["d/", ""],
  ["d\\", "t"],
  ["t/", ""],
  ["t\\", ""],
  ["n/", ""],
  ["n\\", "n"],
  ["b/", ""],
  ["b\\", "p"],
  ["p/", ""],
  ["p\\", ""],
  ["f/", ""],
  ["f\\", ""],
  ["m/", ""],
  ["m\\", ""],
  ["y/", "y"],
  ["y\\", ""],
  ["r/", ""],
  ["r\\", ""],
  ["l/", ""],
  ["l\\", ""],
  ["v/", ""],
  ["v\\", ""],
  ["h/", ""],
  ["h\\", ""],
  ["'/", ""],
  ["'\\", ""],
];

// V is any vowel
// consonants: L is low, H is high
// tone markers: 1: low, 2: rising, 3: low falling, 4: high, 5: mid, 6: low falling
// no tone goes first so that it matches the narrowest rule
// in case any of the other rules reduce the tones and
// make the diacritic disappear
const StandardLatinTonesTemplate: PlainRule[] = [
  // no tone mark
  ["HV", "HV1"],
  ["LV", "LV4"],
  // mai nueng / tone ^1
  [escape("H^1V"), "HV2"],
  [escape("L^1V"), "LV5"],
  // mai song / tone ^2
  [escape("H^2V"), "HV3"],
  [escape("L^2V"), "LV6"],
  // mai ek / tone 1
  ["H1V", "HV2"],
  ["L1V", "LV5"],
  // mai tho / tone 2
  ["H2V", "HV3"],
  ["L2V", "LV6"],
];

const LatinHighConsonants: string[] = [];
const LatinLowConsonants: string[] = [];

for (const consonant of LatinConsonants) {
  if (consonant.endsWith("/")) {
    LatinHighConsonants.push(consonant);
  } else if (consonant.endsWith("\\")) {
    LatinLowConsonants.push(consonant);
  }
}

const StandardLatinAllVowels: string[] =
  getValues(StandardLatinVowels).sort(stringLengthDiff);

const StandardLatinTones: Rule[] = fillTemplate(
  StandardLatinTonesTemplate,
  [
    ["H", `(${patternList(LatinHighConsonants).source})`],
    ["L", `(${patternList(LatinLowConsonants).source})`],
    ["V", `(${patternList(StandardLatinAllVowels).source})`],
  ],
  [
    ["1", "\u0300"], // grave
    ["2", "\u030C"], // caron
    ["3", "\u030F"], // double grave
    ["4", "\u0301"], // acute
    ["5", ""],
    ["6", "\u030F"], // double grave

    ["H", "$1"],
    ["L", "$1"],

    ["V", "$2"],
  ],
).map(toRegexRule);

const MonographStandardLatinVowel: string[] = StandardLatinAllVowels.filter(
  (v: string): boolean => v.length == 1,
);

const StandardLatinDiacriticRepositioning: RegexRule[] = fillTemplate(
  [["(V)(\u0304)?((W)+)(X)", "$1$2$5$3"]],
  [
    ["V", patternList(MonographStandardLatinVowel).source],
    [
      "W",
      patternList(["w", "n", "m", "p", ...MonographStandardLatinVowel]).source,
    ],
    [
      "X",
      patternList(["\u0300", "\u0301", "\u0302", "\u030C", "\u030F"]).source,
    ],
  ],
  [],
).map(toRegexRule);

const StandardLatinConsonants: Rule[] = [
  ["kh/", "kh"],
  ["kh\\", "kh"],
  ["ng/", "ng"],
  ["ng\\", "ng"],
  ["ch/", "ch"],
  ["ch\\", "ch"],
  ["ny/", "ny"],
  ["ny\\", "ny"],
  ["th/", "th"],
  ["th\\", "th"],
  ["ph/", "ph"],
  ["ph\\", "ph"],
  ["x/", "khh"],
  ["x\\", "khh"],
  ["k/", "k"],
  ["k\\", "k"],
  ["g/", "g"],
  ["g\\", "g"],
  ["c/", "c"],
  ["c\\", "c"],
  ["s/", "s"],
  ["s\\", "s"],
  ["d/", "d"],
  ["d\\", "d"],
  ["t/", "t"],
  ["t\\", "t"],
  ["n/", "n"],
  ["n\\", "n"],
  ["b/", "b"],
  ["b\\", "b"],
  ["p/", "p"],
  ["p\\", "p"],
  ["f/", "f"],
  ["f\\", "f"],
  ["m/", "m"],
  ["m\\", "m"],
  ["y/", "y"],
  ["y\\", "y"],
  ["r/", "r"],
  ["r\\", "r"],
  ["l/", "l"],
  ["l\\", "l"],
  ["v/", "v"],
  ["v\\", "v"],
  ["h/", "h"],
  ["h\\", "h"],
  ["'/", "o"],
  ["'\\", "o"],
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
