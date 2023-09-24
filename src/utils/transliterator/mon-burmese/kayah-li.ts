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
  after,
  patternList,
} from "../core";

const enum KayahLi {
  A = "\uA922",
  I = "\uA924",
  E = "\uA922\uA927",
  U = "\uA922\uA928",
  O = "\uA922\uA92A",

  OE = "\uA923",
  OO = "\uA925",

  UE = "\uA922\uA926",
  EE = "\uA922\uA929",

  LowTone = "\uA92C",
  HighTone = "\uA92B",
  MidTone = "\uA92D",

  K = "\uA90A",
  G = "\uA90C",
  S = "\uA90E",
  Z = "\uA910",
  T = "\uA912",
  N = "\uA914",
  P = "\uA915",
  M = "\uA917",
  D = "\uA918",
  B = "\uA919",
  R = "\uA91A",
  Y = "\uA91B",
  L = "\uA91C",
  W = "\uA91D",
  H = "\uA91F",
  V = "\uA920",
  C = "\uA921",

  Kh = "\uA90B",
  Ng = "\uA90D",
  Sh = "\uA90F",
  Ny = "\uA911",
  Ht = "\uA913",
  Ph = "\uA916",
  Th = "\uA91E",

  Zero = "꤀",
  One = "꤁",
  Two = "꤂",
  Three = "꤃",
  Four = "꤄",
  Five = "꤅",
  Six = "꤆",
  Seven = "꤇",
  Eight = "꤈",
  Nine = "꤉",
}

const DigraphLatinDigraphKayahLiVowels: PlainRule[] = [
  ["u_e", KayahLi.UE],
  ["e_e", KayahLi.EE],
];

const DigraphLatinMonographKayahLiVowels: PlainRule[] = [
  ["o_e", KayahLi.OE],
  ["o_o", KayahLi.OO],
];

const MonographLatinMonographKayahLiVowels: PlainRule[] = [
  ["a", KayahLi.A],
  ["i", KayahLi.I],
];

const MonographLatinDigraphKayahLiVowels: PlainRule[] = [
  ["e", KayahLi.E],
  ["u", KayahLi.U],
  ["o", KayahLi.O],
];

const KayahLiVowels = chainRule(
  DigraphLatinDigraphKayahLiVowels,
  MonographLatinDigraphKayahLiVowels,
  DigraphLatinMonographKayahLiVowels,
  MonographLatinMonographKayahLiVowels,
).map(([key, val]) => val);

const LatinVowels = chainRule(
  DigraphLatinDigraphKayahLiVowels,
  DigraphLatinMonographKayahLiVowels,
  MonographLatinDigraphKayahLiVowels,
  MonographLatinMonographKayahLiVowels,
).map(([key, val]) => key);

const MonographConsonants: PlainRule[] = [
  ["k", KayahLi.K],
  ["g", KayahLi.G],
  ["s", KayahLi.S],
  ["z", KayahLi.Z],
  ["t", KayahLi.T],
  ["n", KayahLi.N],
  ["p", KayahLi.P],
  ["m", KayahLi.M],
  ["d", KayahLi.D],
  ["b", KayahLi.B],
  ["r", KayahLi.R],
  ["y", KayahLi.Y],
  ["l", KayahLi.L],
  ["w", KayahLi.W],
  ["h", KayahLi.H],
  ["v", KayahLi.V],
  ["c", KayahLi.C],
];

const DigraphConsonants: PlainRule[] = [
  ["k_h", KayahLi.Kh],
  ["n_g", KayahLi.Ng],
  ["s_h", KayahLi.Sh],
  ["n_y", KayahLi.Ny],
  ["h_t", KayahLi.Ht],
  ["p_h", KayahLi.Ph],
  ["t_h", KayahLi.Th],
];

const ToneNumbers: PlainRule[] = [
  ["3", KayahLi.HighTone],
  ["2", KayahLi.MidTone],
  ["1", KayahLi.LowTone],
];

const Numbers: PlainRule[] = [
  ["0", KayahLi.Zero],
  ["1", KayahLi.One],
  ["2", KayahLi.Two],
  ["3", KayahLi.Three],
  ["4", KayahLi.Four],
  ["5", KayahLi.Five],
  ["6", KayahLi.Six],
  ["7", KayahLi.Seven],
  ["8", KayahLi.Eight],
  ["9", KayahLi.Nine],
];

