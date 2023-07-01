import type { StemResult } from "../stemmer/stemmer";

const enum Pegon {
    Alif = "\u0627",
    AlifWithHamzaAbove = "\u0623",
    AlifWithHamzaBelow = "\u0625",
    AlifWithMaddaAbove = "\u0622",
    AlifWithHamzaAboveThenWaw = "\u0623\u0648",
    AlifWithHamzaBelowThenYa = "\u0625\u064A",
    AlifWithHamzaAboveThenYa = "\u0623\u064A",
    AlifThenWaw = "\u0627\u0648",
    // Tambahan untuk huruf Arab
    AlefWasla = "\u0671",
    WawHamzaAbove= "\u0624",
    AlefMaksura = "\u0649",

    // Harakat
    Fatha = "\u064E",
    CurlyFatha = "\u08E4",
    MaddaAbove = "\u0653",
    SuperscriptAlif = "\u0670", // khanjariah
    Kasra = "\u0650",
    Damma = "\u064F",
    // Tambahan harakat untuk huruf Arab
    Fathatan = "\u064B",
    Dhammatan = "\u064C",
    Kasratan = "\u064D",
    InvertedDhamma = "\u0657",
    SubAlef = "\u0656",
    OpenFathatan = "\u08F0",
    OpenDhammatan = "\u08F1",
    OpenKasratan= "\u08F2",

    SuperscriptAlifThenYa = "\u0670\u064A",
    FathaThenYa = "\u064E\u064A",
    FathaThenWaw = "\u064E\u0648",
    // Consonants
    Ba = "\u0628",
    Ya = "\u064A",
    Ta = "\u062A",
    Ca = "\u0686",
    Dal = "\u062F",
    Waw = "\u0648",
    Ra = "\u0631",
    Zain = "\u0632",
    Sin = "\u0633",
    Ain = "\u0639",
    Jim = "\u062C",
    Fa = "\u0641",
    Qaf = "\u0642",
    Peh = "\u06A4",
    Kaf = "\u0643",
    KafWithOneDotBelow = "\u08B4",
    KafWithThreeDotsBelow = "\u06AE",
    Lam = "\u0644",
    Mim = "\u0645",
    Nun = "\u0646",
    Ha = "\u0647",
    ThaWithThreeDotsAbove = "\u069F",
    ThaWithOneDotBelow = "\u0637\u065C",
    Tsa = "\u062B",
    Ho = "\u062D",
    Kho = "\u062E",
    DhaWithOneDotBelow = "\u068A",
    DhaWithThreeDotsABove = "\u068E",
    Dzal = "\u0630",
    Syin = "\u0634",
    Shod = "\u0635",
    Dho = "\u0636",
    Tha = "\u0637",
    Zha = "\u0638",
    Ghain = "\u063A",
    Nga = "\u06A0",
    Nya = "\u06D1",
    FathaThenWawThenKasra = "\u064E\u0648\u0650",
    FathaThenYaThenKasra = "\u064E\u064A\u0650",
    TaMarbuta = "\u0629",
    YaWithHamzaAbove = "\u0678",
    FathaThenYaWithHamzaAbove = "\u064E\u0678",
    Maksura = "\u0649",
    Comma = "\u060C",
    Sukun = "\u0652",
    Tatwil = "\u0640",
    // Tambahan consonant Arab
    Hamza = "\u0621"
}

export type PlainTransliteration = [string, string]
export type RegexTransliteration = [RegExp, string]

export type Transliteration = PlainTransliteration | RegexTransliteration

// from https://stackoverflow.com/a/6969486
// escapes any control sequences
const escape = (toEscape: string) => toEscape
    .replace(/[.*+?^${}()|[\]\\\-]/g, '\\$&')

const isPlain = (rule: Transliteration): rule is PlainTransliteration =>
    typeof rule[0] === "string"

export const prepareRules = (rules: Transliteration[]): Transliteration[] =>
    rules.map<Transliteration>((rule) =>
        (isPlain(rule) ? [escape(rule[0]), rule[1]] : rule))

const debugTransliterate = (stringToTransliterate: string,
                       translationMap: Transliteration[]): string =>
    translationMap.reduce<string>((acc, [key, val]) => {
        if (new RegExp(key, 'g').test(acc)) {
            console.log(`acc: ${acc}\nkey: ${key}\nval: ${val}\n`)
        }
        return acc.replace(new RegExp(key, 'g'), val)},
                                  stringToTransliterate.slice())

export const transliterate = (stringToTransliterate: string,
                       translationMap: Transliteration[]): string =>
    translationMap.reduce<string>((acc, [key, val]) =>
        acc.replace(new RegExp(key, 'g'), val),
                                  stringToTransliterate.slice());

// like a cartesian product but for tl rules
// https://rosettacode.org/wiki/Cartesian_product_of_two_or_more_lists#Functional
export const ruleProduct =
    (leftRules: PlainTransliteration[],
     rightRules: PlainTransliteration[]): PlainTransliteration[] =>
    leftRules.flatMap<PlainTransliteration>(([leftKey, leftVal]) =>
        rightRules.map<PlainTransliteration>(([rightKey, rightVal]) =>
            [leftKey.concat(rightKey), leftVal.concat(rightVal)]));

export const chainRule = <T extends Transliteration>(...chainOfRules: T[][]): T[] =>
    chainOfRules.reduce<T[]>((acc, rules) => acc.concat(rules),
                                           [] as T[])

const punctuationRules: PlainTransliteration[] = [
    [",", Pegon.Comma]
]
const marbutahRules: PlainTransliteration[] = [
    ["t_", Pegon.TaMarbuta]
]

const monographVowelRules: PlainTransliteration[] = [
    ["a", Pegon.Alif],
    // asumsi semua e tanpa diakritik taling
	["e", Pegon.Fatha + Pegon.Ya],
	["o", Pegon.Fatha + Pegon.Waw],
	["i", Pegon.Ya],
	["u", Pegon.Waw],
    //second options of rules 4, 5, 6
    ['W', Pegon.Waw],
    ['A', Pegon.Alif],
    ['Y', Pegon.Ya]
]

const digraphVowelRules: PlainTransliteration[] = [
    ["^e", Pegon.MaddaAbove],
    ["`a", Pegon.YaWithHamzaAbove + Pegon.Alif]
]

const monographVowelHarakatAtFirstAbjadRules: PlainTransliteration[] = [
    ["a", Pegon.Alif],
    ["e", Pegon.Ya + Pegon.Fatha + Pegon.Sukun],
    ["o", Pegon.Waw + Pegon.Fatha + Pegon.Sukun],
    ["i", Pegon.Ya + Pegon.Kasra + Pegon.Sukun],
    ["u", Pegon.Waw + Pegon.Damma + Pegon.Sukun],    
]
    
const singleVowelRules: PlainTransliteration[] =
    chainRule(
        digraphVowelRules,
        monographVowelHarakatAtFirstAbjadRules)

