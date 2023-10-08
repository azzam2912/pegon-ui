export type PlainRule = [string, string]
export type RegexRule = [RegExp, string]

export type Rule = PlainRule | RegexRule

// like a cartesian product but for tl rules
// https://rosettacode.org/wiki/Cartesian_product_of_two_or_more_lists#Functional
export const ruleProduct =
    (leftRules: PlainRule[],
     rightRules: PlainRule[]): PlainRule[] =>
    leftRules.flatMap<PlainRule>(([leftKey, leftVal]) =>
        rightRules.map<PlainRule>(([rightKey, rightVal]) =>
            [leftKey.concat(rightKey), leftVal.concat(rightVal)]));

// from https://stackoverflow.com/a/6969486
// escapes any control sequences
export const escape = (toEscape: string) => toEscape
    .replace(/[.*+?^${}()|[\]\\\-]/g, '\\$&')

export const isPlain = (rule: Rule): rule is PlainRule =>
    typeof rule[0] === "string"

export const prepareRules = (rules: Rule[]): Rule[] =>
    rules.map<Rule>((rule) =>
        (isPlain(rule) ? [escape(rule[0]), rule[1]] : rule))

export const chainRule = <T extends Rule>(...chainOfRules: T[][]): T[] =>
    chainOfRules.reduce<T[]>((acc, rules) => acc.concat(rules),
                             [] as T[])

export const wordDelimitingPatterns: string =
    escape([" ", ".", ",", "?", "!", "\"", "(", ")", "-", ":", ";",
            "،", "؛", "؛", "؟"]
            .join(""))

// \b would fail when the characters are from different
// encoding blocks
export const asWordEnding = (rules: PlainRule[]): RegexRule[] =>
    prepareRules(rules).map<RegexRule>(([key, val]) =>
        [new RegExp(`(${key})($|[${wordDelimitingPatterns}])`), `${val}$2`])

export const asWordBeginning = (rules: PlainRule[]): RegexRule[] =>
    prepareRules(rules).map<RegexRule>(([key, val]) =>
        [new RegExp(`(^|[${wordDelimitingPatterns}])(${key})`), `$1${val}`])

export const asNotWordBeginning = (rules: PlainRule[]): RegexRule[] =>
    prepareRules(rules).map<RegexRule>(([key, val]) =>
        [new RegExp(`([^${wordDelimitingPatterns}])(${key})`), `$1${val}`])

export const asNotWordEnding = (rules: Rule[]): RegexRule[] =>
    prepareRules(rules).map<RegexRule>(([key, val]) =>
        [new RegExp(`(${key})([^${wordDelimitingPatterns}])`), `${val}$2`])

export const asSingleWord = (rules: PlainRule[]): RegexRule[] =>
    prepareRules(rules).map<RegexRule>(([key, val]) =>
        [new RegExp(`(^|[${wordDelimitingPatterns}])(${key})($|[${wordDelimitingPatterns}])`),
         `$1${val}$3`])

export const debugTransliterate = (stringToTransliterate: string,
                       translationMap: Rule[]): string =>
    translationMap.reduce<string>((acc, [key, val]) => {
        // if (new RegExp(key, 'g').test(acc)) {
            console.log(`acc: ${acc}\nkey: ${key}\nval: ${val}\n`)
        // }
        return acc.replace(new RegExp(key, 'g'), val)},
                                  stringToTransliterate.slice())

export const transliterate = (stringToTransliterate: string,
                       translationMap: Rule[]): string =>
    translationMap.reduce<string>((acc, [key, val]) =>
        acc.replace(new RegExp(key, 'g'), val),
                                  stringToTransliterate.slice());

export const asInverse = (rules: PlainRule[]): PlainRule[] =>
    rules.map<PlainRule>(([key, val]) => [val, key])



/*
  The basic idea for this function is to take several
  lists of transliteration rules and make it so that
  if a tl key on the nth list is the prefix of a key
  on the n+1th list, then the key of the n+1th list
  has that prefix replaced by the value of the
  key from the nth list, and that this propagates
  To see why you would want to do this, take a look at
  github.com/wikimedia/jquery.ime
*/

export const makeTransitive = (...transliterationRules: PlainRule[][]): PlainRule[] =>
    transliterationRules.reduceRight((acc, left) => {
        let newAcc: PlainRule[] = [];
        for (const [rightKey, rightVal] of acc) {
            let foundMatch = false;
            for (const [leftKey, leftVal] of left) {
                if (rightKey.startsWith(leftKey)) {
                    foundMatch = true;
                    newAcc
                        .push([leftVal
                        .concat(rightKey.slice(leftKey.length)),
                               rightVal])
                }
            }
            if (!foundMatch) newAcc.push([rightKey, rightVal]);
        }
        return newAcc.concat(left);
    });

