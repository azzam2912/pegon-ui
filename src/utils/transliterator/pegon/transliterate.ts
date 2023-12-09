import type { StemResult } from "./stemmer/stemmer";
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
         asNotWordBeginning,
         asNotWordEnding,
         asSingleWord,
         asInverse
       } from "../core"

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
    DalWithOneDotBelow = "\u068A",
    DalWithThreeDotsBelow = "\u08AE",
    DalWithThreeDotsAbove = "\u068E",
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
    Sukun2 = "\u06E1",
    Tatwil = "\u0640",
    // Tambahan consonant Arab
    Hamza = "\u0621",
    //Tambahan
    Pepet = "\u08e4",
}

const punctuationRules: PlainRule[] = [
    [",", Pegon.Comma]
]
const marbutahRules: PlainRule[] = [
    ["t_", Pegon.TaMarbuta]
]

const sukunRules: PlainRule[] = [
    [".", Pegon.Sukun],
    ["^.", Pegon.Sukun2]
]

const pepetRules: PlainRule[] = [
    ["^e", Pegon.Pepet],
]

const monographVowelRules: PlainRule[] = [
    ["a", Pegon.Alif],
    // asumsi semua e tanpa diakritik taling
	["e", Pegon.Fatha + Pegon.Ya],
	["o", Pegon.Fatha + Pegon.Waw],
	["i", Pegon.Ya],
	["u", Pegon.Waw],
    //second options of rules 4, 5, 6
    ['W', Pegon.Waw],
    ['A', Pegon.Alif],
    ['Y', Pegon.Ya],
]

const digraphVowelRules: PlainRule[] = [
    ["^e", Pegon.MaddaAbove],
    ["`a", Pegon.YaWithHamzaAbove + Pegon.Alif],
    ["`U", Pegon.WawHamzaAbove + Pegon.Damma]
]

const monographVowelHarakatAtFirstAbjadRules: PlainRule[] = [
    ["A", Pegon.Alif],
    ["e", Pegon.Ya + Pegon.Fatha + Pegon.Sukun],
    ["o", Pegon.Waw + Pegon.Fatha + Pegon.Sukun],
    ["i", Pegon.Ya + Pegon.Kasra + Pegon.Sukun],
    ["u", Pegon.Waw + Pegon.Damma + Pegon.Sukun],    
]
    
const singleVowelRules: PlainRule[] =
    chainRule(
        digraphVowelRules,
        monographVowelHarakatAtFirstAbjadRules)

const singleEndingVowelRules: PlainRule[] = [
    ["i", Pegon.Ya]
]

const singleVowelAsWordEndingRules: RegexRule[] =
    asWordEnding(singleEndingVowelRules);

const rule1314: PlainRule[] = [
    ["uW", Pegon.Damma + Pegon.Waw],
    ["iY", Pegon.Kasra + Pegon.Ya],
    ["i^Y", Pegon.Kasra + Pegon.Maksura]
]

const beginningDigraphVowelRules: PlainRule[] = [
    ["^e", Pegon.Alif + Pegon.MaddaAbove],
]

const beginningMonographVowelRules: PlainRule[] = [
    ["a", Pegon.AlifWithHamzaAbove],
    ["e", Pegon.Alif + Pegon.Fatha + Pegon.Ya],
    ["i", Pegon.Alif + Pegon.Ya ],
    ["o", Pegon.Alif + Pegon.Fatha + Pegon.Waw],
    ["u", Pegon.Alif + Pegon.Waw],
]

const beginningSingleVowelRules: PlainRule[] =
    chainRule(
        beginningDigraphVowelRules,
        beginningMonographVowelRules)

const beginningIForDeadConsonantRules: PlainRule[] = [
    ["i", Pegon.AlifWithHamzaBelow + Pegon.Kasra],
    ["i", Pegon.AlifWithHamzaBelow],
]

const beginningIForOpenConsonantRules: PlainRule[] = [
    ["i", Pegon.Alif + Pegon.Ya]
]

