import type { PlainRule, RegexRule, Rule, InputMethodEditor } from "../core"
import { transliterate,
         debugTransliterate,
         prepareRules,
         chainRule,
         ruleProduct,
         makeTransitive,
         notAfter,
         asInverse,
         genericIMEInit
       } from "../core"

const enum Lontara {
    Ka = "ᨀ",
    Ga = "ᨁ",
    Nga = "ᨂ",
    Ngka = "ᨃ",
    Pa = "ᨄ",
    Ba = "ᨅ",
    Ma = "ᨆ",
    Mpa = "ᨇ",
    Ta = "ᨈ",
    Da = "ᨉ",
    Na = "ᨊ",
    Nra = "ᨋ",
    Ca = "ᨌ",
    Ja = "ᨍ",
    Nya = "ᨎ",
    Nca = "ᨏ",
    Ya = "ᨐ",
    Ra = "ᨑ",
    La = "ᨒ",
    Wa = "ᨓ",
    Sa = "ᨔ",
    A = "ᨕ",
    Ha = "ᨖ",

    _i = "ᨗ",
    _u = "ᨘ",
    _e = "ᨙ",
    _o = "ᨚ",
    _eˆ = "ᨛ",

    Pallawa = "᨞",
    EndOfSection = "᨟",
}

const TrigraphConsonants: PlainRule[] = [
    ["n_g_k", Lontara.Ngka]
]

const DigraphConsonants: PlainRule[] = [
    ["n_g", Lontara.Nga],
    ["m_p", Lontara.Mpa],
    ["n_r", Lontara.Nra],
    ["n_y", Lontara.Nya],
    ["n_c", Lontara.Nca],
]

const MonographConsonants: PlainRule[] = [
    ["k", Lontara.Ka],
    ["g", Lontara.Ga],
    ["p", Lontara.Pa],
    ["b", Lontara.Ba],
    ["m", Lontara.Ma],
    ["t", Lontara.Ta],
    ["d", Lontara.Da],
    ["n", Lontara.Na],
    ["c", Lontara.Ca],
    ["j", Lontara.Ja],
    ["l", Lontara.La],
    ["y", Lontara.Ya],
    ["r", Lontara.Ra],
    ["l", Lontara.La],
    ["w", Lontara.Wa],
    ["s", Lontara.Sa],
    ["h", Lontara.Ha],
]

const DigraphAna: PlainRule[] = [
    ["^e", Lontara._eˆ]
]
const MonographAna: PlainRule[] = [
    ["i", Lontara._i],
    ["u", Lontara._u],
    ["o", Lontara._o],
    ["e", Lontara._e],
    ["a", ""],
]

const Ana = chainRule<PlainRule>(DigraphAna, MonographAna);

const IndependentVowels: PlainRule[] =
    Ana.map(([key, val]: PlainRule): PlainRule => [key, Lontara.A + val])

const Syllables: PlainRule[] = chainRule<PlainRule>(
    ruleProduct(
        chainRule<PlainRule>(TrigraphConsonants,
                  DigraphConsonants,
                  MonographConsonants),
        Ana),
    IndependentVowels)

const Punctuation: PlainRule[] = [
    [",", Lontara.Pallawa],
    [".", Lontara.EndOfSection]
]

export const fromLatin = (input: string): string =>
    transliterate(input, prepareRules(chainRule<PlainRule>(Syllables,
                                                           Punctuation)));

export const toLatin = (input: string): string =>
    transliterate(input, asInverse(chainRule<PlainRule>(Syllables,
                                                        Punctuation)))

const StandardLatinScheme: Rule[] = prepareRules([
    ["n_g_k", "ngk"],
    ["n_g", "ng"],
    ["m_p", "mp"],
    ["n_r", "nr"],
    ["n_y", "ny"],
    ["n_c", "nc"],
    notAfter(/\^/, ["e", "é"]),
    ["^e", "e"],
])

export const toStandardLatin = (input: string): string =>
    transliterate(input, StandardLatinScheme)

export const initIME = genericIMEInit(prepareRules(chainRule(Syllables,
                                                             Punctuation)))
