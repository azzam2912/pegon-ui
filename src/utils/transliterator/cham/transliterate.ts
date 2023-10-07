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
  wordDelimiters,
  before,
  patternList,
} from "../core";

const enum Cham {
  Ka = "ꨆ",
  Kha = "ꨇ",
  Ga = "ꨈ",
  Gha = "ꨉ",
  Ngaˆ = "ꨊ",
  Nga = "ꨋ",
  Ca = "ꨌ",
  Cha = "ꨍ",
  Ja = "ꨎ",
  Jha = "ꨏ",
  Nyaˆ = "ꨐ",
  Nya = "ꨑ",
  Nja = "ꨒ",
  Ta = "ꨓ",
  Tha = "ꨔ",
  Da = "ꨕ",
  Dha = "ꨖ",
  Naˆ = "ꨗ",
  Na = "ꨘ",
  Nda = "ꨙ",
  Pa = "ꨚ",
  Ppa = "ꨛ",
  Pha = "ꨜ",
  Ba = "ꨝ",
  Bha = "ꨞ",
  Maˆ = "ꨟ",
  Ma = "ꨠ",
  Mba = "ꨡ",
  Ya = "ꨢ",
  Ra = "ꨣ",
  La = "ꨤ",
  Wa = "ꨥ",
  Sya = "ꨦ",
  Sa = "ꨧ",
  Ha = "ꨨ",

  // final consonants
  _k = "ꩀ",
  _ng = "ꩂ",
  _c = "ꩄ",
  _t = "ꩅ",
  _n = "ꩆ",
  _p = "ꩇ",
  _y = "ꩈ",
  _r = "ꩉ",
  _l = "ꩊ",
  _w = "ꨥ",
  _sy = "ꩋ",
  // independent vowels
  A = "ꨀ",
  I = "ꨁ",
  U = "ꨂ",
  E = "ꨃ",
  Ai = "ꨄ",
  O = "ꨅ",

  // diacritics
  // medial consonants
  _i_ = "ꨳ",
  _r_ = "ꨴ",
  _l_ = "ꨵ",
  _u_ = "ꨶ",
  // final diacritics
  __ng = "ꩃ",
  __m = "ꩌ",
  __h = "ꩍ",
  // vowels
  __aa = "ꨩ",
  __i = "ꨪ",
  __ii = "ꨫ",
  __ei = "ꨬ",
  __u = "ꨭ",
  __uu = "ꨭꨩ",
  __eˆ = "ꨮ",
  __eˆeˆ = "ꨮꨩ",
  __e = "ꨯꨮ",
  __ee = "ꨯꨮꨩ",
  __o = "ꨯ",
  __oo = "ꨯꨩ",
  __ai = "ꨰ",
  __ao = "ꨯꨱ",
  __aˆ = "ꨲ",
  __aˆaˆ = "ꨲꨩ",
  __au = "ꨮꨭ",

  // numbers
  Thaoh = "꩐",
  Satu = "꩑",
  Dua = "꩒",
  Klau = "꩓",
  Pak = "꩔",
  Limaˆ = "꩕",
  Nam = "꩖",
  Tajuh = "꩗",
  Dalapan = "꩘",
  Salapan = "꩙",

  // punctuation
  Opening = "꩜",
  Danda = "꩝",
  DandaDouble = "꩞",
  DandaTriple = "꩟",
}

const monographAConsonants: PlainRule[] = [
  ["k", Cham.Ka],
  ["g", Cham.Ga],
  ["c", Cham.Ca],
  ["j", Cham.Ja],
  ["t", Cham.Ta],
  ["d", Cham.Da],
  ["p", Cham.Pa],
  ["b", Cham.Ba],
  ["m", Cham.Ma],
  ["y", Cham.Ya],
  ["r", Cham.Ra],
  ["l", Cham.La],
  ["w", Cham.Wa],
  ["s", Cham.Sa],
  ["h", Cham.Ha],
];

const digraphAConsonants: PlainRule[] = [
  ["k_h", Cham.Kha],
  ["g_h", Cham.Gha],
  ["c_h", Cham.Cha],
  ["j_h", Cham.Jha],
  ["p_h", Cham.Pha],
  ["t_h", Cham.Tha],
  ["b_h", Cham.Bha],
  ["m_b", Cham.Mba],
  ["n_d", Cham.Nda],
  ["n_j", Cham.Nja],
  ["p_p", Cham.Ppa],
];

