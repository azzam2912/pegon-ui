import { asWordEnding } from "./transliterate";
import { prepareRules, chainRule, ruleProduct, transliterate,
    asWordBeginning, asInverse, wordDelimitingPatterns } from "./transliterate"
import type { PlainTransliteration, RegexTransliteration, Transliteration } from "./transliterate";

const enum Arabic {
    // Hijaiyah
    Alif = "\u0627",
    Ba = "\u0628",
    Ta = "\u062A",
    Tsa = "\u062B",
    Jim = "\u062C",
    Hah = "\u062D",      //ح
    Kho = "\u062E",
    Dal = "\u062F",
    Dzal = "\u0630",    //ذ
    Ra = "\u0631",
    Zain = "\u0632",
    Sin = "\u0633",
    Syin = "\u0634",
    Shod = "\u0635",
    Dhod = "\u0636",     //ض
    Tha = "\u0637",
    Zha = "\u0638",     //ظ
    Ain = "\u0639",
    Ghain = "\u063A",
    Fa = "\u0641",
    Qaf = "\u0642",
    Kaf = "\u0643",
    Lam = "\u0644",
    Mim = "\u0645",
    Nun = "\u0646",
    Ha = "\u0647",      //ه
    Waw = "\u0648",
    Ya = "\u064A",
    TaMarbuta = "\u0629",   //ة
    Hamza = "\u0621",       //ء

    // Alif variety
    AlifWithHamzaAbove = "\u0623",
    AlifWithHamzaBelow = "\u0625",
    AlifWithMaddaAbove = "\u0622",  //آ
    AlifWasla = "\u0671",           //ٱ

    YaWithHamzaAbove = "\u0626",     //ئ
    YaWithHamzaAboveAlt = "\u0678",        //ٸ 
    WawWithHamzaAbove= "\u0624",        //ؤ
    AlefMaksura = "\u0649",             //ى

    // Harakat
    Fatha = "\u064E",
    Damma = "\u064F",
    Kasra = "\u0650",

    Sukun = "\u06E1",               // ۡ
    SukunAlt = "\u0652",            // ◌ْ

    Fathatan = "\u064B",
    Dhammatan = "\u064C",
    Kasratan = "\u064D",

    SuperscriptAlif = "\u0670",     //  ٰ
    InvertedDhamma = "\u0657",      // ٗ
    SubAlef = "\u0656",             // ٖ

    OpenFathatan = "\u08F0",
    OpenDhammatan = "\u08F1",
    OpenKasratan= "\u08F2",

    // Addition
    SmallHighMim = "\u06E2",        // ۢ
    SmallWaw = "\u06E5",            // ۥ
    SmallYa = "\u06E6",             // ۦ
    Shadda = "\u0651",              //  ّ
    
    Tatwil = "\u0640",              // ـ  For long tail like ســــ

    LamAlef = "\uFEFB",             // ﻻ

    // From Pegon
    MaddaAbove = "\u0653",
}

//////////========== Step 1 : Transliterate to Arab Letter and Harakat ==========//////////

////////// Prefix Rule Section //////////

const prefixLevel1Rules: PlainTransliteration[] = [
    ['wa', Arabic.Waw + Arabic.Fatha],
    ['fa', Arabic.Fa + Arabic.Fatha],
];

const prefixLevel2Rules: PlainTransliteration[] = [
    ['li', Arabic.Lam + Arabic.Kasra],
    ['bi', Arabic.Ba + Arabic.Kasra],
    ['ka', Arabic.Kaf + Arabic.Fatha],
    ['sa', Arabic.Sin + Arabic.Fatha],
];

// Prefix Level 3 Rules
const alifLamRules: PlainTransliteration[] = [
    ['al-', Arabic.Alif + Arabic.Lam],
    ['al', Arabic.Alif + Arabic.Lam],
];

////////// Simple Rule Section //////////

// Harakat Rules
const sukunRules: PlainTransliteration[] = [
    ['.', Arabic.Sukun]
];

const fathaSoundRules: PlainTransliteration[] = [
    ['a', Arabic.Fatha]
];

const dammaSoundRules: PlainTransliteration[] = [
    ['u', Arabic.Damma]
];

const kasraSoundRules: PlainTransliteration[] = [
    ['i', Arabic.Kasra]
];

const oSoundRules: PlainTransliteration[] = [
    ['o', Arabic.Fatha]
];

const shortHarakatRules: PlainTransliteration[] =
    chainRule(
        fathaSoundRules,
        dammaSoundRules,
        kasraSoundRules
    );

const tanwinHarakatRules: PlainTransliteration[] = [
    ['an-', Arabic.Fathatan],
    ['an_', Arabic.OpenFathatan],

    ['un-', Arabic.Dhammatan],
    ['un_', Arabic.OpenDhammatan],

    ['in-', Arabic.Kasratan],
    ['in_', Arabic.OpenKasratan],
];

const longFathaHarakatRules: PlainTransliteration[] = [
    // Fatha
    ['aA', Arabic.Fatha + Arabic.Alif],
    ['a^a', Arabic.SuperscriptAlif],
    ['^a', Arabic.SuperscriptAlif],
    ['aY', Arabic.Fatha + Arabic.AlefMaksura],

    // Additional Fatha, delete if needed
    ['aa', Arabic.Fatha + Arabic.Alif],
];

const longHarakatRules: PlainTransliteration[] = [
    // Fatha
    ['aA', Arabic.Fatha + Arabic.Alif],
    ['a^a', Arabic.SuperscriptAlif],
    ['^a', Arabic.SuperscriptAlif],
    ['aY', Arabic.Fatha + Arabic.AlefMaksura],

    // Additional Fatha, delete if needed
    ['aa', Arabic.Fatha + Arabic.Alif],

    // Kasra
    ['iy.', Arabic.Kasra + Arabic.Ya + Arabic.Sukun],
    ['iy', Arabic.Kasra + Arabic.Ya],
    ['i^i', Arabic.SubAlef],
    ['^i', Arabic.SubAlef],
    ['iY', Arabic.Kasra + Arabic.AlefMaksura],
    ['i^Y', Arabic.Kasra + Arabic.SmallYa],
    ['^Y', Arabic.Kasra + Arabic.SmallYa],

    // Additional Kasra, delete if needed
    ['ii.', Arabic.Kasra + Arabic.Ya + Arabic.Sukun],
    ['ii', Arabic.Kasra + Arabic.Ya],

    // Damma
    ['uw.', Arabic.Damma + Arabic.Waw + Arabic.Sukun],
    ['uw', Arabic.Damma + Arabic.Waw],
    ['u^u', Arabic.InvertedDhamma],
    ['^u', Arabic.InvertedDhamma],
    ['u^W', Arabic.Damma + Arabic.SmallWaw],
    ['^W', Arabic.Damma + Arabic.SmallWaw],

    // Additional Damma, delete if needed
    ['uu.', Arabic.Damma + Arabic.Waw + Arabic.Sukun],
    ['uu', Arabic.Damma + Arabic.Waw],
];

const digraphHarakatRules: PlainTransliteration[] = [
    //ai
    ['ay', Arabic.Fatha + Arabic.Ya + Arabic.Sukun],
    ['ai', Arabic.Fatha + Arabic.Ya + Arabic.Sukun],

    //au
    ['aw', Arabic.Fatha + Arabic.Waw + Arabic.Sukun],
    ['au', Arabic.Fatha + Arabic.Waw + Arabic.Sukun],
];

const additionalHarakatRule: PlainTransliteration[] = [
    ['^m', Arabic.SmallHighMim],
];

// Consonant Rules
const connectedMonographConsonantRules: PlainTransliteration[] = [
    ['b', Arabic.Ba],
    ['t', Arabic.Ta],
    ['j', Arabic.Jim],
    ['s', Arabic.Sin],
    ['\'', Arabic.Ain],
    ['f', Arabic.Fa],
    ['q', Arabic.Qaf],
    ['k', Arabic.Kaf],
    ['l', Arabic.Lam],
    ['m', Arabic.Mim],
    ['n', Arabic.Nun],
    ['h', Arabic.Ha],
    ['y', Arabic.Ya],
    ['Y', Arabic.AlefMaksura],
];

const connectedDigraphConsonantRules: PlainTransliteration[] = [
    ['t_s', Arabic.Tsa],
    ['h_h', Arabic.Hah],
    ['k_h', Arabic.Kho],
    ['s_y', Arabic.Syin],
    ['s_h', Arabic.Shod],
    ['d_l', Arabic.Dhod],
    ['t_t', Arabic.Tha],
    ['z_h', Arabic.Zha],
    ['g_h', Arabic.Ghain],
];

const notConnectedMonographConsonantRules: PlainTransliteration[] = [
    ['A', Arabic.Alif],
    ['d', Arabic.Dal],
    ['r', Arabic.Ra],
    ['z', Arabic.Zain],
    ['w', Arabic.Waw],
];

const notConnectedDigraphConsonantRules: PlainTransliteration[] =[
    ['d_z', Arabic.Dzal],
];

const taMarbutaRules: PlainTransliteration[] = [
    ['t-', Arabic.TaMarbuta],
    ['h-', Arabic.TaMarbuta],
];

const oSoundConsonantRules: PlainTransliteration[] = [
    ['r', Arabic.Ra],
    ['k_h', Arabic.Kho],
    ['s_h', Arabic.Shod],
    ['d_l', Arabic.Dhod],
    ['t_t', Arabic.Tha],
    ['z_h', Arabic.Zha],
    ['g_h', Arabic.Ghain],
    ['q', Arabic.Qaf],
];

const allConsonantRules: PlainTransliteration[] =
    chainRule(
        connectedDigraphConsonantRules,
        notConnectedDigraphConsonantRules,
        taMarbutaRules,
        connectedMonographConsonantRules,
        notConnectedMonographConsonantRules,
    );


const alifWawYaConsonantRules: PlainTransliteration[] = [
    ['A', Arabic.Alif],
    ['w', Arabic.Waw],
    ['y', Arabic.Ya],
    ['Y', Arabic.AlefMaksura],
];

const exceptAlifWaYaConsonantFunction = (): PlainTransliteration[] => {
    let consonant: PlainTransliteration[] = allConsonantRules;

    let consonantWithoutAlifWaYa = consonant.filter(x => {
        for (let i = 0; i < alifWawYaConsonantRules.length; i++) {
            if (alifWawYaConsonantRules[i][0] === x[0] && alifWawYaConsonantRules[i][1] === x[1])
                return false;
        }
        return true;
    });
    return consonantWithoutAlifWaYa;
};

const exceptAlifWaYaConsonantRules: PlainTransliteration[] = exceptAlifWaYaConsonantFunction();

const qomarMonographConsonantRules: PlainTransliteration[] = [
    ['A', Arabic.Alif],
    ['b', Arabic.Ba],
    ['j', Arabic.Jim],
    ['\'', Arabic.Ain],
    ['f', Arabic.Fa],
    ['q', Arabic.Qaf],
    ['k', Arabic.Kaf],
    ['m', Arabic.Mim],
    ['w', Arabic.Waw],
    ['h', Arabic.Ha],
    ['y', Arabic.Ya],
    ['Y', Arabic.AlefMaksura],
];

