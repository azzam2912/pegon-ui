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

const enum TaiLe {
  Ka = "ᥐ",
  Xa = "ᥑ",
  Nga = "ᥒ",
  Tsa = "ᥓ",
  Sa = "ᥔ",
  Ya = "ᥕ",
  Ta = "ᥖ",
  Tha = "ᥗ",
  La = "ᥘ",
  Pa = "ᥙ",
  Pha = "ᥚ",
  Ma = "ᥛ",
  Fa = "ᥜ",
  Wa = "ᥝ",
  Ha = "ᥞ",
  Qa = "ᥟ",
  Kha = "ᥠ",
  Tsha = "ᥡ",
  Na = "ᥢ",

  // vowels

  A = "ᥣ",
  I = "ᥤ",
  E = "ᥥ",
  Ee = "ᥦ",
  Eˆ = "ᥫ",
  U = "ᥧ",
  O = "ᥩ",
  Oo = "ᥨ",
  Ue = "ᥪ",
  Aue = "ᥬ",
  Ai = "ᥭ",

  // Special cases vowels
  Aai = "ᥣᥭ",
  Ei = "ᥥᥭ",
  Ui = "ᥧᥭ",
  Oi = "ᥨᥭ",
  Ooi = "ᥩᥭ",
  Uei = "ᥪᥭ",
  Eˆi = "ᥫᥭ",

  // Special cases vowels 2
  Au = "ᥣᥝ",
  Iu = "ᥤᥝ",
  Eu = "ᥥᥝ",
  Eeu = "ᥦᥝ",
  Ou = "ᥨᥝ",
  Ueu = "ᥪᥝ",
  Eˆu = "ᥫᥝ",

  // Tone marks

  tone2 = "ᥰ",
  tone3 = "ᥱ",
  tone4 = "ᥲ",
  tone5 = "ᥳ",
  tone6 = "ᥴ",

  // numbers
  Zero = "႐",
  Sung = "႑",
  Soang = "႒",
  Saam = "႓",
  Si = "႔",
  Haa = "႕",
  Hok = "႖",
  Ceet = "႗",
  Peht = "႘",
  Kau = "႙",
}

const tripleConsonants: PlainRule[] = [["t_s_h", TaiLe.Tsha]];
const dualConsonants: PlainRule[] = [
  ["n_g", TaiLe.Nga],
  ["t_s", TaiLe.Tsa],
  ["t_h", TaiLe.Tha],
  ["p_h", TaiLe.Pha],
  ["k_h", TaiLe.Kha],
];
const monoConsonants: PlainRule[] = [
  ["k", TaiLe.Ka],
  ["x", TaiLe.Xa],
  ["s", TaiLe.Sa],
  ["y", TaiLe.Ya],
  ["t", TaiLe.Ta],
  ["l", TaiLe.La],
  ["p", TaiLe.Pa],
  ["m", TaiLe.Ma],
  ["f", TaiLe.Fa],
  ["w", TaiLe.Wa],
  ["h", TaiLe.Ha],
  ["q", TaiLe.Qa],
  ["n", TaiLe.Na],
];

const diagraphVowels: PlainRule[] = [
  ["aai", TaiLe.Aai],
  ["eeu", TaiLe.Eeu],
  ["^oi", TaiLe.Ooi],
  ["^ui", TaiLe.Uei],
  ["^uu", TaiLe.Ueu],
  ["^eu", TaiLe.Eˆu],
  ["^ei", TaiLe.Eˆi],
  ["ei", TaiLe.Ei],
  ["ui", TaiLe.Ui],
  ["oi", TaiLe.Oi],
  ["ai", TaiLe.Oo],
  ["au", TaiLe.Au],
  ["iu", TaiLe.Iu],
  ["eu", TaiLe.Eu],
  ["ou", TaiLe.Ou],
  ["a^u", TaiLe.Oo],
];

const monographVowelsForEndings: PlainRule[] = [
  ["ee", TaiLe.Ee],
  ["^o", TaiLe.Oo],
  ["^u", TaiLe.Ue],
  ["^e", TaiLe.Eˆ],
  ["i", TaiLe.I],
  ["e", TaiLe.E],
  ["u", TaiLe.U],
  ["o", TaiLe.O],
];

