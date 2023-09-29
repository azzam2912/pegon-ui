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

const enum Mon {
  Ka = "က",
  Kha = "ခ",
  Ga = "ဂ",
  Gha = "ဃ",
  Nga = "ၚ",
  Ca = "စ",
  Cha = "ဆ",
  Ja = "ဇ",
  Jha = "ၛ",
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
  Bba = "ၜ",
  Bbe = "ၝ",

  // independent vowels

  I = "ဣ",
  Ii = "ဤ",
  U = "ဥ",
  Uu = "ဦ",
  E = "ဨ",
  O = "ဩ",
  Oˆ = "ဪ",

  // diacritics
  // medial consonants
  _y_ = "ျ",
  _w_ = "ွ",
  _r_ = "ြ",
  _h_ = "ှ",
  _n_ = "ၞ",
  _m_ = "ၟ",
  _l_ = "ၠ",
  // final diacritics
  asat = "်",
  virama = "္",

  // Tone marks

  tone1 = "့",
  tone2 = "း",

  // vowels
  __aa = "ာ",
  __i = "ိ",
  __ii = "ဳ",
  __u = "ု",
  __uu = "ူ",
  __e = "ေ",
  __ai = "ဲ",
  __o = "ဴ",
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

const monoBbe: PlainRule[] = [["b_be", Mon.Bbe]];

const singleAasConsonant: PlainRule[] = [["", Mon.A]];

const monographConsonants: PlainRule[] = [
  ["k", Mon.Ka],
  ["g", Mon.Ga],
  ["c", Mon.Ca],
  ["j", Mon.Ja],
  ["t", Mon.Ta],
  ["d", Mon.Da],
  ["n", Mon.Na],
  ["p", Mon.Pa],
  ["b", Mon.Ba],
  ["m", Mon.Ma],
  ["y", Mon.Ya],
  ["r", Mon.Ra],
  ["l", Mon.La],
  ["w", Mon.Wa],
  ["s", Mon.Sa],
  ["h", Mon.Ha],
];

const digraphConsonants: PlainRule[] = [
  ["b_b", Mon.Bba],
  ["k_h", Mon.Kha],
  ["g_h", Mon.Gha],
  ["c_h", Mon.Cha],
  ["j_h", Mon.Jha],
  ["t_h", Mon.Tha],
  ["d_h", Mon.Dha],
  ["p_h", Mon.Pha],
  ["b_h", Mon.Bha],
  ["n_g", Mon.Nga],
  ["n_y", Mon.Nnya],
  ["t_t", Mon.Tta],
  ["d_d", Mon.Dda],
  ["n_n", Mon.Nna],
  ["l_l", Mon.Lla],
];

const trigraphConsonants: PlainRule[] = [
  ["t_t_h", Mon.Ttha],
  ["d_d_h", Mon.Ddha],
];

const medialConsonants: PlainRule[] = [
  ["ywh", Mon._y_ + Mon._w_ + Mon._h_],
  ["yh", Mon._y_ + Mon._h_],
  ["yw", Mon._y_ + Mon._w_],

  ["rwh", Mon._r_ + Mon._w_ + Mon._h_],
  ["rh", Mon._r_ + Mon._h_],
  ["rw", Mon._r_ + Mon._w_],
  ["wh", Mon._w_ + Mon._h_],
  ["y", Mon._y_],
  ["r", Mon._r_],
  ["w", Mon._w_],
  ["h", Mon._h_],
  ["n", Mon._n_],
  ["m", Mon._m_],
  ["l", Mon._l_]
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
  ["'", Mon.tone1],
  ['"', Mon.tone2],
];

const monographIndependentVowels: PlainRule[] = [
  ["i", Mon.I],
  ["u", Mon.U],
  ["e", Mon.E],
  ["o", Mon.O],
];

const digraphIndependentVowels: PlainRule[] = [
  ["o^", Mon.Oˆ],
  ["ii", Mon.Ii],
  ["uu", Mon.Uu],
];

const dependentLongVowels: PlainRule[] = [
  ["aa", Mon.__aa],
  ["ii", Mon.__ii],
  ["uu", Mon.__uu],
];

const dependentMonographVowels: PlainRule[] = [
  ["a", ""],
  ["i", Mon.__i],
  ["u", Mon.__u],
  ["e", Mon.__e],
  ["o", Mon.__o],
];

const dependentDigraphVowels: PlainRule[] = [["o^", Mon.__oˆ]];

const dipthongVowels: PlainRule[] = [
  ["ai", Mon.__ai],
  ["ui", Mon.__ui],
];

const addAsVowelToAConsonant: PlainRule[] = [
  ["ai", Mon.__ai],
  ["ui", Mon.__ui],
  ["aa", Mon.__aa],
  ["a", ""],
];

const numbers: PlainRule[] = [
  ["0", Mon.Sunya],
  ["1", Mon.Tas],
  ["2", Mon.Nhas],
  ["3", Mon.Sum],
  ["4", Mon.Le],
  ["5", Mon.Ngaa],
  ["6", Mon.Khrauk],
  ["7", Mon.Khu],
  ["8", Mon.Rhas],
  ["9", Mon.Kui],
];

const punctuations: PlainRule[] = [
  [",", Mon.Coma],
  [".", Mon.Period],
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
  [["", Mon.asat]],
);

// second pass, assumes everything is already Mon

const specialNyaRule: PlainRule[] = [
  [Mon.Nnya + Mon.__aa, Mon.Nya + Mon.__aa],
  [Mon.Nnya + Mon.asat, Mon.Nya],
];

const ViramaToAsatRule: PlainRule[] = (
  ([[Mon.Ka, Mon.Ka],
  [Mon.Ka, Mon.Kha],
  [Mon.Ga, Mon.Ga],
  [Mon.Ga, Mon.Gha],
  [Mon.Ca, Mon.Ca],
  [Mon.Ca, Mon.Cha],
  [Mon.Ja, Mon.Ja],
  [Mon.Ja, Mon.Jha],
  [Mon.Nya, Mon.Ca],
  [Mon.Nya, Mon.Cha],
  [Mon.Nya, Mon.Ja],
  [Mon.Nya, Mon.Jha],
  [Mon.Ta, Mon.Ta],
  [Mon.Ta, Mon.Tha],
  [Mon.Da, Mon.Da],
  [Mon.Da, Mon.Dha],
  [Mon.Nna, Mon.Ta],
  [Mon.Nna, Mon.Da],
  [Mon.Ta, Mon.Ta],
  [Mon.Ta, Mon.Tha],
  [Mon.Da, Mon.Da],
  [Mon.Da, Mon.Dha],
  [Mon.Na, Mon.Ta],
  [Mon.Na, Mon.Tha],
  [Mon.Na, Mon.Na],
  [Mon.Pa, Mon.Pa],
  [Mon.Pa, Mon.Pha],
  [Mon.Ba, Mon.Bha],
  [Mon.Ma, Mon.Pa],
  [Mon.Ma, Mon.Ba],
  [Mon.Ma, Mon.Bha],
  [Mon.Ma, Mon.Ma],
  [Mon.La, Mon.La],
  [Mon.Lla, Mon.Lla]]
) as Array<[string, string]>
).map(
  ([left, right]: [string, string]): PlainRule => [
    left + Mon.asat + right,
    left + Mon.virama + right
  ],
);

const specialSsaRule: PlainRule[] = [
  [Mon.Sa + Mon.asat + Mon.Sa, Mon.Ssa],
];

const FromLatinScheme: Rule[] = prepareRules(
  chainRule(
    monoBbe,
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
    asInverse(monoBbe),
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
  ["b_b", "bb"],
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
    makeTransitive(ClosedConsonants, monoBbe, SyllablesWithMedial, Syllables),
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
