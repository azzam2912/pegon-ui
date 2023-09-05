import type { PlainRule, RegexRule, Rule, InputMethodEditor } from "../core"
import { prepareRules,
         chainRule,
         ruleProduct,
         makeTransitive,
         transliterate,
         debugTransliterate,
         escape,
         isPlain,
         wordDelimiters,
         asInverse,
         genericIMEInit,
         notAfter,
         between,
         patternList
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

const Inok: PlainRule[] = chainRule<PlainRule>(
    TrigraphConsonants,
    DigraphConsonants,
    MonographConsonants,
    [["a", Rejang.A]]
)

const IndependentDigraphVowels: PlainRule[] = [
    ["au", Rejang.A + Rejang._au],
    ["ai", Rejang.A + Rejang._ai],
    ["ea", Rejang.A + Rejang._ea],
    ["^e", Rejang.A + Rejang._eˆu]
]


const IndependentMonographVowels: PlainRule[] = [
    ["u", Rejang.A + Rejang._u],
    ["o", Rejang.A + Rejang._o],
    ["e", Rejang.A + Rejang._e],
    ["i", Rejang.A + Rejang._i],
    ["a", Rejang.A]
]



const IndependentVowels = chainRule<PlainRule>(IndependentDigraphVowels,
                                               IndependentMonographVowels)

const DiphthongVowels: PlainRule[] = [
    ["a_u", Rejang._au],
    ["a_i", Rejang._ai],
    ["e_a", Rejang._ea]
]

const DigraphAnok: PlainRule[] = [
    ["^e", Rejang._eˆu]
]

const MonographAnok: PlainRule[] = [
    ["u", Rejang._u],
    ["o", Rejang._o],
    ["e", Rejang._e],
    ["i", Rejang._i],
]

const Anok = chainRule<PlainRule>(DigraphAnok,
                                  MonographAnok)

const DependentVowels = chainRule<PlainRule>(Anok,
                                             [["a", ""]])

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
            TrigraphConsonants,
            DigraphConsonants,
            MonographConsonants),
        chainRule(DiphthongVowels,
                  DependentVowels))

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
    chainRule(ClosedTrigraphConsonants,
              ClosedDigraphConsonants,
              ClosedMonographConsonants)

const latinVowels: string[] = DependentVowels.map(([key,val]) => key)
const anok: string[] = chainRule(Anok).map(([key, val]) => val)
const inok: string[] = chainRule(Inok).map(([key, val]) => val)

const FinalConsonants: PlainRule[] = chainRule(
    FinalDigraphConsonantDiacritics,
    FinalMonographConsonantDiacritics
)

const FinalConsonantsToClosedConsonants: PlainRule[] =
    FinalConsonants
        .filter(([key, val]) => (key != "\'"))
        .map(([key, val]) =>
            [val, ClosedConsonants.filter(([k, v]) => key == k)[0][1]])

// console.dir(FinalConsonantsToClosedConsonants, {maxArrayLength: null})

const FromLatinScheme: Rule[] = prepareRules(
    chainRule<Rule>(FinalConsonants
        .map((rule: PlainRule) =>
            between(
                patternList(latinVowels.map(escape)),
                rule,
                patternList(wordDelimiters.map(escape).concat("$")))),
              Syllables,
              ClosedConsonants,
              IndependentVowels,
              Punctuation))

const ToLatinScheme: Rule[] = prepareRules(
    chainRule(
        asInverse(IndependentVowels),
        asInverse(ClosedConsonants),
        asInverse(Syllables),
        asInverse(FinalConsonants),
        asInverse(DiphthongVowels),
        asInverse(Punctuation)))

const ReversibleLatinToLatinScheme: Rule[] = prepareRules([
    ["n_g_g", "ngg"],
    ["n_d", "nd"],
    ["n_g", "ng"],
    ["n_j", "nj"],
    ["n_y", "ny"],
    ["m_b", "mb"],
    ["n_g", "ng"],
    ["a_i", "ai"],
    ["a_u", "au"],
    ["e_a", "ea"],
    notAfter(/\^/, ["e", "é"]),
    ["^e", "e"],
])

export const fromLatin = (input: string): string => transliterate(input, FromLatinScheme);
export const toLatin = (input: string): string => transliterate(input, ToLatinScheme);
export const toStandardLatin = (input: string): string =>
    transliterate(input, ReversibleLatinToLatinScheme)

const IMEScheme: Rule[] = prepareRules(chainRule<Rule>(
    Punctuation,
    ruleProduct(
        FinalConsonantsToClosedConsonants,
        DependentVowels
            .map(([key, val]): PlainRule => [key, key])),
    FinalConsonants.map((rule: PlainRule) =>
        between(
            patternList(inok.concat(anok).map(escape)),
            rule,
            patternList(wordDelimiters.map(escape).concat("$"))
            )),
    makeTransitive(ClosedMonographConsonants,
                   ClosedDigraphConsonants,
                   ClosedTrigraphConsonants,
                   Syllables),
    makeTransitive(DependentVowels,
                   DiphthongVowels).filter(([key, val]) =>
                       val != "" && key.length > 1),
    IndependentVowels
))

export const initIME: (() => InputMethodEditor) = genericIMEInit(IMEScheme);
