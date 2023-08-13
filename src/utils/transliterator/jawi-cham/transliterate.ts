import type { PlainRule, RegexRule, Rule, InputMethodEditor } from "../core"
import { Arab } from "../arab-common"
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
         asInverse
       } from "../core"

// based on Majid, http://naipaleikaohkabuak.blogspot.com/2010/11/majid-transliteration-jawi-cham.html

const enum ChamJawi {
    AlifWithThreeDotsAbove = "\u0627\uFBB6",
    AlifWithSukun = "\u0627\u0652",
    // Consonants
    Nja = "\u0685",
    Nda = "\u068E",
    Nga = "\u06A0",
    Mba = "\u06A8",
    Ga = "\u06AC",
    Kaf = "\u06A9",
    WawWithThreeDotsAbove = "\u0648\uFBB6",
    DhaWithThreeDotsABove = "\u068E",
    Ha = "\u0647",
    Hamzah = "\u0621",
    HighHamzah = "\u0674",
    Ya = "\u064A",
    Maksura = "\u0649",    
    Nya = "\u06D1",    
}

const monographConsonants: PlainRule[] = [
    ["b", Arab.Ba],
    ["t", Arab.Ta],
    ["c", Arab.Ca],
    ["d", Arab.Dal],
    ["r", Arab.Ra],
    ["z", Arab.Zain],
    ["s", Arab.Sin],
    ["'", Arab.Ain],
    ["j", Arab.Jim],
    ["f", Arab.Fa],
    ["q", Arab.Qaf],
    ["p", Arab.Fa],
    ["v", Arab.Peh],
    ["k", ChamJawi.Kaf],
    ["g", ChamJawi.Ga],
    ["l", Arab.Lam],
    ["m", Arab.Mim],
    ["n", Arab.Nun],
    ["h", Arab.Ha],
    ["w", Arab.Waw],
    ["y", Arab.Ya],
    // Tambahan konsonan Arab
    ["'", Arab.Hamzah],
    ["E", Arab.Ain],
    ["H", Arab.Ho]
]

const digraphConsonants: PlainRule[] = [
    // taken from Pegon
    // ["h_h", Arab.Ho],
    // taken from Majid
    ["k_h", ChamJawi.Kaf + Arab.Ho],
    ["g_h", ChamJawi.Ga  + Arab.Ha],
    ["c_h", Arab.Ca + Arab.Ho],
    ["j_h", Arab.Jim + Arab.Ha],
    ["n_y", ChamJawi.Nya],
    ["n_j", ChamJawi.Nja],
    ["n_g", ChamJawi.Nga],
    ["t_h", Arab.Ta + Arab.Ho],
    ["d_h", Arab.Dal + Arab.Ha],
    ["n_d", ChamJawi.DhaWithThreeDotsABove],
    ["p_h", Arab.Fa + Arab.Ho],
    ["b_h", Arab.Ba + Arab.Ha],
    ["m_b", ChamJawi.Mba],
    ["n_d", ChamJawi.Nda],
    ["s_y", Arab.Syin]
]

const digraphTargetMonographVowels: PlainRule[] = [
    ["o", ChamJawi.WawWithThreeDotsAbove],
    ["e", Arab.Ya + Arab.Sukun],
]

const monographTargetMonographVowels: PlainRule[] = [
    ["i", Arab.Ya],
    ["u", Arab.Waw],
]

const monographVowels: PlainRule[] = chainRule(digraphTargetMonographVowels, monographTargetMonographVowels)

const digraphVowels: PlainRule[] = [
    ["^a", ChamJawi.AlifWithThreeDotsAbove],
    ["^e", ChamJawi.AlifWithSukun],
    ["aa", Arab.Alif],
]

const beginningMonographVowels: PlainRule[] = [
    ["a", Arab.Alif],
    ["i", Arab.Alif + Arab.Ya],
    ["u", Arab.Alif + Arab.Waw],
    ["o", Arab.Alif + ChamJawi.WawWithThreeDotsAbove],
]

const beginningDigraphVowels: PlainRule[] = [
    ["^e", ChamJawi.AlifWithSukun],
    ["ai", Arab.Ain + Arab.Alif + Arab.Ya]
]

const monographVowelAsBeginnings: RegexRule[] = asWordBeginning(beginningMonographVowels);
const digraphVowelAsBeginnings: RegexRule[] = asWordBeginning(beginningDigraphVowels);

const medialConsonants: PlainRule[] = [
    ["r", Arab.Ra],
    ["i", Arab.Ya],
    ["l", Arab.Lam],
    ["u", Arab.Waw]
]

// dipthongs don't occur in the beginning?
const dipthongs: PlainRule[] = [
    ["^ei", ChamJawi.AlifWithSukun + Arab.Ya],
    ["ao", Arab.Alif + ChamJawi.WawWithThreeDotsAbove],
    ["au", Arab.Alif + Arab.Waw],
    ["ia", Arab.Ya + Arab.Alif],
    ["ua", Arab.Waw + Arab.Alif]
]

const specialCases: PlainRule[] = [
    ["iy", Arab.Ya + Arab.Ya],
    ["ow", ChamJawi.WawWithThreeDotsAbove + Arab.Waw],
]

const numbers : PlainRule[] = [
    ["0", Arab.Shifr],
    ["1", Arab.Wahid],
    ["2", Arab.Itsnan],
    ["3", Arab.Tsalatsah],
    ["4", Arab.Arbaah],
    ["5", Arab.Khamsah],
    ["6", Arab.Sittah],
    ["7", Arab.Sabaah],
    ["8", Arab.Tsamaniyah],
    ["9", Arab.Tisah]
]

const LatinToChamJawiScheme: Rule[] =
    prepareRules(chainRule<Rule>(
        digraphVowelAsBeginnings,
        monographVowelAsBeginnings,
        digraphConsonants,
        monographConsonants,
        digraphVowels,
        [["a", ""]] as PlainRule[],
        monographVowels,
        numbers))

const ChamJawiToLatinScheme: Rule[] =
    prepareRules(chainRule<Rule>(
        asWordEnding(asInverse(specialCases)),
        asWordBeginning(asInverse(beginningDigraphVowels)),
        asWordBeginning(asInverse(beginningMonographVowels)),
        asInverse(digraphTargetMonographVowels),
        asInverse(digraphVowels),
        asInverse(digraphConsonants),
        asInverse(monographTargetMonographVowels),
        asInverse(monographConsonants),
        asInverse(numbers),
    ))

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
            ["^a", "â"],
            ["H", "h"]])

export const fromLatin = (input: string): string =>
    transliterate(input, LatinToChamJawiScheme)

export const toLatin = (input: string): string =>
    transliterate(input, ChamJawiToLatinScheme)

export const toStandardLatin = (input: string): string =>
    transliterate(input, ReversibleLatinToLatinScheme)

const IMERules: Rule[] = prepareRules(chainRule<Rule>(
    makeTransitive(monographConsonants,
                   digraphConsonants),
    digraphVowelAsBeginnings,
    monographVowelAsBeginnings,
    digraphVowels,
    monographVowels
))

export function initIME(): InputMethodEditor {
    return {
        "rules": IMERules,
        "inputEdit": (inputString: string): string => 
            transliterate(inputString, IMERules)
    }
}