const monographVowelsForEndingsAA: PlainRule[] = [["a", TaiLe.A]];

const monographVowelsForEndingsA: PlainRule[] = [["a", ""]];

const FinalConsonants: PlainRule[] = [
  ["n_g", TaiLe.Nga],
  ["m", TaiLe.Ma],
  ["n", TaiLe.Na],
  ["p", TaiLe.Pa],
  ["t", TaiLe.Ta],
  ["k", TaiLe.Ka],
];

const FinalConsonantsVowelsSyllables: PlainRule[] = ruleProduct(
  chainRule(monographVowelsForEndings, monographVowelsForEndingsA),
  FinalConsonants,
);

const FinalConsonantsVowelsSyllablesIndependent: PlainRule[] = ruleProduct(
  chainRule(monographVowelsForEndingsAA, monographVowelsForEndings),
  FinalConsonants,
);

const consonantSyllables: PlainRule[] = ruleProduct(
  chainRule(tripleConsonants, dualConsonants, monoConsonants),
  chainRule(
    FinalConsonantsVowelsSyllables,
    diagraphVowels,
    monographVowelsForEndings,
    monographVowelsForEndingsA,
  ),
);

const vowelSyllables: PlainRule[] = chainRule(
  FinalConsonantsVowelsSyllablesIndependent,
  diagraphVowels,
  monographVowelsForEndings,
  monographVowelsForEndingsAA,
);

const tones: PlainRule[] = [
  ["#2", TaiLe.tone2],
  ["#3", TaiLe.tone3],
  ["#4", TaiLe.tone4],
  ["#5", TaiLe.tone5],
  ["#6", TaiLe.tone6],
];

const numbers: PlainRule[] = [
  ["0", TaiLe.Zero],
  ["1", TaiLe.Sung],
  ["2", TaiLe.Soang],
  ["3", TaiLe.Saam],
  ["4", TaiLe.Si],
  ["5", TaiLe.Haa],
  ["6", TaiLe.Hok],
  ["7", TaiLe.Ceet],
  ["8", TaiLe.Peht],
  ["9", TaiLe.Kau],
];

const sortedConsonantSyllables =
  asInverse(consonantSyllables).sort(ruleKeyLengthDiff);

const sortedVowelSyllables = asInverse(vowelSyllables).sort(ruleKeyLengthDiff);

const FromLatinScheme: Rule[] = prepareRules(
  chainRule(consonantSyllables, vowelSyllables, tones, numbers),
);

const ToLatinScheme: Rule[] = prepareRules(
  chainRule(
    asInverse(vowelSyllables),
    sortedConsonantSyllables,
    asInverse(tones),
    asInverse(numbers),
  ),
);

const ReversibleLatinToLatinScheme: Rule[] = [
  ["t_s_h", "tsh"],
  ["n_g", "ng"],
  ["t_s", "ts"],
  ["t_h", "th"],
  ["p_h", "ph"],
  ["k_h", "kh"],
  ["aai", "ài"],
  ["^oi", "ói"],
  ["^ui", "îi"],
  ["^ei", "əi"],
  ["^ei", "əi"],
  ["eeu", "èu"],
  ["^uu", "îu"],
  ["^eu", "əu"],
  ["a^u", "aî"],
  ["ee", "è"],
  ["^e", "ə"],
  ["^o", "ó"],
  ["^u", "î"],
];

export const fromLatin = (input: string): string =>
  transliterate(input, FromLatinScheme);
export const toLatin = (input: string): string =>
  transliterate(input, ToLatinScheme);
export const toStandardLatin = (input: string): string =>
  transliterate(input, ReversibleLatinToLatinScheme);

const IMEScheme: Rule[] = prepareRules(
  chainRule(makeTransitive(consonantSyllables, vowelSyllables), tones, numbers),
);

export function initIME(): InputMethodEditor {
  return {
    rules: IMEScheme,
    inputEdit: (inputString: string): string =>
      transliterate(inputString, IMEScheme),
  };
}