const qomarDigraphConsonantRules: PlainTransliteration[] = [
    ['h_h', Arabic.Hah],
    ['k_h', Arabic.Kho],
    ['g_h', Arabic.Ghain],
];

const syamsiMonographConsonantRules: PlainTransliteration[] = [
    ['t', Arabic.Ta],
    ['d', Arabic.Dal],
    ['r', Arabic.Ra],
    ['z', Arabic.Zain],
    ['s', Arabic.Sin],
    ['l', Arabic.Lam],
    ['n', Arabic.Nun],
];

const syamsiDigraphConsonantRules: PlainTransliteration[] = [
    ['t_s', Arabic.Tsa],
    ['d_z', Arabic.Dzal],
    ['s_y', Arabic.Syin],
    ['s_h', Arabic.Shod],
    ['d_l', Arabic.Dhod],
    ['t_t', Arabic.Tha],
    ['z_h', Arabic.Zha],
];

const qomarOSoundConsonantRules: PlainTransliteration[] = [
    ['k_h', Arabic.Kho],
    ['g_h', Arabic.Ghain],
    ['q', Arabic.Qaf],
];

const syamsiOSoundConsonantRules: PlainTransliteration[] = [
    ['r', Arabic.Ra],
    ['s_h', Arabic.Shod],
    ['d_l', Arabic.Dhod],
    ['t_t', Arabic.Tha],
    ['z_h', Arabic.Zha],
];

////////// Hamza Code Section //////////

const hamzaAloneRules: PlainTransliteration[] = [
    ['`', Arabic.Hamza],
];

const hamzaBeginningRules: PlainTransliteration[] = [
    ['`a', Arabic.AlifWithHamzaAbove + Arabic.Fatha],
    ['`u', Arabic.AlifWithHamzaAbove + Arabic.Damma],
    ['`i', Arabic.AlifWithHamzaBelow + Arabic.Kasra],
];

const hamzaAboveAlifRules: PlainTransliteration[] = [
    ['`', Arabic.AlifWithHamzaAbove],
];

const hamzaAboveWawRules: PlainTransliteration[] = [
    ['`w', Arabic.WawWithHamzaAbove],
    ['`', Arabic.WawWithHamzaAbove],
];

const hamzaAboveYaRules: PlainTransliteration[] = [
    ['`y', Arabic.YaWithHamzaAbove],
    ['`', Arabic.YaWithHamzaAbove],
];

const additionalConsonantRule: PlainTransliteration[] = [
    ['^A', Arabic.AlifWithMaddaAbove],
    ['\*', Arabic.AlifWasla],
];

////////// Util Section //////////

const prefixSyllableRules: PlainTransliteration[] =
    chainRule(
        ruleProduct(prefixLevel1Rules, prefixLevel2Rules),
        prefixLevel1Rules,
        prefixLevel2Rules
    );

const addUntilPrefix2Rules = (rules: PlainTransliteration[]): PlainTransliteration[] => {
    return chainRule(
        ruleProduct(prefixSyllableRules, rules),
        rules
    )
};

const addLetterBeforeRules = (rules: PlainTransliteration[], latin: string): PlainTransliteration[] =>
    rules.map(([key, val]) => [latin.concat(key), latin.concat(val)]);

const addAlif = (rules: PlainTransliteration[]): PlainTransliteration[] =>
    rules.map(([key, val]) => [key, Arabic.Alif.concat(val)]);

const addTatwil = (rules: PlainTransliteration[]): PlainTransliteration[] =>
    rules.map(([key, val]) => [key, Arabic.Tatwil.concat(val)]);

const addSukun = (rules: PlainTransliteration[]): PlainTransliteration[] =>
    rules.map(([key, val]) => [key, val.concat(Arabic.Sukun)]);

////////// Rule Section //////////

const harakatBeginningRules: Transliteration[] =
    chainRule(
        asWordBeginning(addAlif(tanwinHarakatRules)),
        asWordBeginning(addAlif(shortHarakatRules)),
        asWordBeginning(addAlif(longHarakatRules))
    );

const commonHarakatRules: PlainTransliteration[] =
    chainRule(
        tanwinHarakatRules,
        digraphHarakatRules,
        longHarakatRules,
        shortHarakatRules,
        sukunRules
    );

const commonHarakatAfterAlifWawYa: Transliteration[] =
    prepareRules(alifWawYaConsonantRules).flatMap<RegexTransliteration>(
        ([awyKey, awyVal]) => prepareRules(commonHarakatRules).map<RegexTransliteration>(
            ([latinKey, arabVal]) => [new RegExp(`${awyVal}(${Arabic.Shadda})?${latinKey}`), awyVal + `$1` + arabVal]
        )
    );

const commonHarakatAfterSukunRules: Transliteration[] =
    prepareRules(commonHarakatRules).map(
        ([latinKey, arabVal]) => [new RegExp(`${Arabic.Sukun}${latinKey}`), arabVal]
    );

const commonHarakatElseRules: Transliteration[] =
    chainRule(
        addTatwil(commonHarakatRules)
    );

///// Harakat Only End Rules
const groupHarakatOnlyRules: Transliteration[] =
    chainRule(
        harakatBeginningRules,

        commonHarakatAfterAlifWawYa,
        commonHarakatAfterSukunRules,
        commonHarakatElseRules
    );

const groupAdditionalHarakatOnlyRules: Transliteration[] =
    // ^m not overlap with consonant only rules
    chainRule(
        additionalHarakatRule
    );

///// Syllable with O Sound Start Rules
const doubleOSoundSyllableRules: Transliteration[] =
    prepareRules(oSoundConsonantRules).map(
        ([latinKey, arabVal]) => [new RegExp(`${latinKey}${latinKey}o`), arabVal + Arabic.Shadda + Arabic.Fatha]
    );

const singleOSoundSyllableRules: Transliteration[] =
    prepareRules(oSoundConsonantRules).map(
        ([latinKey, arabVal]) => [new RegExp(`${latinKey}o`), arabVal + Arabic.Fatha]
    );

///// Syllable With O Sound End Rules
const groupOSoundSyllableRules: Transliteration[] =
    chainRule(
        doubleOSoundSyllableRules,
        singleOSoundSyllableRules
    );

// nn not overlap with tanwin (n-)
const doubleConsonantRules: Transliteration[] =
    prepareRules(exceptAlifWaYaConsonantRules).map(
        ([latinKey, arabVal]) => [new RegExp(`${latinKey}${latinKey}`), arabVal + Arabic.Shadda + Arabic.Sukun]
    );

// n overlap with tanwin (n-)
const singleConsonantWithoutNunRules: Transliteration[] =
    prepareRules(exceptAlifWaYaConsonantRules).filter(
        ([latinKey, arabVal]) => {
            if (latinKey === 'n') {
                return false;
            } else {
                return true;
            }
        }
    ).map(
        ([latinKey, arabVal]) => [new RegExp(`${latinKey}`), arabVal + Arabic.Sukun]
    );

const nunConsonantRules: Transliteration[] = [
    [new RegExp(`n(?!-|_)`), Arabic.Nun + Arabic.Sukun]
];

const groupNunConsonantDefaultRules: Transliteration[] = [
    ['n', Arabic.Nun + Arabic.Sukun]
];

///// Consonant Only End Rules
const groupConsonantOnlyRules: Transliteration[] =
    chainRule(
        doubleConsonantRules,
        singleConsonantWithoutNunRules,
        nunConsonantRules,
        additionalConsonantRule
    );

///// Alif Waw Ya Start Rules

// Alif not included, cannot shadda
const doubleAlifWawYaAsConsonantRules: Transliteration[] = [
    [new RegExp(`ww`), Arabic.Waw + Arabic.Shadda],
    [new RegExp(`yy`), Arabic.Ya + Arabic.Shadda],
    [new RegExp(`YY`), Arabic.AlefMaksura + Arabic.Shadda],
];

// aiu^ it means, followed by harakat
const singleAlifWawYaAsConsonantRules: Transliteration[] =
    prepareRules(alifWawYaConsonantRules).map(
        ([latinKey, arabVal]) => [new RegExp(`(?<!_)${latinKey}(?=a|i|u|\\^)`), arabVal]
    );

///// Alif Waw Ya End Rules
const groupAlifWawYaAsConsonantRules: Transliteration[] =
    chainRule(
        doubleAlifWawYaAsConsonantRules,
        singleAlifWawYaAsConsonantRules
    );

const groupAlifWawYaOnlyRules: PlainTransliteration[] =
    chainRule(
        alifWawYaConsonantRules
    );

///// Connected Syllable Start Rules
const connectedFathaSyllableRules: PlainTransliteration[] =
    chainRule(
        ruleProduct(connectedDigraphConsonantRules, fathaSoundRules),
        ruleProduct(connectedMonographConsonantRules, fathaSoundRules)
    )

const connectedDammaSyllableRules: PlainTransliteration[] =
    chainRule(
        ruleProduct(connectedDigraphConsonantRules, dammaSoundRules),
        ruleProduct(connectedMonographConsonantRules, dammaSoundRules)
    );

const connectedKasraSylableRules: PlainTransliteration[] =
    chainRule(
        ruleProduct(connectedDigraphConsonantRules, kasraSoundRules),
        ruleProduct(connectedMonographConsonantRules, kasraSoundRules)
    );

///// Hamza Syllable Start Rules
const hamzaAloneOnlyRules: PlainTransliteration[] =
    chainRule(
        addSukun(hamzaAloneRules)
    );

const hamzaAloneLongFathaHarakatSyllableRules: PlainTransliteration[] =
    chainRule(
        ruleProduct(hamzaAloneRules, longFathaHarakatRules)
    );

const hamzaBeginningSyllableRules: Transliteration[] =
    chainRule(
        // Special for hamza long fatha harakat, using alone than hamzaAbove
        asWordBeginning(
            addUntilPrefix2Rules(hamzaAloneLongFathaHarakatSyllableRules)
        ),
        // hamza beginning need harakat, if not, exactly like hamza alone
        asWordBeginning(
            addUntilPrefix2Rules(hamzaBeginningRules)
        )
    );

const hamzaAfterAlifWawYaOnlyRules: PlainTransliteration[] =
    chainRule(
        addLetterBeforeRules(hamzaAloneOnlyRules, 'A'),
        addLetterBeforeRules(hamzaAloneOnlyRules, 'w'),
        addLetterBeforeRules(hamzaAloneOnlyRules, 'y'),
    );

const hamzaAboveAlifOnlyRules: PlainTransliteration[] =
    chainRule(
        addSukun(hamzaAboveAlifRules)
    );

const hamzaAboveWawOnlyRules: PlainTransliteration[] =
    chainRule(
        addSukun(hamzaAboveWawRules)
    );

const hamzaAboveYaOnlyRules: PlainTransliteration[] =
    chainRule(
        addSukun(hamzaAboveYaRules)
    );