const monographÂConsonants: PlainRule[] = [
  ["m", Cham.Maˆ],
  ["n", Cham.Naˆ],
];

const digraphÂConsonants: PlainRule[] = [
  ["n_g", Cham.Ngaˆ],
  ["n_y", Cham.Nyaˆ],
];

const syllabicÂToAConsonants: PlainRule[] = [
  ["n_ga", Cham.Nga],
  ["n_ya", Cham.Nya],
  ["ma", Cham.Ma],
  ["na", Cham.Na],
];

const syllabicÂConsonants: PlainRule[] = [
  ["n_g^a", Cham.Ngaˆ],
  ["n_y^a", Cham.Nyaˆ],
  ["m^a", Cham.Maˆ],
  ["n^a", Cham.Naˆ],
];

const finalMonographConsonantLetters: PlainRule[] = [
  ["k", Cham._k],
  // keep ths or the other one?
  ["n_g", Cham._ng],
  ["c", Cham._c],
  ["t", Cham._t],
  ["n", Cham._n],
  ["p", Cham._p],
  ["y", Cham._y],
  ["r", Cham._r],
  ["l", Cham._l],
  ["w", Cham._w],
];

const finalDigraphConsonantLetters: PlainRule[] = [["s_y", Cham._sy]];

const finalConsonantLetters: PlainRule[] = chainRule(
  finalDigraphConsonantLetters,
  finalMonographConsonantLetters,
);

const finalDigraphConsonantDiacritics: PlainRule[] = [["_n_g", Cham.__ng]];

const finalMonographConsonantDiacritics: PlainRule[] = [
  ["m", Cham.__m],
  ["h", Cham.__h],
];

const finalNasals: PlainRule[] = [
  ["n_g", Cham.__ng],
  ["m", Cham.__m],
  ["n", Cham._n],
];

const finalConsonantDiacritics: PlainRule[] = chainRule(
  finalDigraphConsonantDiacritics,
  finalMonographConsonantDiacritics,
);

const medialConsonants: PlainRule[] = [
  ["y", Cham._i_],
  ["r", Cham._r_],
  ["l", Cham._l_],
  ["w", Cham._u_],
];

const latinMedialConsonants: string[] = medialConsonants.map(
  ([key, val]) => key,
);

const syllabicÂConsonantWithMedials: PlainRule[] = ruleProduct(
  syllabicÂConsonants,
  medialConsonants,
).map(([key, val]) => [
  key.replace(new RegExp(`([${latinMedialConsonants.join("")}])\^a`), "^a$1"),
  val,
]);

const syllabicÂToAConsonantWithMedials: PlainRule[] = ruleProduct(
  syllabicÂToAConsonants,
  medialConsonants,
).map(([key, val]) => [
  key.replace(new RegExp(`([${latinMedialConsonants.join("")}])a`), "a$1"),
  val,
]);

const monographIndependentVowels: PlainRule[] = [
  ["a", Cham.A],
  ["i", Cham.I],
  ["u", Cham.U],
  ["e", Cham.E],
  ["o", Cham.O],
];

const digraphIndependentVowels: PlainRule[] = [["a_i", Cham.Ai]];

const dependentLongVowels: PlainRule[] = [
  ["^e^e", Cham.__eˆeˆ],
  ["^a^a", Cham.__aˆaˆ],
  ["aa", Cham.__aa],
  ["ii", Cham.__ii],
  ["ee", Cham.__ee],
  ["oo", Cham.__oo],
  ["uu", Cham.__uu],
];

const dipthongVowels: PlainRule[] = [
  ["aao", Cham.__ao],
  ["aai", Cham.__ai],
  ["ei", Cham.__ei],
  ["ai", Cham.__ai],
  ["au", Cham.__au],
  ["ao", Cham.__ao],
];

const digraphShortVowels: PlainRule[] = [
  ["^a", Cham.__aˆ],
  ["^e", Cham.__eˆ],
];

const monographShortVowels: PlainRule[] = [
  ["a", ""],
  ["i", Cham.__i],
  ["u", Cham.__u],
  ["o", Cham.__o],
  ["e", Cham.__e],
];