export interface InputMethodEditor {
    readonly rules: Rule[];
    readonly inputEdit: (inputString: string) => string;
}


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

const tripleConsonants: PlainRule[] = [
  ["t_s_h", TaiLe.Tsha],
]
const dualConsonants: PlainRule[] = [
  ["n_g", TaiLe.Nga],
  ["t_s", TaiLe.Tsa],
  ["t_h", TaiLe.Tha],
  ["p_h", TaiLe.Pha],
  ["k_h", TaiLe.Kha],
]
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
]

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

const monographVowelsForEndingsAA: PlainRule[] = [
    ["a", TaiLe.A],
];

const monographVowelsForEndingsA: PlainRule[] = [
    ["a", ""],
];

const FinalConsonants: PlainRule[] = [
  ["n_g", TaiLe.Nga],
  ["m", TaiLe.Ma],
  ["n", TaiLe.Na],
  ["p", TaiLe.Pa],
  ["t", TaiLe.Ta],
  ["k", TaiLe.Ka],
]

const FinalConsonantsVowelsSyllables: PlainRule[] = ruleProduct(
  chainRule(
    monographVowelsForEndings,
    monographVowelsForEndingsA
  ),
  FinalConsonants
);

const FinalConsonantsVowelsSyllablesIndependent: PlainRule[] = ruleProduct(
    chainRule(
      monographVowelsForEndingsAA,
      monographVowelsForEndings,
    ),
    FinalConsonants
);

const consonantSyllables: PlainRule[] = ruleProduct(
    chainRule(
      tripleConsonants,
      dualConsonants,
      monoConsonants
    ),
    chainRule(
      FinalConsonantsVowelsSyllables,
      diagraphVowels,
      monographVowelsForEndings,
      monographVowelsForEndingsA
    )
);

const vowelSyllables: PlainRule[] = chainRule(
    FinalConsonantsVowelsSyllablesIndependent,
    diagraphVowels,
    monographVowelsForEndings,
    monographVowelsForEndingsAA
);

const tones: PlainRule[] = [
    ["#2", TaiLe.tone2],
    ["#3", TaiLe.tone3],
    ["#4", TaiLe.tone4],
    ["#5", TaiLe.tone5],
    ["#6", TaiLe.tone6],
  ]
  
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
  ]
  
// const sortedConsonantSyllables = asInverse(consonantSyllables).sort((a, b) => b[0].length - a[0].length);
// const sortedVowelSyllables = asInverse(vowelSyllables).sort((a, b) => b[0].length - a[0].length);

const sortedConsonantSyllables = asInverse(consonantSyllables).sort((a, b) => {
    // First, compare by the length of the left side in descending order
    const lengthComparison = b[0].length - a[0].length;
    
    // If the lengths are equal, compare the right side strings alphabetically
    if (lengthComparison === 0) {
      return a[1].localeCompare(b[1]);
    }
  
    return lengthComparison;
});

const sortedVowelSyllables = asInverse(vowelSyllables).sort((a, b) => {
    // First, compare by the length of the left side in descending order
    const lengthComparison = b[0].length - a[0].length;
    
    // If the lengths are equal, compare the right side strings alphabetically
    if (lengthComparison === 0) {
      return a[1].localeCompare(b[1]);
    }
  
    return lengthComparison;
});



const FromLatinScheme: Rule[] = prepareRules(
    chainRule(
      consonantSyllables,
      vowelSyllables,
      tones,
      numbers
    ),
  );
  
  const ToLatinScheme: Rule[] = prepareRules(
    chainRule(
      sortedConsonantSyllables,
      asInverse(vowelSyllables),
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
    ["^u", "î"]
  ];
  
  
  export const fromLatin = (input: string): string =>
    transliterate(input, FromLatinScheme);
  export const toLatin = (input: string): string =>
    debugTransliterate(input, ToLatinScheme);
  export const toStandardLatin = (input: string): string =>
    transliterate(input, ReversibleLatinToLatinScheme);
  
  const IMEScheme: Rule[] = prepareRules(
    chainRule(
      makeTransitive(
        consonantSyllables,
        vowelSyllables
      ),
      tones,
      numbers
    ),
  );
  
  export function initIME(): InputMethodEditor {
    return {
      rules: IMEScheme,
      inputEdit: (inputString: string): string =>
        transliterate(inputString, IMEScheme),
    };
  }