const hamzaAfterConnectedConstantWithFathaOnlyRules: PlainTransliteration[] =
    chainRule(
        ruleProduct(connectedFathaSyllableRules, hamzaAboveAlifOnlyRules)
    );

const hamzaAfterConnectedConstantWithDammaOnlyRules: PlainTransliteration[] =
    chainRule(
        ruleProduct(connectedDammaSyllableRules, hamzaAboveWawOnlyRules)
    );

const hamzaAfterConnectedConstantWithKasraOnlyRules: PlainTransliteration[] =
    chainRule(
        ruleProduct(connectedKasraSylableRules, hamzaAboveYaOnlyRules)
    );

const hamzaAfterNotConnectedConstantOnlyRules: PlainTransliteration[] =
    chainRule(
        ruleProduct(notConnectedDigraphConsonantRules, hamzaAloneOnlyRules),
        ruleProduct(notConnectedMonographConsonantRules, hamzaAloneOnlyRules)
    );

///// Hamza Syllable End Rule
const groupHamzaRules: Transliteration[] =
    chainRule(
        hamzaBeginningSyllableRules,
        hamzaAfterAlifWawYaOnlyRules,
        hamzaAfterConnectedConstantWithFathaOnlyRules,
        hamzaAfterConnectedConstantWithDammaOnlyRules,
        hamzaAfterConnectedConstantWithKasraOnlyRules,
        hamzaAfterNotConnectedConstantOnlyRules,

        // Default Rules
        hamzaAloneOnlyRules
    );

///// Alif Lam Start Rule
// Combination [Alif lam, Alif Wasla lam][Qomar, Hamza, Syamsi][Digraph Monograph OSound][With/out Prefix]
const alifLamLamWithPrefixRules: Transliteration[] =
    prefixSyllableRules.map(
        ([latinPrefix, arabPrefix]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${latinPrefix}[aA]l(?:-)?l(?:l)?`),
            `$1` + arabPrefix + Arabic.Alif + Arabic.Lam + Arabic.Lam + Arabic.Shadda + Arabic.Sukun]
    );

const alifWaslaLamLamWithPrefixRules: Transliteration[] =
    prefixSyllableRules.map(
        ([latinPrefix, arabPrefix]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${latinPrefix}\\*(?:a|i|u|A|I|U)?l(?:-)?l(?:l)?`),
            `$1` + arabPrefix + Arabic.AlifWasla + Arabic.Lam + Arabic.Lam + Arabic.Shadda + Arabic.Sukun]
    );

const alifLamLamWithoutPrefixRules: Transliteration[] = [
    [new RegExp(`(^|[${wordDelimitingPatterns}])[aA]l(?:-)?l(?:l)?`),
        `$1` + Arabic.Alif + Arabic.Lam + Arabic.Lam + Arabic.Shadda + Arabic.Sukun]
];

const alifWaslaLamLamWithoutPrefixRules: Transliteration[] = [
    [new RegExp(`(^|[${wordDelimitingPatterns}])\\*(?:a|i|u|A|I|U)?l(?:-)?l(?:l)?`),
        `$1` + Arabic.AlifWasla + Arabic.Lam + Arabic.Lam + Arabic.Shadda + Arabic.Sukun]
];

// Qomar
const alifLamQomarDigraphWithPrefixRules: Transliteration[] =
    qomarDigraphConsonantRules.flatMap<RegexTransliteration>(
        ([latinQomar, arabQomar]) => prefixSyllableRules.map<RegexTransliteration>(
            ([latinPrefix, arabPrefix]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${latinPrefix}[aA]l(?:-)?${latinQomar}`),
                `$1` + arabPrefix + Arabic.Alif + Arabic.Lam + Arabic.Sukun + latinQomar]
        )
    );

const alifWaslaLamQomarDigraphWithPrefixRules: Transliteration[] =
    qomarDigraphConsonantRules.flatMap<RegexTransliteration>(
        ([latinQomar, arabQomar]) => prefixSyllableRules.map<RegexTransliteration>(
            ([latinPrefix, arabPrefix]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${latinPrefix}\\*(?:a|i|u|A|I|U)?l(?:-)?${latinQomar}`),
                `$1` + arabPrefix + Arabic.AlifWasla + Arabic.Lam + Arabic.Sukun + latinQomar]
        )
    );

const alifLamQomarMonographWithPrefixRules: Transliteration[] =
    qomarMonographConsonantRules.flatMap<RegexTransliteration>(
        ([latinQomar, arabQomar]) => prefixSyllableRules.map<RegexTransliteration>(
            ([latinPrefix, arabPrefix]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${latinPrefix}[aA]l(?:-)?${latinQomar}`),
                `$1` + arabPrefix + Arabic.Alif + Arabic.Lam + Arabic.Sukun + latinQomar]
        )
    );

const alifWaslaLamQomarMonographWithPrefixRules: Transliteration[] =
    qomarMonographConsonantRules.flatMap<RegexTransliteration>(
        ([latinQomar, arabQomar]) => prefixSyllableRules.map<RegexTransliteration>(
            ([latinPrefix, arabPrefix]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${latinPrefix}\\*(?:a|i|u|A|I|U)?l(?:-)?${latinQomar}`),
                `$1` + arabPrefix + Arabic.AlifWasla + Arabic.Lam + Arabic.Sukun + latinQomar]
        )
    );

const alifLamQomarDigraphWithoutPrefixRules: Transliteration[] =
    qomarDigraphConsonantRules.map(
        ([latinQomar, arabQomar]) => [new RegExp(`(^|[${wordDelimitingPatterns}])[aA]l(?:-)?${latinQomar}`),
            `$1` + Arabic.Alif + Arabic.Lam + Arabic.Sukun + latinQomar]
    );

const alifWaslaLamQomarDigraphWithoutPrefixRules: Transliteration[] =
    qomarDigraphConsonantRules.map(
        ([latinQomar, arabQomar]) => [new RegExp(`(^|[${wordDelimitingPatterns}])\\*(?:a|i|u|A|I|U)?l(?:-)?${latinQomar}`),
            `$1` + Arabic.AlifWasla + Arabic.Lam + Arabic.Sukun + latinQomar]
    );

const alifLamQomarMonographWithoutPrefixRules: Transliteration[] =
    qomarMonographConsonantRules.map(
        ([latinQomar, arabQomar]) => [new RegExp(`(^|[${wordDelimitingPatterns}])[aA]l(?:-)?${latinQomar}`),
            `$1` + Arabic.Alif + Arabic.Lam + Arabic.Sukun + latinQomar]
    );

const alifWaslaLamQomarMonographWithoutPrefixRules: Transliteration[] =
    qomarMonographConsonantRules.map(
        ([latinQomar, arabQomar]) => [new RegExp(`(^|[${wordDelimitingPatterns}])\\*(?:a|i|u|A|I|U)?l(?:-)?${latinQomar}`),
            `$1` + Arabic.AlifWasla + Arabic.Lam + Arabic.Sukun + latinQomar]
    );

const alifLamQomarHamzaWithPrefixRules: Transliteration[] =
    hamzaAboveAlifOnlyRules.flatMap<RegexTransliteration>(
        ([latinHamza, arabHamza]) => prefixSyllableRules.map<RegexTransliteration>(
            ([latinPrefix, arabPrefix]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${latinPrefix}[aA]l(?:-)?${latinHamza}`),
                `$1` + arabPrefix + Arabic.Alif + Arabic.Lam + Arabic.Sukun + arabHamza + Arabic.Sukun]
        )
    );

const alifWaslaLamQomarHamzaWithPrefixRules: Transliteration[] =
    hamzaAboveAlifOnlyRules.flatMap<RegexTransliteration>(
        ([latinHamza, arabHamza]) => prefixSyllableRules.map<RegexTransliteration>(
            ([latinPrefix, arabPrefix]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${latinPrefix}\\*(?:a|i|u|A|I|U)?l(?:-)?${latinHamza}`),
                `$1` + arabPrefix + Arabic.AlifWasla + Arabic.Lam + Arabic.Sukun + arabHamza + Arabic.Sukun]
        )
    );

const alifLamQomarHamzaWithoutPrefixRules: Transliteration[] =
    hamzaAboveAlifOnlyRules.map(
        ([latinHamza, arabHamza]) => [new RegExp(`(^|[${wordDelimitingPatterns}])[aA]l(?:-)?${latinHamza}`),
            `$1` + Arabic.Alif + Arabic.Lam + Arabic.Sukun + arabHamza + Arabic.Sukun]
    );

const alifWaslaLamQomarHamzaWithoutPrefixRules: Transliteration[] =
    hamzaAboveAlifOnlyRules.map(
        ([latinHamza, arabHamza]) => [new RegExp(`(^|[${wordDelimitingPatterns}])\\*(?:a|i|u|A|I|U)?l(?:-)?${latinHamza}`),
            `$1` + Arabic.AlifWasla + Arabic.Lam + Arabic.Sukun + arabHamza + Arabic.Sukun]
    );

const alifLamQomarOSoundWithPrefixRules: Transliteration[] =
    qomarOSoundConsonantRules.flatMap<RegexTransliteration>(
        ([latinOSound, arabOSound]) => prefixSyllableRules.map<RegexTransliteration>(
            ([latinPrefix, arabPrefix]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${latinPrefix}[aA]l(?:-)?${latinOSound}o`),
                `$1` + arabPrefix + Arabic.Alif + Arabic.Lam + Arabic.Sukun + arabOSound + Arabic.Fatha]
        )
    );

const alifWaslaLamQomarOSoundWithPrefixRules: Transliteration[] =
    qomarOSoundConsonantRules.flatMap<RegexTransliteration>(
        ([latinOSound, arabOSound]) => prefixSyllableRules.map<RegexTransliteration>(
            ([latinPrefix, arabPrefix]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${latinPrefix}\\*(?:a|i|u|A|I|U)?l(?:-)?${latinOSound}o`),
                `$1` + arabPrefix + Arabic.AlifWasla + Arabic.Lam + Arabic.Sukun + arabOSound + Arabic.Fatha]
        )
    );

const alifLamQomarOSoundWithoutPrefixRules: Transliteration[] =
    qomarOSoundConsonantRules.map(
        ([latinOSound, arabOSound]) => [new RegExp(`(^|[${wordDelimitingPatterns}])[aA]l(?:-)?${latinOSound}o`),
            `$1` + Arabic.Alif + Arabic.Lam + Arabic.Sukun + arabOSound + Arabic.Fatha]
    );

const alifWaslaLamQomarOSoundWithoutPrefixRules: Transliteration[] =
    qomarOSoundConsonantRules.map(
        ([latinOSound, arabOSound]) => [new RegExp(`(^|[${wordDelimitingPatterns}])\\*(?:a|i|u|A|I|U)?l(?:-)?${latinOSound}o`),
            `$1` + Arabic.AlifWasla + Arabic.Lam + Arabic.Sukun + arabOSound + Arabic.Fatha]
    );

