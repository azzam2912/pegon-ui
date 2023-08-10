import type { PlainRule, RegexRule, Rule, InputMethodEditor } from "../core"
import { Batak } from "../batak-common";
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
       } from "../core";

const enum Toba {
    Ta = "\u1BD7",
}

const DigraphConsonants: PlainRule[] = [
    ["n_g", Batak.Nga],
]

const MonographConsonants: PlainRule[] = [
    ["h", Batak.Ha],
    ["k", Batak.Ha],
    ["b", Batak.Ba],
    ["p", Batak.Pa],
    ["n", Batak.Na],
    ["w", Batak.Wa],
    ["g", Batak.Ga],
    ["j", Batak.Ja],
    ["d", Batak.Da],
    ["r", Batak.Ra],
    ["m", Batak.Ma],
    ["t", Batak.Ta],
    ["s", Batak.Sa],
    ["y", Batak.Ya],
    ["l", Batak.La],
]

const IndependentVowels: PlainRule[] = [
    ["u", Batak.U],
    ["o", Batak.A + Batak._o],
    ["e", Batak.A + Batak._e],
    ["i", Batak.I],
    ["a", Batak.A]
]

const DependentVowels: PlainRule[] = [
    ["u", Batak._u],
    ["o", Batak._o],
    ["e", Batak._e],
    ["i", Batak._i],
    ["a", ""]
]

const FinalConsonants: PlainRule[] = [
    ["n_g", Batak._ng],
]

const Punctuation: PlainRule[] = [
    [":", Batak.BinduJudul],
    [",", Batak.BinduPangolat],
    [">", Batak.BinduNaMetek],
    ["\"", Batak.BinduPinarboras]
]

const Syllables: PlainRule[] = ruleProduct(
    chainRule(
        DigraphConsonants,
        MonographConsonants),
    DependentVowels
)

const ClosedMonographConsonants: PlainRule[] =
    ruleProduct(
        MonographConsonants,
        [["", Batak.Virama]])

const ClosedDigraphConsonants: PlainRule[] =
    ruleProduct(
        DigraphConsonants,
        [["", Batak.Virama]])

const ClosedConsonants: PlainRule[] =
    chainRule(
        ClosedDigraphConsonants,
        ClosedMonographConsonants)

const FromLatinScheme: PlainRule[] = prepareRules(
    chainRule(Syllables,
              FinalConsonants,
              ClosedConsonants,
              IndependentVowels,
              Punctuation))

const ToLatinScheme: PlainRule[] = prepareRules(
    chainRule(
        asInverse(IndependentVowels),
        asInverse(FinalConsonants),
        asInverse(ClosedConsonants),
        asInverse(Syllables),
        asInverse(Punctuation)))

const ReversibleLatinToLatinScheme: Rule[] =
    [
        ["n_gh", "ngk"],
        ["n_g", "ng"]
    ]

export const fromLatin = (input: string): string => transliterate(input, FromLatinScheme);
export const toLatin = (input: string): string => transliterate(input, ToLatinScheme);
export const toStandardLatin = (input: string): string =>
    transliterate(input, ReversibleLatinToLatinScheme)

const IMEScheme: Rule[] = prepareRules(chainRule(
    Punctuation,
    makeTransitive(ClosedMonographConsonants,
                   ClosedDigraphConsonants,
                   Syllables),
    [[Batak.Nga + Batak.Virama, Batak._ng]], // final consonant special
    IndependentVowels
))

export function initIME(): InputMethodEditor {
    return {
        "rules": IMEScheme,
        "inputEdit": (inputString: string): string => 
            transliterate(inputString, IMEScheme)
    }
}
