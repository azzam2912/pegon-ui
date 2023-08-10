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
         asInverse
       } from "../core"

const enum Baybayin {
    Ka = "ᜣ",
    Ga = "ᜤ",
    Nga = "ᜥ",
    Ta = "ᜦ",
    Da =  "ᜧ",
    Na = "ᜨ",
    Pa = "ᜩ",
    Ba = "ᜪ",
    Ma = "ᜫ",
    Ya = "ᜬ",
    Ra = "ᜭ",
    La = "ᜮ",
    Wa = "ᜯ",
    Sa = "ᜰ ",
    Ha = "ᜱ",
    
    A = "ᜠ",
    I = "ᜡ",
    U = "ᜢ",
    
    _i = "ᜲ",
    _u = "ᜳ",

    BantasanSingle = "᜵",
    BantasanDouble = "᜶",
    
    Virama = "᜴",
    
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
    ["i", Baybayin.I],
    ["a", Baybayin.A]
]

const DependentVowels: PlainRule[] = [
    ["u", Baybayin._u],
    ["o", ""],
    ["i", Baybayin._i],
    ["a", ""]
]

const Punctuation: PlainRule[] = [
    [",", Baybayin.BantasanSingle],
    [".", Baybayin.BantasanDouble]
]

const Syllables: PlainRule[] =
    ruleProduct(
        chainRule<Rule>(
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
    chainRule<Rule>(
        ClosedDigraphConsonants,
        ClosedMonographConsonants)

const FromLatinScheme: PlainRule[] = prepareRules(
    chainRule<Rule>(Syllables,
                    ClosedConsonants,
                    IndependentVowels,
                    Punctuation))
const ToLatinScheme: PlainRule[] = prepareRules(
    chainRule<Rule>(
        asInverse(IndependentVowels.filter(([key, val]) => !(key.includes("o"|| key.includes("e"))))),
        asInverse(ClosedConsonants),
        asInverse(Syllables.filter(([key, val]) => !(key.includes("o") || key.includes("e")))),
        asInverse(Punctuation)))

const ReversibleLatinToLatinScheme: Rule[] =
    [["n_g", "ng"]]

export const fromLatin = (input: string): string => transliterate(input, FromLatinScheme);
export const toLatin = (input: string): string => transliterate(input, ToLatinScheme);
export const toStandardLatin = (input: string): string =>
    transliterate(input, ReversibleLatinToLatinScheme)

const IMEScheme: Rule[] = prepareRules(chainRule<Rule>(
    Punctuation,
    makeTransitive(ClosedMonographConsonants,
                   ClosedDigraphConsonants,
                   Syllables),
    IndependentVowels    
))

export function initIME(): InputMethodEditor {
    return {
        "rules": IMEScheme,
        "inputEdit": (inputString: string): string => 
            transliterate(inputString, IMEScheme)
    }
}
