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
} from "../core";

const enum Burmese {
  Ka = "က",
  Kha = "ခ",
  Ga = "ဂ",
  Gha = "ဃ",
  Nga = "င",
  Ca = "စ",
  Cha = "ဆ",
  Ja = "ဇ",
  Jha = "ဈ",
  Nnya = "ည",
  Nya = "ဉ",
  Tta = "ဋ",
  Ttha = "ဌ",
  Dda = "ဍ",
  Ddha = "ဎ",
  Nna = "ဏ",
  Ta = "တ",
  Tha = "ထ",
  Da = "ဒ",
  Dha = "ဓ",
  Na = "န",
  Pa = "ပ",
  Pha = "ဖ",
  Ba = "ဗ",
  Bha = "ဘ",
  Ma = "မ",
  Ya = "ယ",
  Ra = "ရ",
  La = "လ",
  Wa = "ဝ",
  Sa = "သ",
  Ssa = "ဿ",
  Ha = "ဟ",
  Lla = "ဠ",
  A = "အ",

  // independent vowels

  I = "ဣ",
  Ii = "ဤ",
  U = "ဥ",
  Uu = "ဦ",
  E = "ဧ",
  O = "ဩ",
  Oˆ = "ဪ",

  // diacritics
  // medial consonants
  _y_ = "ျ",
  _w_ = "ွ",
  _r_ = "ြ",
  _h_ = "ှ",
  // final diacritics
  asat = "်",
  virama = "္",

  // Tone marks

  tone1 = "့",
  tone2 = "း",

  // vowels
  __aa = "ာ",
  __i = "ိ",
  __ii = "ီ",
  __u = "ု",
  __uu = "ူ",
  __e = "ေ",
  __ai = "ဲ",
  __o = "ော",
  __oˆ = "ော်",
  __ui = "ို",

  // numbers
  Sunya = "၀",
  Tas = "၁",
  Nhas = "၂",
  Sum = "၃",
  Le = "၄",
  Ngaa = "၅",
  Khrauk = "၆",
  Khu = "၇",
  Rhas = "၈",
  Kui = "၉",

  // punctuation
  Coma = "၊",
  Period = "။",
}

const singleAasConsonant: PlainRule[] = [["", Burmese.A]];

const monographConsonants: PlainRule[] = [
  ["k", Burmese.Ka],
  ["g", Burmese.Ga],
  ["c", Burmese.Ca],
  ["j", Burmese.Ja],
  ["t", Burmese.Ta],
  ["d", Burmese.Da],
  ["n", Burmese.Na],
  ["p", Burmese.Pa],
  ["b", Burmese.Ba],
  ["m", Burmese.Ma],
  ["y", Burmese.Ya],
  ["r", Burmese.Ra],
  ["l", Burmese.La],
  ["w", Burmese.Wa],
  ["s", Burmese.Sa],
  ["h", Burmese.Ha],
];

const digraphConsonants: PlainRule[] = [
  ["k_h", Burmese.Kha],
  ["g_h", Burmese.Gha],
  ["c_h", Burmese.Cha],
  ["j_h", Burmese.Jha],
  ["t_h", Burmese.Tha],
  ["d_h", Burmese.Dha],
  ["p_h", Burmese.Pha],
  ["b_h", Burmese.Bha],
  ["n_g", Burmese.Nga],
  ["n_y", Burmese.Nnya],
  ["t_t", Burmese.Tta],
  ["d_d", Burmese.Dda],
  ["n_n", Burmese.Nna],
  ["l_l", Burmese.Lla],
];

const trigraphConsonants: PlainRule[] = [
  ["t_t_h", Burmese.Ttha],
  ["d_d_h", Burmese.Ddha],
];

const medialConsonants: PlainRule[] = [
  ["ywh", Burmese._y_ + Burmese._w_ + Burmese._h_],
  ["yh", Burmese._y_ + Burmese._h_],
  ["yw", Burmese._y_ + Burmese._w_],

  ["rwh", Burmese._r_ + Burmese._w_ + Burmese._h_],
  ["rh", Burmese._r_ + Burmese._h_],
  ["rw", Burmese._r_ + Burmese._w_],
  ["wh", Burmese._w_ + Burmese._h_],
  ["y", Burmese._y_],
  ["r", Burmese._r_],
  ["w", Burmese._w_],
  ["h", Burmese._h_],
];