const doubleDigraphVowelRules: PlainRule[] = [
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

const doubleMonographVowelRulesStandard: PlainRule[] = [
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
    ["aa", 
        Pegon.Alif + 
        Pegon.AlifWithHamzaAbove + Pegon.Fatha],
    ["aa", 
        Pegon.Alif + 
        Pegon.AlifWithHamzaAbove], 
    ["aa", 
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
]

const doubleMonographVowelRulesSunda: PlainRule[] = [
    ...doubleMonographVowelRulesStandard,
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
// TODO
var doubleMonographVowelRules: PlainRule[] = [];

const initiateDoubleMonographVowelRules = (lang: string) => {
    if(lang === "Sunda"){
        doubleMonographVowelRules = doubleMonographVowelRulesSunda;
    } else {
        doubleMonographVowelRules = doubleMonographVowelRulesStandard;
    }
}

const doubleMonographBeginningSyllableVowelRules: PlainRule[] = [
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

const alternateDoubleMonographVowelRules: PlainRule[] = [
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

const alternateDoubleMonographBeginningSyllableVowelRules: PlainRule[] = [
    ["iu", Pegon.Kasra +
        Pegon.YaWithHamzaAbove +
        Pegon.Damma + Pegon.Waw + Pegon.Sukun],
    ["ia", Pegon.Kasra +
        Pegon.YaWithHamzaAbove +
        Pegon.Fatha + Pegon.Alif],
]

const doubleVowelRules: PlainRule[] =
    chainRule(
        doubleDigraphVowelRules,
        doubleMonographVowelRules)

const doubleEndingVowelRules: PlainRule[] = [
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

const alternateDoubleEndingVowelRules: PlainRule[] = [
    ["ae", Pegon.Fatha + Pegon.Alif +
        Pegon.YaWithHamzaAbove +
        Pegon.Fatha + Pegon.Maksura + Pegon.Sukun],
    ["ai", Pegon.Fatha + Pegon.Alif +
        Pegon.YaWithHamzaAbove +
        Pegon.Kasra + Pegon.Maksura + Pegon.Sukun],
]

const doubleVowelAsWordEndingRules: RegexRule [] =
    asWordEnding(doubleEndingVowelRules);

const beginningSingleVowelAsWordBeginningRules: RegexRule[] =
    asWordBeginning(beginningSingleVowelRules);

const monographConsonantRules: PlainRule[] = [
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

const digraphConsonantRules: PlainRule[] = [
    // special combination using diacritics, may drop
    // ["t_h", Pegon.ThaWithOneDotBelow],
    // the one in id.wikipedia/wiki/Abjad_Pegon
    ["t_h", Pegon.ThaWithThreeDotsAbove],
    ["t_s", Pegon.Tsa],
    ["h_h", Pegon.Ho],
    ["k_h", Pegon.Kho],
    ["d_H", Pegon.DalWithOneDotBelow],
    ["d_h", Pegon.DalWithThreeDotsBelow],
    ["d_h", Pegon.DalWithThreeDotsAbove],
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

const consonantRules: PlainRule[] = chainRule(
    digraphConsonantRules,
    monographConsonantRules)

const withSukun = (rules: PlainRule[]): PlainRule[] =>
    rules.map<PlainRule>(([key, val]) => [key, val.concat(Pegon.Sukun)])

const deadDigraphConsonantRules: PlainRule[] =
    digraphConsonantRules

const deadMonographConsonantRules: PlainRule[] =
    monographConsonantRules

const deadConsonantRules: PlainRule[] = consonantRules

// TODO
const ruleProductDoubleMonographConsonant = (
    leftRules: PlainRule[],
    rightRules: PlainRule[],
  ): PlainRule[] =>
    leftRules.flatMap<PlainRule>(([leftKey, leftVal]) =>
      rightRules.map<PlainRule>(([rightKey, rightVal]) => [
        leftKey.concat('a'.concat(rightKey)),
        leftVal.concat(rightVal),
      ]),
    );
const doubleMonographConsonantRules: PlainRule[] = 
    ruleProductDoubleMonographConsonant(consonantRules, consonantRules)

const singleVowelSyllableRules: PlainRule[] =
    chainRule(
        ruleProduct(consonantRules, digraphVowelRules),
        ruleProduct(consonantRules, monographVowelRules))

const doubleVowelSyllableRules: PlainRule[] =
    ruleProduct(consonantRules, doubleVowelRules)

const beginningIWithDeadConsonantRules: PlainRule[] =
    chainRule(
        ruleProduct(beginningIForDeadConsonantRules, deadDigraphConsonantRules),
        ruleProduct(beginningIForOpenConsonantRules, deadMonographConsonantRules))

const beginningIWithDeadConsonantAsWordBeginningRules: RegexRule[] =
    asWordBeginning(beginningIWithDeadConsonantRules)

const beginningIWithOpenConsonantRules: PlainRule[] =
    chainRule(
        ruleProduct(beginningIForOpenConsonantRules, doubleVowelSyllableRules),
        ruleProduct(beginningIForOpenConsonantRules, singleVowelSyllableRules))

const beginningIWithOpenConsonantAsSingleWordRules: Rule[] =
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

const singleVowelSyllableAsWordEndingRules: RegexRule[] =
    asWordEnding(ruleProduct(consonantRules, singleEndingVowelRules))

const doubleVowelSyllableAsWordEndingRules: RegexRule[] = 
    asWordEnding(ruleProduct(consonantRules, doubleEndingVowelRules))

const beginningIWithOpenConsonantAsWordBeginningRules: Rule[] =
    chainRule(
        beginningIWithOpenConsonantAsSingleWordRules,
        asWordBeginning(beginningIWithOpenConsonantRules))

const prefixRules: PlainRule[] = [
    ["dak", Pegon.Dal + Pegon.Fatha + Pegon.Alif + Pegon.Kaf + Pegon.Sukun],
    ["di", Pegon.Dal + Pegon.Kasra + Pegon.Ya + Pegon.Sukun]
]

const specialPrepositionRules: PlainRule[] = [
    ["di", Pegon.Dal + Pegon.Kasra + Pegon.Maksura + Pegon.Sukun]
]

const prefixWithSpaceRules: PlainRule[] =
    prefixRules.map(([key, val]) => [key, val.concat(" ")])

const specialRaWithMaddaAboveRules: PlainRule[] = [
    ["r^e", Pegon.Ra + Pegon.Fatha + Pegon.Ya]
]

const specialPrepositionAsSingleWordsRule: RegexRule[] =
    asSingleWord(specialPrepositionRules)

const prefixWithBeginningVowelRules: PlainRule[] =
    ruleProduct(prefixWithSpaceRules,
                beginningSingleVowelRules)

const prefixWithBeginningVowelAsWordBeginningRules: RegexRule[] =
    asWordBeginning(prefixWithBeginningVowelRules)

const prefixAsWordBeginningRules: RegexRule[] = asWordBeginning(prefixRules)

const latinConsonants: string[] = consonantRules.map<string>(([key, val]) => key)
const pegonConsonants: string[] = consonantRules.map<string>(([key, val]) => val)
const latinVowels: string[] = singleVowelRules.map<string>(([key, val]) => key)

const consonantExceptions: string[] = []

const asWordBeginningFollowedByOpenConsonant =
    (rules: PlainRule[]): RegexRule[] =>
    rules.map(([key, val]) =>
            [new RegExp(`(^|[${wordDelimitingPatterns}])(${key})($latinConsonants.join("|")($latinVowels.join("|")`),
             `$1${val}$2$3`])

const doubleMonographVowelBeginningSyllableRules: PlainRule[] =
    ruleProduct(consonantRules,
                doubleMonographBeginningSyllableVowelRules)

const alternateDoubleMonographVowelBeginningSyllableRules: PlainRule[] =
    ruleProduct(consonantRules,
                alternateDoubleMonographBeginningSyllableVowelRules)

const doubleMonographVowelAsBeginningSyllableRules: RegexRule[] =
    asWordBeginning(doubleMonographVowelBeginningSyllableRules)

const aWithFatha: PlainRule[] = [
    ["a", Pegon.Fatha],
]   

const closedSyllable = (rules: PlainRule[]): RegexRule[] =>
    prepareRules(rules).map<RegexRule>(([key, val]) =>
        [new RegExp(`(${key})(?![_aiueo^\`WAIUEOY])`), `${val}`])

const closedSyllableWithSoundARules: RegexRule[] =
    closedSyllable(ruleProduct(ruleProduct(consonantRules,aWithFatha), consonantRules))


const indonesianPrefixesRules: PlainRule[] = [
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

const indonesianSuffixes: PlainRule[] = [
    ["ku", Pegon.Kaf + Pegon.Waw],
    ["mu", Pegon.Mim + Pegon.Waw],
    ["n_ya", Pegon.Nya + Pegon.Alif],
    ["lah", Pegon.Lam + Pegon.Fatha + Pegon.Ha],
    ["kah", Pegon.Kaf + Pegon.Fatha + Pegon.Ha],
    ["tah", Pegon.Ta + Pegon.Fatha + Pegon.Ha],
    ["pun", Pegon.Peh + Pegon.Waw + Pegon.Nun],
    ["kan", Pegon.Kaf + Pegon.Fatha + Pegon.Nun],
]
const suffixAnForBaseWordWithEndingA: PlainRule[] = [
    
    ["an", Pegon.AlifWithHamzaAbove + Pegon.Nun],
]

const suffixAn: PlainRule[] = [
    ["an", Pegon.Alif + Pegon.Nun],
]

const indonesianSuffixesForBaseWordWithEndingA: PlainRule[] =
    chainRule(indonesianSuffixes, 
        suffixAnForBaseWordWithEndingA)

const indonesianSuffixesForRegularBaseWord: PlainRule[] =
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

const baseWordLastLetterVowel: PlainRule[] = [
    ["a", ""],
    ["i", ""],
    ["u", ""],
    ["e", ""],
    ["o", ""],
    ["W", ""],
    ["A", ""],
    ["Y", ""],
]

const suffixFirstLetterVowel: PlainRule[] = [
    ["a", Pegon.Alif],
    ["i", Pegon.Ya],
    ["e", Pegon.Alif + Pegon.Fatha + Pegon.Ya],
]

const doubleVowelForSuffixRules: PlainRule [] = [
    ["ae", Pegon.Ha + Pegon.Fatha + Pegon.Ya],
    ["ai", Pegon.Ha + Pegon.Ya],
    ["Ya", Pegon.Ya + Pegon.Alif],
    ["aa", Pegon.AlifWithHamzaAbove],
]

const baseWordLastLetterVowelSuffixFirstLetterVowel: PlainRule[] = 
    chainRule(doubleVowelForSuffixRules,
        ruleProduct(baseWordLastLetterVowel, suffixFirstLetterVowel))

const doubleEndingVowelForSuffixRules: PlainRule[] = [
    ["ae", Pegon.Ha + Pegon.Fatha + Pegon.Ya],
    ["ai", Pegon.Ha + Pegon.Ya],
    ["ea", Pegon.Ya + Pegon.Fatha + Pegon.Alif],
    ["^ea", Pegon.Ya + Pegon.Ya + Pegon.Alif],
    ["aa", Pegon.Ha + Pegon.Alif],
    ["oa", Pegon.Ha + Pegon.Alif],
    ["ua", Pegon.Waw + Pegon.Alif],
    ["ia", Pegon.Ya + Pegon.Alif],
]

const jawaPrefixesRules: PlainRule[] = [
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

const jawaSuffixesRules: PlainRule[] = [
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
    const jawaSuffixesRulesAlt: PlainRule[] = [
        ["na", Pegon.Nun + Pegon.Alif],
        ["ke", Pegon.Kaf + Pegon.Fatha + Pegon.Ya],
        ["n", Pegon.Nun],
    ]

    const jawaSuffixesVowelRules: Rule[] =
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

const firstSyllableWithSoundA: RegexRule[] =
    asWordBeginning(ruleProduct(consonantRules, aWithFatha));

const countSyllable = (word: string): number => {
    const matches = word.match(/(e_u|a_i|a_u|\^e|`[aiueoAIUEO]|[aiueoAIUEO]){1}/g)
    if (matches)
        return matches.length
    return 0
}

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

const latinToPegonScheme: Rule[] =
    prepareRules(chainRule(
        rule1314,
        specialPrepositionAsSingleWordsRule,
        specialRaWithMaddaAboveRules,
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
        punctuationRules,
        sukunRules,
        pepetRules,
        numbers))

const latinToPegonSchemeForMoreThanTwoSyllables: Rule[] =
    prepareRules(chainRule(
        rule1314,
        specialPrepositionAsSingleWordsRule,
        specialRaWithMaddaAboveRules,
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
        sukunRules,
        pepetRules,
        punctuationRules,
        numbers))

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

const inverseSpecialPrepositionAsSingleWordsRules: RegexRule[] =
    asSingleWord(asInverse(specialPrepositionRules))

const inversePrefixWithSpaceRules: PlainRule[] =
    asInverse(prefixWithSpaceRules)

const inversePrefixWithSpaceAsWordBeginningRules: RegexRule[] =
    asWordBeginning(inversePrefixWithSpaceRules)

const inverseDeadDigraphConsonantRules: PlainRule[] =
    asInverse(deadDigraphConsonantRules)

const inverseDeadMonographConsonantRules: PlainRule[] =
    asInverse(deadMonographConsonantRules)

const inverseDeadConsonantRules: PlainRule[] =
    asInverse(deadConsonantRules)

const inverseDigraphVowelRules: PlainRule[] =
    asInverse(digraphVowelRules)

const inverseMonographVowelRules: PlainRule[] =
    asInverse(monographVowelRules)

const inverseSingleVowelRules: PlainRule[] =
    asInverse(singleVowelRules)

const inverseSingleEndingVowelRules: PlainRule[] =
    asInverse(singleEndingVowelRules)

const inverseSingleEndingVowelAsWordEndingRules: RegexRule[] =
    asWordEnding(inverseSingleEndingVowelRules)

const inverseDoubleEndingVowelRules: PlainRule[] =
    asInverse(chainRule(doubleEndingVowelRules,
                        alternateDoubleEndingVowelRules))

const inverseDoubleEndingVowelAsWordEndingRules: RegexRule[] =
    asWordEnding(inverseDoubleEndingVowelRules)

const inverseEndingVowelAsWordEndingRules: RegexRule[] =
    chainRule(
        inverseDoubleEndingVowelAsWordEndingRules,
        inverseSingleEndingVowelAsWordEndingRules)

const inverseDoubleVowelRules: PlainRule[] =
    asInverse(chainRule(doubleVowelRules,
                        alternateDoubleMonographVowelRules))

const inverseBeginningDigraphVowelRules: PlainRule[] =
    asInverse(beginningDigraphVowelRules)

const inverseBeginningMonographVowelRules: PlainRule[] =
    asInverse(beginningMonographVowelRules)

const inverseBeginningVowelAsWordBeginningRules: RegexRule[] =
    asWordBeginning(chainRule(inverseBeginningDigraphVowelRules,
                              inverseBeginningMonographVowelRules))

const inverseBeginningIForOpenConsonantRules: PlainRule[] =
    asInverse(beginningIForOpenConsonantRules)

const inverseBeginningIForDeadConsonantRules: PlainRule[] =
    asInverse(beginningIForDeadConsonantRules)

const inversePrefixWithBeginningVowelsRules: PlainRule[] =
    chainRule(
        ruleProduct(inversePrefixWithSpaceRules,
                    inverseBeginningDigraphVowelRules),
        ruleProduct(inversePrefixWithSpaceRules,
                    inverseBeginningMonographVowelRules),
        ruleProduct(inversePrefixWithSpaceRules,
                    inverseBeginningIForDeadConsonantRules))

const inversePrefixWithBeginningVowelsAsWordBeginningRules: RegexRule[] =
    asWordBeginning(inversePrefixWithBeginningVowelsRules)

const inverseMarbutahRules: PlainRule[] =
    asInverse(marbutahRules)

const inverseOpenConsonantRules: PlainRule[] =
    asInverse(consonantRules)

const inverseSpecialRaWithMaddaAboveRules: PlainRule[] =
    asInverse(specialRaWithMaddaAboveRules)

const inverseConsonantRules: PlainRule[] =
    chainRule(
        inverseMarbutahRules,
        inverseDeadDigraphConsonantRules,
        inverseDeadMonographConsonantRules,
        inverseOpenConsonantRules)

const inverseVowelRules: Rule[] =
    chainRule<Rule>(
        inverseBeginningVowelAsWordBeginningRules,
        inverseEndingVowelAsWordEndingRules,
        inverseDoubleVowelRules,
        inverseSingleVowelRules,
        inverseBeginningIForDeadConsonantRules)

const inverseRule1314: PlainRule[] =
    asInverse(rule1314)

const inverseDoubleMonographConsonantRules: PlainRule[] =
    asInverse(doubleMonographConsonantRules)

const inversePunctuationRules: PlainRule[] =
    asInverse(punctuationRules)

const inverseSingleVowelSyllableRules: Rule[] =
    chainRule<Rule>(
        asWordEnding(ruleProduct(inverseOpenConsonantRules,
                                 inverseSingleEndingVowelRules)),
        ruleProduct(inverseOpenConsonantRules, inverseDigraphVowelRules),
        ruleProduct(inverseOpenConsonantRules, inverseMonographVowelRules))

const inverseDoubleVowelSyllableRules: Rule[] =
    chainRule<Rule>(
        asWordEnding(ruleProduct(inverseOpenConsonantRules,
                                 inverseDoubleEndingVowelRules)),
        ruleProduct(inverseOpenConsonantRules,
                    inverseDoubleVowelRules))

const inverseSyllableRules: Rule[] =
    chainRule(
        inverseDoubleVowelSyllableRules,
        inverseSingleVowelSyllableRules)

const inverseDoubleMonographVowelAsBeginningSyllableRules: RegexRule[] =
    asWordBeginning(chainRule(
        asInverse(doubleMonographVowelBeginningSyllableRules),
        asInverse(alternateDoubleMonographVowelBeginningSyllableRules)
    ))

const inverseAWithFatha: PlainRule[] = 
    asInverse(aWithFatha)

const inverseSukun: PlainRule[] =
    asInverse(sukunRules)

const inversePepet: PlainRule[] =
    asInverse(pepetRules)

const initiatePegonToLatinScheme = (): Rule[] => {
    return prepareRules(chainRule<Rule>(
        inverseRule1314,
        inverseSpecialPrepositionAsSingleWordsRules,
        inverseSpecialRaWithMaddaAboveRules,
        inversePrefixWithBeginningVowelsAsWordBeginningRules,
        inversePrefixWithSpaceAsWordBeginningRules,
        inverseDoubleMonographVowelAsBeginningSyllableRules,
        inverseDoubleEndingVowelAsWordEndingRules,
        inverseSyllableRules,
        inverseVowelRules,
        inverseConsonantRules,
        inversePunctuationRules,
        inverseAWithFatha,
        inverseSukun,
        inversePepet,
        inverseDoubleMonographConsonantRules,
        asInverse(numbers)))
}

export const transliteratePegonToLatin = (pegonString: string, lang: string = "Indonesia"): string => {
    initiateDoubleMonographVowelRules(lang);
    const pegonToLatinScheme: Rule[] = initiatePegonToLatinScheme();
    return transliterate(pegonString, pegonToLatinScheme)
}
                            
const standardLatinRules: PlainRule[] = [
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
    [".", ""],
    ["^.", ""]
];


export const transliterateReversibleLatinToStandardLatin =
    (reversibleString: string): string =>
    transliterate(reversibleString, prepareRules(standardLatinRules));

/*
  Transitive rules necessities:
  monograph vowels -> digraph vowels
  dead consonants -> open consonants + vowels
  i with dead consonants -> i with open consonants
  di/dak -> vowels/consonants
  product(i for dead consonants, transitive syllables)
  -> product(i for open consonants, transitive syllables)
*/

const IMEPrefixRules: Rule[] =
    asWordBeginning(
        makeTransitive(
            prefixRules.map(([key, val]) =>
                [key, val.replace(Pegon.Ya, Pegon.Maksura)]),
            prefixWithBeginningVowelRules
    ))

const IMESyllableRules: Rule[] =
    chainRule<Rule>(
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

const IMEBeginningIRules: Rule[] =
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

const IMEVowelRules: Rule[] =
    chainRule<Rule>(
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

const IMESpecialAsNotWordEndingRules: RegexRule[] =
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
const IMERules: Rule[] = prepareRules(chainRule<Rule>(
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
            transliterate(inputString, IMERules)
    }
}