const numbers: PlainRule[] = [
  ["0", Cham.Thaoh],
  ["1", Cham.Satu],
  ["2", Cham.Dua],
  ["3", Cham.Klau],
  ["4", Cham.Pak],
  ["5", Cham.Limaˆ],
  ["6", Cham.Nam],
  ["7", Cham.Tajuh],
  ["8", Cham.Dalapan],
  ["9", Cham.Salapan],
];

const punctuations: PlainRule[] = [
  ["...", Cham.DandaTriple],
  ["..", Cham.DandaDouble],
  [".", Cham.Danda],
];

const dependentVowelsAlwaysDiacritics: PlainRule[] = chainRule(
  dipthongVowels,
  dependentLongVowels,
  digraphShortVowels,
  monographShortVowels,
).filter(([key, val]: PlainRule) => key != "a" && key != "^a");

const digraphAConsonantWithMedials: PlainRule[] = ruleProduct(
  digraphAConsonants,
  medialConsonants,
);
const digraphÂConsonantWithMedials: PlainRule[] = ruleProduct(
  digraphÂConsonants,
  medialConsonants,
);
const monographAConsonantWithMedials: PlainRule[] = ruleProduct(
  monographAConsonants,
  medialConsonants,
);
const monographÂConsonantWithMedials: PlainRule[] = ruleProduct(
  monographÂConsonants,
  medialConsonants,
);

const digraphConsonantSyllables: PlainRule[] = chainRule(
  ruleProduct(digraphAConsonantWithMedials, dependentVowelsAlwaysDiacritics),
  ruleProduct(digraphÂConsonantWithMedials, dependentVowelsAlwaysDiacritics),
  ruleProduct(monographAConsonantWithMedials, dependentVowelsAlwaysDiacritics),
  ruleProduct(monographÂConsonantWithMedials, dependentVowelsAlwaysDiacritics),

  syllabicÂToAConsonantWithMedials,
  syllabicÂConsonantWithMedials,

  ruleProduct(digraphAConsonantWithMedials, [["^a", Cham.__aˆ]]),
  ruleProduct(monographAConsonantWithMedials, [["^a", Cham.__aˆ]]),
  ruleProduct(digraphAConsonantWithMedials, [["a", ""]]),
  ruleProduct(monographAConsonantWithMedials, [["a", ""]]),

  ruleProduct(digraphAConsonants, dependentVowelsAlwaysDiacritics),
  ruleProduct(digraphÂConsonants, dependentVowelsAlwaysDiacritics),
  ruleProduct(monographAConsonants, dependentVowelsAlwaysDiacritics),
  ruleProduct(monographÂConsonants, dependentVowelsAlwaysDiacritics),

  syllabicÂToAConsonants,
  syllabicÂConsonants,

  ruleProduct(digraphAConsonants, [["^a", Cham.__aˆ]]),
  ruleProduct(monographAConsonants, [["^a", Cham.__aˆ]]),
  ruleProduct(digraphAConsonants, [["a", ""]]),
  ruleProduct(monographAConsonants, [["a", ""]]),
);

const openLatinConsonants: string[] = chainRule(
  digraphÂConsonants,
  digraphAConsonants,
  monographÂConsonants,
  monographAConsonants,
).map(([key, val]) => key);

const openChamConsonants: string[] = chainRule(
  digraphÂConsonants,
  digraphAConsonants,
  monographÂConsonants,
  monographAConsonants,
  digraphIndependentVowels,
  monographIndependentVowels,
  medialConsonants,
  dependentLongVowels,
  dipthongVowels,
  digraphShortVowels,
  digraphIndependentVowels,
  monographIndependentVowels,
  monographShortVowels.filter(([key, val]) => val != ""),
).map(([key, val]) => val);

const latinVowels: string[] = chainRule(
  digraphShortVowels,
  monographShortVowels,
  [["a", ""]],
).map(([key, val]: PlainRule) => escape(key));

const asIndependent = (rules: PlainRule[]): RegexRule[] =>
  rules.map(([key, val]) => [
    new RegExp(`(?<!(\\^|${openLatinConsonants.join("|")}))${escape(key)}`),
    val,
  ]);

const asDependent = (rules: PlainRule[]): RegexRule[] =>
  rules.map(([key, val]) => [
    new RegExp(`(?<=(\\^|${openLatinConsonants.join("|")}))${escape(key)}`),
    val,
  ]);

const toDependentCham = ([key, val]: PlainRule): RegexRule => [
  new RegExp(`(?<=(${openChamConsonants.join("|")}))${escape(key)}`),
  val,
];

