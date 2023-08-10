import type { PlainRule, RegexRule, Rule, InputMethodEditor } from "../core"
import { prepareRules,
         chainRule,
         ruleProduct,
         makeTransitive,
         transliterate,
         debugTransliterate,
         escape,
         isPlain,
         asInverse
       } from "../core"

const enum Tagbanwa {
    Ka = "ᝣ",
    Ga = "ᝤ",
    Nga = "ᝥ",
    Ta = "ᝦ",
    Da =  "ᝧ",
    Na = "ᝨ",
    Pa = "ᝩ",
    Ba = "ᝪ",
    Ma = "ᝫ",
    Ya = "ᝬ",
    La = "ᝮ",
    Wa = "ᝯ",
    Sa = "ᝰ ",
    
    A = "ᝠ",
    I = "ᝡ",
    U = "ᝢ",
    
    _i = "ᝲ",
    _u = "ᝳ",

    BantasanSingle = "᜵",
    BantasanDouble = "᜶",
    
}

const DigraphConsonants: PlainRule[] = [
    ["n_g", Tagbanwa.Nga],
]

const MonographConsonants: PlainRule[] = [
    ["k", Tagbanwa.Ka],
    ["g", Tagbanwa.Ga],
    ["t", Tagbanwa.Ta],
    ["d", Tagbanwa.Da],
    ["n", Tagbanwa.Na],
    ["p", Tagbanwa.Pa],
    ["b", Tagbanwa.Ba],
    ["m", Tagbanwa.Ma],
    ["y", Tagbanwa.Ya],
    ["l", Tagbanwa.La],
    ["w", Tagbanwa.Wa],
    ["s", Tagbanwa.Sa],
]

const IndependentVowels: PlainRule[] = [
    ["u", Tagbanwa.U],
    ["i", Tagbanwa.I],
    ["a", Tagbanwa.A]
]

const DependentVowels: PlainRule[] = [
    ["u", Tagbanwa._u],
    ["i", Tagbanwa._i],
    ["a", ""]
]

const Punctuation: PlainRule[] = [
    [",", Tagbanwa.BantasanSingle],
    [".", Tagbanwa.BantasanDouble]
]

const Syllables: PlainRule[] =
    ruleProduct(
        chainRule(
            DigraphConsonants,
            MonographConsonants),
        DependentVowels)


const FromLatinScheme: Rule[] = prepareRules(
    chainRule(Syllables,
                    IndependentVowels,
                    Punctuation))

const ToLatinScheme: Rule[] = prepareRules(
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

const IMEScheme: Rule[] = prepareRules(chainRule(
    Punctuation,
    Syllables,
    IndependentVowels
))

export function initIME(): InputMethodEditor {
    return {
        "rules": IMEScheme,
        "inputEdit": (inputString: string): string => 
            transliterate(inputString, IMEScheme)
    }
}