// Syamsi
const alifLamSyamsiDigraphWithPrefixRules: Transliteration[] =
    syamsiDigraphConsonantRules.flatMap<RegexTransliteration>(
        ([latinSyamsi, arabSyamsi]) => prefixSyllableRules.map<RegexTransliteration>(
            ([latinPrefix, arabPrefix]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${latinPrefix}[aA]l(?:-)?${latinSyamsi}(?:${latinSyamsi})?`),
                `$1` + arabPrefix + Arabic.Alif + Arabic.Lam + arabSyamsi + Arabic.Shadda + Arabic.Sukun]
        )
    );

const alifWaslaLamSyamsiDigraphWithPrefixRules: Transliteration[] =
    syamsiDigraphConsonantRules.flatMap<RegexTransliteration>(
        ([latinSyamsi, arabSyamsi]) => prefixSyllableRules.map<RegexTransliteration>(
            ([latinPrefix, arabPrefix]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${latinPrefix}\\*(?:a|i|u|A|I|U)?l(?:-)?${latinSyamsi}(?:${latinSyamsi})?`),
                `$1` + arabPrefix + Arabic.AlifWasla + Arabic.Lam + arabSyamsi + Arabic.Shadda + Arabic.Sukun]
        )
    );

const alifLamSyamsiMonographWithPrefixRules: Transliteration[] =
    syamsiMonographConsonantRules.flatMap<RegexTransliteration>(
        ([latinSyamsi, arabSyamsi]) => prefixSyllableRules.map<RegexTransliteration>(
            ([latinPrefix, arabPrefix]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${latinPrefix}[aA]l(?:-)?${latinSyamsi}(?:${latinSyamsi})?`),
                `$1` + arabPrefix + Arabic.Alif + Arabic.Lam + arabSyamsi + Arabic.Shadda + Arabic.Sukun]
        )
    );

const alifWaslaLamSyamsiMonographWithPrefixRules: Transliteration[] =
    syamsiMonographConsonantRules.flatMap<RegexTransliteration>(
        ([latinSyamsi, arabSyamsi]) => prefixSyllableRules.map<RegexTransliteration>(
            ([latinPrefix, arabPrefix]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${latinPrefix}\\*(?:a|i|u|A|I|U)?l(?:-)?${latinSyamsi}(?:${latinSyamsi})?`),
                `$1` + arabPrefix + Arabic.AlifWasla + Arabic.Lam + arabSyamsi + Arabic.Shadda + Arabic.Sukun]
        )
    );

const alifLamSyamsiDigraphWithoutPrefixRules: Transliteration[] =
    syamsiDigraphConsonantRules.map(
        ([latinSyamsi, arabSyamsi]) => [new RegExp(`(^|[${wordDelimitingPatterns}])[aA]l(?:-)?${latinSyamsi}(?:${latinSyamsi})?`),
            `$1` + Arabic.Alif + Arabic.Lam + arabSyamsi + Arabic.Shadda + Arabic.Sukun]
    );

const alifWaslaLamSyamsiDigraphWithoutPrefixRules: Transliteration[] =
    syamsiDigraphConsonantRules.map(
        ([latinSyamsi, arabSyamsi]) => [new RegExp(`(^|[${wordDelimitingPatterns}])\\*(?:a|i|u|A|I|U)?l(?:-)?${latinSyamsi}(?:${latinSyamsi})?`),
            `$1` + Arabic.AlifWasla + Arabic.Lam + arabSyamsi + Arabic.Shadda + Arabic.Sukun]
    );

const alifLamSyamsiMonographWithoutPrefixRules: Transliteration[] =
    syamsiMonographConsonantRules.map(
        ([latinSyamsi, arabSyamsi]) => [new RegExp(`(^|[${wordDelimitingPatterns}])[aA]l(?:-)?${latinSyamsi}(?:${latinSyamsi})?`),
            `$1` + Arabic.Alif + Arabic.Lam + arabSyamsi + Arabic.Shadda + Arabic.Sukun]
    );

const alifWaslaLamSyamsiMonographWithoutPrefixRules: Transliteration[] =
    syamsiMonographConsonantRules.map(
        ([latinSyamsi, arabSyamsi]) => [new RegExp(`(^|[${wordDelimitingPatterns}])\\*(?:a|i|u|A|I|U)?l(?:-)?${latinSyamsi}(?:${latinSyamsi})?`),
            `$1` + Arabic.AlifWasla + Arabic.Lam + arabSyamsi + Arabic.Shadda + Arabic.Sukun]
    );

const alifLamSyamsiOSoundWithPrefixRules: Transliteration[] =
    syamsiOSoundConsonantRules.flatMap<RegexTransliteration>(
        ([latinOSound, arabOSound]) => prefixSyllableRules.map<RegexTransliteration>(
            ([latinPrefix, arabPrefix]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${latinPrefix}[aA]l(?:-)?${latinOSound}(?:${latinOSound})?o`),
                `$1` + arabPrefix + Arabic.Alif + Arabic.Lam + arabOSound + Arabic.Shadda + Arabic.Fatha]
        )
    );

const alifWaslaLamSyamsiOSoundWithPrefixRules: Transliteration[] =
    syamsiOSoundConsonantRules.flatMap<RegexTransliteration>(
        ([latinOSound, arabOSound]) => prefixSyllableRules.map<RegexTransliteration>(
            ([latinPrefix, arabPrefix]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${latinPrefix}\\*(?:a|i|u|A|I|U)?l(?:-)?${latinOSound}(?:${latinOSound})?o`),
                `$1` + arabPrefix + Arabic.AlifWasla + Arabic.Lam + arabOSound + Arabic.Shadda + Arabic.Fatha]
        )
    );

const alifLamSyamsiOSoundWithoutPrefixRules: Transliteration[] =
    syamsiOSoundConsonantRules.map(
        ([latinOSound, arabOSound]) => [new RegExp(`(^|[${wordDelimitingPatterns}])[aA]l(?:-)?${latinOSound}(?:${latinOSound})?o`),
            `$1` + Arabic.Alif + Arabic.Lam + arabOSound + Arabic.Shadda + Arabic.Fatha]
    );

const alifWaslaLamSyamsiOSoundWithoutPrefixRules: Transliteration[] =
    syamsiOSoundConsonantRules.map(
        ([latinOSound, arabOSound]) => [new RegExp(`(^|[${wordDelimitingPatterns}])\\*(?:a|i|u|A|I|U)?l(?:-)?${latinOSound}(?:${latinOSound})?o`),
            `$1` + Arabic.AlifWasla + Arabic.Lam + arabOSound + Arabic.Shadda + Arabic.Fatha]
    );

// Alif lam must be in front of word
const alifLamSyllableRules: Transliteration[] =
    chainRule(
        // Alif lam
            // With Prefix
        alifLamQomarHamzaWithPrefixRules,
        alifLamLamWithPrefixRules,
        alifLamQomarOSoundWithPrefixRules,
        alifLamSyamsiOSoundWithPrefixRules,

        alifLamQomarDigraphWithPrefixRules,
        alifLamSyamsiDigraphWithPrefixRules,
        alifLamQomarMonographWithPrefixRules,
        alifLamSyamsiMonographWithPrefixRules,

            // Without Prefix
        alifLamQomarHamzaWithoutPrefixRules,
        alifLamLamWithoutPrefixRules,
        alifLamQomarOSoundWithoutPrefixRules,
        alifLamSyamsiOSoundWithoutPrefixRules,

        alifLamQomarDigraphWithoutPrefixRules,
        alifLamSyamsiDigraphWithoutPrefixRules,
        alifLamQomarMonographWithoutPrefixRules,
        alifLamSyamsiMonographWithoutPrefixRules,

        // Alif Wasla Lam
            // With Prefix
        alifWaslaLamQomarHamzaWithPrefixRules,
        alifWaslaLamLamWithPrefixRules,
        alifWaslaLamQomarOSoundWithPrefixRules,
        alifWaslaLamSyamsiOSoundWithPrefixRules,

        alifWaslaLamQomarDigraphWithPrefixRules,
        alifWaslaLamSyamsiDigraphWithPrefixRules,
        alifWaslaLamQomarMonographWithPrefixRules,
        alifWaslaLamSyamsiMonographWithPrefixRules,

            // Without Prefix
        alifWaslaLamQomarHamzaWithoutPrefixRules,
        alifWaslaLamLamWithoutPrefixRules,
        alifWaslaLamQomarOSoundWithoutPrefixRules,
        alifWaslaLamSyamsiOSoundWithoutPrefixRules,

        alifWaslaLamQomarDigraphWithoutPrefixRules,
        alifWaslaLamSyamsiDigraphWithoutPrefixRules,
        alifWaslaLamQomarMonographWithoutPrefixRules,
        alifWaslaLamSyamsiMonographWithoutPrefixRules
    );

///// Alif Lam End Rules
const groupAlifLamFrontSyllableRules: Transliteration[] =
    chainRule(
        alifLamSyllableRules
    );

///// Syadda is implisit in double consonant rules

//////////========== Step 2 : Adding Special Rule ==========//////////

// To-Do: Change " " (space) to \s in regex
// Note : use x(?=y) to match x followed by y. But y is not included in match result
// To-Do: use x(?!y) to match x not followed by y

////////// Util Section //////////

const arabicHarakatRules = [
    Arabic.Fatha, Arabic.Damma, Arabic.Kasra,
    Arabic.SuperscriptAlif, Arabic.SubAlef, Arabic.InvertedDhamma,
    Arabic.Fathatan, Arabic.Dhammatan, Arabic.Kasratan,
    Arabic.OpenFathatan, Arabic.OpenDhammatan, Arabic.OpenKasratan,
]

const changeOrderShadda: RegexTransliteration[] =
    arabicHarakatRules.map(
        ([harakat]) => [new RegExp(`${harakat}${Arabic.Shadda}`), Arabic.Shadda.concat(harakat)]
    );

// x(?!y) means match x if not followed by y
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Assertions
const deleteSpaceAfterPrefixLevel1Rules: Transliteration[] =
    prefixLevel1Rules.flatMap<RegexTransliteration>(
        ([keyFirst, valFirst]) => prefixLevel1Rules.map<RegexTransliteration>(
            ([keySecond, valSecond]) => [new RegExp(`(^|\\s)${valFirst}\\s(?!${valSecond})`), `$1` + valFirst]
        )
    );

const deleteSpaceAfterPrefixLevel2Rules: Transliteration[] =
    prefixLevel2Rules.flatMap<RegexTransliteration>(
        ([keyFirst, valFirst]) => prefixLevel1Rules.concat(prefixLevel2Rules).map<RegexTransliteration>(
            ([keySecond, valSecond]) => [new RegExp(`(^|\\s)${valFirst}\\s(?!${valSecond})`), `$1` + valFirst]
        )
    );

const deleteSpaceAfterPrefixRules: Transliteration[] =
    chainRule(
        deleteSpaceAfterPrefixLevel2Rules,
        deleteSpaceAfterPrefixLevel1Rules
    );

////////// Special Rule Section //////////

// Nun Tanwin Mim Start Rules
const mimNunWawYaLamRa = [Arabic.Mim, Arabic.Nun, Arabic.Waw, Arabic.Ya, Arabic.Lam, Arabic.Ra]

    // different or same word applied
