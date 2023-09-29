import { Batak } from "./batak-common";
import type { PlainRule, RegexRule, Rule, InputMethodEditor } from "../core";
import {
  prepareRules,
  chainRule,
  ruleProduct,
  makeTransitive,
  transliterate,
  asInverse,
  asWordEnding,
  before,
  after,
  patternList,
} from "../core";

const enum Mandailing {
  Ha = "\u1BC4",
  Na = "\u1BCA",
  Sa = "\u1BDA",
  Ca = "\u1BDA\u1BE6",
  Ka = "\u1BC4\u1BE6",
}

const DigraphConsonants: PlainRule[] = [["n_g", Batak.Nga]];

const MonographConsonants: PlainRule[] = [
  ["k", Mandailing.Ka],
  ["h", Mandailing.Ha],
  ["b", Batak.Ba],
  ["p", Batak.Pa],
  ["n", Mandailing.Na],
  ["w", Batak.Wa],
  ["g", Batak.Ga],
  ["j", Batak.Ja],
  ["d", Batak.Da],
  ["r", Batak.Ra],
  ["m", Batak.Ma],
  ["t", Batak.Ta],
  ["c", Mandailing.Ca],
  ["s", Mandailing.Sa],
  ["y", Batak.Ya],
  ["l", Batak.La],
];

const BatakConsonants = chainRule(DigraphConsonants, MonographConsonants).map(
  ([key, val]) => val,
);

const LatinConsonants = chainRule(DigraphConsonants, MonographConsonants).map(
  ([key, val]) => key,
);

const IndependentVowels: PlainRule[] = [
  ["u", Batak.U],
  ["o", Batak.A + Batak._o],
  ["e", Batak.A + Batak._e],
  ["i", Batak.I],
  ["a", Batak.A],
];

const DependentVowels: PlainRule[] = [
  ["u", Batak._u],
  ["o", Batak._o],
  ["e", Batak._e],
  ["i", Batak._i],
  ["a", ""],
];

const FinalConsonants: PlainRule[] = [["n_g", Batak._ng]];

const Punctuation: PlainRule[] = [
  [":", Batak.BinduJudul],
  [",", Batak.BinduPangolat],
  [">", Batak.BinduNaMetek],
  ['"', Batak.BinduPinarboras],
];

const Syllables: PlainRule[] = ruleProduct(
  chainRule(DigraphConsonants, MonographConsonants),
  DependentVowels,
);

const ClosedMonographConsonants: PlainRule[] = ruleProduct(
  MonographConsonants,
  [["", Batak.Virama]],
);

const ClosedDigraphConsonants: PlainRule[] = ruleProduct(DigraphConsonants, [
  ["", Batak.Virama],
]);

const ClosedConsonants: PlainRule[] = chainRule(
  ClosedDigraphConsonants,
  ClosedMonographConsonants,
);

const FromLatinScheme: Rule[] = prepareRules(
  chainRule<Rule>(
    Syllables,
    FinalConsonants,
    ClosedConsonants,
    IndependentVowels,
    Punctuation,
  ),
);

const ToLatinScheme: Rule[] = prepareRules(
  chainRule<Rule>(
    asInverse(IndependentVowels),
    asInverse(FinalConsonants),
    asInverse(ClosedConsonants),
    asInverse(Syllables),
    asInverse(Punctuation),
    [
      [Batak.A + Batak._i, "i"],
      [Batak.A + Batak._u, "u"],
    ],
  ),
);

const ReversibleLatinToLatinScheme: Rule[] = [
  before(["h", "k"], patternList(LatinConsonants)),
  after(patternList(LatinConsonants), ["h", "k"]),
  ["n_g", "ng"],
];

export const fromLatin = (input: string): string =>
  transliterate(input, FromLatinScheme);
export const toLatin = (input: string): string =>
  transliterate(input, ToLatinScheme);
export const toStandardLatin = (input: string): string =>
  transliterate(input, ReversibleLatinToLatinScheme);

const IMEScheme: Rule[] = prepareRules(
  chainRule<Rule>(
    Punctuation,
    ruleProduct(asInverse(FinalConsonants), [
      ["a", "a"],
      ["i", "i"],
      ["u", "u"],
      ["e", "e"],
      ["o", "o"],
    ]),
    Syllables,
    makeTransitive(
      ClosedMonographConsonants,
      ClosedDigraphConsonants,
      Syllables,
    ),
    // special rules
    [
      [Batak.Nga + Batak.Virama, Batak._ng],
      [
        new RegExp(`${Batak.I}(${BatakConsonants.join("|")})${Batak.Virama}`),
        `${Batak.A}${Batak._i}$1${Batak.Virama}`,
      ],
      [
        new RegExp(`${Batak.U}(${BatakConsonants.join("|")})${Batak.Virama}`),
        `${Batak.A}${Batak._u}$1${Batak.Virama}`,
      ],
    ],
    IndependentVowels,
  ),
);

export function initIME(): InputMethodEditor {
  return {
    rules: IMEScheme,
    inputEdit: (inputString: string): string =>
      transliterate(inputString, IMEScheme),
  };
}
