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

const enum Simalungun {
  A = "\u1BC1",
  Ha = "\u1BC3",
  Pa = "\u1BC8",
  Wa = "\u1BCC",
  Ra = "\u1BD3",
  Ma = "\u1BD5",
  Sa = "\u1BD9",
  Ya = "\u1BDC",
  La = "\u1BDF",
  Nda = "\u1BE1",
  Mba = "\u1BE3",

  _i = "\u1BEB",
  _ou = "\u1BE9\u1BE8",
  _u = "\u1BEF",
}

const DigraphConsonants: PlainRule[] = [
  ["m_b", Simalungun.Mba],
  ["n_d", Simalungun.Nda],
  ["n_g", Batak.Nga],
  ["n_y", Batak.Nya],
];

const MonographConsonants: PlainRule[] = [
  ["h", Simalungun.Ha],
  ["k", Simalungun.Ha],
  ["b", Batak.Ba],
  ["p", Simalungun.Pa],
  ["n", Batak.Na],
  ["w", Simalungun.Wa],
  ["g", Batak.Ga],
  ["j", Batak.Ja],
  ["d", Batak.Da],
  ["r", Simalungun.Ra],
  ["m", Simalungun.Ma],
  ["t", Batak.Ta],
  ["s", Simalungun.Sa],
  ["y", Simalungun.Ya],
  ["l", Simalungun.La],
];

const BatakConsonants = chainRule(DigraphConsonants, MonographConsonants).map(
  ([key, val]) => val,
);

const LatinConsonants = chainRule(DigraphConsonants, MonographConsonants).map(
  ([key, val]) => key,
);

const InaNiSurat = BatakConsonants.concat([Batak.A]);

const IndependentVowels: PlainRule[] = [
  ["u", Batak.U],
  ["o", Simalungun.A + Batak._o],
  ["e", Simalungun.A + Batak._e],
  ["i", Batak.I],
  ["a", Simalungun.A],
];

const DigraphDependentVowels: PlainRule[] = [["ou", Simalungun._ou]];

const MonographDependentVowels: PlainRule[] = [
  ["u", Batak._u],
  ["o", Batak._o],
  ["e", Batak._e],
  ["i", Batak._i],
  ["a", ""],
];

const DependentVowels = chainRule(
  DigraphDependentVowels,
  MonographDependentVowels,
);

const FinalConsonants: PlainRule[] = [
  ["n_g", Batak._ng],
  ["h", Batak._h],
];

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

const toDependentBatak = ([key, val]: PlainRule): RegexRule => [
  new RegExp(`(?<=(${InaNiSurat.join("|")}))${escape(key)}`),
  val,
];

const asDependentBatak = (rules: PlainRule[]): RegexRule[] =>
  rules.map(toDependentBatak);

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
    asDependentBatak(
      ruleProduct(DigraphDependentVowels, MonographDependentVowels),
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