const nunMeetSixRules: Transliteration[] =
    mimNunWawYaLamRa.map(
        ([letter]) => [new RegExp(`${Arabic.Nun}${Arabic.Sukun}(\\s?)${letter}([^${Arabic.Shadda}]|$)`),
            Arabic.Nun + Arabic.Sukun + `$1` + letter + Arabic.Shadda + `$2`]
    );

    // different or same word applied
const nunMeetBa: Transliteration[] = [
    [new RegExp(`${Arabic.Nun}${Arabic.Sukun}(\\s?)${Arabic.Ba}`),
        Arabic.Nun + Arabic.Sukun + Arabic.SmallHighMim + `$1` + Arabic.Ba],
];

const tanwinMeetSixRules: Transliteration[] =
    tanwinHarakatRules.flatMap<RegexTransliteration>(
        ([key, val]) => mimNunWawYaLamRa.map<RegexTransliteration>(
            ([letter]) => [new RegExp(`${val}\\s${letter}([^${Arabic.Shadda}|$])`), val + ' ' + letter + Arabic.Shadda + `$1`]
        )
    );

const tanwinMeetBa: Transliteration[] =
    tanwinHarakatRules.map(
        ([key, val]) => [val + ' ' + Arabic.Ba, val + Arabic.SmallHighMim + ' ' + Arabic.Ba]
    );

    // different or same word applied
const mimMeetMim: Transliteration[] = [
    [new RegExp(`${Arabic.Mim}${Arabic.Sukun}(\\s?)${Arabic.Mim}([^${Arabic.Mim}${Arabic.Shadda}]|$)`),
        Arabic.Mim + Arabic.Sukun + `$1` + Arabic.Mim + Arabic.Shadda + `$2`],
];

/// Nun Tanwin Mim End Rules
const groupNunTanwinMimRules: Transliteration[] =
    chainRule(
        nunMeetSixRules,
        tanwinMeetSixRules,
        nunMeetBa,
        tanwinMeetBa,
        mimMeetMim
    );

// Special consonant Start Rules
const idghamMutaqaribainConsonantRules = [
    [Arabic.Lam, Arabic.Ra],
    [Arabic.Qaf, Arabic.Kaf],
];

const idghamMutajanisainConsonantRules = [
    [Arabic.Ta, Arabic.Dal, Arabic.Tha],
    [Arabic.Tsa, Arabic.Dzal, Arabic.Zha],
    [Arabic.Ba, Arabic.Mim],
];
// Special consonant End Rules

// Dead Consonant Followed by Similar Sound Start Rules

// Idgham Mutamatsilain, Mutaqarabain, Mutajanisain
// https://www.khudzilkitab.com/2019/01/idgham-mutamatsilain-lengkap.html
// https://www.khudzilkitab.com/2019/09/pengertian-jenis-dan-contoh-idgham-mutaqaribain.html
// https://www.khudzilkitab.com/2019/08/idgham-mutajanisain-lengkap.html

// exclude mim too, because conflict with mim meet mim rules
const idghamMutamatsilainDifferentWordRules: Transliteration[] =
    exceptAlifWaYaConsonantRules.filter(
            ([key, val]) => val !== Arabic.Mim
        ).map(
            ([key, val]) => [new RegExp(`${val}${Arabic.Sukun}\\s${val}[${Arabic.Shadda}]?`), val + ' ' + val + Arabic.Shadda]
    );

const idghamMutamatsilainSameWordRules: Transliteration[] =
    exceptAlifWaYaConsonantRules.filter(
            ([key, val]) => val !== Arabic.Mim
        ).map(
            ([key, val]) => [new RegExp(`${val}${Arabic.Sukun}${val}`), val + val]
    );

const idghamMutaqaribainDifferentWordRules: Transliteration[] =
    idghamMutaqaribainConsonantRules.map(
        ([precedeLetter, Letter]) => [new RegExp(`${precedeLetter}${Arabic.Sukun}\\s${Letter}[${Arabic.Shadda}]?`),
            precedeLetter + ' ' + Letter + Arabic.Shadda]
    );

const idghamMutaqaribainSameWordRules: Transliteration[] =
    idghamMutaqaribainConsonantRules.map(
        ([precedeLetter, Letter]) => [new RegExp(`${precedeLetter}${Arabic.Sukun}${Letter}`),
            precedeLetter + Letter]
    );
const idghamMutajanisainDifferentWordRules: Transliteration[] =
    idghamMutajanisainConsonantRules.flatMap<RegexTransliteration>(
        (groupLetter) => groupLetter.flatMap<RegexTransliteration>(
            ([letterFirst]) => groupLetter.filter(
                ([letterSecond]) => {
                    if (letterFirst === letterSecond) {
                        return false;
                    } else {
                        return true;
                    }
                }
            ).map<RegexTransliteration>(
                ([letterSecond]) => [new RegExp(`${letterFirst}${Arabic.Sukun}\\s${letterSecond}[${Arabic.Shadda}]?`),
                    letterFirst + ' ' + letterSecond + Arabic.Shadda]
            )
        )
    );

const idghamMutajanisainSameWordRules: Transliteration[] =
    idghamMutajanisainConsonantRules.flatMap<RegexTransliteration>(
        (groupLetter) => groupLetter.flatMap<RegexTransliteration>(
            ([letterFirst]) => groupLetter.filter(
                ([letterSecond]) => {
                    if (letterFirst === letterSecond) {
                        return false;
                    }
                    else {
                        return true;
                    }
                }
            ).map<RegexTransliteration>(
                ([letterSecond]) => [new RegExp(`${letterFirst}${Arabic.Sukun}${letterSecond}`),
                    letterFirst + letterSecond]
                
            )
        )
    );

// Dead Consonant Followed by Similar Sound End Rules
const groupIdghamDifferentWordRules: Transliteration[] =
    chainRule(
        idghamMutamatsilainDifferentWordRules,
        idghamMutaqaribainDifferentWordRules,
        idghamMutajanisainDifferentWordRules
    );

const groupIdghamSameWordRules: Transliteration[] =
    chainRule(
        idghamMutamatsilainSameWordRules,
        idghamMutaqaribainSameWordRules,
        idghamMutajanisainSameWordRules
    );

///// Latin to Pegon End Rules
const latinToArabScheme: Transliteration[] =
    prepareRules(chainRule(
        /// Step 1 Latin to Arabic ///

        // Alif waw ya first, overlap with long harakat
        groupAlifLamFrontSyllableRules,

        groupAlifWawYaAsConsonantRules,
        groupOSoundSyllableRules,

        groupHamzaRules,

        // high meem (^m) overlap wiht m,
        // so additional harakat more prioritize
        groupAdditionalHarakatOnlyRules,

        // Tanwin overlap with consonant nun (n- vs n)
        groupConsonantOnlyRules,
        groupHarakatOnlyRules,

        groupAlifWawYaOnlyRules,

        // If user typo input n- but not tanwin like n-an-
        groupNunConsonantDefaultRules,


        /// Step 2 Add Special Rule ///
        deleteSpaceAfterPrefixRules,
        changeOrderShadda,
        groupNunTanwinMimRules,

        groupIdghamDifferentWordRules,
        groupIdghamSameWordRules
    ));


//////////========== Arab to Latin : Step 1 ==========//////////

// Inverse Normal Consonant End Rules
// 1. All dead consonant default without . even if sukun is provided
// 2. Alif, Waw, Ya is optional about . or Sukun
const ginverseConsonantSyllableRules: PlainTransliteration[] =
    chainRule(
        asInverse(addSukun(exceptAlifWaYaConsonantRules)),
        asInverse(exceptAlifWaYaConsonantRules),
        asInverse(
            ruleProduct(alifWawYaConsonantRules, sukunRules)
        ),
        asInverse(alifWawYaConsonantRules),
        asInverse(additionalConsonantRule)
    );

// Inverse Harakat Start Rules
const inverseShortHarakatRules: PlainTransliteration[] =
    chainRule(
        asInverse(shortHarakatRules),
        asInverse(oSoundRules)
    );

const inverseTanwinHarakatRules: PlainTransliteration[] =
    chainRule(
        asInverse(tanwinHarakatRules)
    );

// For long harakat, only specified the alt part,
// on normal term, already covered by harakat short and consonant
const inverseLongHarakatRules: Transliteration[] = [
    [new RegExp(`(${Arabic.Fatha})?${Arabic.SuperscriptAlif}`), 'a^a'],
    [new RegExp(`(${Arabic.Fatha})?${Arabic.SubAlef}`), 'i^i'],
    [new RegExp(`(${Arabic.Kasra})?${Arabic.SmallYa}`), 'i^Y'],
    [new RegExp(`(${Arabic.Damma})?${Arabic.InvertedDhamma}`), 'u^u'],
    [new RegExp(`(${Arabic.Damma})?${Arabic.SmallWaw}`), 'u^W'],
];

// Sukun is a must actually, but we never know what our user type
const inverseDigraphHarakatRules: Transliteration[] = [
    [new RegExp(`${Arabic.Fatha}${Arabic.Ya}(${Arabic.Sukun})?`), 'ay'],
    [new RegExp(`${Arabic.Fatha}${Arabic.Waw}(${Arabic.Sukun})?`), 'aw'],
];

const ginverseAdditionalHarakatRules: PlainTransliteration[] =
    chainRule(
        asInverse(additionalHarakatRule)
    );

const vanishingAlifRules: PlainTransliteration[] = [
    [Arabic.Alif, ''],
];

// as word beginning cannot contain RegexTransliteration, so manual add beginning
const inverseLongHarakatBeginningRules: RegexTransliteration[] = [
    [new RegExp(`(^|[${wordDelimitingPatterns}])${Arabic.Alif}(${Arabic.Fatha})?${Arabic.SuperscriptAlif}`), `$1` + '^a'],
    [new RegExp(`(^|[${wordDelimitingPatterns}])${Arabic.Alif}(${Arabic.Fatha})?${Arabic.SubAlef}`), '^i'],
    [new RegExp(`(^|[${wordDelimitingPatterns}])${Arabic.Alif}(${Arabic.Kasra})?${Arabic.SmallYa}`), `$1` + 'i^Y'],
    [new RegExp(`(^|[${wordDelimitingPatterns}])${Arabic.Alif}(${Arabic.Damma})?${Arabic.InvertedDhamma}`), '^u'],
    [new RegExp(`(^|[${wordDelimitingPatterns}])${Arabic.Alif}(${Arabic.Damma})?${Arabic.SmallWaw}`), `$1` + 'u^W'],
];

const inverseHarakatBeginningRules: Transliteration[] =
    chainRule(
        inverseLongHarakatBeginningRules,
        asWordBeginning(
            ruleProduct(vanishingAlifRules, inverseShortHarakatRules)
        )
    );

const vanishingTatwilRules: PlainTransliteration[] = [
    [Arabic.Tatwil, ''],
];

