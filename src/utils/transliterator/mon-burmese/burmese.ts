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

const enum Burmese {
    Ka = "က",
    Kha = "ခ",
    Ga = "ဂ",
    Gha = "ဃ",
    Nga = "င",
    Ca = "စ",
    Cha = "ဆ",
    Ja = "ဇ",
    Jha = "ဈ",
    Nyaˆ = "ည",
    Nya = "ဉ ",
    Taˆ = "ဋ",
    Thaˆ = "ဌ",
    Daˆ = "ဍ",
    Dhaˆ = "ဎ",
    Naˆ = "ဏ",
    Ta = "တ",
    Tha = "ထ",
    Da = "ဒ",
    Dha = "ဓ",
    Na = "န",
    Pa = "ပ",
    Pha = "ဖ",
    Ba = "ဗ",
    Bha = "ဘ",
    Ma = "မ",
    Ya = "ယ",
    Ra = "ရ",
    La = "လ",
    Va = "ဝ",
    Sa = "သ",
    Ha = "ဟ",
    Laˆ = "ဠ",
    A = "အ",

    // independent vowels

    I = "ဣ",
    Ii = "ဤ",
    U = "ဥ",
    Uu = "ဦ",
    E = "ဧ",
    O = "ဩ",
    Oˆ = "ဪ",
    
    // diacritics
    // medial consonants
    _y_ = "ျ",
    _v_ = "ွ",
    _r_ = "ြ",
    _h_ = "ှ",
    // final diacritics
    virama = "ံ",
    
    // Tone marks

    tone1 = "့",
    tone2 = "း",

    // vowels
    __aa = "ာ",
    __i = "ိ",
    __ii = "ီ",
    __u = "ု",
    __uu = "ူ",
    __e = "ေ",
    __ai = "ဲ",
    __o = "ော",
    __oˆ = "ော်",
    __ui = "ို",
    
    // numbers
    Thaoh = "၀",
    Satu = "၁",
    Dua = "၂",
    Klau = "၃",
    Pak = "၄",
    Limaˆ = "၅",
    Nam = "၆",
    Tajuh = "၇",
    Dalapan = "၈",
    Salapan = "၉",

    // punctuation
    Coma = "၊",
    Period = "။",
}

const singleAasConsonant: PlainRule[] = [
    ["", Burmese.A]
]

const singlegraphAConsonants: PlainRule[] = [
    ["k", Burmese.Ka],
    ["g", Burmese.Ga],
    ["c", Burmese.Ca],
    ["j", Burmese.Ja],
    ["t", Burmese.Ta],
    ["d", Burmese.Da],
    ["n", Burmese.Na],
    ["p", Burmese.Pa],
    ["b", Burmese.Ba],
    ["m", Burmese.Ma],
    ["y", Burmese.Ya],
    ["r", Burmese.Ra],
    ["l", Burmese.La],
    ["v", Burmese.Va],
    ["s", Burmese.Sa],
    ["h", Burmese.Ha],
]



const singlegraphÂConsonants: PlainRule[] = [
    ["t^", Burmese.Taˆ],
    ["d^", Burmese.Daˆ],
    ["n^", Burmese.Naˆ],
    ["l^", Burmese.Laˆ],
]


const digraphAConsonants: PlainRule[] = [
    ["k_h", Burmese.Kha],
    ["g_h", Burmese.Gha],
    ["c_h", Burmese.Cha],
    ["j_h", Burmese.Jha],
    ["t_h", Burmese.Tha],
    ["d_h", Burmese.Dha],
    ["p_h", Burmese.Pha],
    ["b_h", Burmese.Bha],
    ["n_g", Burmese.Nga],
    ["n_y", Burmese.Nya]
]

const digraphÂConsonants: PlainRule[] = [
    ["n_y^", Burmese.Nyaˆ],
    ["t_h^", Burmese.Thaˆ],
    ["d_h^", Burmese.Dhaˆ]
]


const medialConsonants: PlainRule[] = [
    ["y", Burmese._y_],
    ["v", Burmese._v_],
    ["r", Burmese._r_],
    ["h", Burmese._h_]
]

const latinMedialConsonants: string[] = medialConsonants.map(([key, val]) => key)

const digraphAConsonantWithMedials: PlainRule[] =
    ruleProduct(digraphAConsonants, medialConsonants)
const digraphÂConsonantWithMedials: PlainRule[] =
    ruleProduct(digraphÂConsonants, medialConsonants)
const singlegraphAConsonantWithMedials: PlainRule[] =
    ruleProduct(singlegraphAConsonants, medialConsonants)
const singlegraphÂConsonantWithMedials: PlainRule[] =
    ruleProduct(singlegraphÂConsonants, medialConsonants)

const tone: PlainRule[] = [
    ["'", Burmese.tone1],
    ['"', Burmese.tone2],
]


const singlegraphIndependentVowels: PlainRule[] = [
    ["i", Burmese.I],
    ["u", Burmese.U],
    ["e", Burmese.E],
    ["o", Burmese.O],
]

