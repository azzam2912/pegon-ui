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

const enum SgawKaren {
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
  Sha = "ၡ",

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

  tone1 = "ၢ်",
  tone2 = "ာ်",
  tone3 = "း",
  tone4 = "ၣ်",
  tone5 = "ၤ",

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
  __eu = "ၢ",

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

const singleAasConsonant: PlainRule[] = [["", SgawKaren.A]];

const monographConsonants: PlainRule[] = [
  ["k", SgawKaren.Ka],
  ["g", SgawKaren.Ga],
  ["c", SgawKaren.Ca],
  ["j", SgawKaren.Ja],
  ["t", SgawKaren.Ta],
  ["d", SgawKaren.Da],
  ["n", SgawKaren.Na],
  ["p", SgawKaren.Pa],
  ["b", SgawKaren.Ba],
  ["m", SgawKaren.Ma],
  ["y", SgawKaren.Ya],
  ["r", SgawKaren.Ra],
  ["l", SgawKaren.La],
  ["w", SgawKaren.Wa],
  ["s", SgawKaren.Sa],
  ["h", SgawKaren.Ha],
];

const digraphConsonants: PlainRule[] = [
  ["k_h", SgawKaren.Kha],
  ["g_h", SgawKaren.Gha],
  ["c_h", SgawKaren.Cha],
  ["j_h", SgawKaren.Jha],
  ["t_h", SgawKaren.Tha],
  ["d_h", SgawKaren.Dha],
  ["p_h", SgawKaren.Pha],
  ["b_h", SgawKaren.Bha],
  ["n_g", SgawKaren.Nga],
  ["n_y", SgawKaren.Nnya],
  ["t_t", SgawKaren.Tta],
  ["d_d", SgawKaren.Dda],
  ["n_n", SgawKaren.Nna],
  ["l_l", SgawKaren.Lla],
  ["s_h", SgawKaren.Sha]
];

const trigraphConsonants: PlainRule[] = [
  ["t_t_h", SgawKaren.Ttha],
  ["d_d_h", SgawKaren.Ddha],
];

const medialConsonants: PlainRule[] = [
  ["ywh", SgawKaren._y_ + SgawKaren._w_ + SgawKaren._h_],
  ["yh", SgawKaren._y_ + SgawKaren._h_],
  ["yw", SgawKaren._y_ + SgawKaren._w_],

  ["rwh", SgawKaren._r_ + SgawKaren._w_ + SgawKaren._h_],
  ["rh", SgawKaren._r_ + SgawKaren._h_],
  ["rw", SgawKaren._r_ + SgawKaren._w_],
  ["wh", SgawKaren._w_ + SgawKaren._h_],
  ["y", SgawKaren._y_],
  ["r", SgawKaren._r_],
  ["w", SgawKaren._w_],
  ["h", SgawKaren._h_],
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
    ["^1", SgawKaren.tone1],
    ["^2", SgawKaren.tone2],
    ["^3", SgawKaren.tone3],
    ["^4", SgawKaren.tone4],
    ["^5", SgawKaren.tone5]
]


const monographIndependentVowels: PlainRule[] = [
  ["i", SgawKaren.I],
  ["u", SgawKaren.U],
  ["e", SgawKaren.E],
  ["o", SgawKaren.O],
];

const digraphIndependentVowels: PlainRule[] = [
  ["o^", SgawKaren.Oˆ],
  ["ii", SgawKaren.Ii],
  ["uu", SgawKaren.Uu],
];

const dependentLongVowels: PlainRule[] = [
  ["aa", SgawKaren.__aa],
  ["ii", SgawKaren.__ii],
  ["uu", SgawKaren.__uu],
];

const dependentMonographVowels: PlainRule[] = [
  ["a", ""],
  ["i", SgawKaren.__i],
  ["u", SgawKaren.__u],
  ["e", SgawKaren.__e],
  ["o", SgawKaren.__o],
];

const dependentDigraphVowels: PlainRule[] = [["o^", SgawKaren.__oˆ]];

const dipthongVowels: PlainRule[] = [
  ["ai", SgawKaren.__ai],
  ["ui", SgawKaren.__ui],
  ["eu", SgawKaren.__eu]
];

const addAsVowelToAConsonant: PlainRule[] = [
  ["ai", SgawKaren.__ai],
  ["ui", SgawKaren.__ui],
  ["aa", SgawKaren.__aa],
  ["eu", SgawKaren.__eu],
  ["a", ""],
];

const numbers: PlainRule[] = [
  ["0", SgawKaren.Sunya],
  ["1", SgawKaren.Tas],
  ["2", SgawKaren.Nhas],
  ["3", SgawKaren.Sum],
  ["4", SgawKaren.Le],
  ["5", SgawKaren.Ngaa],
  ["6", SgawKaren.Khrauk],
  ["7", SgawKaren.Khu],
  ["8", SgawKaren.Rhas],
  ["9", SgawKaren.Kui],
];

const punctuations: PlainRule[] = [
  [",", SgawKaren.Coma],
  [".", SgawKaren.Period],
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
  [["", SgawKaren.asat]],
);

// second pass, assumes everything is already SgawKaren

const specialNyaRule: PlainRule[] = [
  [SgawKaren.Nnya + SgawKaren.__aa, SgawKaren.Nya + SgawKaren.__aa],
  [SgawKaren.Nnya + SgawKaren.asat, SgawKaren.Nya],
];

const ViramaToAsatRule: PlainRule[] = (
  ([[SgawKaren.Ka, SgawKaren.Ka],
  [SgawKaren.Ka, SgawKaren.Kha],
  [SgawKaren.Ga, SgawKaren.Ga],
  [SgawKaren.Ga, SgawKaren.Gha],
  [SgawKaren.Ca, SgawKaren.Ca],
  [SgawKaren.Ca, SgawKaren.Cha],
  [SgawKaren.Ja, SgawKaren.Ja],
  [SgawKaren.Ja, SgawKaren.Jha],
  [SgawKaren.Nya, SgawKaren.Ca],
  [SgawKaren.Nya, SgawKaren.Cha],
  [SgawKaren.Nya, SgawKaren.Ja],
  [SgawKaren.Nya, SgawKaren.Jha],
  [SgawKaren.Ta, SgawKaren.Ta],
  [SgawKaren.Ta, SgawKaren.Tha],
  [SgawKaren.Da, SgawKaren.Da],
  [SgawKaren.Da, SgawKaren.Dha],
  [SgawKaren.Nna, SgawKaren.Ta],
  [SgawKaren.Nna, SgawKaren.Da],
  [SgawKaren.Ta, SgawKaren.Ta],
  [SgawKaren.Ta, SgawKaren.Tha],
  [SgawKaren.Da, SgawKaren.Da],
  [SgawKaren.Da, SgawKaren.Dha],
  [SgawKaren.Na, SgawKaren.Ta],
  [SgawKaren.Na, SgawKaren.Tha],
  [SgawKaren.Na, SgawKaren.Na],
  [SgawKaren.Pa, SgawKaren.Pa],
  [SgawKaren.Pa, SgawKaren.Pha],
  [SgawKaren.Ba, SgawKaren.Ba],
  [SgawKaren.Ba, SgawKaren.Bha],
  [SgawKaren.Ma, SgawKaren.Pa],
  [SgawKaren.Ma, SgawKaren.Ba],
  [SgawKaren.Ma, SgawKaren.Bha],
  [SgawKaren.Ma, SgawKaren.Ma],
  [SgawKaren.La, SgawKaren.La],
  [SgawKaren.Lla, SgawKaren.Lla]]
) as Array<[string, string]>
).map(
  ([left, right]: [string, string]): PlainRule => [
    left + SgawKaren.asat + right,
    left + SgawKaren.virama + right
  ],
);

const specialSsaRule: PlainRule[] = [
  [SgawKaren.Sa + SgawKaren.asat + SgawKaren.Sa, SgawKaren.Ssa],
];

const FromLatinScheme: Rule[] = prepareRules(
  chainRule(
    tone,
    SyllablesWithMedial,
    Syllables,
    ClosedConsonants,
    digraphIndependentVowels,
    monographIndependentVowels,
    SyllablesOfVowels,
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
  ["c_h", "ch"],
  ["j_h", "jh"],
  ["n_y", "ñ"],
  ["t_h", "th"],
  ["d_h", "dh"],
  ["p_h", "ph"],
  ["b_h", "bh"],
  ["s_h", "sh"],
  ["c", "s"],
  ["r", "y"],

  ["o^", "o'"],
  ["aa", "à"],
  ["ii", "ī"],
  ["uu", "ū"],
  ["eu", "ɨ"]
];

export const fromLatin = (input: string): string =>
  transliterate(input, FromLatinScheme);
export const toLatin = (input: string): string =>
  transliterate(input, ToLatinScheme);
export const toStandardLatin = (input: string): string =>
  transliterate(input, ReversibleLatinToLatinScheme);

const IMEScheme: Rule[] = prepareRules(
  chainRule(
    tone,
    makeTransitive(ClosedConsonants, SyllablesWithMedial, Syllables),
    digraphIndependentVowels,
    monographIndependentVowels,
    SyllablesOfVowels,
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