const singleEndingVowelRules: PlainTransliteration[] = [
    ["i", Pegon.Ya]
]

export const wordDelimitingPatterns: string =
    escape([" ", ".", ",", "?", "!", "\"", "(", ")", "-", Pegon.Comma]
            .join(""))

// \b would fail when the characters are from different
// encoding blocks
export const asWordEnding = (rules: PlainTransliteration[]): RegexTransliteration[] =>
    prepareRules(rules).map<RegexTransliteration>(([key, val]) =>
        [new RegExp(`(${key})($|[${wordDelimitingPatterns}])`), `${val}$2`])

export const asWordBeginning = (rules: PlainTransliteration[]): RegexTransliteration[] =>
    prepareRules(rules).map<RegexTransliteration>(([key, val]) =>
        [new RegExp(`(^|[${wordDelimitingPatterns}])(${key})`), `$1${val}`])

export const asSingleWord = (rules: PlainTransliteration[]): RegexTransliteration[] =>
    prepareRules(rules).map<RegexTransliteration>(([key, val]) =>
        [new RegExp(`(^|[${wordDelimitingPatterns}])(${key})($|[${wordDelimitingPatterns}])`),
         `$1${val}$3`])

const singleVowelAsWordEndingRules: RegexTransliteration[] =
    asWordEnding(singleEndingVowelRules);

const beginningDigraphVowelRules: PlainTransliteration[] = [
    ["^e", Pegon.Alif + Pegon.MaddaAbove],
]

const beginningMonographVowelRules: PlainTransliteration[] = [
    ["a", Pegon.AlifWithHamzaAbove],
    ["e", Pegon.Alif + Pegon.Fatha + Pegon.Ya],
    ["i", Pegon.Alif + Pegon.Ya ],
    ["o", Pegon.Alif + Pegon.Fatha + Pegon.Waw],
    ["u", Pegon.Alif + Pegon.Waw],
]

const beginningSingleVowelRules: PlainTransliteration[] =
    chainRule(
        beginningDigraphVowelRules,
        beginningMonographVowelRules)

const beginningIForDeadConsonantRules: PlainTransliteration[] = [
    ["i", Pegon.AlifWithHamzaBelow]
]

const beginningIForOpenConsonantRules: PlainTransliteration[] = [
    ["i", Pegon.Alif + Pegon.Ya]
]

const doubleDigraphVowelRules: PlainTransliteration[] = [
    ["a^e", Pegon.Alif +
        Pegon.YaWithHamzaAbove + Pegon.MaddaAbove],
    ["i^e", Pegon.Ya + 
        Pegon.YaWithHamzaAbove + Pegon.MaddaAbove],
    ["u^e", Pegon.Waw +
        Pegon.YaWithHamzaAbove + Pegon.MaddaAbove],
    ["e^e", Pegon.Fatha + Pegon.Ya +
        Pegon.YaWithHamzaAbove + Pegon.MaddaAbove],
    ["o^e", Pegon.Fatha + Pegon.Waw +
        Pegon.YaWithHamzaAbove + Pegon.MaddaAbove],

]

const doubleMonographVowelRules: PlainTransliteration[] = [
    ["ae", Pegon.Alif +
        Pegon.Ha +
        Pegon.Fatha + Pegon.Ya],
    ["a`e", Pegon.Alif +
        Pegon.YaWithHamzaAbove +
        Pegon.Fatha + Pegon.Ya],
    ["ai", Pegon.Alif +
        Pegon.Ha +
        Pegon.Ya],
    ["a`i", Pegon.Alif +
        Pegon.YaWithHamzaAbove +
        Pegon.Ya],
    ["au", Pegon.Alif +
        Pegon.Ha +
        Pegon.Waw],
    ["aU", Pegon.Alif +
        Pegon.Alif +
        Pegon.Waw],
    ["iu", Pegon.Ya +
        Pegon.Ya +
        Pegon.Waw],
    ["i`u", Pegon.Ya +
        Pegon.YaWithHamzaAbove +
        Pegon.Waw],
    ["Ya", Pegon.Ya +
        Pegon.Ya + Pegon.Alif],
    ["Y`a", Pegon.Ya +
        Pegon.YaWithHamzaAbove + Pegon.Alif],
    ["aA", 
        Pegon.Alif + 
        Pegon.AlifWithHamzaAbove + Pegon.Fatha],
    ["aa", 
        Pegon.Alif + 
        Pegon.AlifWithHamzaAbove], 
    ["aA", 
        Pegon.Alif + 
        Pegon.AlifWithHamzaAbove + Pegon.Fatha],
    ["aa", 
        Pegon.Alif + 
        Pegon.AlifWithHamzaAbove],
    ["ao", Pegon.Alif +
        Pegon.Ha +
        Pegon.Fatha + Pegon.Waw],
    ["aO", Pegon.Alif +
        Pegon.Alif +
        Pegon.Fatha + Pegon.Waw],
    ["eo", Pegon.Fatha + Pegon.Ya +
        Pegon.YaWithHamzaAbove +
        Pegon.Fatha + Pegon.Waw],
    ["io", Pegon.Ya +
        Pegon.YaWithHamzaAbove +
        Pegon.Fatha + Pegon.Waw],
    // Pegon Sunda
    ["e_u", Pegon.MaddaAbove +
        Pegon.Waw],
    ["a_i", Pegon.Fatha +
        Pegon.Ya +
        Pegon.Sukun],
    ["a_u", Pegon.Fatha +
        Pegon.Waw +
        Pegon.Sukun],

    // Pegon Sunda
    ["e_u", Pegon.MaddaAbove +
        Pegon.Waw],
    ["a_i", Pegon.Fatha +
        Pegon.Ya +
        Pegon.Sukun],
    ["a_u", Pegon.Fatha +
        Pegon.Waw +
        Pegon.Sukun],

]

const doubleMonographBeginningSyllableVowelRules: PlainTransliteration[] = [
    ["iu",Pegon.Ya +
        Pegon.Ya +
        Pegon.Waw],
    ["ia", Pegon.Ya +
        Pegon.Alif],
    // ["eo", Pegon.Fatha +
    //     Pegon.Damma + Pegon.Waw + Pegon.Sukun],
    ["ia", Pegon.Kasra +
        Pegon.Ya +
        Pegon.Fatha + Pegon.Alif],
    ["eo", Pegon.Fatha + Pegon.Ya +
        Pegon.YaWithHamzaAbove +
        Pegon.Fatha + Pegon.Waw],
    ["io", Pegon.Ya +
        Pegon.YaWithHamzaAbove +
        Pegon.Fatha + Pegon.Waw],    
]

