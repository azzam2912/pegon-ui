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

const enum Rejang {
    Ka = "ꤰ",
    Ga = "ꤱ",
    Nga = "ꤲ",
    Ta = "ꤳ",
    Da = "ꤴ",
    Na = "ꤵ",
    Pa = "ꤶ",
    Ba = "ꤷ",
    Ma = "ꤸ",
    Ca = "ꤹ",
    Ja = "ꤺ",
    Nya = "ꤻ",
    Sa = "ꤼ",
    Ra = "ꤽ",
    La = "ꤾ",
    Ya = "ꤿ",
    Wa = "ꥀ",
    Ha = "ꥁ",
    Mba = "ꥂ",
    Ngga = "ꥃ",
    Nda = "ꥄ",
    Nja = "ꥅ",
    A = "ꥆ",
    
    _i = "\uA947",
    _u = "\uA948",
    _e = "\uA949",
    _o = "\uA94B",
    _ai = "\uA94A",
    _au = "\uA94C",
    _eˆu = "\uA94D",
    _ea = "\uA94E",
    _ng = "\uA94F",
    _n = "\uA950",
    _r = "\uA951",
    _ʔ = "\uA952",

    Virama = "\uA953",

    Titik = "꥟",    
}

const TrigraphConsonants: PlainRule[] = [
    ["n_g_g", Rejang.Ngga]
]

const DigraphConsonants: PlainRule[] = [
    
    ["n_d", Rejang.Nda],
    ["n_g", Rejang.Nga],
    ["n_j", Rejang.Nja],
    ["n_y", Rejang.Nya],
    ["m_b", Rejang.Mba],
]

const MonographConsonants: PlainRule[] = [
    ["k", Rejang.Ka],
    ["g", Rejang.Ga],
    ["t", Rejang.Ta],
    ["d", Rejang.Da],
    ["n", Rejang.Na],
    ["p", Rejang.Pa],
    ["b", Rejang.Ba],
    ["m", Rejang.Ma],
    ["y", Rejang.Ya],
    ["r", Rejang.Ra],
    ["l", Rejang.La],
    ["w", Rejang.Wa],
    ["s", Rejang.Sa],
    ["h", Rejang.Ha],
]

const IndependentDigraphVowels: PlainRule[] = [
    ["^e", Rejang.A + Rejang._eˆu]
]


const IndependentMonographVowels: PlainRule[] = [
    ["u", Rejang.A + Rejang._u],
    ["o", Rejang.A + Rejang._o],
    ["e", Rejang.A + Rejang._e],
    ["i", Rejang.A + Rejang._i],
    ["a", Rejang.A]
]

const DiphthongVowels: PlainRule[] = [
    ["au", Rejang._au],
    ["ai", Rejang._ai],
    ["ea", Rejang._ea]
]

const DigraphDependentVowels: PlainRule[] = [
    ["^e", Rejang._eˆu]
]

const MonographDependentVowels: PlainRule[] = [
    ["u", Rejang._u],
    ["o", Rejang._o],
    ["e", Rejang._e],
    ["i", Rejang._i],
    ["a", ""]
]

const Punctuation: PlainRule[] = [
    [".", Rejang.Titik]
]

const FinalMonographConsonantDiacritics: PlainRule[] = [
    ["\'", Rejang._ʔ],
    ["r", Rejang._r],
    ["n", Rejang._n],
]

const FinalDigraphConsonantDiacritics: PlainRule[] = [ 
    ["n_g", Rejang._ng],
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
        [["", Rejang.Virama]])

const ClosedDigraphConsonants: PlainRule[] =
    ruleProduct(
        DigraphConsonants,
        [["", Rejang.Virama]])

const ClosedTrigraphConsonants: PlainRule[] =
    ruleProduct(
        TrigraphConsonants,
        [["", Rejang.Virama]])

const ClosedConsonants: PlainRule[] =
    chainRule(
        ClosedTrigraphConsonants,
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
