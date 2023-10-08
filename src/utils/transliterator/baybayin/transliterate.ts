import type { PlainRule, RegexRule, Rule, InputMethodEditor } from "../core"
import { prepareRules,
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
         genericIMEInit
       } from "../core"

const enum Baybayin {
    Ka = "ᜃ",
    Ga = "ᜄ",
    Nga = "ᜅ",
    Ta = "ᜆ",
    Da =  "ᜇ",
    Na = "ᜈ",
    Pa = "ᜉ",
    Ba = "ᜊ",
    Ma = "ᜋ",
    Ya = "ᜌ",
    Ra = "\u170D",
    La = "ᜎ",
    Wa = "ᜏ",
    Sa = "ᜐ",
    Ha = "ᜑ",
    
    A = "ᜀ",
    I = "ᜁ",
    U = "ᜂ",
    
    _i = "ᜒ",
    _u = "ᜓ",

    BantasanSingle = "᜵",
    BantasanDouble = "᜶",
    
    Virama = "᜔",
    
}

const DigraphConsonants: PlainRule[] = [
    ["n_g", Baybayin.Nga],
]

const MonographConsonants: PlainRule[] = [
    ["k", Baybayin.Ka],
    ["g", Baybayin.Ga],
    ["t", Baybayin.Ta],
    ["d", Baybayin.Da],
    ["n", Baybayin.Na],
    ["p", Baybayin.Pa],
    ["b", Baybayin.Ba],
    ["m", Baybayin.Ma],
    ["y", Baybayin.Ya],
    ["r", Baybayin.Ra],
    ["l", Baybayin.La],
    ["w", Baybayin.Wa],
    ["s", Baybayin.Sa],
    ["h", Baybayin.Ha],
]

const IndependentVowels: PlainRule[] = [
    ["u", Baybayin.U],
    ["o", Baybayin.U],
    ["e", Baybayin.I],
    ["i", Baybayin.I],
    ["a", Baybayin.A]
]

const DependentVowels: PlainRule[] = [
    ["u", Baybayin._u],
    ["o", Baybayin._u],
    ["e", Baybayin._i],
    ["i", Baybayin._i],
    ["a", ""]
]

const Punctuation: PlainRule[] = [
    [",", Baybayin.BantasanSingle],
    [".", Baybayin.BantasanDouble]
]

const Syllables: PlainRule[] =
    ruleProduct(
        chainRule(
            DigraphConsonants,
            MonographConsonants),
        DependentVowels)

const ClosedMonographConsonants: PlainRule[] =
    ruleProduct(
        MonographConsonants,
        [["", Baybayin.Virama]])

const ClosedDigraphConsonants: PlainRule[] =
    ruleProduct(
        DigraphConsonants,
        [["", Baybayin.Virama]])

const ClosedConsonants: PlainRule[] =
    chainRule(
        ClosedDigraphConsonants,
        ClosedMonographConsonants)

const FromLatinScheme: Rule[] = prepareRules(
    chainRule(Syllables,
                    ClosedConsonants,
                    IndependentVowels,
                    Punctuation))
const ToLatinScheme: Rule[] = prepareRules(
    chainRule(
        asInverse(IndependentVowels.filter(([key, val]) => !(key.includes("o") || key.includes("e")))),
        asInverse(ClosedConsonants),
        asInverse(Syllables.filter(([key, val]) => !(key.includes("o") || key.includes("e")))),
        asInverse(Punctuation)))

const ReversibleLatinToLatinScheme: Rule[] =
    [["n_g", "ng"]]

export const fromLatin = (input: string): string => transliterate(input, FromLatinScheme);
export const toLatin = (input: string): string => transliterate(input, ToLatinScheme);
export const toStandardLatin = (input: string): string =>
    transliterate(input, ReversibleLatinToLatinScheme)

const IMEScheme: Rule[] = prepareRules(chainRule(
    Punctuation,
    makeTransitive(ClosedMonographConsonants,
                   ClosedDigraphConsonants,
                   Syllables),
    IndependentVowels    
))

export const initIME: (() => InputMethodEditor) = genericIMEInit(IMEScheme);