const alternateDoubleMonographVowelRules: PlainTransliteration[] = [
    ["ae", Pegon.Fatha + Pegon.Alif +
        Pegon.YaWithHamzaAbove +
        Pegon.Fatha + Pegon.Ya + Pegon.Sukun],
    ["ai", Pegon.Alif +
        Pegon.YaWithHamzaAbove +
        Pegon.Ya],
    ["au", Pegon.Alif +
        Pegon.Alif +
        Pegon.Waw],
    ["iu", Pegon.Ya +
        Pegon.YaWithHamzaAbove +
        Pegon.Waw],
    ["ia", Pegon.Kasra + Pegon.Ya + Pegon.Sukun + Pegon.Sukun +
        Pegon.YaWithHamzaAbove +
        Pegon.Fatha + Pegon.Alif],
    ["ao", Pegon.Alif +
        Pegon.Ha +
        Pegon.Fatha + Pegon.Waw],
    ["aO", Pegon.Alif +
        Pegon.Alif +
        Pegon.Fatha + Pegon.Waw],
]

const alternateDoubleMonographBeginningSyllableVowelRules: PlainTransliteration[] = [
    ["iu", Pegon.Kasra +
        Pegon.YaWithHamzaAbove +
        Pegon.Damma + Pegon.Waw + Pegon.Sukun],
    ["ia", Pegon.Kasra +
        Pegon.YaWithHamzaAbove +
        Pegon.Fatha + Pegon.Alif],
]

const doubleVowelRules: PlainTransliteration[] =
    chainRule(
        doubleDigraphVowelRules,
        doubleMonographVowelRules)

const doubleEndingVowelRules: PlainTransliteration[] = [
    ["ae", Pegon.Alif +
        Pegon.Ha +
        Pegon.Fatha + Pegon.Ya],
    ["ai", Pegon.Alif +
        Pegon.Ha +
        Pegon.Ya],
    ["ea", Pegon.Fatha + Pegon.Ya + Pegon.Sukun +
        Pegon.Ya +
        Pegon.Fatha + Pegon.Alif],
    ["^ea", Pegon.Fatha + Pegon.Ya +
        Pegon.Ya +
        Pegon.Alif],
    ["aa", Pegon.Alif +
        Pegon.Ha +
        Pegon.Alif],
    ["oa", Pegon.Fatha + Pegon.Waw +
        Pegon.Ha +
        Pegon.Alif],
    ["ua", Pegon.Waw +
        Pegon.Waw +
        Pegon.Alif],
    ["ia", Pegon.Ya + 
        Pegon.Ya +
        Pegon.Alif],
]

const alternateDoubleEndingVowelRules: PlainTransliteration[] = [
    ["ae", Pegon.Fatha + Pegon.Alif +
        Pegon.YaWithHamzaAbove +
        Pegon.Fatha + Pegon.Maksura + Pegon.Sukun],
    ["ai", Pegon.Fatha + Pegon.Alif +
        Pegon.YaWithHamzaAbove +
        Pegon.Kasra + Pegon.Maksura + Pegon.Sukun],
]

const doubleVowelAsWordEndingRules: RegexTransliteration [] =
    asWordEnding(doubleEndingVowelRules);

const beginningSingleVowelAsWordBeginningRules: RegexTransliteration[] =
    asWordBeginning(beginningSingleVowelRules);

const monographConsonantRules: PlainTransliteration[] = [
    ["b", Pegon.Ba],
    ["t", Pegon.Ta],
    ["c", Pegon.Ca],
    ["d", Pegon.Dal],
    ["r", Pegon.Ra],
    ["z", Pegon.Zain],
    ["s", Pegon.Sin],
    ["'", Pegon.Ain],
    ["j", Pegon.Jim],
    ["f", Pegon.Fa],
    ["q", Pegon.Qaf],
    ["p", Pegon.Peh],
    ["v", Pegon.Peh],
    ["k", Pegon.Kaf],
    ["G", Pegon.KafWithOneDotBelow],
    ["g", Pegon.KafWithThreeDotsBelow],
    ["l", Pegon.Lam],
    ["m", Pegon.Mim],
    ["n", Pegon.Nun],
    ["h", Pegon.Ha],
    ["w", Pegon.Waw],
    ["y", Pegon.Ya],
    // Tambahan konsonan Arab
    ["'`", Pegon.Hamza]
]

const digraphConsonantRules: PlainTransliteration[] = [
    // special combination using diacritics, may drop
    // ["t_h", Pegon.ThaWithOneDotBelow],
    // the one in id.wikipedia/wiki/Abjad_Pegon
    ["t_h", Pegon.ThaWithThreeDotsAbove],
    ["t_s", Pegon.Tsa],
    ["h_h", Pegon.Ho],
    ["k_h", Pegon.Kho],
    ["d_h", Pegon.DhaWithOneDotBelow],
    ["d_z", Pegon.Dzal],
    ["s_y", Pegon.Syin],
    ["s_h", Pegon.Shod],
    ["d_H", Pegon.Dho],
    ["t_t", Pegon.Tha],
    ["z_h", Pegon.Zha],
    ["g_h", Pegon.Ghain],
    ["n_g", Pegon.Nga],
    ["n_y", Pegon.Nya],
];

const consonantRules: PlainTransliteration[] = chainRule(
    digraphConsonantRules,
    monographConsonantRules)

const withSukun = (rules: PlainTransliteration[]): PlainTransliteration[] =>
    rules.map<PlainTransliteration>(([key, val]) => [key, val.concat(Pegon.Sukun)])

const deadDigraphConsonantRules: PlainTransliteration[] =
    digraphConsonantRules

const deadMonographConsonantRules: PlainTransliteration[] =
    monographConsonantRules

const deadConsonantRules: PlainTransliteration[] = consonantRules

const singleVowelSyllableRules: PlainTransliteration[] =
    chainRule(
        ruleProduct(consonantRules, digraphVowelRules),
        ruleProduct(consonantRules, monographVowelRules))

const doubleVowelSyllableRules: PlainTransliteration[] =
    ruleProduct(consonantRules, doubleVowelRules)

const beginningIWithDeadConsonantRules: PlainTransliteration[] =
    chainRule(
        ruleProduct(beginningIForDeadConsonantRules, deadDigraphConsonantRules),
        ruleProduct(beginningIForOpenConsonantRules, deadMonographConsonantRules))

const beginningIWithDeadConsonantAsWordBeginningRules: RegexTransliteration[] =
    asWordBeginning(beginningIWithDeadConsonantRules)

const beginningIWithOpenConsonantRules: PlainTransliteration[] =
    chainRule(
        ruleProduct(beginningIForOpenConsonantRules, doubleVowelSyllableRules),
        ruleProduct(beginningIForOpenConsonantRules, singleVowelSyllableRules))

const beginningIWithOpenConsonantAsSingleWordRules: Transliteration[] =
    // avoids the nesting problem
    chainRule(
        // single ending vowel
        asSingleWord(ruleProduct(ruleProduct(beginningIForOpenConsonantRules,
                                             consonantRules),
                                 singleEndingVowelRules)),
        // double ending vowel
        asSingleWord(ruleProduct(ruleProduct(beginningIForOpenConsonantRules,
                                             consonantRules),
                                 doubleEndingVowelRules)))

