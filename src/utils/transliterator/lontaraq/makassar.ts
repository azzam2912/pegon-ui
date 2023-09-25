import type { PlainRule, RegexRule, Rule, InputMethodEditor } from "../core"
import { prepareRules,
         chainRule,
         ruleProduct,
         makeTransitive,
         transliterate,
         debugTransliterate,
         escape,
         isPlain,
         asInverse,
         genericIMEInit
       } from "../core"

const enum Makassar {
    Ka = "𑻠",
    Ga = "𑻡",
    Nga = "𑻢",
    Pa = "𑻣",
    Ba = "𑻤",
    Ma = "𑻥",
    Ta = "𑻦",
    Da = "𑻧",
    Na = "𑻨",
    Ca = "𑻩",
    Ja = "𑻪",
    Nya = "𑻫",
    Ya = "𑻬",
    Ra = "𑻭",
    La = "𑻮",
    Wa = "𑻯",
    Sa = "𑻰",
    A = "𑻱",

    Angka = "𑻲",

    _i = "𑻳",
    _u = "𑻴",
    _e = " 𑻵",
    _o = "𑻶",

    Passimbang = "𑻷",
    EndOfSection = "𑻸",
}

const DigraphConsonants: PlainRule[] = [
    ["n_g", Makassar.Nga],
    ["n_y", Makassar.Nya]
]

const MonographConsonants: PlainRule[] = [
    ["k", Makassar.Ka],
    ["g", Makassar.Ga],
    ["p", Makassar.Pa],
    ["b", Makassar.Ba],
    ["m", Makassar.Ma],
    ["t", Makassar.Ta],
    ["d", Makassar.Da],
    ["n", Makassar.Na],
    ["c", Makassar.Ca],
    ["j", Makassar.Ja],
    ["y", Makassar.Ya],
    ["r", Makassar.Ra],
    ["l", Makassar.La],
    ["w", Makassar.Wa],
    ["s", Makassar.Sa],
]

const Ana: PlainRule[] = [
    ["i", Makassar._i],
    ["u", Makassar._u],
    ["o", Makassar._o],
    ["e", Makassar._e],
]

const Vowels = chainRule<PlainRule>(Ana, [["a", ""]])

const Consonants = chainRule<PlainRule>(DigraphConsonants,
                                        MonographConsonants)

const IndependentVowels: PlainRule[] =
    Vowels.map(([key, val]: PlainRule): PlainRule => [key, Makassar.A + val])


const Syllables: PlainRule[] =
    chainRule<PlainRule>(ruleProduct(Consonants,
                                Vowels),
                    IndependentVowels)

const DoubleAna: PlainRule[] =
    Consonants.flatMap<PlainRule>(([leftKey, leftVal]) =>
        Ana.map<PlainRule>(([rightKey, rightVal]) =>
            [`${leftVal}${rightVal}${leftVal}${rightVal}`,
             `${leftVal}${rightVal}${rightVal}`]));
                        
const anaGroup: Array<string> = Ana.map(([key, val]) => val)
    
const Angka: Rule[] =
    Consonants.map<RegexRule>(([key, val]) =>
        [new RegExp(`(${val})((${anaGroup.join("|")})?)(${val})`),
         `$1$2${Makassar.Angka}`])

const AngkaReverse: Rule[] =
    Consonants.map<RegexRule>(([key, val]) =>
        [new RegExp(`(${val})((${anaGroup.join("|")})?)(${Makassar.Angka})`),
         "$1$2$1"])

const Punctuation: PlainRule[] = [
    [",", Makassar.Passimbang],
    [".", Makassar.EndOfSection]
]

const FromLatinScheme: Rule[] =
    prepareRules(chainRule<Rule>(Syllables,
                                 DoubleAna,
                                 Angka,
                                 Punctuation))

export const fromLatin = (input: string): string =>
    transliterate(input, FromLatinScheme);

const ToLatinScheme: Rule[] =
    chainRule(
        AngkaReverse,
        asInverse(chainRule<PlainRule>(DoubleAna,
                                       Syllables,
                                       Punctuation)))

export const toLatin = (input: string): string =>
    transliterate(input, ToLatinScheme)

const StandardLatinScheme: Rule[] = prepareRules([
    ["n_g", "ng"],
    ["n_y", "ny"],
    ["e", "é"],
])

export const toStandardLatin = (input: string): string =>
    transliterate(input, StandardLatinScheme)

export const initIME = genericIMEInit(FromLatinScheme)