// Inverse Harakat End Rules
const ginverseHarakatRules: Transliteration[] =
    chainRule(
        inverseHarakatBeginningRules,

        inverseTanwinHarakatRules,
        inverseDigraphHarakatRules,
        inverseLongHarakatRules,
        inverseShortHarakatRules,

        vanishingTatwilRules
    );

// Inverse Hamza Start Rules
const inverseHamzaRules: Transliteration[] = [
    [new RegExp(`${Arabic.Hamza}(${Arabic.Sukun})?`), '\`'],
    [new RegExp(`${Arabic.AlifWithHamzaAbove}(${Arabic.Sukun})?`), '\`'],
    [new RegExp(`${Arabic.AlifWithHamzaBelow}(${Arabic.Sukun})?`), '\`'],
    [new RegExp(`${Arabic.WawWithHamzaAbove}(${Arabic.Sukun})?`), '\`'],
    [new RegExp(`${Arabic.YaWithHamzaAbove}(${Arabic.Sukun})?`), '\`'],
];

// Common rules have . to sukun
// it disturbing the reverse
const inverseHamzaAboveAlifRules: PlainTransliteration[] =
    chainRule(
        addSukun(hamzaAboveAlifRules),
        hamzaAboveAlifRules
    );

const inverseHamzaAboveWawRules: PlainTransliteration[] =
    chainRule(
        addSukun(hamzaAboveWawRules),
        hamzaAboveWawRules
    );

const inverseHamzaAboveYaRules: PlainTransliteration[] =
    chainRule(
        addSukun(hamzaAboveYaRules),
        hamzaAboveYaRules
    );

const inverseHamzaAfterConnectedConstantWithFathaRules: PlainTransliteration[] =
    chainRule(
        asInverse(ruleProduct(connectedFathaSyllableRules, inverseHamzaAboveAlifRules)),
        asInverse(addLetterBeforeRules(inverseHamzaAboveAlifRules, Arabic.Fatha))
    )

const inverseHamzaAfterConnectedConstantWithDammaRules: PlainTransliteration[] =
    chainRule(
        asInverse(ruleProduct(connectedDammaSyllableRules, inverseHamzaAboveWawRules)),
        asInverse(addLetterBeforeRules(inverseHamzaAboveWawRules, Arabic.Damma))
    );

const inverseHamzaAfterConnectedConstantWithKasraRules: PlainTransliteration[] =
    chainRule(
        asInverse(ruleProduct(connectedKasraSylableRules, inverseHamzaAboveYaRules)),
        asInverse(addLetterBeforeRules(inverseHamzaAboveWawRules, Arabic.Kasra))
    );

// Inverse Hamza End Rules
// 1. For hamza after connected constant with specific harakat
//     --> use additional letter, e.g. `A, `w, `y
// 2. Else or if input not correct, use default e.g. ` only
const ginverseHamzaRules: Transliteration[] =
    chainRule(
        inverseHamzaAfterConnectedConstantWithFathaRules,
        inverseHamzaAfterConnectedConstantWithDammaRules,
        inverseHamzaAfterConnectedConstantWithKasraRules,
        inverseHamzaRules
    );

// Inverse Alif Lam Start Rules
const inverseAlifLamJalalahRules: RegexTransliteration[] = [
    [new RegExp(`${Arabic.Alif}(${Arabic.Fatha})?${Arabic.Lam}${Arabic.Lam}(${Arabic.Shadda})?${Arabic.SuperscriptAlif}${Arabic.Ha}`),
        'alla^ah'],
    [new RegExp(`${Arabic.Alif}(${Arabic.Fatha})?${Arabic.Lam}${Arabic.Lam}(${Arabic.Shadda})?(${Arabic.Fatha})?${Arabic.Ha}`),
        'allah'],
    [new RegExp(`${Arabic.AlifWasla}${Arabic.Lam}${Arabic.Lam}(${Arabic.Shadda})?${Arabic.SuperscriptAlif}${Arabic.Ha}`),
        '*alla^ah'],
    [new RegExp(`${Arabic.AlifWasla}${Arabic.Lam}${Arabic.Lam}(${Arabic.Shadda})?(${Arabic.Fatha})?${Arabic.Ha}`),
        '*allah'],
];

const inverseQomarConsonantRules: PlainTransliteration[] =
    chainRule(
        asInverse(qomarDigraphConsonantRules),
        asInverse(qomarMonographConsonantRules),
        asInverse(hamzaAboveAlifRules)
    );

const inverseSyamsiConsonantRules: PlainTransliteration[] =
    chainRule(
        asInverse(syamsiDigraphConsonantRules),
        asInverse(syamsiMonographConsonantRules)
    );

const inverseAlifLamQomarWithPrefixRules: RegexTransliteration[] =
    inverseQomarConsonantRules.flatMap<RegexTransliteration>(
        ([key, val]) => asInverse(prefixSyllableRules).map<RegexTransliteration>(
            ([arabicPrefix, latinPrefix]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${arabicPrefix}${Arabic.Alif}(?:${Arabic.Fatha})?${Arabic.Lam}(?:${Arabic.Sukun})?${key}`),
                `$1` + latinPrefix + 'al-' + val]
        )
    );

const inverseAlifWaslaLamQomarWithPrefixRules: RegexTransliteration[] =
    inverseQomarConsonantRules.flatMap<RegexTransliteration>(
        ([key, val]) => asInverse(prefixSyllableRules).map<RegexTransliteration>(
            ([arabicPrefix, latinPrefix]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${arabicPrefix}${Arabic.AlifWasla}${Arabic.Lam}(?:${Arabic.Sukun})?${key}`),
                `$1` + latinPrefix + '*al-' + val]
        )
    );

const inverseAlifLamQomarWithoutPrefixRules: RegexTransliteration[] =
    inverseQomarConsonantRules.map(
        ([key, val]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${Arabic.Alif}(?:${Arabic.Fatha})?${Arabic.Lam}(?:${Arabic.Sukun})?${key}`),
            `$1` + 'al-' + val]
    );

const inverseAlifWaslaLamQomarWithoutPrefixRules: RegexTransliteration[] =
    inverseQomarConsonantRules.map(
        ([key, val]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${Arabic.AlifWasla}${Arabic.Lam}(?:${Arabic.Sukun})?${key}`),
            `$1` + '*al-' + val]
    );

const inverseAlifLamSyamsiWithPrefixRules: RegexTransliteration[] =
    inverseSyamsiConsonantRules.flatMap<RegexTransliteration>(
        ([key, val]) => asInverse(prefixSyllableRules).map<RegexTransliteration>(
            ([arabicPrefix, latinPrefix]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${arabicPrefix}${Arabic.Alif}(?:${Arabic.Fatha})?${Arabic.Lam}${key}(?:${Arabic.Shadda})?`),
                `$1` + latinPrefix + 'al-' + val + val]
        )
    );

const inverseAlifWaslaLamSyamsiWithPrefixRules: RegexTransliteration[] =
    inverseSyamsiConsonantRules.flatMap<RegexTransliteration>(
        ([key, val]) => asInverse(prefixSyllableRules).map<RegexTransliteration>(
            ([arabicPrefix, latinPrefix]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${arabicPrefix}${Arabic.AlifWasla}${Arabic.Lam}${key}(?:${Arabic.Shadda})?`),
                `$1` + latinPrefix + '*al-' + val + val]
        )
    );

const inverseAlifLamSyamsiWithoutPrefixRules: RegexTransliteration[] =
    inverseSyamsiConsonantRules.map(
        ([key, val]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${Arabic.Alif}(?:${Arabic.Fatha})?${Arabic.Lam}${key}(?:${Arabic.Shadda})?`),
            `$1` + 'al-' + val + val]
    );

const inverseAlifWaslaLamSyamsiWithoutPrefixRules: RegexTransliteration[] =
    inverseSyamsiConsonantRules.map(
        ([key, val]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${Arabic.AlifWasla}${Arabic.Lam}${key}(?:${Arabic.Shadda})?`),
            `$1` + '*al-' + val + val]
    );

const inverseShaddaRules: PlainTransliteration[] =
    asInverse(allConsonantRules).map(
        ([key, val]) => [key + Arabic.Shadda, val + val]
    );

const ginverseAlifLamRules: RegexTransliteration[] =
    chainRule(
        inverseAlifLamJalalahRules,
        inverseAlifLamQomarWithPrefixRules,
        inverseAlifLamSyamsiWithPrefixRules,
        inverseAlifLamQomarWithoutPrefixRules,
        inverseAlifLamSyamsiWithoutPrefixRules,

        inverseAlifWaslaLamQomarWithPrefixRules,
        inverseAlifWaslaLamSyamsiWithPrefixRules,
        inverseAlifWaslaLamQomarWithoutPrefixRules,
        inverseAlifWaslaLamSyamsiWithoutPrefixRules
    );

const ginverseShaddaRules: PlainTransliteration[] =
    chainRule(
        inverseShaddaRules
    );

//////////========== Arab To Latin : Step 2 ==========//////////

////////// Util Section //////////

const changeSukunAltToSukun: PlainTransliteration[] = [
    [Arabic.SukunAlt, Arabic.Sukun],
];

////////// Special Rule Section //////////

    // different or same word applied
// delete shadda if
const inverseNunMeetSixRules: Transliteration[] =
    mimNunWawYaLamRa.map(
        ([letter]) => [new RegExp(`${Arabic.Nun}(?:${Arabic.Sukun})?(\\s)?${letter}${Arabic.Shadda}`),
            Arabic.Nun + Arabic.Sukun + `$1` + letter]
    );

    // different or same word applied
// delete high mim if
const inverseNunMeetBa: Transliteration[] = [
    [new RegExp(`${Arabic.Nun}(?:${Arabic.Sukun})?${Arabic.SmallHighMim}(\\s)?${Arabic.Ba}`),
        Arabic.Nun + Arabic.Sukun + `$1` + Arabic.Ba],
];

// delete Shadda if
const inverseTanwinMeetSixRules: Transliteration[] =
    tanwinHarakatRules.flatMap<RegexTransliteration>(
        ([key, val]) => mimNunWawYaLamRa.map<RegexTransliteration>(
            ([letter]) => [new RegExp(`${val}\\s${letter}${Arabic.Shadda}`), val + ' ' + letter]
        )
    );

// delete high mim if
const inverseTanwinMeetBa: Transliteration[] =
    tanwinHarakatRules.map(
        ([key, val]) => [val + Arabic.SmallHighMim + ' ' + Arabic.Ba, val + ' ' + Arabic.Ba]
    );

    // different or same word applied
// delete shadda if
const inverseMimMeetMim: Transliteration[] = [
    [new RegExp(`${Arabic.Mim}(?:${Arabic.Sukun})?(\\s)?${Arabic.Mim}${Arabic.Shadda}`),
        Arabic.Mim + Arabic.Sukun + `$1` + Arabic.Mim],
];

// Inverse Nun Tanwin Mim End Rules
const ginverseNunTanwinMimRules: Transliteration[] =
    chainRule(
        inverseNunMeetSixRules,
        inverseTanwinMeetSixRules,
        inverseNunMeetBa,
        inverseTanwinMeetBa,
        inverseMimMeetMim
    );

