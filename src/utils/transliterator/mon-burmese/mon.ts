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

const enum Mon {
    Ka = "က",
    Kha = "ခ",
    Ga = "ဂ",
    Gha = "ဃ",
    Nga = "ၚ",
    Ca = "စ",
    Cha = "ဆ",
    Ja = "ဇ",
    Jha = "ၛ",
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
    Baˆ = "ၜ",
    Bbe = "ၝ",

    // independent vowels

    I = "ဣ",
    Ii = "ဤ",
    U = "ဥ",
    Uu = "ဦ",
    E = "ဨ",
    O = "ဩ",
    Oˆ = "ဪ",
    
    // diacritics
    // medial consonants
    _y_ = "ျ",
    _v_ = "ွ",
    _r_ = "ြ",
    _h_ = "ှ",
    _n_ = "ၞ",
    _m_ = "ၟ",
    _l_ = "ၠ",
    // final diacritics
    virama = "်",
    
    // Tone marks

    tone1 = "့",
    tone2 = "း",

    // vowels
    __aa = "ာ",
    __i = "ိ",
    __ii = "ဳ",
    __u = "ု",
    __uu = "ူ",
    __e = "ေ",
    __ai = "ဲ",
    __o = "ဴ",
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

const monoBbe: PlainRule[] = [
    ["b_e^", Mon.Bbe]
]
const monoAasConsonant: PlainRule[] = [
    ["", Mon.A]
]

const monographAConsonants: PlainRule[] = [
    ["k", Mon.Ka],
    ["g", Mon.Ga],
    ["c", Mon.Ca],
    ["j", Mon.Ja],
    ["t", Mon.Ta],
    ["d", Mon.Da],
    ["n", Mon.Na],
    ["p", Mon.Pa],
    ["b", Mon.Ba],
    ["m", Mon.Ma],
    ["y", Mon.Ya],
    ["r", Mon.Ra],
    ["l", Mon.La],
    ["v", Mon.Va],
    ["s", Mon.Sa],
    ["h", Mon.Ha],
]



const monographÂConsonants: PlainRule[] = [
    ["t^", Mon.Taˆ],
    ["d^", Mon.Daˆ],
    ["n^", Mon.Naˆ],
    ["l^", Mon.Laˆ],
    ["b^", Mon.Baˆ],
]


const digraphAConsonants: PlainRule[] = [
    ["k_h", Mon.Kha],
    ["g_h", Mon.Gha],
    ["c_h", Mon.Cha],
    ["j_h", Mon.Jha],
    ["t_h", Mon.Tha],
    ["d_h", Mon.Dha],
    ["p_h", Mon.Pha],
    ["b_h", Mon.Bha],
    ["n_g", Mon.Nga],
    ["n_y", Mon.Nya]
]

const digraphÂConsonants: PlainRule[] = [
    ["n_y^", Mon.Nyaˆ],
    ["t_h^", Mon.Thaˆ],
    ["d_h^", Mon.Dhaˆ]
]


const medialConsonants: PlainRule[] = [
    ["y", Mon._y_],
    ["v", Mon._v_],
    ["r", Mon._r_],
    ["h", Mon._h_],
    ["n", Mon._n_],
    ["m", Mon._m_],
    ["l", Mon._l_]
]

const latinMedialConsonants: string[] = medialConsonants.map(([key, val]) => key)

const digraphAConsonantWithMedials: PlainRule[] =
    ruleProduct(digraphAConsonants, medialConsonants)
const digraphÂConsonantWithMedials: PlainRule[] =
    ruleProduct(digraphÂConsonants, medialConsonants)
const monographAConsonantWithMedials: PlainRule[] =
    ruleProduct(monographAConsonants, medialConsonants)
const monographÂConsonantWithMedials: PlainRule[] =
    ruleProduct(monographÂConsonants, medialConsonants)

const tone: PlainRule[] = [
    ["'", Mon.tone1],
    ['"', Mon.tone2],
]


const monographIndependentVowels: PlainRule[] = [
    ["i", Mon.I],
    ["u", Mon.U],
    ["e", Mon.E],
    ["o", Mon.O],
]

const longIndependentVowels: PlainRule[] = [
    ["ii", Mon.Ii],
    ["uu", Mon.Uu],
]

const independentÂVowels: PlainRule[] = [
    ["o^", Mon.Oˆ],
]
const dependentLongVowels: PlainRule[] = [
    ["aa", Mon.__aa],
    ["ii", Mon.__ii],
    ["uu", Mon.__uu],
]

const dependentShortVowels: PlainRule[] = [
    ["a", ""],
    ["i", Mon.__i],
    ["u", Mon.__u],
    ["e", Mon.__e],
    ["o", Mon.__o],
]

const dependentShortÂVowels: PlainRule[] = [
    ["o^", Mon.__oˆ],
]

const dipthongVowels: PlainRule[] = [
    ["ai", Mon.__ai],
    ["ui", Mon.__ui],
]

const addAsVowelToAConsonant: PlainRule[] = [
    ["ai", Mon.__ai],
    ["ui", Mon.__ui],
    ["aa", Mon.__aa],
    ["a", ""],
]


const numbers : PlainRule[] = [
    ["0", Mon.Thaoh],
    ["1", Mon.Satu],
    ["2", Mon.Dua],
    ["3", Mon.Klau],
    ["4", Mon.Pak],
    ["5", Mon.Limaˆ],
    ["6", Mon.Nam],
    ["7", Mon.Tajuh],
    ["8", Mon.Dalapan],
    ["9", Mon.Salapan]
]

const punctuations: PlainRule[] = [
    [',', Mon.Coma],
    ['.', Mon.Period],    
]

const SyllablesWithMedial: PlainRule[] =
    ruleProduct(
        chainRule(
            digraphÂConsonantWithMedials,
            digraphAConsonantWithMedials,
            monographÂConsonantWithMedials,
            monographAConsonantWithMedials
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
            monographÂConsonants,
            monographAConsonants
            ),
        chainRule(
            dipthongVowels,
            dependentLongVowels,
            dependentShortÂVowels,
            dependentShortVowels
        ))

const SyllablesOfVowels: PlainRule[] = 
    ruleProduct(
        monoAasConsonant,
        addAsVowelToAConsonant
    )

const ClosedConsonants: PlainRule[] = 
    ruleProduct(
        chainRule(
        digraphÂConsonants,
        digraphAConsonants,
        monographÂConsonants,
        monographAConsonants
        ),
        [["", Mon.virama]]
    )
const FromLatinScheme: Rule[] = prepareRules(
    chainRule(
        monoBbe,
        SyllablesWithMedial,
        Syllables,
        ClosedConsonants,
        longIndependentVowels,
        independentÂVowels,
        monographIndependentVowels,
        SyllablesOfVowels,
        tone,
        numbers,
        punctuations))

const ToLatinScheme: Rule[] = prepareRules(
    chainRule(
        asInverse(monoBbe),
        asInverse(ClosedConsonants),
        asInverse(SyllablesWithMedial),
        asInverse(Syllables),
        asInverse(longIndependentVowels),
        asInverse(independentÂVowels),
        asInverse(monographIndependentVowels),
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
    ["b^", "bb"],
    ["b_e^", "bbe"],
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
        monoBbe,
        SyllablesWithMedial,
        Syllables
    ),
    longIndependentVowels,
    independentÂVowels,
    monographIndependentVowels,
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