const singleVowelSyllableAsWordEndingRules: RegexTransliteration[] =
    asWordEnding(ruleProduct(consonantRules, singleEndingVowelRules))

const doubleVowelSyllableAsWordEndingRules: RegexTransliteration[] = 
    asWordEnding(ruleProduct(consonantRules, doubleEndingVowelRules))

const beginningIWithOpenConsonantAsWordBeginningRules: Transliteration[] =
    chainRule(
        beginningIWithOpenConsonantAsSingleWordRules,
        asWordBeginning(beginningIWithOpenConsonantRules))

const prefixRules: PlainTransliteration[] = [
    ["dak", Pegon.Dal + Pegon.Fatha + Pegon.Alif + Pegon.Kaf + Pegon.Sukun],
    ["di", Pegon.Dal + Pegon.Kasra + Pegon.Ya + Pegon.Sukun]
]

const specialPrepositionRules: PlainTransliteration[] = [
    ["di", Pegon.Dal + Pegon.Kasra + Pegon.Maksura + Pegon.Sukun]
]

const prefixWithSpaceRules: PlainTransliteration[] =
    prefixRules.map(([key, val]) => [key, val.concat(" ")])

const specialRaWithPepetRules: PlainTransliteration[] = [
    ["r^e", Pegon.Ra + Pegon.Fatha + Pegon.Ya]
]

const specialPrepositionAsSingleWordsRule: RegexTransliteration[] =
    asSingleWord(specialPrepositionRules)

const prefixWithBeginningVowelRules: PlainTransliteration[] =
    ruleProduct(prefixWithSpaceRules,
                beginningSingleVowelRules)

const prefixWithBeginningVowelAsWordBeginningRules: RegexTransliteration[] =
    asWordBeginning(prefixWithBeginningVowelRules)

const prefixAsWordBeginningRules: RegexTransliteration[] = asWordBeginning(prefixRules)

const latinConsonants: string[] = consonantRules.map<string>(([key, val]) => key)
const pegonConsonants: string[] = consonantRules.map<string>(([key, val]) => val)
const latinVowels: string[] = singleVowelRules.map<string>(([key, val]) => key)

const consonantExceptions: string[] = []

const asWordBeginningFollowedByOpenConsonant =
    (rules: PlainTransliteration[]): RegexTransliteration[] =>
    rules.map(([key, val]) =>
            [new RegExp(`(^|[${wordDelimitingPatterns}])(${key})($latinConsonants.join("|")($latinVowels.join("|")`),
             `$1${val}$2$3`])

const doubleMonographVowelBeginningSyllableRules: PlainTransliteration[] =
    ruleProduct(consonantRules,
                doubleMonographBeginningSyllableVowelRules)

const alternateDoubleMonographVowelBeginningSyllableRules: PlainTransliteration[] =
    ruleProduct(consonantRules,
                alternateDoubleMonographBeginningSyllableVowelRules)

const doubleMonographVowelAsBeginningSyllableRules: RegexTransliteration[] =
    asWordBeginning(doubleMonographVowelBeginningSyllableRules)

const aWithFatha: PlainTransliteration[] = [
    ["a", Pegon.Fatha],
]   

const closedSyllable = (rules: PlainTransliteration[]): RegexTransliteration[] =>
    prepareRules(rules).map<RegexTransliteration>(([key, val]) =>
        [new RegExp(`(${key})(?![_aiueo^\`WAIUEOY])`), `${val}`])

const closedSyllableWithSoundARules: RegexTransliteration[] =
    closedSyllable(ruleProduct(ruleProduct(consonantRules,aWithFatha), consonantRules))


const indonesianPrefixesRules: PlainTransliteration[] = [
    ["di", Pegon.Dal + Pegon.Ya],
    ["k^e", Pegon.Kaf + Pegon.MaddaAbove],
    ["s^e", Pegon.Sin + Pegon.MaddaAbove],
    ["b^er", Pegon.Ba + Pegon.MaddaAbove + Pegon.Ra],
    ["b^e", Pegon.Ba + Pegon.MaddaAbove],
    ["t^er", Pegon.Ta + Pegon.MaddaAbove + Pegon.Ra],
    ["t^e", Pegon.Ta + Pegon.MaddaAbove],
    ["m^em", Pegon.Mim + Pegon.MaddaAbove + Pegon.Mim],
    ["m^en_g", Pegon.Mim + Pegon.MaddaAbove + Pegon.Nga],
    ["m^en", Pegon.Mim + Pegon.MaddaAbove + Pegon.Nun],
    ["m^e", Pegon.Mim + Pegon.MaddaAbove],
    ["p^er", Pegon.Peh + Pegon.MaddaAbove + Pegon.Ra],
    ["p^em", Pegon.Peh + Pegon.MaddaAbove + Pegon.Mim],
    ["p^en_g", Pegon.Peh + Pegon.MaddaAbove + Pegon.Nga],
    ["p^en", Pegon.Peh + Pegon.MaddaAbove + Pegon.Nun],
    ["p^e", Pegon.Peh + Pegon.MaddaAbove],
]

const transliterateIndonesianPrefixes =
    (prefix: string): string =>
        transliterate(prefix, prepareRules(indonesianPrefixesRules));

const indonesianSuffixes: PlainTransliteration[] = [
    ["ku", Pegon.Kaf + Pegon.Waw],
    ["mu", Pegon.Mim + Pegon.Waw],
    ["n_ya", Pegon.Nya + Pegon.Alif],
    ["lah", Pegon.Lam + Pegon.Fatha + Pegon.Ha],
    ["kah", Pegon.Kaf + Pegon.Fatha + Pegon.Ha],
    ["tah", Pegon.Ta + Pegon.Fatha + Pegon.Ha],
    ["pun", Pegon.Peh + Pegon.Waw + Pegon.Nun],
    ["kan", Pegon.Kaf + Pegon.Fatha + Pegon.Nun],
]
const suffixAnForBaseWordWithEndingA: PlainTransliteration[] = [
    
    ["an", Pegon.AlifWithHamzaAbove + Pegon.Nun],
]

const suffixAn: PlainTransliteration[] = [
    ["an", Pegon.Alif + Pegon.Nun],
]

const indonesianSuffixesForBaseWordWithEndingA: PlainTransliteration[] =
    chainRule(indonesianSuffixes, 
        suffixAnForBaseWordWithEndingA)

const indonesianSuffixesForRegularBaseWord: PlainTransliteration[] =
    chainRule(indonesianSuffixes, 
        suffixAn)

const transliterateIndonesianSuffixes =
    (suffix: string, baseWord: string) => 
        baseWord[baseWord.length-1] === 'a' ?
        transliterate(suffix, prepareRules(indonesianSuffixesForBaseWordWithEndingA)) :
        transliterate(suffix, prepareRules(indonesianSuffixesForRegularBaseWord));

const transliterateISuffix = (baseWord: string) => {
        if (baseWord[baseWord.length-1] === 'a')
            return Pegon.Ha + Pegon.Ya
        else if (baseWord[baseWord.length-1].match(/^[iueo]/))
            return Pegon.Alif + Pegon.Ya
        else
            return Pegon.Ya
}

