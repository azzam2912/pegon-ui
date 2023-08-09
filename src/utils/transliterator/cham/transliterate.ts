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

const enum Cham {
    Ka = "ꨆ",
    Kha = "ꨇ",
    Ga = "ꨈ",
    Gha = "ꨉ",
    Ngaˆ = "ꨊ",
    Nga = "ꨋ",
    Ca = "ꨌ",
    Cha = "ꨍ",
    Ja = "ꨎ",
    Jha = "ꨏ",
    Nyaˆ = "ꨐ",
    Nya = "ꨑ",
    Nja = "ꨒ",
    Ta = "ꨓ",
    Tha = "ꨔ",
    Da = "ꨕ",
    Dha = "ꨖ",
    Naˆ = "ꨗ",
    Na = "ꨘ",
    Nda = "ꨙ",
    Pa = "ꨚ",
    Ppa = "ꨛ",
    Pha = "ꨜ",
    Ba = "ꨝ",
    Bha = "ꨞ",
    Maˆ = "ꨟ",
    Ma = "ꨠ",
    Mba = "ꨡ",
    Ya = "ꨢ",
    Ra = "ꨣ",
    La = "ꨤ",
    Wa = "ꨥ",
    Sya = "ꨦ",
    Sa = "ꨧ",
    Ha = "ꨨ",
    
    // final consonants
    _k = "ꩀ",
    _ng = "ꩂ",
    _c = "ꩄ",
    _t = "ꩅ",
    _n = "ꩆ",
    _p = "ꩇ",
    _y  = "ꩈ",
    _r = "ꩉ",
    _l = "ꩊ",
    _w = "ꨥ",
    _sy = "ꩋ",
    // independent vowels
    A = "ꨀ",
    I = "ꨁ",
    U = "ꨂ",
    E = "ꨃ",
    Ai = "ꨄ",
    O = "ꨅ",
    
    // diacritics
    // medial consonants
    _i_ = "ꨳ",
    _r_ = "ꨴ",
    _l_ = "ꨵ",
    _u_ = "ꨶ",
    // final diacritics
    __ng = "ꩃ",
    __m = "ꩌ",
    __h = "ꩍ",
    // vowels
    __aa = "ꨩ",
    __i = "ꨪ",
    __ii = "ꨫ",
    __ei = "ꨬ",
    __u = "ꨭ",
    __uu = "ꨭꨩ",
    __eˆ = "ꨮ",
    __eˆeˆ = "ꨮꨩ",
    __e = "ꨯꨮ",
    __ee = "ꨯꨮꨩ",
    __o = "ꨯ",
    __oo = "ꨯꨩ",
    __ai = "ꨰ",
    __ao = "ꨯꨱ",
    __aˆ = "ꨲ",
    __aˆaˆ = "ꨲꨩ",
    __au = "ꨮꨭ",
    
    // numbers
    Thaoh = "꩐",
    Satu = "꩑",
    Dua = "꩒",
    Klau = "꩓",
    Pak = "꩔",
    Limaˆ = "꩕",
    Nam = "꩖",
    Tajuh = "꩗",
    Dalapan = "꩘",
    Salapan = "꩙",

    // punctuation
    Opening = "꩜",
    Danda = "꩝",
    DandaDouble = "꩞",
    DandaTriple = "꩟",
}


const monographAConsonants: PlainRule[] = [
    ["k", Cham.Ka],
    ["g", Cham.Ga],
    ["c", Cham.Ca],
    ["j", Cham.Ja],
    ["t", Cham.Ta],
    ["d", Cham.Da],
    ["p", Cham.Pa],
    ["b", Cham.Ba],
    ["m", Cham.Ma],
    ["y", Cham.Ya],
    ["r", Cham.Ra],
    ["l", Cham.Na],
    ["w", Cham.Na],
    ["s", Cham.Na],
    ["h", Cham.Na],
]

const digraphAConsonants: PlainRule[] = [
    ["k_h", Cham.Kha],
    ["g_h", Cham.Gha],
    ["c_h", Cham.Gha],
    ["j_h", Cham.Gha],
    ["p_h", Cham.Pha],
    ["t_h", Cham.Pha],
    ["b_h", Cham.Pha],
    ["m_b", Cham.Mba],
    ["n_d", Cham.Nda],
    ["n_d", Cham.Nda],
]

const monographÂConsonants: PlainRule[] = [
    ["m", Cham.Maˆ],
    ["n", Cham.Naˆ]
]

const digraphÂConsonants: PlainRule[] = [
    ["n_g", Cham.Ngaˆ],
    ["n_y", Cham.Nyaˆ],
]

const syllabicÂToAConsonants: PlainRule[] = [
    ["n_ga", Cham.Nga],
    ["n_ya", Cham.Nya],
    ["ma", Cham.Ma],
    ["na", Cham.Na]
]

const syllabicÂConsonants: PlainRule[] = [
    ["n_g^a", Cham.Ngaˆ],
    ["n_y^a", Cham.Nyaˆ],
    ["m^a", Cham.Maˆ],
    ["n^a", Cham.Naˆ]
]