const asDependentCham = (rules: PlainRule[]): RegexRule[] =>
  rules.map(toDependentCham);

const LatinToChamSchemePlain: PlainRule[] = chainRule(
  ruleProduct(digraphAConsonantWithMedials, dependentVowelsAlwaysDiacritics),
  ruleProduct(digraphÂConsonantWithMedials, dependentVowelsAlwaysDiacritics),
  ruleProduct(monographAConsonantWithMedials, dependentVowelsAlwaysDiacritics),
  ruleProduct(monographÂConsonantWithMedials, dependentVowelsAlwaysDiacritics),

  syllabicÂToAConsonantWithMedials,
  syllabicÂConsonantWithMedials,

  ruleProduct(digraphAConsonantWithMedials, [["^a", Cham.__aˆ]]),
  ruleProduct(monographAConsonantWithMedials, [["^a", Cham.__aˆ]]),
  ruleProduct(digraphAConsonantWithMedials, [["a", ""]]),
  ruleProduct(monographAConsonantWithMedials, [["a", ""]]),

  ruleProduct(digraphAConsonants, dependentVowelsAlwaysDiacritics),
  ruleProduct(digraphÂConsonants, dependentVowelsAlwaysDiacritics),
  ruleProduct(monographAConsonants, dependentVowelsAlwaysDiacritics),
  ruleProduct(monographÂConsonants, dependentVowelsAlwaysDiacritics),

  syllabicÂToAConsonants,
  syllabicÂConsonants,

  ruleProduct(digraphAConsonants, [["^a", Cham.__aˆ]]),
  ruleProduct(monographAConsonants, [["^a", Cham.__aˆ]]),
  ruleProduct(digraphAConsonants, [["a", ""]]),
  ruleProduct(monographAConsonants, [["a", ""]]),

  numbers,
  punctuations,
);

const ChamToLatinScheme: Rule[] = prepareRules(
  chainRule<Rule>(
    asInverse(chainRule(finalConsonantDiacritics, finalConsonantLetters)),
    asInverse(LatinToChamSchemePlain),
    asInverse(chainRule(digraphIndependentVowels, monographIndependentVowels)),
  ),
);

const LatinToChamScheme: Rule[] = prepareRules(
  chainRule<Rule>(
    asWordEnding(chainRule(finalConsonantDiacritics, finalConsonantLetters)),
    LatinToChamSchemePlain,
    chainRule(digraphIndependentVowels, monographIndependentVowels),
    chainRule(finalConsonantDiacritics, finalConsonantLetters).map(
      (rule: PlainRule) =>
        before(
          rule,
          patternList(wordDelimiters.concat(openChamConsonants).map(escape)),
        ),
    ),
  ),
);

export const fromLatin = (input: string): string =>
  transliterate(input, LatinToChamScheme);
export const toLatin = (input: string): string =>
  transliterate(input, ChamToLatinScheme);

const ReversibleLatinToLatinScheme: Rule[] = prepareRules([
  ["_n_g", "ng"],
  ["k_h", "kh"],
  ["g_h", "gh"],
  ["c_h", "ch"],
  ["j_h", "jh"],
  ["n_y", "ny"],
  ["n_j", "nj"],
  ["n_g", "ng"],
  ["t_h", "th"],
  ["d_h", "dh"],
  ["n_d", "nd"],
  ["p_h", "ph"],
  ["b_h", "bh"],
  ["m_b", "mb"],
  ["n_d", "nd"],
  ["a_i", "ai"],
  [/[^\^]e/, "é"],
  ["^e", "e"],
  ["aa", "a"],
  ["^a", "â"],
]);

export const toStandardLatin = (input: string): string =>
  transliterate(input, ReversibleLatinToLatinScheme);

const finalConsonantChamLetters = new Set(
  chainRule(finalConsonantDiacritics, finalConsonantLetters).map(
    ([key, val]) => val,
  ),
);

const shortenDoubleA = ([key, val]: PlainRule): PlainRule => [
  key.replace(new RegExp(`(${openChamConsonants.join("|")})(aa)`), `$1a`),
  val,
];