const baseWordLastLetterVowel: PlainTransliteration[] = [
    ["a", ""],
    ["i", ""],
    ["u", ""],
    ["e", ""],
    ["o", ""],
    ["W", ""],
    ["A", ""],
    ["Y", ""],
]

const suffixFirstLetterVowel: PlainTransliteration[] = [
    ["a", Pegon.Alif],
    ["i", Pegon.Ya],
    ["e", Pegon.Alif + Pegon.Fatha + Pegon.Ya],
]

const doubleVowelForSuffixRules: PlainTransliteration [] = [
    ["ae", Pegon.Ha + Pegon.Fatha + Pegon.Ya],
    ["ai", Pegon.Ha + Pegon.Ya],
    ["Ya", Pegon.Ya + Pegon.Alif],
    ["aa", Pegon.AlifWithHamzaAbove],
]

const baseWordLastLetterVowelSuffixFirstLetterVowel: PlainTransliteration[] = 
    chainRule(doubleVowelForSuffixRules,
        ruleProduct(baseWordLastLetterVowel, suffixFirstLetterVowel))

const doubleEndingVowelForSuffixRules: PlainTransliteration[] = [
    ["ae", Pegon.Ha + Pegon.Fatha + Pegon.Ya],
    ["ai", Pegon.Ha + Pegon.Ya],
    ["ea", Pegon.Ya + Pegon.Fatha + Pegon.Alif],
    ["^ea", Pegon.Ya + Pegon.Ya + Pegon.Alif],
    ["aa", Pegon.Ha + Pegon.Alif],
    ["oa", Pegon.Ha + Pegon.Alif],
    ["ua", Pegon.Waw + Pegon.Alif],
    ["ia", Pegon.Ya + Pegon.Alif],
]

const jawaPrefixesRules: PlainTransliteration[] = [
    ["di", Pegon.Dal + Pegon.Ya],
    ["su", Pegon.Sin + Pegon.Waw],
    ["pri", Pegon.Peh + Pegon.Ra + Pegon.Ya],
    ["wi", Pegon.Waw + Pegon.Ya],
    ["k^e", Pegon.Kaf + Pegon.MaddaAbove],
    ["sa", Pegon.Sin + Pegon.Fatha],
    ["dak", Pegon.Dal + Pegon.Fatha + Pegon.Kaf],
    ["da", Pegon.Dal + Pegon.Fatha],
    ["tar", Pegon.Ta + Pegon.Fatha + Pegon.Ra],
    ["tak", Pegon.Ta + Pegon.Fatha + Pegon.Kaf],
    ["ta", Pegon.Ta + Pegon.Fatha],
    ["kok", Pegon.Kaf + Pegon.Fatha + Pegon.Waw + Pegon.Kaf],
    ["ko", Pegon.Kaf + Pegon.Fatha + Pegon.Waw],
    ["tok", Pegon.Ta + Pegon.Fatha + Pegon.Waw + Pegon.Kaf],
    ["to", Pegon.Ta + Pegon.Fatha + Pegon.Waw],
    ["pi", Pegon.Peh + Pegon.Ya],
    ["kami", Pegon.Kaf + Pegon.Fatha + Pegon.Mim + Pegon.Ya],
    ["kapi", Pegon.Kaf + Pegon.Fatha + Pegon.Peh + Pegon.Ya],
    ["kuma", Pegon.Kaf + Pegon.Waw + Pegon.Mim + Pegon.Fatha],
    ["ka", Pegon.Kaf + Pegon.Fatha],
    ["pra", Pegon.Peh + Pegon.Ra + Pegon.Fatha],
    ["pan_g", Pegon.Peh + Pegon.Fatha + Pegon.Nga],
    ["pan", Pegon.Peh + Pegon.Fatha + Pegon.Nun],
    ["pam", Pegon.Peh + Pegon.Fatha + Pegon.Mim],
    ["pa", Pegon.Peh + Pegon.Fatha],
    ["man_g", Pegon.Mim + Pegon.Fatha + Pegon.Nga],
    ["man", Pegon.Mim + Pegon.Fatha + Pegon.Nun],
    ["mam", Pegon.Mim + Pegon.Fatha + Pegon.Mim],
    ["ma", Pegon.Mim + Pegon.Fatha],
    ["m^en_g", Pegon.Mim + Pegon.MaddaAbove + Pegon.Nga],
    ["m^en", Pegon.Mim + Pegon.MaddaAbove + Pegon.Nun],
    ["m^em", Pegon.Mim + Pegon.MaddaAbove + Pegon.Mim],
    ["m^e", Pegon.Mim + Pegon.MaddaAbove],
    ["an_g", Pegon.Ha + Pegon.Fatha + Pegon.Nga],
    ["am", Pegon.Ha + Pegon.Fatha + Pegon.Mim],
    ["an", Pegon.Ha + Pegon.Fatha + Pegon.Nun],
    ["a", Pegon.Ha + Pegon.Fatha],
]

const jawaSuffixesRules: PlainTransliteration[] = [
    ["i", Pegon.Ya],
    ["ake", Pegon.Alif + Pegon.Kaf + Pegon.Fatha + Pegon.Ya],
    ["en", Pegon.Fatha + Pegon.Ya + Pegon.Nun],
    ["na", Pegon.Nun + Pegon.Alif],
    ["ana", Pegon.Alif + Pegon.Nun + Pegon.Alif],
    ["an", Pegon.Alif + Pegon.Nun],
    ["e", Pegon.Fatha + Pegon.Ya],
    ["a", Pegon.Alif],
]

const transliterateJawaPrefixes =
    (prefix: string): string =>
        transliterate(prefix, prepareRules(jawaPrefixesRules));

const transliterateJawaSuffixesVowel = (suffix: string, baseWord: string): string => {
    const jawaSuffixesRulesAlt: PlainTransliteration[] = [
        ["na", Pegon.Nun + Pegon.Alif],
        ["ke", Pegon.Kaf + Pegon.Fatha + Pegon.Ya],
        ["n", Pegon.Nun],
    ]

    const jawaSuffixesVowelRules: Transliteration[] =
            prepareRules(chainRule(
                ruleProduct(baseWordLastLetterVowelSuffixFirstLetterVowel, jawaSuffixesRulesAlt),
                doubleEndingVowelForSuffixRules,
                baseWordLastLetterVowelSuffixFirstLetterVowel))


    return transliterate(baseWord[baseWord.length-1]+suffix, jawaSuffixesVowelRules)
}

const transliterateJawaSuffixes = (suffix: string, baseWord: string): string => {
    if (baseWord[baseWord.length-1].match(/^[aiueoWAY]/) && suffix[0].match(/^[aiueo]/)) {
        return transliterateJawaSuffixesVowel(suffix, baseWord)
    }

    return transliterate(suffix, prepareRules(jawaSuffixesRules))
}