const latinMedialConsonants: string[] = medialConsonants.map(
  ([key, val]) => key,
);

const trigraphConsonantsWithMedials: PlainRule[] = ruleProduct(
  trigraphConsonants,
  medialConsonants,
);

const digraphConsonantsWithMedials: PlainRule[] = ruleProduct(
  digraphConsonants,
  medialConsonants,
);

const monographConsonantWithMedials: PlainRule[] = ruleProduct(
  monographConsonants,
  medialConsonants,
);

const tone: PlainRule[] = [
  ["'", Burmese.tone1],
  ['"', Burmese.tone2],
];

const monographIndependentVowels: PlainRule[] = [
  ["i", Burmese.I],
  ["u", Burmese.U],
  ["e", Burmese.E],
  ["o", Burmese.O],
];

const digraphIndependentVowels: PlainRule[] = [
  ["o^", Burmese.Oˆ],
  ["ii", Burmese.Ii],
  ["uu", Burmese.Uu],
];

const dependentLongVowels: PlainRule[] = [
  ["aa", Burmese.__aa],
  ["ii", Burmese.__ii],
  ["uu", Burmese.__uu],
];

const dependentMonographVowels: PlainRule[] = [
  ["a", ""],
  ["i", Burmese.__i],
  ["u", Burmese.__u],
  ["e", Burmese.__e],
  ["o", Burmese.__o],
];

const dependentDigraphVowels: PlainRule[] = [["o^", Burmese.__oˆ]];

const dipthongVowels: PlainRule[] = [
  ["ai", Burmese.__ai],
  ["ui", Burmese.__ui],
];

const addAsVowelToAConsonant: PlainRule[] = [
  ["ai", Burmese.__ai],
  ["ui", Burmese.__ui],
  ["aa", Burmese.__aa],
  ["a", ""],
];

const numbers: PlainRule[] = [
  ["0", Burmese.Sunya],
  ["1", Burmese.Tas],
  ["2", Burmese.Nhas],
  ["3", Burmese.Sum],
  ["4", Burmese.Le],
  ["5", Burmese.Ngaa],
  ["6", Burmese.Khrauk],
  ["7", Burmese.Khu],
  ["8", Burmese.Rhas],
  ["9", Burmese.Kui],
];

const punctuations: PlainRule[] = [
  [",", Burmese.Coma],
  [".", Burmese.Period],
  [" ", "‌"],
];

const SyllablesWithMedial: PlainRule[] = ruleProduct(
  chainRule(
    trigraphConsonantsWithMedials,
    digraphConsonantsWithMedials,
    monographConsonantWithMedials,
  ),
  chainRule(
    dipthongVowels,
    dependentLongVowels,
    dependentDigraphVowels,
    dependentMonographVowels,
  ),
);

const Syllables: PlainRule[] = ruleProduct(
  chainRule(trigraphConsonants, digraphConsonants, monographConsonants),
  chainRule(
    dipthongVowels,
    dependentLongVowels,
    dependentDigraphVowels,
    dependentMonographVowels,
  ),
);

const SyllablesOfVowels: PlainRule[] = ruleProduct(
  singleAasConsonant,
  addAsVowelToAConsonant,
);

const ClosedConsonants: PlainRule[] = ruleProduct(
  chainRule(trigraphConsonants, digraphConsonants, monographConsonants),
  [["", Burmese.asat]],
);

// second pass, assumes everything is already Burmese

const specialNyaRule: PlainRule[] = [
  [Burmese.Nnya + Burmese.__aa, Burmese.Nya + Burmese.__aa],
  [Burmese.Nnya + Burmese.asat, Burmese.Nya],
];

