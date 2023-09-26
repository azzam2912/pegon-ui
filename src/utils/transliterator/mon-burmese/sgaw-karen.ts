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

const enum SgawKaren {
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
    Sha = "ၡ",

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
    _y_ = "ၠ",
    _r_ = "ြွ",
    _l_ = "ျ",
    _w_ = "ွ",
    // final diacritics
    virama = "်",
    
    // Tone marks

    tone1 = "ၢ်",
    tone2 = "ာ်",
    tone3 = "း",
    tone4 = "ၣ်",
    tone5 = "ၤ",

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
    __eu = "ၢ",
    
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
    ["", SgawKaren.A]
]

const singlegraphAConsonants: PlainRule[] = [
    ["k", SgawKaren.Ka],
    ["g", SgawKaren.Ga],
    ["c", SgawKaren.Ca],
    ["j", SgawKaren.Ja],
    ["t", SgawKaren.Ta],
    ["d", SgawKaren.Da],
    ["n", SgawKaren.Na],
    ["p", SgawKaren.Pa],
    ["b", SgawKaren.Ba],
    ["m", SgawKaren.Ma],
    ["y", SgawKaren.Ya],
    ["r", SgawKaren.Ra],
    ["l", SgawKaren.La],
    ["v", SgawKaren.Va],
    ["s", SgawKaren.Sa],
    ["h", SgawKaren.Ha],
]



const singlegraphÂConsonants: PlainRule[] = [
    ["t^", SgawKaren.Taˆ],
    ["d^", SgawKaren.Daˆ],
    ["n^", SgawKaren.Naˆ],
    ["l^", SgawKaren.Laˆ],
]


const digraphAConsonants: PlainRule[] = [
    ["k_h", SgawKaren.Kha],
    ["g_h", SgawKaren.Gha],
    ["c_h", SgawKaren.Cha],
    ["j_h", SgawKaren.Jha],
    ["t_h", SgawKaren.Tha],
    ["d_h", SgawKaren.Dha],
    ["p_h", SgawKaren.Pha],
    ["b_h", SgawKaren.Bha],
    ["n_g", SgawKaren.Nga],
    ["n_y", SgawKaren.Nya],
    ["s_h", SgawKaren.Sha]
]

const digraphÂConsonants: PlainRule[] = [
    ["n_y^", SgawKaren.Nyaˆ],
    ["t_h^", SgawKaren.Thaˆ],
    ["d_h^", SgawKaren.Dhaˆ]
]


const medialConsonants: PlainRule[] = [
    ["y", SgawKaren._y_],
    ["r", SgawKaren._r_],
    ["l", SgawKaren._l_],
    ["w", SgawKaren._w_]
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
    ["1", SgawKaren.tone1],
    ["2", SgawKaren.tone2],
    ["3", SgawKaren.tone3],
    ["4", SgawKaren.tone4],
    ["5", SgawKaren.tone5]
]


const singlegraphIndependentVowels: PlainRule[] = [
    ["i", SgawKaren.I],
    ["u", SgawKaren.U],
    ["e", SgawKaren.E],
    ["o", SgawKaren.O],
]

const longIndependentVowels: PlainRule[] = [
    ["ii", SgawKaren.Ii],
    ["uu", SgawKaren.Uu],
]

const independentÂVowels: PlainRule[] = [
    ["o^", SgawKaren.Oˆ],
]
const dependentLongVowels: PlainRule[] = [
    ["aa", SgawKaren.__aa],
    ["ii", SgawKaren.__ii],
    ["uu", SgawKaren.__uu],
]

const dependentShortVowels: PlainRule[] = [
    ["a", ""],
    ["i", SgawKaren.__i],
    ["u", SgawKaren.__u],
    ["e", SgawKaren.__e],
    ["o", SgawKaren.__o],
]

const dependentShortÂVowels: PlainRule[] = [
    ["o^", SgawKaren.__oˆ],
]

const dipthongVowels: PlainRule[] = [
    ["ai", SgawKaren.__ai],
    ["ui", SgawKaren.__ui],
]

const addAsVowelToAConsonant: PlainRule[] = [
    ["ai", SgawKaren.__ai],
    ["ui", SgawKaren.__ui],
    ["aa", SgawKaren.__aa],
    ["a", ""],
]


const numbers : PlainRule[] = [
    ["0", SgawKaren.Thaoh],
    ["1", SgawKaren.Satu],
    ["2", SgawKaren.Dua],
    ["3", SgawKaren.Klau],
    ["4", SgawKaren.Pak],
    ["5", SgawKaren.Limaˆ],
    ["6", SgawKaren.Nam],
    ["7", SgawKaren.Tajuh],
    ["8", SgawKaren.Dalapan],
    ["9", SgawKaren.Salapan]
]

const punctuations: PlainRule[] = [
    [',', SgawKaren.Coma],
    ['.', SgawKaren.Period],    
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

const SgawKarenToneSyllables = chainRule(
    SyllablesWithMedial,
    Syllables,
    SyllablesOfVowels).map(([key, val]) => val)

const LatinVowels = chainRule(
    SyllablesWithMedial,
    Syllables,
    SyllablesOfVowels).map(([key, val]) => key)

const ToneNumbersAsSgawVowelDiacritics: RegexRule[] = tone.map(([key, val]) => [new RegExp(`(?<=(${SgawKarenToneSyllables.join("|")}))${key}`), val])
const ToneNumbersAsLatinVowelDiacritics: RegexRule[] = tone.map(([key, val]) => [new RegExp(`(?<=(${LatinVowels.join("|")}))${key}`), val])


const ClosedConsonants: PlainRule[] = 
    ruleProduct(
        chainRule(
        digraphÂConsonants,
        digraphAConsonants,
        singlegraphÂConsonants,
        singlegraphAConsonants
        ),
        [["", SgawKaren.virama]]
    )
const FromLatinScheme: Rule[] = prepareRules(
    chainRule<Rule>(
        SyllablesWithMedial,
        Syllables,
        ClosedConsonants,
        longIndependentVowels,
        independentÂVowels,
        singlegraphIndependentVowels,
        SyllablesOfVowels,
        ToneNumbersAsLatinVowelDiacritics,
        numbers,
        punctuations))

const ToLatinScheme: Rule[] = prepareRules(
    chainRule<PlainRule>(
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
    ["s_h", "sh"],
    ["o^", "o'"]
]

export const fromLatin = (input: string): string => transliterate(input, FromLatinScheme);
export const toLatin = (input: string): string => transliterate(input, ToLatinScheme);
export const toStandardLatin = (input: string): string =>
    transliterate(input, ReversibleLatinToLatinScheme)


const IMEScheme: Rule[] = prepareRules(chainRule<Rule>(
    makeTransitive(
        chainRule<PlainRule>(
        ClosedConsonants,
        SyllablesWithMedial,
        Syllables    
    )),
    ToneNumbersAsSgawVowelDiacritics,
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