const transliterateIndonesianAffixes = (affixes: string[], baseWord: string): string[] => {
    let prefixResult = ''
    let suffixResult = ''

    for (let affix of affixes){
        let prefixMatches = affix.match(/(.*)-$/)
        let suffixMatches = affix.match(/^-(.*)/)

        if (prefixMatches) {
            prefixResult += transliterateIndonesianPrefixes(prefixMatches[1])
        }

        else if (suffixMatches) {
            if (suffixMatches[1] === 'i')
                suffixResult += transliterateISuffix(baseWord)
            else
                suffixResult += transliterateIndonesianSuffixes(suffixMatches[1], baseWord)
        }
    }

    return [prefixResult, suffixResult]
}

const transliterateJawaAffixes = (affixes: string[], baseWord: string): string[] => {
    let prefixResult = ''
    let suffixResult = ''

    for (let affix of affixes){
        let prefixMatches = affix.match(/(.*)-$/)
        let suffixMatches = affix.match(/^-(.*)/)

        if (prefixMatches) {
            prefixResult += transliterateJawaPrefixes(prefixMatches[1])
        }

        else if (suffixMatches) {
            suffixResult += transliterateJawaSuffixes(suffixMatches[1], baseWord)
        }
    }

    return [prefixResult, suffixResult]
}

const firstSyllableWithSoundA: RegexTransliteration[] =
    asWordBeginning(ruleProduct(consonantRules, aWithFatha));