const ToneNumbersAsKayahLiVowelDiacritics: RegexRule[] = ToneNumbers.map(
  ([key, val]) => [new RegExp(`(?<=(${KayahLiVowels.join("|")}))${key}`), val],
);

const ToneNumbersAsLatinVowelDiacritics: RegexRule[] = ToneNumbers.map(
  ([key, val]) => [new RegExp(`(?<=(${LatinVowels.join("|")}))${key}`), val],
);

// second pass ONLY
const Diphthongs: PlainRule[] = [
  ["ꤢꤦꤢꤧ", "ꤣꤧ"],
  ["ꤢꤦꤣ", "ꤛꤣ"],
  ["ꤟꤢꤦꤣ", "ꤟꤌꤣ"],
  ["ꤣꤢꤦ", "ꤣꤦ"],
  ["ꤣꤢꤨ", "ꤣꤨ"],
  ["ꤣꤢꤩ", "ꤣꤩ"],
  ["ꤣꤢꤪ", "ꤣꤪ"],
];

const FromLatinScheme: Rule[] = prepareRules(
  chainRule<Rule>(
    DigraphLatinDigraphKayahLiVowels,
    DigraphLatinMonographKayahLiVowels,
    MonographLatinDigraphKayahLiVowels,
    MonographLatinMonographKayahLiVowels,
    DigraphConsonants,
    MonographConsonants,
    ToneNumbersAsLatinVowelDiacritics,
    Diphthongs,
    Numbers,
  ),
);

const ToLatinScheme: Rule[] = prepareRules(
  asInverse(
    chainRule<PlainRule>(
      Diphthongs,
      DigraphLatinDigraphKayahLiVowels,
      DigraphLatinMonographKayahLiVowels,
      MonographLatinDigraphKayahLiVowels,
      MonographLatinMonographKayahLiVowels,
      DigraphConsonants,
      MonographConsonants,
      ToneNumbers,
      Numbers,
    ),
  ),
);

const latinVowels = ["a", "i", "u", "e", "o", "ư", "ê", "ơ", "ô"];

const ReversibleLatinToLatinScheme: Rule[] = chainRule<Rule>(
  [
    ["k_h", "kʰ"],
    ["n_g", "ng"],
    ["s_h", "sʰ"],
    ["n_y", "ny"],
    ["h_t", "tʰ"],
    ["p_h", "pʰ"],
    ["t_h", "tʰ"],
  ],

  [
    ["u_e", "ư"],
    ["e_e", "ê"],
    ["o_e", "ơ"],
    ["o_o", "ô"],
  ],
  (
    [
      ["3", "́"], // high tone
      ["2", "̄"], // mid tone
      ["1", "̀"], // low tone
    ] as PlainRule[]
  ).map((rule: PlainRule): RegexRule => after(patternList(latinVowels), rule)),
  latinVowels.map<Rule>((vowel) => ["h".concat(vowel), vowel.concat("̤")]),
);

export const fromLatin = (input: string): string =>
  transliterate(input, FromLatinScheme);
export const toLatin = (input: string): string =>
  transliterate(input, ToLatinScheme);
export const toStandardLatin = (input: string): string =>
  transliterate(input, ReversibleLatinToLatinScheme);

const IMEScheme: Rule[] = prepareRules(
  chainRule<Rule>(
    makeTransitive(
      chainRule<PlainRule>(
        MonographLatinDigraphKayahLiVowels,
        MonographLatinMonographKayahLiVowels,
      ),
      chainRule<PlainRule>(
        DigraphLatinDigraphKayahLiVowels,
        DigraphLatinMonographKayahLiVowels,
      ),
    ),
    makeTransitive(MonographConsonants, DigraphConsonants),
    ToneNumbersAsKayahLiVowelDiacritics,
    Diphthongs,
    Numbers,
  ),
);

export function initIME(): InputMethodEditor {
  return {
    rules: IMEScheme,
    inputEdit: (inputString: string): string =>
      transliterate(inputString, IMEScheme),
  };
}