// Inverse Dead Consonant Followed by Similar Sound Start Rule
const inverseIdghamMutamatsilainRules: Transliteration[] =
    exceptAlifWaYaConsonantRules.filter(
        ([latinKey, arabicVal]) => arabicVal !== Arabic.Mim
    ).map(
        ([latinKey, arabicVal]) => [new RegExp(`${arabicVal}(${Arabic.Sukun})?(\\s)?${arabicVal}(${Arabic.Shadda})?`),
            arabicVal + `$1` + `$2` + arabicVal]
    );

const inverseIdghamMutaqaribainRules: Transliteration[] =
    idghamMutaqaribainConsonantRules.map(
        ([precedeLetter, Letter]) => [new RegExp(`${precedeLetter}(${Arabic.Sukun})?(\\s)?${Letter}(${Arabic.Shadda})?`),
            precedeLetter + `$1` + `$2` + Letter]
    );

const inverseIdghamMutajanisainRules: Transliteration[] =
    idghamMutajanisainConsonantRules.flatMap<RegexTransliteration>(
        (groupLetter) => groupLetter.flatMap<RegexTransliteration>(
            ([letterFirst]) => groupLetter.filter(
                ([letterSecond]) => {
                    if (letterFirst === letterSecond) {
                        return false;
                    } else {
                        return true;
                    }
                }
            ).map<RegexTransliteration>(
                ([letterSecond]) => [new RegExp(`${letterFirst}(${Arabic.Sukun})?(\\s)?${letterSecond}(${Arabic.Shadda})?`),
                    letterFirst + `$1` + `$2` + letterSecond]
            )
        )
    );

// Dead Consonant Followed by Similar Sound End Rules
const ginverseIdghamRules: Transliteration[] =
    chainRule(
        inverseIdghamMutamatsilainRules,
        inverseIdghamMutaqaribainRules,
        inverseIdghamMutajanisainRules
    );

///// Latin to Pegon End Rules
const arabToLatinScheme: Transliteration[] = 
prepareRules(chainRule(
    /// Step 2 Arabic to Latin : Special Rule ///
    changeOrderShadda,
    changeSukunAltToSukun,

    ginverseNunTanwinMimRules,
    ginverseIdghamRules,
    
    /// Step 1 Arabic to Latin : Consonant & Harakat ///
    ginverseAlifLamRules,
    ginverseShaddaRules,
    ginverseHamzaRules,

    // Default Rules
    ginverseHarakatRules,
    ginverseConsonantSyllableRules,
    // additional last, because sukun
    ginverseAdditionalHarakatRules,
));

//////////========== Arab To Pelafalan : Step 1 ==========//////////

////////// Simple Rule Section //////////

// Standard Harakat Start Rules
const standardSukunRules: PlainTransliteration[] = [
    ['.', ''],
];

const standardOSoundRules: PlainTransliteration[] = [
    ['o', 'a'],
];

const standardTanwinHarakatRules: PlainTransliteration[] = [
    ['an-', 'an'],
    ['an_', 'an'],

    ['un-', 'un'],
    ['un_', 'un'],

    ['in-', 'in'],
    ['in_', 'in'],
];

const standardLongHarakatRules: PlainTransliteration[] = [
    // Fatha
    ['aA', 'ā'],
    ['a^a', 'ā'],
    ['^a', 'ā'],
    ['aY', 'ā'],
    ['aa', 'ā'],

    // Kasra
    ['iY', 'ī'],
    ['i^Y', 'ī'],
    ['^Y', 'ī'],
    ['i^i', 'ī'],
    ['^i', 'ī'],
    ['ii', 'ī'],

    // Damma
    ['u^W', 'ū'],
    ['^W', 'ū'],
    ['u^u', 'ū'],
    ['^u', 'ū'],
    ['uu', 'ū'],
];

// Is y a consonant or as a part of long harakat?
const standardLongHarakatAmbiguousRules: Transliteration[] = [
    [new RegExp(`iy($|[^aiuy])`), 'ī' + `$1`],
    [new RegExp(`uw($|[^aiuw])`), 'ū' + `$1`],
];

const standardDigraphHarakatRules: Transliteration[] = [
    // ai
    [new RegExp(`ay($|[^aiuy])`), 'ai' + `$1`],

    // au
    [new RegExp(`aw($|[^aiuw])`), 'au' + `$1`],
];

// Standard Harakat and Consonant End Rules
const gstandardHarakatRules: Transliteration[] =
    chainRule(
        standardDigraphHarakatRules,
        standardTanwinHarakatRules,
        standardLongHarakatAmbiguousRules,
        standardLongHarakatRules,
        standardOSoundRules,
        standardSukunRules
    );

// Standard Consonant Start Rules
const standardConsonantRules: PlainTransliteration[] = [
    // Connected
    ['t_s', 'ṡ'],
    ['h_h', 'ḥ'],
    ['k_h', 'kh'],
    ['s_y', 'sy'],
    ['s_h', 'ṣ'],
    ['d_l', 'ḍ'],
    ['t_t', 'ṭ'],
    ['z_h', 'ẓ'],
    ['g_h', 'g'],

    // Not Connected
    ['d_z', 'ẑ'],

    // Ta Marbuta
    ['t-', 't'],
    ['h-', 't'],
];

const standardAlifWawYaConsonantRules: PlainTransliteration[] = [
    ['A', 'a'],
    ['W', 'w'],
    ['Y', 'y'],
]

// Ta Marbuta
const standardTaMarbutaEndingRules: PlainTransliteration[] = [
    ['t-', 'h'],
    ['h-', 'h']
];

const standardQomarMonographConsonantRules: PlainTransliteration[] = [
    ['`', '`'],
    ['A', 'a'],
    ['b', 'b'],
    ['j', 'j'],
    ['\'', '\''],
    ['f', 'f'],
    ['q', 'q'],
    ['k', 'k'],
    ['m', 'm'],
    ['w', 'w'],
    ['h', 'h'],
    ['y', 'y'],
    ['Y', 'y'],
]

const standardQomarDigraphConsonantRules: PlainTransliteration[] = [
    ['h_h', 'ḥ'],
    ['k_h', 'kh'],
    ['g_h', 'g'],
];

const standardSyamsiMonographConsonantRules: PlainTransliteration[] = [
    ['t', 't'],
    ['d', 'd'],
    ['r', 'r'],
    ['z', 'z'],
    ['s', 's'],
    ['l', 'l'],
    ['n', 'n'],
];

const standardSyamsiDigraphConsonantRules: PlainTransliteration[] = [
    ['t_s', 'ṡ'],
    ['d_z', 'ẑ'],
    ['s_y', 'sy'],
    ['s_h', 'ṣ'],
    ['d_l', 'ḍ'],
    ['t_t', 'ṭ'],
    ['z_h', 'ẓ'],
];

const gstandardConsonantRules: Transliteration[] =
    chainRule(
        standardConsonantRules
    );

const gstandardAlifWawYaConsonantRules: Transliteration[] =
    chainRule(
        standardAlifWawYaConsonantRules
    );

const gstandardTaMarbutaEndingRules: Transliteration[] =
    chainRule(
        asWordEnding(standardTaMarbutaEndingRules)
    );

// Standard Hamza Start Rules
const standardHamzaBeginningRules: PlainTransliteration[] = [
    ['`a', 'a'],
    ['`u', 'u'],
    ['`i', 'i'],
];

const standardHamzaAfterSpecialHarakatRules: Transliteration[] = [
    ['u`w', 'u`'],
    ['i`y', 'i`'],
];

// Standard Hamza End Rules
const gstandardHamzaRules: Transliteration[] =
    chainRule(
        asWordBeginning(standardHamzaBeginningRules),
        standardHamzaAfterSpecialHarakatRules
    )

// Standard Alif Lam Start Rules

// Alif Lam Jalalah
const standardAlifLamJalalahWithoutPrefixBeginningRules: RegexTransliteration[] = [
    [new RegExp(`(^|[${wordDelimitingPatterns}])(?:\\*)?al(?:-)?l(a|\\^a|a\\^a)h(?!_h)`), `$1` + 'allah'],
];

const standardAlifLamJalalahWithoutPrefixContinueRules: RegexTransliteration[] = [
    [new RegExp(`([aiu])\\s(?:\\*)?all(a|\\^a|a\\^a)h(?!_h)`), `$1` + 'llah']
];

const standardAlifLamJalalahWithPrefixRules: RegexTransliteration[] =
    prefixSyllableRules.map<RegexTransliteration>(
        ([latinPrefix, arabPrefix]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${latinPrefix}(?:\\*)?all(a|\\^a|a\\^a)h(?!_h)`),
        `$1` + 'llah']
    );

// Combination [Qomar, Syamsi][Digraph, Monograph][With, Without][Beginning, Continue]
// Qomar
const standardAlifLamQomarDigraphWithoutPrefixBeginningRules: RegexTransliteration[] =
    alifLamRules.flatMap<RegexTransliteration>(
        ([latinKeyAl, ArabicValAl]) => standardQomarDigraphConsonantRules.map<RegexTransliteration>(
            ([latinKeyQomar, latinValQomar]) => [new RegExp(`(^|[${wordDelimitingPatterns}])(?:\\*)?${latinKeyAl}${latinKeyQomar}`),
                `$1` + 'al-' + latinValQomar]
        )
    );

const standardAlifLamQomarDigraphWithoutPrefixContinueRules: RegexTransliteration[] =
    alifLamRules.flatMap<RegexTransliteration>(
        ([latinKeyAl, ArabicValAl]) => standardQomarDigraphConsonantRules.map<RegexTransliteration>(
            ([latinKeyQomar, latinValQomar]) => [new RegExp(`([aiu])\\s(?:\\*)?${latinKeyAl}${latinKeyQomar}`),
                `$1` + 'l-' + latinValQomar]
        )
    );

const standardAlifLamQomarDigraphWithPrefixRules: RegexTransliteration[] =
    alifLamRules.flatMap<RegexTransliteration>(
        ([latinKeyAl, ArabicValAl]) => standardQomarDigraphConsonantRules.flatMap<RegexTransliteration>(
            ([latinKeyQomar, latinValQomar]) => prefixSyllableRules.map<RegexTransliteration>(
                ([latinPrefix, arabPrefix]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${latinPrefix}(?:\\*)?${latinKeyAl}${latinKeyQomar}`),
                `$1` + 'l-' + latinValQomar]
            )
        )
    );

const standardAlifLamQomarMonographWithoutPrefixBeginningRules: RegexTransliteration[] =
    alifLamRules.flatMap<RegexTransliteration>(
        ([latinKeyAl, ArabicValAl]) => standardQomarMonographConsonantRules.map<RegexTransliteration>(
            ([latinKeyQomar, latinValQomar]) => [new RegExp(`(^|[${wordDelimitingPatterns}])(?:\\*)?${latinKeyAl}${latinKeyQomar}`),
                `$1` + 'al-' + latinValQomar]
        )
    );