const IMERules: Rule[] = prepareRules(
  chainRule<Rule>(
    ruleProduct(
      asInverse(
        chainRule(
          finalDigraphConsonantDiacritics,
          finalDigraphConsonantLetters,
        ),
      ),
      [
        ["^a", "^a"],
        ["^e", "^e"],
        ["a", "a"],
        ["i", "i"],
        ["u", "u"],
        ["e", "e"],
        ["o", "o"],
        ["l", "l"],
        ["r", "r"],
        ["y", "y"],
        ["w", "w"],
      ],
    ),

    ruleProduct(
      asInverse(
        chainRule(
          finalMonographConsonantDiacritics,
          finalMonographConsonantLetters,
        ),
      ),
      [
        ["_", "_"],
        ["^a", "^a"],
        ["^e", "^e"],
        ["a", "a"],
        ["i", "i"],
        ["u", "u"],
        ["e", "e"],
        ["o", "o"],
        ["l", "l"],
        ["r", "r"],
        ["y", "y"],
        ["w", "w"],
      ],
    ),

    makeTransitive(
      chainRule<PlainRule>(
        digraphÂConsonantWithMedials,
        monographÂConsonantWithMedials,
      ),
      chainRule<PlainRule>(
        syllabicÂConsonantWithMedials,
        ruleProduct(
          digraphÂConsonantWithMedials,
          dependentVowelsAlwaysDiacritics,
        ),
        ruleProduct(
          monographÂConsonantWithMedials,
          dependentVowelsAlwaysDiacritics,
        ),
      ),
    ).map(shortenDoubleA),

    makeTransitive(
      chainRule(digraphAConsonantWithMedials, monographAConsonantWithMedials),
      chainRule(
        syllabicÂToAConsonantWithMedials,
        ruleProduct(
          digraphAConsonantWithMedials,
          dependentVowelsAlwaysDiacritics,
        ),
        ruleProduct(
          monographAConsonantWithMedials,
          dependentVowelsAlwaysDiacritics,
        ),
        ruleProduct(digraphAConsonantWithMedials, [["^a", Cham.__aˆ]]),
        ruleProduct(monographAConsonantWithMedials, [["^a", Cham.__aˆ]]),
        ruleProduct(digraphAConsonantWithMedials, [["a", ""]]),
        ruleProduct(monographAConsonantWithMedials, [["a", ""]]),
      ),
    ).map(shortenDoubleA),

    makeTransitive(
      chainRule(
        syllabicÂConsonants,
        ruleProduct(digraphÂConsonants, dependentVowelsAlwaysDiacritics),
        ruleProduct(monographÂConsonants, dependentVowelsAlwaysDiacritics),
      ),
    ).map(shortenDoubleA),

    makeTransitive(
      chainRule(
        ruleProduct(digraphAConsonants, [["a", ""]]),
        ruleProduct(monographAConsonants, [["a", ""]]),
        ruleProduct(digraphAConsonants, [["^a", Cham.__aˆ]]),
        ruleProduct(monographAConsonants, [["^a", Cham.__aˆ]]),
      ),
      chainRule(
        syllabicÂToAConsonants,
        ruleProduct(digraphAConsonants, dependentVowelsAlwaysDiacritics),
        ruleProduct(monographAConsonants, dependentVowelsAlwaysDiacritics),
      ),
    ).map(shortenDoubleA),

    chainRule(
      syllabicÂToAConsonants,
      ruleProduct(digraphAConsonants, [["a", ""]]),
      ruleProduct(monographAConsonants, [["a", ""]]),
    ).map(([key, val]) => [val + "a", val + Cham.__aa]),

    asDependentCham(
      chainRule<PlainRule>(
        finalConsonantDiacritics,
        finalConsonantLetters,
        makeTransitive(
          monographShortVowels.filter(([key, val]) => val != ""),
          [["a", Cham.__aa]] as PlainRule[],
          digraphShortVowels,
          dependentLongVowels.filter(([key, val]) => key != "aa"),
          dipthongVowels,
        ),
      ),
    ),

    makeTransitive(finalNasals, syllabicÂConsonants),

    chainRule(digraphIndependentVowels, monographIndependentVowels),
    numbers,
    makeTransitive(
      ...punctuations
        .reverse()
        .map(([key, val]: PlainRule): PlainRule[] => [[key, val]]),
    ),
  ),
);

export function initIME(): InputMethodEditor {
  return {
    rules: IMERules,
    inputEdit: (inputString: string): string =>
      transliterate(inputString, IMERules),
  };
}