const countSyllable = (word: string): number => {
    const matches = word.match(/(e_u|a_i|a_u|\^e|`[aiueoAIUEO]|[aiueoAIUEO]){1}/g)
    if (matches)
        return matches.length
    return 0
}

const latinToPegonScheme: Transliteration[] =
    prepareRules(chainRule(specialPrepositionAsSingleWordsRule,
                specialRaWithPepetRules,
                closedSyllableWithSoundARules,
                prefixWithBeginningVowelAsWordBeginningRules,

                doubleVowelSyllableAsWordEndingRules,

                doubleMonographVowelAsBeginningSyllableRules,

                beginningIWithOpenConsonantAsWordBeginningRules,
                beginningIWithDeadConsonantAsWordBeginningRules,


                beginningSingleVowelAsWordBeginningRules,

                singleVowelSyllableAsWordEndingRules,
                doubleVowelSyllableRules,
                singleVowelSyllableRules,

                singleVowelRules,
                deadConsonantRules,
                marbutahRules,
                punctuationRules))

const latinToPegonSchemeForMoreThanTwoSyllables: Transliteration[] =
    prepareRules(chainRule(specialPrepositionAsSingleWordsRule,
                specialRaWithPepetRules,
                closedSyllableWithSoundARules,
                prefixWithBeginningVowelAsWordBeginningRules,

                doubleVowelSyllableAsWordEndingRules,

                doubleMonographVowelAsBeginningSyllableRules,

                beginningIWithOpenConsonantAsWordBeginningRules,
                beginningIWithDeadConsonantAsWordBeginningRules,


                beginningSingleVowelAsWordBeginningRules,

                singleVowelSyllableAsWordEndingRules,
                doubleVowelSyllableRules,

                firstSyllableWithSoundA,

                singleVowelSyllableRules,

                singleVowelRules,
                deadConsonantRules,
                marbutahRules,
                punctuationRules))

export const transliterateLatinToPegon = (latinString: string): string =>
    countSyllable(latinString) > 2 ? 
        transliterate(latinString, latinToPegonSchemeForMoreThanTwoSyllables): 
        transliterate(latinString, latinToPegonScheme)

export const transliterateLatinToPegonStemResult = (stemResult: StemResult, lang: string): string => {
    if (stemResult.affixSequence.length == 0) {
        return transliterateLatinToPegon(stemResult.baseWord);
    }

    // TO-DO: insert transliterate rules for different language
    if (lang === "Jawa") {
        // transliterateStemResultJawa
        let base = transliterateLatinToPegon(stemResult.baseWord)
        let [prefix, suffix] = transliterateJawaAffixes(stemResult.affixSequence, stemResult.baseWord)
        return prefix + base + suffix;
    } else if (lang === "Sunda") {
        // transliterateStemResultSunda
        return transliterateLatinToPegon(stemResult.baseWord);
    } else if (lang === "Madura") {
        // transliterateStemResultMadura
        return transliterateLatinToPegon(stemResult.baseWord);
    } else {
        // transliterateStemResultIndonesia
        let base = transliterateLatinToPegon(stemResult.baseWord)
        let [prefix, suffix] = transliterateIndonesianAffixes(stemResult.affixSequence, stemResult.baseWord)
        return prefix + base + suffix;
    }
}

export const asInverse = (rules: PlainTransliteration[]): PlainTransliteration[] =>
    rules.map<PlainTransliteration>(([key, val]) => [val, key])

const inverseSpecialPrepositionAsSingleWordsRules: RegexTransliteration[] =
    asSingleWord(asInverse(specialPrepositionRules))

const inversePrefixWithSpaceRules: PlainTransliteration[] =
    asInverse(prefixWithSpaceRules)

const inversePrefixWithSpaceAsWordBeginningRules: RegexTransliteration[] =
    asWordBeginning(inversePrefixWithSpaceRules)

const inverseDeadDigraphConsonantRules: PlainTransliteration[] =
    asInverse(deadDigraphConsonantRules)

const inverseDeadMonographConsonantRules: PlainTransliteration[] =
    asInverse(deadMonographConsonantRules)

const inverseDeadConsonantRules: PlainTransliteration[] =
    asInverse(deadConsonantRules)

const inverseDigraphVowelRules: PlainTransliteration[] =
    asInverse(digraphVowelRules)

const inverseMonographVowelRules: PlainTransliteration[] =
    asInverse(monographVowelRules)

const inverseSingleVowelRules: PlainTransliteration[] =
    asInverse(singleVowelRules)

const inverseSingleEndingVowelRules: PlainTransliteration[] =
    asInverse(singleEndingVowelRules)

const inverseSingleEndingVowelAsWordEndingRules: RegexTransliteration[] =
    asWordEnding(inverseSingleEndingVowelRules)

const inverseDoubleEndingVowelRules: PlainTransliteration[] =
    asInverse(chainRule(doubleEndingVowelRules,
                        alternateDoubleEndingVowelRules))

const inverseDoubleEndingVowelAsWordEndingRules: RegexTransliteration[] =
    asWordEnding(inverseDoubleEndingVowelRules)

const inverseEndingVowelAsWordEndingRules: RegexTransliteration[] =
    chainRule(
        inverseDoubleEndingVowelAsWordEndingRules,
        inverseSingleEndingVowelAsWordEndingRules)

const inverseDoubleVowelRules: PlainTransliteration[] =
    asInverse(chainRule(doubleVowelRules,
                        alternateDoubleMonographVowelRules))

const inverseBeginningDigraphVowelRules: PlainTransliteration[] =
    asInverse(beginningDigraphVowelRules)

const inverseBeginningMonographVowelRules: PlainTransliteration[] =
    asInverse(beginningMonographVowelRules)

const inverseBeginningVowelAsWordBeginningRules: RegexTransliteration[] =
    asWordBeginning(chainRule(inverseBeginningDigraphVowelRules,
                              inverseBeginningMonographVowelRules))

const inverseBeginningIForOpenConsonantRules: PlainTransliteration[] =
    asInverse(beginningIForOpenConsonantRules)

const inverseBeginningIForDeadConsonantRules: PlainTransliteration[] =
    asInverse(beginningIForDeadConsonantRules)

const inversePrefixWithBeginningVowelsRules: PlainTransliteration[] =
    chainRule(
        ruleProduct(inversePrefixWithSpaceRules,
                    inverseBeginningDigraphVowelRules),
        ruleProduct(inversePrefixWithSpaceRules,
                    inverseBeginningMonographVowelRules),
        ruleProduct(inversePrefixWithSpaceRules,
                    inverseBeginningIForDeadConsonantRules))

const inversePrefixWithBeginningVowelsAsWordBeginningRules: RegexTransliteration[] =
    asWordBeginning(inversePrefixWithBeginningVowelsRules)

const inverseMarbutahRules: PlainTransliteration[] =
    asInverse(marbutahRules)

const inverseOpenConsonantRules: PlainTransliteration[] =
    asInverse(consonantRules)

const inverseSpecialRaWithPepetRules: PlainTransliteration[] =
    asInverse(specialRaWithPepetRules)

const inverseConsonantRules: PlainTransliteration[] =
    chainRule(
        inverseMarbutahRules,
        inverseDeadDigraphConsonantRules,
        inverseDeadMonographConsonantRules,
        inverseOpenConsonantRules)

const inverseVowelRules: Transliteration[] =
    chainRule<Transliteration>(
        inverseBeginningVowelAsWordBeginningRules,
        inverseEndingVowelAsWordEndingRules,
        inverseDoubleVowelRules,
        inverseSingleVowelRules,
        inverseBeginningIForDeadConsonantRules)

const inversePunctuationRules: PlainTransliteration[] =
    asInverse(punctuationRules)

const inverseSingleVowelSyllableRules: Transliteration[] =
    chainRule<Transliteration>(
        asWordEnding(ruleProduct(inverseOpenConsonantRules,
                                 inverseSingleEndingVowelRules)),
        ruleProduct(inverseOpenConsonantRules, inverseDigraphVowelRules),
        ruleProduct(inverseOpenConsonantRules, inverseMonographVowelRules))

const inverseDoubleVowelSyllableRules: Transliteration[] =
    chainRule<Transliteration>(
        asWordEnding(ruleProduct(inverseOpenConsonantRules,
                                 inverseDoubleEndingVowelRules)),
        ruleProduct(inverseOpenConsonantRules,
                    inverseDoubleVowelRules))

const inverseSyllableRules: Transliteration[] =
    chainRule(
        inverseDoubleVowelSyllableRules,
        inverseSingleVowelSyllableRules)

const inverseDoubleMonographVowelAsBeginningSyllableRules: RegexTransliteration[] =
    asWordBeginning(chainRule(
        asInverse(doubleMonographVowelBeginningSyllableRules),
        asInverse(alternateDoubleMonographVowelBeginningSyllableRules)
    ))

const inverseAWithFatha: PlainTransliteration[] = 
    asInverse(aWithFatha)

const pegonToLatinScheme: Transliteration[] =
    prepareRules(chainRule<Transliteration>(
        inverseSpecialPrepositionAsSingleWordsRules,
        inverseSpecialRaWithPepetRules,
        inversePrefixWithBeginningVowelsAsWordBeginningRules,
        inversePrefixWithSpaceAsWordBeginningRules,
        inverseDoubleMonographVowelAsBeginningSyllableRules,
        inverseDoubleEndingVowelAsWordEndingRules,
        inverseSyllableRules,
        inverseVowelRules,
        inverseConsonantRules,
        inversePunctuationRules,
        inverseAWithFatha))

export const transliteratePegonToLatin = (pegonString: string): string =>
    transliterate(pegonString,
                  pegonToLatinScheme)
                            
const standardLatinRules: PlainTransliteration[] = [
    ["t_h", "th"],
    ["T_h", "th"],
    ["t_s", "ṡ"],
    ["h_h", "ḥ"],
    ["k_h", "kh"],
    ["d_h", "dh"],
    ["d_H", "dh"],
    ["d_l", "ḍ"],
    ["d_z", "ẑ"],
    ["s_y", "sy"],
    ["s_h", "ṣ"],
    ["t_t", "ṭ"],
    ["z_h", "ẓ"],
    ["g_h", "g"],
    ["n_g", "ng"],
    ["n_y", "ny"],
    ["e_u", "eu"],
    ["a_i", "ai"],
    ["a_u", "au"],
    ["^e", "ê"],
    ["`a", "a"],
    ["`i", "i"],
    ["`u", "u"],
    ["`e", "e"],
    ["`o", "o"],
    ["Y", "i"],
    ["O", "o"],
    ["A", "a"],
    ["U", "u"],
    ["G", "g"],
];


export const transliterateReversibleLatinToStandardLatin =
    (reversibleString: string): string =>
    transliterate(reversibleString, prepareRules(standardLatinRules));

/*
  The basic idea for this function is to take several
  lists of transliteration rules and make it so that
  if a tl key on the nth list is the prefix of a key
  on the n+1th list, then the key of the n+1th list
  has that prefix replaced by the value of the
  key from the nth list, and that this propagates
  To see why you would want to do this, take a look at
  github.com/wikimedia/jquery.ime
*/

export const makeTransitive = (...transliterationRules: PlainTransliteration[][]): PlainTransliteration[] =>
    transliterationRules.reduceRight((acc, left) => {
        let newAcc: PlainTransliteration[] = [];
        for (const [rightKey, rightVal] of acc) {
            let foundMatch = false;
            for (const [leftKey, leftVal] of left) {
                if (rightKey.startsWith(leftKey)) {
                    foundMatch = true;
                    newAcc
                        .push([leftVal
                        .concat(rightKey.slice(leftKey.length)),
                               rightVal])
                }
            }
            if (!foundMatch) newAcc.push([rightKey, rightVal]);
        }
        return newAcc.concat(left);
    });

export interface InputMethodEditor {
    readonly rules: Transliteration[];
    readonly inputEdit: (inputString: string) => string;
}

/*
  Transitive rules necessities:
  monograph vowels -> digraph vowels
  dead consonants -> open consonants + vowels
  i with dead consonants -> i with open consonants
  di/dak -> vowels/consonants
  product(i for dead consonants, transitive syllables)
  -> product(i for open consonants, transitive syllables)
*/

const asNotWordBeginning = (rules: PlainTransliteration[]): RegexTransliteration[] =>
    prepareRules(rules).map<RegexTransliteration>(([key, val]) =>
        [new RegExp(`([^${wordDelimitingPatterns}])(${key})`), `$1${val}`])

const asNotWordEnding = (rules: Transliteration[]): RegexTransliteration[] =>
    prepareRules(rules).map<RegexTransliteration>(([key, val]) =>
        [new RegExp(`(${key})([^${wordDelimitingPatterns}])`), `${val}$2`])

const IMEPrefixRules: Transliteration[] =
    asWordBeginning(
        makeTransitive(
            prefixRules.map(([key, val]) =>
                [key, val.replace(Pegon.Ya, Pegon.Maksura)]),
            prefixWithBeginningVowelRules
    ))

const IMESyllableRules: Transliteration[] =
    chainRule<Transliteration>(
        asWordEnding(makeTransitive(
            deadMonographConsonantRules,
            marbutahRules,
            deadDigraphConsonantRules,
            ruleProduct(consonantRules,
                        chainRule(singleEndingVowelRules,
                                  monographVowelRules
                                      .filter(([key, val]) => key != "i"))),
            ruleProduct(consonantRules,
                        doubleEndingVowelRules))
            .filter(([key, val]) =>
                !(new RegExp(`^(${pegonConsonants.join("|")})${Pegon.Sukun}(${latinVowels.filter(([key, val]) => key != "i").join("|")})$`)
                    .test(key)))),
        asWordBeginning(makeTransitive(
            deadMonographConsonantRules,
            marbutahRules,
            deadDigraphConsonantRules,
            ruleProduct(consonantRules,
                        chainRule(singleEndingVowelRules,
                                  monographVowelRules
                                      .filter(([key, val]) => key != "i"))),
            doubleMonographVowelBeginningSyllableRules)),
        makeTransitive(
            deadMonographConsonantRules,
            marbutahRules,
            deadDigraphConsonantRules,
            chainRule(
                ruleProduct(consonantRules, digraphVowelRules),
                ruleProduct(consonantRules, monographVowelRules)),
            chainRule(
                ruleProduct(consonantRules, doubleDigraphVowelRules),
                ruleProduct(consonantRules, doubleMonographVowelRules)
            )))

const IMEBeginningIRules: Transliteration[] =
    chainRule(
        asSingleWord(makeTransitive(
            beginningIForDeadConsonantRules,
            ruleProduct(beginningIForDeadConsonantRules,
                        deadMonographConsonantRules),
            ruleProduct(beginningIForDeadConsonantRules,
                        marbutahRules),
            ruleProduct(beginningIForDeadConsonantRules,
                        deadDigraphConsonantRules),
            ruleProduct(beginningIForOpenConsonantRules,
                        ruleProduct(consonantRules, singleEndingVowelRules)),
        )),
        asWordBeginning(makeTransitive(
            beginningIForDeadConsonantRules,
            ruleProduct(beginningIForDeadConsonantRules,
                        deadMonographConsonantRules),
            ruleProduct(beginningIForDeadConsonantRules,
                        marbutahRules),
            ruleProduct(beginningIForDeadConsonantRules,
                        deadDigraphConsonantRules),
            ruleProduct(beginningIForOpenConsonantRules,
                        ruleProduct(consonantRules, monographVowelRules)))))

const IMEVowelRules: Transliteration[] =
    chainRule<Transliteration>(
        asWordEnding(makeTransitive(
            chainRule(
                // the only single ending vowel is "i"
                monographVowelRules
                    .filter(([key, val]) => key != "i"),
                singleEndingVowelRules),
            doubleEndingVowelRules)
            .filter(([key, val]) => key.length > 1)),
        asWordBeginning(makeTransitive(
            beginningMonographVowelRules,
            beginningDigraphVowelRules)),
        makeTransitive(
            chainRule(
                monographVowelRules,
                singleEndingVowelRules),
            doubleMonographVowelRules,
            doubleDigraphVowelRules)
            .filter(([key, val]) => key.length > 1),
        digraphVowelRules,
        monographVowelRules)

const IMESpecialAsNotWordEndingRules: RegexTransliteration[] =
    asNotWordEnding([
        // "i"
        [Pegon.Maksura + Pegon.Sukun, Pegon.Ya + Pegon.Sukun],
        // "ae"
        [Pegon.Fatha + Pegon.Alif +
            Pegon.Ha +
            Pegon.Fatha + Pegon.Maksura + Pegon.Sukun,
         Pegon.Fatha + Pegon.Alif +
            Pegon.Ha +
            Pegon.Fatha + Pegon.Ya + Pegon.Sukun],
        // "ai"
        [Pegon.Fatha + Pegon.Alif +
            Pegon.Ha +
            Pegon.Kasra + Pegon.Maksura + Pegon.Sukun,
         Pegon.Fatha + Pegon.Alif +
            Pegon.Ha +
            Pegon.Kasra + Pegon.Ya + Pegon.Sukun],
        // "ea"
        [Pegon.Fatha + Pegon.Ya + Pegon.Sukun +
            Pegon.Ya +
            Pegon.Fatha + Pegon.Alif,
         Pegon.Fatha + Pegon.Ya + Pegon.Sukun +
             Pegon.Alif + Pegon.Fatha],
        // "ia"
        [Pegon.Kasra + Pegon.Ya + Pegon.Sukun + 
            Pegon.Ya +
            Pegon.Fatha + Pegon.Alif,
         Pegon.Kasra +
            Pegon.Ya +
            Pegon.Fatha + Pegon.Alif],
        // "aa"
        [Pegon.Fatha + Pegon.Alif +
            Pegon.Ha +
            Pegon.Fatha + Pegon.Alif,
         Pegon.Fatha + Pegon.Alif + Pegon.AlifWithHamzaAbove],
        // "oa"
        [Pegon.Fatha + Pegon.Waw + Pegon.Sukun +
            Pegon.Ha +
            Pegon.Fatha + Pegon.Alif,
        Pegon.Fatha + Pegon.Waw + Pegon.Sukun +
             Pegon.Alif + Pegon.Fatha,],
        // "ua"
        [Pegon.Damma + Pegon.Waw + Pegon.Sukun +
            Pegon.Waw +
            Pegon.Fatha + Pegon.Alif,
        Pegon.Damma + Pegon.Waw + Pegon.Sukun +
            Pegon.Alif + Pegon.Fatha],
    ])


// TODO: make this pass for the ime tests
// Alternatively, just go ahead and make it all contextual
const IMERules: Transliteration[] = prepareRules(chainRule<Transliteration>(
    IMEPrefixRules,
    IMEBeginningIRules,
    beginningSingleVowelAsWordBeginningRules,
    IMESyllableRules,
    IMEVowelRules,
    IMESpecialAsNotWordEndingRules,
    punctuationRules,
))

export function initIME(): InputMethodEditor {
    return {
        "rules": IMERules,
        "inputEdit": (inputString: string): string => 
            debugTransliterate(inputString, IMERules)
    }
}
