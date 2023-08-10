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

const enum Hanunuo {
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
    Sa = "ᜰ",
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
    ["n_g", Hanunuo.Nga],
]

const MonographConsonants: PlainRule[] = [
    ["k", Hanunuo.Ka],
    ["g", Hanunuo.Ga],
    ["t", Hanunuo.Ta],
    ["d", Hanunuo.Da],
    ["n", Hanunuo.Na],
    ["p", Hanunuo.Pa],
    ["b", Hanunuo.Ba],
    ["m", Hanunuo.Ma],
    ["y", Hanunuo.Ya],
    ["r", Hanunuo.Ra],
    ["l", Hanunuo.La],
    ["w", Hanunuo.Wa],
    ["s", Hanunuo.Sa],
    ["h", Hanunuo.Ha],
]

const IndependentVowels: PlainRule[] = [
    ["u", Hanunuo.U],
    ["i", Hanunuo.I],
    ["a", Hanunuo.A]
]

const DependentVowels: PlainRule[] = [
    ["u", Hanunuo._u],
    ["o", ""],
    ["i", Hanunuo._i],
    ["a", ""]
]

const Punctuation: PlainRule[] = [
    [",", Hanunuo.BantasanSingle],
    [".", Hanunuo.BantasanDouble]
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
        [["", Hanunuo.Virama]])

const ClosedDigraphConsonants: PlainRule[] =
    ruleProduct(
        DigraphConsonants,
        [["", Hanunuo.Virama]])

const ClosedConsonants: PlainRule[] =
    chainRule(
        ClosedDigraphConsonants,
        ClosedMonographConsonants)

const FromLatinScheme: PlainRule[] = prepareRules(
    chainRule(Syllables,
                    ClosedConsonants,
                    IndependentVowels,
                    Punctuation))
const ToLatinScheme: PlainRule[] = prepareRules(
    chainRule(
        asInverse(IndependentVowels.filter(([key, val]) => !(key.includes("o")))),
        asInverse(ClosedConsonants),
        asInverse(Syllables.filter(([key, val]) => !(key.includes("o")))),
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

export function initIME(): InputMethodEditor {
    return {
        "rules": IMEScheme,
        "inputEdit": (inputString: string): string => 
            transliterate(inputString, IMEScheme)
    }
}