const ViramaToAsatRule: PlainRule[] = (
  ([[Burmese.Ka, Burmese.Ka],
  [Burmese.Ka, Burmese.Kha],
  [Burmese.Ga, Burmese.Ga],
  [Burmese.Ga, Burmese.Gha],
  [Burmese.Ca, Burmese.Ca],
  [Burmese.Ca, Burmese.Cha],
  [Burmese.Ja, Burmese.Ja],
  [Burmese.Ja, Burmese.Jha],
  [Burmese.Nya, Burmese.Ca],
  [Burmese.Nya, Burmese.Cha],
  [Burmese.Nya, Burmese.Ja],
  [Burmese.Nya, Burmese.Jha],
  [Burmese.Ta, Burmese.Ta],
  [Burmese.Ta, Burmese.Tha],
  [Burmese.Da, Burmese.Da],
  [Burmese.Da, Burmese.Dha],
  [Burmese.Nna, Burmese.Ta],
  [Burmese.Nna, Burmese.Da],
  [Burmese.Ta, Burmese.Ta],
  [Burmese.Ta, Burmese.Tha],
  [Burmese.Da, Burmese.Da],
  [Burmese.Da, Burmese.Dha],
  [Burmese.Na, Burmese.Ta],
  [Burmese.Na, Burmese.Tha],
  [Burmese.Na, Burmese.Na],
  [Burmese.Pa, Burmese.Pa],
  [Burmese.Pa, Burmese.Pha],
  [Burmese.Ba, Burmese.Ba],
  [Burmese.Ba, Burmese.Bha],
  [Burmese.Ma, Burmese.Pa],
  [Burmese.Ma, Burmese.Ba],
  [Burmese.Ma, Burmese.Bha],
  [Burmese.Ma, Burmese.Ma],
  [Burmese.La, Burmese.La],
  [Burmese.Lla, Burmese.Lla]]
) as Array<[string, string]>
).map(
  ([left, right]: [string, string]): PlainRule => [
    left + Burmese.asat + right,
    left + Burmese.virama + right
  ],
);

const specialSsaRule: PlainRule[] = [
  [Burmese.Sa + Burmese.asat + Burmese.Sa, Burmese.Ssa],
];

const FromLatinScheme: Rule[] = prepareRules(
  chainRule(
    SyllablesWithMedial,
    Syllables,
    ClosedConsonants,
    digraphIndependentVowels,
    monographIndependentVowels,
    SyllablesOfVowels,
    tone,
    numbers,
    punctuations,
    // second pass
    specialNyaRule,
    ViramaToAsatRule,
    specialSsaRule,
  ),
);

const ToLatinScheme: Rule[] = prepareRules(
  chainRule(
    // inverse second pass, first
    asInverse(specialNyaRule),
    asInverse(ViramaToAsatRule),
    asInverse(specialSsaRule),

    asInverse(ClosedConsonants),
    asInverse(SyllablesWithMedial),
    asInverse(Syllables),
    asInverse(digraphIndependentVowels),
    asInverse(monographIndependentVowels),
    asInverse(SyllablesOfVowels),
    asInverse(tone),
    asInverse(numbers),
    asInverse(punctuations),
  ),
);

const ReversibleLatinToLatinScheme: Rule[] = [
  ["s", "θ"],
  ["n_yaa", "ñaa"],
  [/n_y(?=($|[\s\W]))/, "ñ"],
  ["n_y", "ññ"],
  ["t_t_h", "ṭh"],
  ["d_d_h", "ḍh"],
  ["t_t", "ṭ"],
  ["d_d", "ḍ"],
  ["n_n", "ṇ"],
  ["l_l", "ḷ"],
  ["k_h", "kh"],
  ["g_h", "gh"],
  ["n_g", "ng"],
  ["c_h", "sh"],
  ["j_h", "jh"],
  ["n_y", "ñ"],
  ["t_h", "th"],
  ["d_h", "dh"],
  ["p_h", "ph"],
  ["b_h", "bh"],
  ["c", "s"],
  ["r", "y"],

  ["o^", "o'"],
  ["aa", "à"],
  ["ii", "ī"],
  ["uu", "ū"],
];

export const fromLatin = (input: string): string =>
  transliterate(input, FromLatinScheme);
export const toLatin = (input: string): string =>
  transliterate(input, ToLatinScheme);
export const toStandardLatin = (input: string): string =>
  transliterate(input, ReversibleLatinToLatinScheme);

const IMEScheme: Rule[] = prepareRules(
  chainRule(
    makeTransitive(ClosedConsonants, SyllablesWithMedial, Syllables),
    digraphIndependentVowels,
    monographIndependentVowels,
    SyllablesOfVowels,
    tone,
    numbers,
    punctuations,

    specialNyaRule,
    ViramaToAsatRule,
    specialSsaRule,
  ),
);

export function initIME(): InputMethodEditor {
  return {
    rules: IMEScheme,
    inputEdit: (inputString: string): string =>
      transliterate(inputString, IMEScheme),
  };
}
