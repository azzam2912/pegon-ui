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

const enum Buhid {
    Ka = "ᝃ",
    Ga = "ᝄ",
    Nga = "ᝅ",
    Ta = "ᝆ",
    Da =  "ᝇ",
    Na = "ᝈ",
    Pa = "ᝉ",
    Ba = "ᝊ",
    Ma = "ᝋ",
    Ya = "ᝌ",
    Ra = "ᝍ",
    La = "ᝎ",
    Wa = "ᝏ",
    Sa = "ᝐ",
    Ha = "ᝑ",
    
    A = "ᝀ",
    I = "ᝁ",
    U = "ᝂ",
    
    _i = "ᝒ",
    _u = "ᝓ",

    BantasanSingle = "᜵",
    BantasanDouble = "᜶",
    
}

const DigraphConsonants: PlainRule[] = [
    ["n_g", Buhid.Nga],
]

const MonographConsonants: PlainRule[] = [
    ["k", Buhid.Ka],
    ["g", Buhid.Ga],
    ["t", Buhid.Ta],
    ["d", Buhid.Da],
    ["n", Buhid.Na],
    ["p", Buhid.Pa],
    ["b", Buhid.Ba],
    ["m", Buhid.Ma],
    ["y", Buhid.Ya],
    ["r", Buhid.Ra],
    ["l", Buhid.La],
    ["w", Buhid.Wa],
    ["s", Buhid.Sa],
    ["h", Buhid.Ha],
]

const IndependentVowels: PlainRule[] = [
    ["u", Buhid.U],
    ["i", Buhid.I],
    ["a", Buhid.A]
]

const DependentVowels: PlainRule[] = [
    ["u", Buhid._u],,
    ["i", Buhid._i],
    ["a", ""]
]

const Punctuation: PlainRule[] = [
    [",", Buhid.BantasanSingle],
    [".", Buhid.BantasanDouble]
]

const Syllables: PlainRule[] =
    ruleProduct(
        chainRule(
            DigraphConsonants,
            MonographConsonants),
        DependentVowels)

const FromLatinScheme: PlainRule[] = prepareRules(
    chainRule(Syllables,
                    IndependentVowels,
                    Punctuation))
const ToLatinScheme: PlainRule[] = prepareRules(
    chainRule(
        asInverse(IndependentVowels),
        asInverse(Syllables),
        asInverse(Punctuation)))

const ReversibleLatinToLatinScheme: Rule[] =
    [["n_g", "ng"]]

export const fromLatin = (input: string): string => transliterate(input, FromLatinScheme);
export const toLatin = (input: string): string => transliterate(input, ToLatinScheme);
export const toStandardLatin = (input: string): string =>
    transliterate(input, ReversibleLatinToLatinScheme)

const IMERules: Rule[] = prepareRules(chainRule(
    Punctuation,
    Syllables,
    IndependentVowels    
))

export function initIME(): InputMethodEditor {
    return {
        "rules": IMERules,
        "inputEdit": (inputString: string): string => 
            transliterate(inputString, IMERules)
    }
}