const finalConsonantLetters: PlainRule[] = [ 
    ["s_y", Cham._sy],
    ["k", Cham._k],
    // keep ths or the other one?
    // ["n_g", Cham._ng],
    ["c", Cham._c],
    ["t", Cham._t],
    ["n", Cham._n],
    ["p", Cham._p],
    ["r", Cham._r],
    ["l", Cham._l],
    ["w", Cham._w],
]

const finalConsonantDiacritics: PlainRule[] = [
    ["n_g", Cham.__ng],
    ["m", Cham.__m],
    ["h", Cham.__h]
]

const medialConsonants: PlainRule[] = [
    ["i", Cham._i_],
    ["r", Cham._r_],
    ["l", Cham._l_],
    ["u", Cham._u_]
]

const monographIndependentVowels: PlainRule[] = [
    ["a", Cham.A],
    ["i", Cham.I],
    ["u", Cham.U],
    ["e", Cham.E],
    ["o", Cham.O]
]

const digraphIndependentVowels: PlainRule[] = [
    ["a_i", Cham.Ai],
]

const dependentLongVowels: PlainRule[] = [
    ["^e^e", Cham.__eˆeˆ],
    ["^a^a", Cham.__aˆaˆ],
    ["aa", Cham.__aa],
    ["ii", Cham.__ii],
    ["ee", Cham.__ee],
    ["oo", Cham.__oo],
    ["uu", Cham.__uu],
]

const dipthongVowels: PlainRule[] = [
    ["aao", Cham.__ao],
    ["ei", Cham.__ei],
    ["ai", Cham.__ai],
    ["au", Cham.__au],
    ["ao", Cham.__ao],
]

const digraphShortVowels: PlainRule[] = [
    ["^a", Cham.__aˆ],
    ["^e", Cham.__eˆ],
]

const monographShortVowels: PlainRule[] = [
    // ["a", ""],
    ["i", Cham.__i],
    ["u", Cham.__u],
    ["o", Cham.__o],
    ["e", Cham.__e]
]

const numbers : PlainRule[] = [
    ["0", Cham.Thaoh],
    ["1", Cham.Satu],
    ["2", Cham.Dua],
    ["3", Cham.Klau],
    ["4", Cham.Pak],
    ["5", Cham.Limaˆ],
    ["6", Cham.Nam],
    ["7", Cham.Tajuh],
    ["8", Cham.Dalapan],
    ["9", Cham.Salapan]
]


const dependentVowels: Rules[] = chainRule<Rule>(
    dipthongVowels,
    dependentLongVowels,
    digraphShortVowels,
    monographShortVowels
)

const openLatinConsonants: string[] = chainRule<Rule>(
    digraphÂConsonants,
    digraphAConsonants,
    monographÂConsonants,
    monographAConsonants,
).map(([key, val]) => key)

const latinVowels: string [] = chainRule<Rule>(
    digraphShortVowels,
    monographShortVowels,
    [["a", ""]]
).map(([key, val]) => escape(key))

const asIndependent = (rules: PlainRule[]): RegexRule[] =>rules.map(([key, val]) => [new RegExp(`(?<!(\\^|${openLatinConsonants.join("|")}))${escape(key)}`), val])

const asDependent = (rules: PlainRule[]): RegexRule[] =>rules.map(([key, val]) => [new RegExp(`(?<=(\\^|${openLatinConsonants.join("|")}))${escape(key)}`), val])

const LatinToChamScheme: Rule[] =
    prepareRules(chainRule<Rule>(
        syllabicÂConsonants,
        ruleProduct(
            medialConsonants,
            dependentVowels
        ).map(([key, val]) => [new RegExp(`(?<=(\\^|${openLatinConsonants.join("|")}))${escape(key)}`), val]),
        asDependent(dependentVowels),
        asIndependent(chainRule<Rule>(
            digraphIndependentVowels,
            monographIndependentVowels)),
        [["a", ""]],
        asWordEnding(chainRule<Rule>(
            finalConsonantLetters,
            finalConsonantDiacritics,
        )),
        digraphAConsonants,
        digraphÂConsonants,
        monographAConsonants,
        monographÂConsonants,
        numbers,
    ))

export const transliterateLatinToCham = (input: string): string => debugTransliterate(input, LatinToChamScheme);


export const transliterateChamToLatin = (input: string): string => transliterate(input, ChamToLatinScheme);

const ReversibleLatinToLatinScheme: Rule[] =
    prepareRules(
        [
            ["k_h", "kh"],
            ["g_h", "gh"],
            ["c_h", "ch"],
            ["j_h", "jh"],
            ["n_y", "ny"],
            ["n_j", "nj"],
            ["n_g", "ng"],
            ["t_h", "th"],
            ["d_h", "dh"],
            ["n_d", "nd"],
            ["p_h", "ph"],
            ["b_h", "bh"],
            ["m_b", "mb"],
            ["n_d", "nd"],
            [/[^\^]e/, "é"],
            ["^e", "e"],
            ["aa", "a"],
            ["^a", "â"]])

export const transliterateReversibleLatinToStandardLatin = (input: string): string =>
    transliterate(input, ReversibleLatinToLatinScheme)