const longIndependentVowels: PlainRule[] = [
    ["ii", Burmese.Ii],
    ["uu", Burmese.Uu],
]

const independentÂVowels: PlainRule[] = [
    ["o^", Burmese.Oˆ],
]
const dependentLongVowels: PlainRule[] = [
    ["aa", Burmese.__aa],
    ["ii", Burmese.__ii],
    ["uu", Burmese.__uu],
]

const dependentShortVowels: PlainRule[] = [
    ["a", ""],
    ["i", Burmese.__i],
    ["u", Burmese.__u],
    ["e", Burmese.__e],
    ["o", Burmese.__o],
]

const dependentShortÂVowels: PlainRule[] = [
    ["o^", Burmese.__oˆ],
]

const dipthongVowels: PlainRule[] = [
    ["ai", Burmese.__ai],
    ["ui", Burmese.__ui],
]

const addAsVowelToAConsonant: PlainRule[] = [
    ["ai", Burmese.__ai],
    ["ui", Burmese.__ui],
    ["aa", Burmese.__aa],
    ["a", ""],
]


const numbers : PlainRule[] = [
    ["0", Burmese.Thaoh],
    ["1", Burmese.Satu],
    ["2", Burmese.Dua],
    ["3", Burmese.Klau],
    ["4", Burmese.Pak],
    ["5", Burmese.Limaˆ],
    ["6", Burmese.Nam],
    ["7", Burmese.Tajuh],
    ["8", Burmese.Dalapan],
    ["9", Burmese.Salapan]
]

const punctuations: PlainRule[] = [
    [',', Burmese.Coma],
    ['.', Burmese.Period],    
]

const SyllablesWithMedial: PlainRule[] =
    ruleProduct(
        chainRule(
            digraphÂConsonantWithMedials,
            digraphAConsonantWithMedials,
            singlegraphÂConsonantWithMedials,
            singlegraphAConsonantWithMedials
            ),
        chainRule(
            dipthongVowels,
            dependentLongVowels,
            dependentShortÂVowels,
            dependentShortVowels
        ))

const Syllables: PlainRule[] =
    ruleProduct(
        chainRule(
            digraphÂConsonants,
            digraphAConsonants,
            singlegraphÂConsonants,
            singlegraphAConsonants
            ),
        chainRule(
            dipthongVowels,
            dependentLongVowels,
            dependentShortÂVowels,
            dependentShortVowels
        ))

const SyllablesOfVowels: PlainRule[] = 
    ruleProduct(
        singleAasConsonant,
        addAsVowelToAConsonant
    )

const ClosedConsonants: PlainRule[] = 
    ruleProduct(
        chainRule(
        digraphÂConsonants,
        digraphAConsonants,
        singlegraphÂConsonants,
        singlegraphAConsonants
        ),
        [["", Burmese.virama]]
    )
const FromLatinScheme: Rule[] = prepareRules(
    chainRule(
        SyllablesWithMedial,
        Syllables,
        ClosedConsonants,
        longIndependentVowels,
        independentÂVowels,
        singlegraphIndependentVowels,
        SyllablesOfVowels,
        tone,
        numbers,
        punctuations))

const ToLatinScheme: Rule[] = prepareRules(
    chainRule(
        asInverse(ClosedConsonants),
        asInverse(SyllablesWithMedial),
        asInverse(Syllables),
        asInverse(longIndependentVowels),
        asInverse(independentÂVowels),
        asInverse(singlegraphIndependentVowels),
        asInverse(SyllablesOfVowels),
        asInverse(tone),
        asInverse(numbers),
        asInverse(punctuations)
    )
)

const ReversibleLatinToLatinScheme: Rule[] = [
    ["n_y^", "ññ"],
    ["t_h^", "ṭh"],
    ["d_h^", "ḍh"],
    ["t^", "ṭ"],
    ["d^", "ḍ"],
    ["n^", "ṇ"],
    ["l^", "ḷ"],
    ["k_h", "kh"],
    ["g_h", "gh"],
    ["n_g", "ng"],
    ["c_h", "ch"],
    ["j_h", "jh"],
    ["n_y", "ñ"],
    ["t_h", "th"],
    ["d_h", "dh"],
    ["p_h", "ph"],
    ["b_h", "bh"],
    ["o^", "o'"]
]

export const fromLatin = (input: string): string => transliterate(input, FromLatinScheme);
export const toLatin = (input: string): string => transliterate(input, ToLatinScheme);
export const toStandardLatin = (input: string): string =>
    transliterate(input, ReversibleLatinToLatinScheme)


const IMEScheme: Rule[] = prepareRules(chainRule(
    makeTransitive(
        ClosedConsonants,
        SyllablesWithMedial,
        Syllables
    ),
    longIndependentVowels,
    independentÂVowels,
    singlegraphIndependentVowels,
    SyllablesOfVowels,
    tone,
    numbers, 
    punctuations, 
))

export function initIME(): InputMethodEditor {
    return {
        "rules": IMEScheme,
        "inputEdit": (inputString: string): string => 
            transliterate(inputString, IMEScheme)
    }
}