const standardAlifLamQomarMonographWithoutPrefixContinueRules: RegexTransliteration[] =
    alifLamRules.flatMap<RegexTransliteration>(
        ([latinKeyAl, ArabicValAl]) => standardQomarMonographConsonantRules.map<RegexTransliteration>(
            ([latinKeyQomar, latinValQomar]) => [new RegExp(`([aiu])\\s(?:\\*)?${latinKeyAl}${latinKeyQomar}`),
                `$1` + 'l-' + latinValQomar]
        )
    );

const standardAlifLamQomarMonographWithPrefixRules: RegexTransliteration[] =
    alifLamRules.flatMap<RegexTransliteration>(
        ([latinKeyAl, ArabicValAl]) => standardQomarMonographConsonantRules.flatMap<RegexTransliteration>(
            ([latinKeyQomar, latinValQomar]) => prefixSyllableRules.map<RegexTransliteration>(
                ([latinPrefix, arabPrefix]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${latinPrefix}(?:\\*)?${latinKeyAl}${latinKeyQomar}`),
                `$1` + 'l-' + latinValQomar]
            )
        )
    );

// Syamsi
const standardAlifLamSyamsiDigraphWithoutPrefixBeginningRules: RegexTransliteration[] =
    alifLamRules.flatMap<RegexTransliteration>(
        ([latinKeyAl, ArabicValAl]) => standardSyamsiDigraphConsonantRules.map<RegexTransliteration>(
            ([latinKeySyamsi, latinValSyamsi]) => [new RegExp(`(^|[${wordDelimitingPatterns}])(?:\\*)?${latinKeyAl}${latinKeySyamsi}(?:${latinKeySyamsi})?`),
                `$1` + 'a' + latinValSyamsi + '-' + latinValSyamsi]
        )
    );

const standardAlifLamSyamsiDigraphWithoutPrefixContinueRules: RegexTransliteration[] =
    alifLamRules.flatMap<RegexTransliteration>(
        ([latinKeyAl, ArabicValAl]) => standardSyamsiDigraphConsonantRules.map<RegexTransliteration>(
            ([latinKeySyamsi, latinValSyamsi]) => [new RegExp(`([aiu])\\s(?:\\*)?${latinKeyAl}${latinKeySyamsi}(?:${latinKeySyamsi})?`),
                `$1` + latinValSyamsi + '-' + latinValSyamsi]
        )
    );

const standardAlifLamSyamsiDigraphWithPrefixRules: RegexTransliteration[] =
    alifLamRules.flatMap<RegexTransliteration>(
        ([latinKeyAl, ArabicValAl]) => standardSyamsiDigraphConsonantRules.flatMap<RegexTransliteration>(
            ([latinKeySyamsi, latinValSyamsi]) => prefixSyllableRules.map<RegexTransliteration>(
                ([latinPrefix, arabPrefix]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${latinPrefix}(?:\\*)?${latinKeyAl}${latinKeySyamsi}(?:${latinKeySyamsi})?`),
                `$1` + latinValSyamsi + '-' + latinValSyamsi]
            )
        )
    );

const standardAlifLamSyamsiMonographWithoutPrefixBeginningRules: RegexTransliteration[] =
    alifLamRules.flatMap<RegexTransliteration>(
        ([latinKeyAl, ArabicValAl]) => standardSyamsiMonographConsonantRules.map<RegexTransliteration>(
            ([latinKeySyamsi, latinValSyamsi]) => [new RegExp(`(^|[${wordDelimitingPatterns}])(?:\\*)?${latinKeyAl}${latinKeySyamsi}(?:${latinKeySyamsi})?`),
                `$1` + 'a' + latinValSyamsi + '-' + latinValSyamsi]
        )
    );

const standardAlifLamSyamsiMonographWithoutPrefixContinueRules: RegexTransliteration[] =
    alifLamRules.flatMap<RegexTransliteration>(
        ([latinKeyAl, ArabicValAl]) => standardSyamsiMonographConsonantRules.map<RegexTransliteration>(
            ([latinKeySyamsi, latinValSyamsi]) => [new RegExp(`([aiu])\\s(?:\\*)?${latinKeyAl}${latinKeySyamsi}(?:${latinKeySyamsi})?`),
                `$1` + latinValSyamsi + '-' + latinValSyamsi]
        )
    );

const standardAlifLamSyamsiMonographWithPrefixRules: RegexTransliteration[] =
    alifLamRules.flatMap<RegexTransliteration>(
        ([latinKeyAl, ArabicValAl]) => standardSyamsiMonographConsonantRules.flatMap<RegexTransliteration>(
            ([latinKeySyamsi, latinValSyamsi]) => prefixSyllableRules.map<RegexTransliteration>(
                ([latinPrefix, arabPrefix]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${latinPrefix}(?:\\*)?${latinKeyAl}${latinKeySyamsi}(?:${latinKeySyamsi})?`),
                `$1` + latinValSyamsi + '-' + latinValSyamsi]
            )
        )
    );

// Standard Alif Lam End Rules
const gstandardAlifLamRules: Transliteration[] =
    prepareRules(chainRule(
        // WithoutPrefixBeginning last, because it overlap with rules before,
        standardAlifLamJalalahWithPrefixRules,
        standardAlifLamJalalahWithoutPrefixContinueRules,
        
        standardAlifLamQomarDigraphWithPrefixRules,
        standardAlifLamQomarDigraphWithoutPrefixContinueRules,
        standardAlifLamQomarDigraphWithoutPrefixBeginningRules,
        
        standardAlifLamSyamsiDigraphWithPrefixRules,
        standardAlifLamSyamsiDigraphWithoutPrefixContinueRules,
        standardAlifLamSyamsiDigraphWithoutPrefixBeginningRules,
        
        standardAlifLamQomarMonographWithPrefixRules,
        standardAlifLamQomarMonographWithoutPrefixContinueRules,
        standardAlifLamQomarMonographWithoutPrefixBeginningRules,
        
        standardAlifLamSyamsiMonographWithPrefixRules,
        standardAlifLamSyamsiMonographWithoutPrefixContinueRules,
        standardAlifLamSyamsiMonographWithoutPrefixBeginningRules,

        // Overlap with lam qomar
        standardAlifLamJalalahWithoutPrefixBeginningRules
    ));

//////////========== Arab To Pelafalan : Step 2 ==========//////////

////////// Util Section //////////
const gstandardDeleteAlifEndingRule: RegexTransliteration[] = [
    [new RegExp(`A($|[${wordDelimitingPatterns}])`), `$1`]
];

////////// Special Rule Section //////////

// Standard Nun Tanwin Mim Start Rules
const standardMimNunWawYaLamRa = ['m', 'n', 'w', 'y', 'l', 'r'];

const standardNMeetSixRules: RegexTransliteration[] =
    standardMimNunWawYaLamRa.map(
        ([letter]) => [new RegExp(`n\\s${letter}(?:${letter})?`), letter + ' ' + letter]
    );

const standardNMeetBa: RegexTransliteration[] = [
    [new RegExp(`n\\sb`), 'm' + ' ' + 'b']
];

const standardMimMeetMim: RegexTransliteration[] = [
    [new RegExp(`m\\sm(?:m)?`), 'm m']
];

// Standard Nun Tanwin Mim End Rules
const gstandardNunTanwinMimRules: Transliteration[] =
    chainRule(
        standardNMeetSixRules,
        standardNMeetBa,
        standardMimMeetMim
    );

// Standard Idgham Start Rules
const standardIdghamMutaqaribainConsonantRules = [
    ['l', 'r'],
    ['q', 'k'],
];

const standardIdghamMutajanisainConsonantRules = [
    ['t', 'd', 'ṭ'],
    ['ṡ', 'ẑ', 'ẓ'],
    ['b', 'm'],
];

// Mutamatsilain do nothing in standard latin

const standardIdghamMutaqaribainDifferentWordRules: RegexTransliteration[] =
    standardIdghamMutaqaribainConsonantRules.map(
        ([precedeLetter, letter]) => [new RegExp(`${precedeLetter}\\s${letter}`), letter + ' ' + letter]
    );

const standardIdghamMutaqaribainSameWordRules: RegexTransliteration[] =
    standardIdghamMutaqaribainConsonantRules.map(
        ([precedeLetter, letter]) => [new RegExp(`${precedeLetter}${letter}`), letter]
    );

const standardIdghamMutajanisainDifferentWordRules: RegexTransliteration[] =
    standardIdghamMutajanisainConsonantRules.flatMap<RegexTransliteration>(
        (groupLetter) => groupLetter.flatMap<RegexTransliteration>(
            ([letterFirst]) => groupLetter.filter(
                ([letterSecond]) => {
                    if (letterFirst === letterSecond) {
                        return false;
                    } else {
                        return true;
                    }
                }
            ).map<RegexTransliteration>(
                ([letterSecond]) => [new RegExp(`${letterFirst}\\s${letterSecond}`),
                    letterSecond + ' ' + letterSecond]
            )
        )
    );

const standardIdghamMutajanisainSameWordRules: RegexTransliteration[] =
    standardIdghamMutajanisainConsonantRules.flatMap<RegexTransliteration>(
        (groupLetter) => groupLetter.flatMap<RegexTransliteration>(
            ([letterFirst]) => groupLetter.filter(
                ([letterSecond]) => {
                    if (letterFirst === letterSecond) {
                        return false;
                    } else {
                        return true;
                    }
                }
            ).map<RegexTransliteration>(
                ([letterSecond]) => [new RegExp(`${letterFirst}${letterSecond}`),
                    letterSecond]
            )
        )
    );

// Standard Idgham Start Rules
const gstandardIdghamRules: Transliteration[] =
    chainRule(
        standardIdghamMutaqaribainDifferentWordRules,
        standardIdghamMutajanisainDifferentWordRules,

        standardIdghamMutaqaribainSameWordRules,
        standardIdghamMutajanisainSameWordRules
    );

///// Latin to Pegon End Rules
const arabToStandardLatinScheme: Transliteration[] = 
prepareRules(chainRule(
    /// Step 1 Arabic to Latin : Normal, Hamza, and AlifLam ///
    // Harakat first, need to eliminate some additional rule like ^a
    gstandardHarakatRules,

    gstandardAlifLamRules,
    gstandardHamzaRules,

    // Default Rules
    gstandardTaMarbutaEndingRules,
    gstandardConsonantRules,

    /// Step 2 Arabic to Latin : Special Rule ///
    gstandardDeleteAlifEndingRule,
    
    // additional last, because Alif Waw Ya can become harakat
    gstandardAlifWawYaConsonantRules,

    // Idgham first, m meet b overlap
    gstandardIdghamRules,
    gstandardNunTanwinMimRules,
    
));

export const transliterateLatinToArab = (latinString: string): string => {
    return transliterate(latinString, latinToArabScheme);
}

// To-Do : Insert some Arab function or rules here
export const transliterateArabToLatin = (arabString: string): string => {
    return transliterate(arabString, arabToLatinScheme);
}

// To-Do : Insert some Arab function or rules here
export const transliterateLatinArabToStandardLatin = (latinArabString: string): string => {
    return transliterate(latinArabString, arabToStandardLatinScheme);
}