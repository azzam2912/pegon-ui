import { asWordEnding } from "../core";
import { prepareRules, chainRule, ruleProduct, transliterate,
    asWordBeginning, asInverse, wordDelimitingPatterns } from "../core"
import type { PlainRule, RegexRule, Rule } from "../core";

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

const prefixLevel1Rules: PlainRule[] = [
    ['wa', Arabic.Waw + Arabic.Fatha],
    ['fa', Arabic.Fa + Arabic.Fatha],
];

const prefixLevel2Rules: PlainRule[] = [
    ['li', Arabic.Lam + Arabic.Kasra],
    ['bi', Arabic.Ba + Arabic.Kasra],
    ['ka', Arabic.Kaf + Arabic.Fatha],
    ['sa', Arabic.Sin + Arabic.Fatha],
];

// Prefix Level 3 Rules
const alifLamRules: PlainRule[] = [
    ['al-', Arabic.Alif + Arabic.Lam],
    ['al', Arabic.Alif + Arabic.Lam],
];

////////// Simple Rule Section //////////

// Harakat Rules
const sukunRules: PlainRule[] = [
    ['.', Arabic.Sukun]
];

const fathaSoundRules: PlainRule[] = [
    ['a', Arabic.Fatha]
];

const dammaSoundRules: PlainRule[] = [
    ['u', Arabic.Damma]
];

const kasraSoundRules: PlainRule[] = [
    ['i', Arabic.Kasra]
];

const oSoundRules: PlainRule[] = [
    ['o', Arabic.Fatha]
];

const shortHarakatRules: PlainRule[] =
    chainRule(
        fathaSoundRules,
        dammaSoundRules,
        kasraSoundRules
    );

const tanwinHarakatRules: PlainRule[] = [
    ['an-', Arabic.Fathatan],
    ['an_', Arabic.OpenFathatan],

    ['un-', Arabic.Dhammatan],
    ['un_', Arabic.OpenDhammatan],

    ['in-', Arabic.Kasratan],
    ['in_', Arabic.OpenKasratan],
];

const longFathaHarakatRules: PlainRule[] = [
    // Fatha
    ['aA', Arabic.Fatha + Arabic.Alif],
    ['a^a', Arabic.SuperscriptAlif],
    ['^a', Arabic.SuperscriptAlif],
    ['aY', Arabic.Fatha + Arabic.AlefMaksura],

    // Additional Fatha, delete if needed
    ['aa', Arabic.Fatha + Arabic.Alif],
];

const longHarakatRules: PlainRule[] = [
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

const digraphHarakatRules: PlainRule[] = [
    //ai
    ['ay', Arabic.Fatha + Arabic.Ya + Arabic.Sukun],
    ['ai', Arabic.Fatha + Arabic.Ya + Arabic.Sukun],

    //au
    ['aw', Arabic.Fatha + Arabic.Waw + Arabic.Sukun],
    ['au', Arabic.Fatha + Arabic.Waw + Arabic.Sukun],
];

const additionalHarakatRule: PlainRule[] = [
    ['^m', Arabic.SmallHighMim],
];

// Consonant Rules
const connectedMonographConsonantRules: PlainRule[] = [
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

const connectedDigraphConsonantRules: PlainRule[] = [
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

const notConnectedMonographConsonantRules: PlainRule[] = [
    ['A', Arabic.Alif],
    ['d', Arabic.Dal],
    ['r', Arabic.Ra],
    ['z', Arabic.Zain],
    ['w', Arabic.Waw],
];

const notConnectedDigraphConsonantRules: PlainRule[] =[
    ['d_z', Arabic.Dzal],
];

const taMarbutaRules: PlainRule[] = [
    ['t-', Arabic.TaMarbuta],
    ['h-', Arabic.TaMarbuta],
];

const oSoundConsonantRules: PlainRule[] = [
    ['r', Arabic.Ra],
    ['k_h', Arabic.Kho],
    ['s_h', Arabic.Shod],
    ['d_l', Arabic.Dhod],
    ['t_t', Arabic.Tha],
    ['z_h', Arabic.Zha],
    ['g_h', Arabic.Ghain],
    ['q', Arabic.Qaf],
];

const allConsonantRules: PlainRule[] =
    chainRule(
        connectedDigraphConsonantRules,
        notConnectedDigraphConsonantRules,
        taMarbutaRules,
        connectedMonographConsonantRules,
        notConnectedMonographConsonantRules,
    );


const alifWawYaConsonantRules: PlainRule[] = [
    ['A', Arabic.Alif],
    ['w', Arabic.Waw],
    ['y', Arabic.Ya],
    ['Y', Arabic.AlefMaksura],
];

const exceptAlifWaYaConsonantFunction = (): PlainRule[] => {
    let consonant: PlainRule[] = allConsonantRules;

    let consonantWithoutAlifWaYa = consonant.filter(x => {
        for (let i = 0; i < alifWawYaConsonantRules.length; i++) {
            if (alifWawYaConsonantRules[i][0] === x[0] && alifWawYaConsonantRules[i][1] === x[1])
                return false;
        }
        return true;
    });
    return consonantWithoutAlifWaYa;
};

const exceptAlifWaYaConsonantRules: PlainRule[] = exceptAlifWaYaConsonantFunction();

const qomarMonographConsonantRules: PlainRule[] = [
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

const qomarDigraphConsonantRules: PlainRule[] = [
    ['h_h', Arabic.Hah],
    ['k_h', Arabic.Kho],
    ['g_h', Arabic.Ghain],
];

const syamsiMonographConsonantRules: PlainRule[] = [
    ['t', Arabic.Ta],
    ['d', Arabic.Dal],
    ['r', Arabic.Ra],
    ['z', Arabic.Zain],
    ['s', Arabic.Sin],
    ['l', Arabic.Lam],
    ['n', Arabic.Nun],
];

const syamsiDigraphConsonantRules: PlainRule[] = [
    ['t_s', Arabic.Tsa],
    ['d_z', Arabic.Dzal],
    ['s_y', Arabic.Syin],
    ['s_h', Arabic.Shod],
    ['d_l', Arabic.Dhod],
    ['t_t', Arabic.Tha],
    ['z_h', Arabic.Zha],
];

const qomarOSoundConsonantRules: PlainRule[] = [
    ['k_h', Arabic.Kho],
    ['g_h', Arabic.Ghain],
    ['q', Arabic.Qaf],
];

const syamsiOSoundConsonantRules: PlainRule[] = [
    ['r', Arabic.Ra],
    ['s_h', Arabic.Shod],
    ['d_l', Arabic.Dhod],
    ['t_t', Arabic.Tha],
    ['z_h', Arabic.Zha],
];

////////// Hamza Code Section //////////

const hamzaAloneRules: PlainRule[] = [
    ['`', Arabic.Hamza],
];

const hamzaBeginningRules: PlainRule[] = [
    ['`a', Arabic.AlifWithHamzaAbove + Arabic.Fatha],
    ['`u', Arabic.AlifWithHamzaAbove + Arabic.Damma],
    ['`i', Arabic.AlifWithHamzaBelow + Arabic.Kasra],
];

const hamzaAboveAlifRules: PlainRule[] = [
    ['`', Arabic.AlifWithHamzaAbove],
];

const hamzaAboveWawRules: PlainRule[] = [
    ['`w', Arabic.WawWithHamzaAbove],
    ['`', Arabic.WawWithHamzaAbove],
];

const hamzaAboveYaRules: PlainRule[] = [
    ['`y', Arabic.YaWithHamzaAbove],
    ['`', Arabic.YaWithHamzaAbove],
];

const additionalConsonantRule: PlainRule[] = [
    ['^A', Arabic.AlifWithMaddaAbove],
    ['\*', Arabic.AlifWasla],
];

////////// Util Section //////////

const prefixSyllableRules: PlainRule[] =
    chainRule(
        ruleProduct(prefixLevel1Rules, prefixLevel2Rules),
        prefixLevel1Rules,
        prefixLevel2Rules
    );

const addUntilPrefix2Rules = (rules: PlainRule[]): PlainRule[] => {
    return chainRule(
        ruleProduct(prefixSyllableRules, rules),
        rules
    )
};

const addLetterBeforeRules = (rules: PlainRule[], latin: string): PlainRule[] =>
    rules.map(([key, val]) => [latin.concat(key), latin.concat(val)]);

const addAlif = (rules: PlainRule[]): PlainRule[] =>
    rules.map(([key, val]) => [key, Arabic.Alif.concat(val)]);

const addTatwil = (rules: PlainRule[]): PlainRule[] =>
    rules.map(([key, val]) => [key, Arabic.Tatwil.concat(val)]);

const addSukun = (rules: PlainRule[]): PlainRule[] =>
    rules.map(([key, val]) => [key, val.concat(Arabic.Sukun)]);

////////// Rule Section //////////

const harakatBeginningRules: Rule[] =
    chainRule(
        asWordBeginning(addAlif(tanwinHarakatRules)),
        asWordBeginning(addAlif(shortHarakatRules)),
        asWordBeginning(addAlif(longHarakatRules))
    );

const commonHarakatRules: PlainRule[] =
    chainRule(
        tanwinHarakatRules,
        digraphHarakatRules,
        longHarakatRules,
        shortHarakatRules,
        sukunRules
    );

const commonHarakatAfterAlifWawYa: Rule[] =
    prepareRules(alifWawYaConsonantRules).flatMap<RegexRule>(
        ([awyKey, awyVal]) => prepareRules(commonHarakatRules).map<RegexRule>(
            ([latinKey, arabVal]) => [new RegExp(`${awyVal}(${Arabic.Shadda})?${latinKey}`), awyVal + `$1` + arabVal]
        )
    );

const commonHarakatAfterSukunRules: Rule[] =
    prepareRules(commonHarakatRules).map(
        ([latinKey, arabVal]) => [new RegExp(`${Arabic.Sukun}${latinKey}`), arabVal]
    );

const commonHarakatElseRules: Rule[] =
    chainRule(
        addTatwil(commonHarakatRules)
    );

///// Harakat Only End Rules
const groupHarakatOnlyRules: Rule[] =
    chainRule(
        harakatBeginningRules,

        commonHarakatAfterAlifWawYa,
        commonHarakatAfterSukunRules,
        commonHarakatElseRules
    );

const groupAdditionalHarakatOnlyRules: Rule[] =
    // ^m not overlap with consonant only rules
    chainRule(
        additionalHarakatRule
    );

///// Syllable with O Sound Start Rules
const doubleOSoundSyllableRules: Rule[] =
    prepareRules(oSoundConsonantRules).map(
        ([latinKey, arabVal]) => [new RegExp(`${latinKey}${latinKey}o`), arabVal + Arabic.Shadda + Arabic.Fatha]
    );

const singleOSoundSyllableRules: Rule[] =
    prepareRules(oSoundConsonantRules).map(
        ([latinKey, arabVal]) => [new RegExp(`${latinKey}o`), arabVal + Arabic.Fatha]
    );

///// Syllable With O Sound End Rules
const groupOSoundSyllableRules: Rule[] =
    chainRule(
        doubleOSoundSyllableRules,
        singleOSoundSyllableRules
    );

// nn not overlap with tanwin (n-)
const doubleConsonantRules: Rule[] =
    prepareRules(exceptAlifWaYaConsonantRules).map(
        ([latinKey, arabVal]) => [new RegExp(`${latinKey}${latinKey}`), arabVal + Arabic.Shadda + Arabic.Sukun]
    );

// n overlap with tanwin (n-)
const singleConsonantWithoutNunRules: Rule[] =
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

const nunConsonantRules: Rule[] = [
    [new RegExp(`n(?!-|_)`), Arabic.Nun + Arabic.Sukun]
];

const groupNunConsonantDefaultRules: Rule[] = [
    ['n', Arabic.Nun + Arabic.Sukun]
];

///// Consonant Only End Rules
const groupConsonantOnlyRules: Rule[] =
    chainRule(
        doubleConsonantRules,
        singleConsonantWithoutNunRules,
        nunConsonantRules,
        additionalConsonantRule
    );

///// Alif Waw Ya Start Rules

// Alif not included, cannot shadda
const doubleAlifWawYaAsConsonantRules: Rule[] = [
    [new RegExp(`ww`), Arabic.Waw + Arabic.Shadda],
    [new RegExp(`yy`), Arabic.Ya + Arabic.Shadda],
    [new RegExp(`YY`), Arabic.AlefMaksura + Arabic.Shadda],
];

// aiu^ it means, followed by harakat
const singleAlifWawYaAsConsonantRules: Rule[] =
    prepareRules(alifWawYaConsonantRules).map(
        ([latinKey, arabVal]) => [new RegExp(`(?<!_)${latinKey}(?=a|i|u|\\^)`), arabVal]
    );

///// Alif Waw Ya End Rules
const groupAlifWawYaAsConsonantRules: Rule[] =
    chainRule(
        doubleAlifWawYaAsConsonantRules,
        singleAlifWawYaAsConsonantRules
    );

const groupAlifWawYaOnlyRules: PlainRule[] =
    chainRule(
        alifWawYaConsonantRules
    );

///// Connected Syllable Start Rules
const connectedFathaSyllableRules: PlainRule[] =
    chainRule(
        ruleProduct(connectedDigraphConsonantRules, fathaSoundRules),
        ruleProduct(connectedMonographConsonantRules, fathaSoundRules)
    )

const connectedDammaSyllableRules: PlainRule[] =
    chainRule(
        ruleProduct(connectedDigraphConsonantRules, dammaSoundRules),
        ruleProduct(connectedMonographConsonantRules, dammaSoundRules)
    );

const connectedKasraSylableRules: PlainRule[] =
    chainRule(
        ruleProduct(connectedDigraphConsonantRules, kasraSoundRules),
        ruleProduct(connectedMonographConsonantRules, kasraSoundRules)
    );

///// Hamza Syllable Start Rules
const hamzaAloneOnlyRules: PlainRule[] =
    chainRule(
        addSukun(hamzaAloneRules)
    );

const hamzaAloneLongFathaHarakatSyllableRules: PlainRule[] =
    chainRule(
        ruleProduct(hamzaAloneRules, longFathaHarakatRules)
    );

const hamzaBeginningSyllableRules: Rule[] =
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

const hamzaAfterAlifWawYaOnlyRules: PlainRule[] =
    chainRule(
        addLetterBeforeRules(hamzaAloneOnlyRules, 'A'),
        addLetterBeforeRules(hamzaAloneOnlyRules, 'w'),
        addLetterBeforeRules(hamzaAloneOnlyRules, 'y'),
    );

const hamzaAboveAlifOnlyRules: PlainRule[] =
    chainRule(
        addSukun(hamzaAboveAlifRules)
    );

const hamzaAboveWawOnlyRules: PlainRule[] =
    chainRule(
        addSukun(hamzaAboveWawRules)
    );

const hamzaAboveYaOnlyRules: PlainRule[] =
    chainRule(
        addSukun(hamzaAboveYaRules)
    );

const hamzaAfterConnectedConstantWithFathaOnlyRules: PlainRule[] =
    chainRule(
        ruleProduct(connectedFathaSyllableRules, hamzaAboveAlifOnlyRules)
    );

const hamzaAfterConnectedConstantWithDammaOnlyRules: PlainRule[] =
    chainRule(
        ruleProduct(connectedDammaSyllableRules, hamzaAboveWawOnlyRules)
    );

const hamzaAfterConnectedConstantWithKasraOnlyRules: PlainRule[] =
    chainRule(
        ruleProduct(connectedKasraSylableRules, hamzaAboveYaOnlyRules)
    );

const hamzaAfterNotConnectedConstantOnlyRules: PlainRule[] =
    chainRule(
        ruleProduct(notConnectedDigraphConsonantRules, hamzaAloneOnlyRules),
        ruleProduct(notConnectedMonographConsonantRules, hamzaAloneOnlyRules)
    );

///// Hamza Syllable End Rule
const groupHamzaRules: Rule[] =
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
const alifLamLamWithPrefixRules: Rule[] =
    prefixSyllableRules.map(
        ([latinPrefix, arabPrefix]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${latinPrefix}[aA]l(?:-)?l(?:l)?`),
            `$1` + arabPrefix + Arabic.Alif + Arabic.Lam + Arabic.Lam + Arabic.Shadda + Arabic.Sukun]
    );

const alifWaslaLamLamWithPrefixRules: Rule[] =
    prefixSyllableRules.map(
        ([latinPrefix, arabPrefix]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${latinPrefix}\\*(?:a|i|u|A|I|U)?l(?:-)?l(?:l)?`),
            `$1` + arabPrefix + Arabic.AlifWasla + Arabic.Lam + Arabic.Lam + Arabic.Shadda + Arabic.Sukun]
    );

const alifLamLamWithoutPrefixRules: Rule[] = [
    [new RegExp(`(^|[${wordDelimitingPatterns}])[aA]l(?:-)?l(?:l)?`),
        `$1` + Arabic.Alif + Arabic.Lam + Arabic.Lam + Arabic.Shadda + Arabic.Sukun]
];

const alifWaslaLamLamWithoutPrefixRules: Rule[] = [
    [new RegExp(`(^|[${wordDelimitingPatterns}])\\*(?:a|i|u|A|I|U)?l(?:-)?l(?:l)?`),
        `$1` + Arabic.AlifWasla + Arabic.Lam + Arabic.Lam + Arabic.Shadda + Arabic.Sukun]
];

// Qomar
const alifLamQomarDigraphWithPrefixRules: Rule[] =
    qomarDigraphConsonantRules.flatMap<RegexRule>(
        ([latinQomar, arabQomar]) => prefixSyllableRules.map<RegexRule>(
            ([latinPrefix, arabPrefix]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${latinPrefix}[aA]l(?:-)?${latinQomar}`),
                `$1` + arabPrefix + Arabic.Alif + Arabic.Lam + Arabic.Sukun + latinQomar]
        )
    );

const alifWaslaLamQomarDigraphWithPrefixRules: Rule[] =
    qomarDigraphConsonantRules.flatMap<RegexRule>(
        ([latinQomar, arabQomar]) => prefixSyllableRules.map<RegexRule>(
            ([latinPrefix, arabPrefix]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${latinPrefix}\\*(?:a|i|u|A|I|U)?l(?:-)?${latinQomar}`),
                `$1` + arabPrefix + Arabic.AlifWasla + Arabic.Lam + Arabic.Sukun + latinQomar]
        )
    );

const alifLamQomarMonographWithPrefixRules: Rule[] =
    qomarMonographConsonantRules.flatMap<RegexRule>(
        ([latinQomar, arabQomar]) => prefixSyllableRules.map<RegexRule>(
            ([latinPrefix, arabPrefix]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${latinPrefix}[aA]l(?:-)?${latinQomar}`),
                `$1` + arabPrefix + Arabic.Alif + Arabic.Lam + Arabic.Sukun + latinQomar]
        )
    );

const alifWaslaLamQomarMonographWithPrefixRules: Rule[] =
    qomarMonographConsonantRules.flatMap<RegexRule>(
        ([latinQomar, arabQomar]) => prefixSyllableRules.map<RegexRule>(
            ([latinPrefix, arabPrefix]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${latinPrefix}\\*(?:a|i|u|A|I|U)?l(?:-)?${latinQomar}`),
                `$1` + arabPrefix + Arabic.AlifWasla + Arabic.Lam + Arabic.Sukun + latinQomar]
        )
    );

const alifLamQomarDigraphWithoutPrefixRules: Rule[] =
    qomarDigraphConsonantRules.map(
        ([latinQomar, arabQomar]) => [new RegExp(`(^|[${wordDelimitingPatterns}])[aA]l(?:-)?${latinQomar}`),
            `$1` + Arabic.Alif + Arabic.Lam + Arabic.Sukun + latinQomar]
    );

const alifWaslaLamQomarDigraphWithoutPrefixRules: Rule[] =
    qomarDigraphConsonantRules.map(
        ([latinQomar, arabQomar]) => [new RegExp(`(^|[${wordDelimitingPatterns}])\\*(?:a|i|u|A|I|U)?l(?:-)?${latinQomar}`),
            `$1` + Arabic.AlifWasla + Arabic.Lam + Arabic.Sukun + latinQomar]
    );

const alifLamQomarMonographWithoutPrefixRules: Rule[] =
    qomarMonographConsonantRules.map(
        ([latinQomar, arabQomar]) => [new RegExp(`(^|[${wordDelimitingPatterns}])[aA]l(?:-)?${latinQomar}`),
            `$1` + Arabic.Alif + Arabic.Lam + Arabic.Sukun + latinQomar]
    );

const alifWaslaLamQomarMonographWithoutPrefixRules: Rule[] =
    qomarMonographConsonantRules.map(
        ([latinQomar, arabQomar]) => [new RegExp(`(^|[${wordDelimitingPatterns}])\\*(?:a|i|u|A|I|U)?l(?:-)?${latinQomar}`),
            `$1` + Arabic.AlifWasla + Arabic.Lam + Arabic.Sukun + latinQomar]
    );

const alifLamQomarHamzaWithPrefixRules: Rule[] =
    hamzaAboveAlifOnlyRules.flatMap<RegexRule>(
        ([latinHamza, arabHamza]) => prefixSyllableRules.map<RegexRule>(
            ([latinPrefix, arabPrefix]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${latinPrefix}[aA]l(?:-)?${latinHamza}`),
                `$1` + arabPrefix + Arabic.Alif + Arabic.Lam + Arabic.Sukun + arabHamza + Arabic.Sukun]
        )
    );

const alifWaslaLamQomarHamzaWithPrefixRules: Rule[] =
    hamzaAboveAlifOnlyRules.flatMap<RegexRule>(
        ([latinHamza, arabHamza]) => prefixSyllableRules.map<RegexRule>(
            ([latinPrefix, arabPrefix]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${latinPrefix}\\*(?:a|i|u|A|I|U)?l(?:-)?${latinHamza}`),
                `$1` + arabPrefix + Arabic.AlifWasla + Arabic.Lam + Arabic.Sukun + arabHamza + Arabic.Sukun]
        )
    );

const alifLamQomarHamzaWithoutPrefixRules: Rule[] =
    hamzaAboveAlifOnlyRules.map(
        ([latinHamza, arabHamza]) => [new RegExp(`(^|[${wordDelimitingPatterns}])[aA]l(?:-)?${latinHamza}`),
            `$1` + Arabic.Alif + Arabic.Lam + Arabic.Sukun + arabHamza + Arabic.Sukun]
    );

const alifWaslaLamQomarHamzaWithoutPrefixRules: Rule[] =
    hamzaAboveAlifOnlyRules.map(
        ([latinHamza, arabHamza]) => [new RegExp(`(^|[${wordDelimitingPatterns}])\\*(?:a|i|u|A|I|U)?l(?:-)?${latinHamza}`),
            `$1` + Arabic.AlifWasla + Arabic.Lam + Arabic.Sukun + arabHamza + Arabic.Sukun]
    );

const alifLamQomarOSoundWithPrefixRules: Rule[] =
    qomarOSoundConsonantRules.flatMap<RegexRule>(
        ([latinOSound, arabOSound]) => prefixSyllableRules.map<RegexRule>(
            ([latinPrefix, arabPrefix]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${latinPrefix}[aA]l(?:-)?${latinOSound}o`),
                `$1` + arabPrefix + Arabic.Alif + Arabic.Lam + Arabic.Sukun + arabOSound + Arabic.Fatha]
        )
    );

const alifWaslaLamQomarOSoundWithPrefixRules: Rule[] =
    qomarOSoundConsonantRules.flatMap<RegexRule>(
        ([latinOSound, arabOSound]) => prefixSyllableRules.map<RegexRule>(
            ([latinPrefix, arabPrefix]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${latinPrefix}\\*(?:a|i|u|A|I|U)?l(?:-)?${latinOSound}o`),
                `$1` + arabPrefix + Arabic.AlifWasla + Arabic.Lam + Arabic.Sukun + arabOSound + Arabic.Fatha]
        )
    );

const alifLamQomarOSoundWithoutPrefixRules: Rule[] =
    qomarOSoundConsonantRules.map(
        ([latinOSound, arabOSound]) => [new RegExp(`(^|[${wordDelimitingPatterns}])[aA]l(?:-)?${latinOSound}o`),
            `$1` + Arabic.Alif + Arabic.Lam + Arabic.Sukun + arabOSound + Arabic.Fatha]
    );

const alifWaslaLamQomarOSoundWithoutPrefixRules: Rule[] =
    qomarOSoundConsonantRules.map(
        ([latinOSound, arabOSound]) => [new RegExp(`(^|[${wordDelimitingPatterns}])\\*(?:a|i|u|A|I|U)?l(?:-)?${latinOSound}o`),
            `$1` + Arabic.AlifWasla + Arabic.Lam + Arabic.Sukun + arabOSound + Arabic.Fatha]
    );

// Syamsi
const alifLamSyamsiDigraphWithPrefixRules: Rule[] =
    syamsiDigraphConsonantRules.flatMap<RegexRule>(
        ([latinSyamsi, arabSyamsi]) => prefixSyllableRules.map<RegexRule>(
            ([latinPrefix, arabPrefix]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${latinPrefix}[aA]l(?:-)?${latinSyamsi}(?:${latinSyamsi})?`),
                `$1` + arabPrefix + Arabic.Alif + Arabic.Lam + arabSyamsi + Arabic.Shadda + Arabic.Sukun]
        )
    );

const alifWaslaLamSyamsiDigraphWithPrefixRules: Rule[] =
    syamsiDigraphConsonantRules.flatMap<RegexRule>(
        ([latinSyamsi, arabSyamsi]) => prefixSyllableRules.map<RegexRule>(
            ([latinPrefix, arabPrefix]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${latinPrefix}\\*(?:a|i|u|A|I|U)?l(?:-)?${latinSyamsi}(?:${latinSyamsi})?`),
                `$1` + arabPrefix + Arabic.AlifWasla + Arabic.Lam + arabSyamsi + Arabic.Shadda + Arabic.Sukun]
        )
    );

const alifLamSyamsiMonographWithPrefixRules: Rule[] =
    syamsiMonographConsonantRules.flatMap<RegexRule>(
        ([latinSyamsi, arabSyamsi]) => prefixSyllableRules.map<RegexRule>(
            ([latinPrefix, arabPrefix]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${latinPrefix}[aA]l(?:-)?${latinSyamsi}(?:${latinSyamsi})?`),
                `$1` + arabPrefix + Arabic.Alif + Arabic.Lam + arabSyamsi + Arabic.Shadda + Arabic.Sukun]
        )
    );

const alifWaslaLamSyamsiMonographWithPrefixRules: Rule[] =
    syamsiMonographConsonantRules.flatMap<RegexRule>(
        ([latinSyamsi, arabSyamsi]) => prefixSyllableRules.map<RegexRule>(
            ([latinPrefix, arabPrefix]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${latinPrefix}\\*(?:a|i|u|A|I|U)?l(?:-)?${latinSyamsi}(?:${latinSyamsi})?`),
                `$1` + arabPrefix + Arabic.AlifWasla + Arabic.Lam + arabSyamsi + Arabic.Shadda + Arabic.Sukun]
        )
    );

const alifLamSyamsiDigraphWithoutPrefixRules: Rule[] =
    syamsiDigraphConsonantRules.map(
        ([latinSyamsi, arabSyamsi]) => [new RegExp(`(^|[${wordDelimitingPatterns}])[aA]l(?:-)?${latinSyamsi}(?:${latinSyamsi})?`),
            `$1` + Arabic.Alif + Arabic.Lam + arabSyamsi + Arabic.Shadda + Arabic.Sukun]
    );

const alifWaslaLamSyamsiDigraphWithoutPrefixRules: Rule[] =
    syamsiDigraphConsonantRules.map(
        ([latinSyamsi, arabSyamsi]) => [new RegExp(`(^|[${wordDelimitingPatterns}])\\*(?:a|i|u|A|I|U)?l(?:-)?${latinSyamsi}(?:${latinSyamsi})?`),
            `$1` + Arabic.AlifWasla + Arabic.Lam + arabSyamsi + Arabic.Shadda + Arabic.Sukun]
    );

const alifLamSyamsiMonographWithoutPrefixRules: Rule[] =
    syamsiMonographConsonantRules.map(
        ([latinSyamsi, arabSyamsi]) => [new RegExp(`(^|[${wordDelimitingPatterns}])[aA]l(?:-)?${latinSyamsi}(?:${latinSyamsi})?`),
            `$1` + Arabic.Alif + Arabic.Lam + arabSyamsi + Arabic.Shadda + Arabic.Sukun]
    );

const alifWaslaLamSyamsiMonographWithoutPrefixRules: Rule[] =
    syamsiMonographConsonantRules.map(
        ([latinSyamsi, arabSyamsi]) => [new RegExp(`(^|[${wordDelimitingPatterns}])\\*(?:a|i|u|A|I|U)?l(?:-)?${latinSyamsi}(?:${latinSyamsi})?`),
            `$1` + Arabic.AlifWasla + Arabic.Lam + arabSyamsi + Arabic.Shadda + Arabic.Sukun]
    );

const alifLamSyamsiOSoundWithPrefixRules: Rule[] =
    syamsiOSoundConsonantRules.flatMap<RegexRule>(
        ([latinOSound, arabOSound]) => prefixSyllableRules.map<RegexRule>(
            ([latinPrefix, arabPrefix]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${latinPrefix}[aA]l(?:-)?${latinOSound}(?:${latinOSound})?o`),
                `$1` + arabPrefix + Arabic.Alif + Arabic.Lam + arabOSound + Arabic.Shadda + Arabic.Fatha]
        )
    );

const alifWaslaLamSyamsiOSoundWithPrefixRules: Rule[] =
    syamsiOSoundConsonantRules.flatMap<RegexRule>(
        ([latinOSound, arabOSound]) => prefixSyllableRules.map<RegexRule>(
            ([latinPrefix, arabPrefix]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${latinPrefix}\\*(?:a|i|u|A|I|U)?l(?:-)?${latinOSound}(?:${latinOSound})?o`),
                `$1` + arabPrefix + Arabic.AlifWasla + Arabic.Lam + arabOSound + Arabic.Shadda + Arabic.Fatha]
        )
    );

const alifLamSyamsiOSoundWithoutPrefixRules: Rule[] =
    syamsiOSoundConsonantRules.map(
        ([latinOSound, arabOSound]) => [new RegExp(`(^|[${wordDelimitingPatterns}])[aA]l(?:-)?${latinOSound}(?:${latinOSound})?o`),
            `$1` + Arabic.Alif + Arabic.Lam + arabOSound + Arabic.Shadda + Arabic.Fatha]
    );

const alifWaslaLamSyamsiOSoundWithoutPrefixRules: Rule[] =
    syamsiOSoundConsonantRules.map(
        ([latinOSound, arabOSound]) => [new RegExp(`(^|[${wordDelimitingPatterns}])\\*(?:a|i|u|A|I|U)?l(?:-)?${latinOSound}(?:${latinOSound})?o`),
            `$1` + Arabic.AlifWasla + Arabic.Lam + arabOSound + Arabic.Shadda + Arabic.Fatha]
    );

// Alif lam must be in front of word
const alifLamSyllableRules: Rule[] =
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
const groupAlifLamFrontSyllableRules: Rule[] =
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

const changeOrderShadda: RegexRule[] =
    arabicHarakatRules.map(
        ([harakat]) => [new RegExp(`${harakat}${Arabic.Shadda}`), Arabic.Shadda.concat(harakat)]
    );

// x(?!y) means match x if not followed by y
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Assertions
const deleteSpaceAfterPrefixLevel1Rules: Rule[] =
    prefixLevel1Rules.flatMap<RegexRule>(
        ([keyFirst, valFirst]) => prefixLevel1Rules.map<RegexRule>(
            ([keySecond, valSecond]) => [new RegExp(`(^|\\s)${valFirst}\\s(?!${valSecond})`), `$1` + valFirst]
        )
    );

const deleteSpaceAfterPrefixLevel2Rules: Rule[] =
    prefixLevel2Rules.flatMap<RegexRule>(
        ([keyFirst, valFirst]) => prefixLevel1Rules.concat(prefixLevel2Rules).map<RegexRule>(
            ([keySecond, valSecond]) => [new RegExp(`(^|\\s)${valFirst}\\s(?!${valSecond})`), `$1` + valFirst]
        )
    );

const deleteSpaceAfterPrefixRules: Rule[] =
    chainRule(
        deleteSpaceAfterPrefixLevel2Rules,
        deleteSpaceAfterPrefixLevel1Rules
    );

////////// Special Rule Section //////////

// Nun Tanwin Mim Start Rules
const mimNunWawYaLamRa = [Arabic.Mim, Arabic.Nun, Arabic.Waw, Arabic.Ya, Arabic.Lam, Arabic.Ra]

    // different or same word applied
const nunMeetSixRules: Rule[] =
    mimNunWawYaLamRa.map(
        ([letter]) => [new RegExp(`${Arabic.Nun}${Arabic.Sukun}(\\s?)${letter}([^${Arabic.Shadda}]|$)`),
            Arabic.Nun + Arabic.Sukun + `$1` + letter + Arabic.Shadda + `$2`]
    );

    // different or same word applied
const nunMeetBa: Rule[] = [
    [new RegExp(`${Arabic.Nun}${Arabic.Sukun}(\\s?)${Arabic.Ba}`),
        Arabic.Nun + Arabic.Sukun + Arabic.SmallHighMim + `$1` + Arabic.Ba],
];

const tanwinMeetSixRules: Rule[] =
    tanwinHarakatRules.flatMap<RegexRule>(
        ([key, val]) => mimNunWawYaLamRa.map<RegexRule>(
            ([letter]) => [new RegExp(`${val}\\s${letter}([^${Arabic.Shadda}|$])`), val + ' ' + letter + Arabic.Shadda + `$1`]
        )
    );

const tanwinMeetBa: Rule[] =
    tanwinHarakatRules.map(
        ([key, val]) => [val + ' ' + Arabic.Ba, val + Arabic.SmallHighMim + ' ' + Arabic.Ba]
    );

    // different or same word applied
const mimMeetMim: Rule[] = [
    [new RegExp(`${Arabic.Mim}${Arabic.Sukun}(\\s?)${Arabic.Mim}([^${Arabic.Mim}${Arabic.Shadda}]|$)`),
        Arabic.Mim + Arabic.Sukun + `$1` + Arabic.Mim + Arabic.Shadda + `$2`],
];

/// Nun Tanwin Mim End Rules
const groupNunTanwinMimRules: Rule[] =
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
const idghamMutamatsilainDifferentWordRules: Rule[] =
    exceptAlifWaYaConsonantRules.filter(
            ([key, val]) => val !== Arabic.Mim
        ).map(
            ([key, val]) => [new RegExp(`${val}${Arabic.Sukun}\\s${val}[${Arabic.Shadda}]?`), val + ' ' + val + Arabic.Shadda]
    );

const idghamMutamatsilainSameWordRules: Rule[] =
    exceptAlifWaYaConsonantRules.filter(
            ([key, val]) => val !== Arabic.Mim
        ).map(
            ([key, val]) => [new RegExp(`${val}${Arabic.Sukun}${val}`), val + val]
    );

const idghamMutaqaribainDifferentWordRules: Rule[] =
    idghamMutaqaribainConsonantRules.map(
        ([precedeLetter, Letter]) => [new RegExp(`${precedeLetter}${Arabic.Sukun}\\s${Letter}[${Arabic.Shadda}]?`),
            precedeLetter + ' ' + Letter + Arabic.Shadda]
    );

const idghamMutaqaribainSameWordRules: Rule[] =
    idghamMutaqaribainConsonantRules.map(
        ([precedeLetter, Letter]) => [new RegExp(`${precedeLetter}${Arabic.Sukun}${Letter}`),
            precedeLetter + Letter]
    );
const idghamMutajanisainDifferentWordRules: Rule[] =
    idghamMutajanisainConsonantRules.flatMap<RegexRule>(
        (groupLetter) => groupLetter.flatMap<RegexRule>(
            ([letterFirst]) => groupLetter.filter(
                ([letterSecond]) => {
                    if (letterFirst === letterSecond) {
                        return false;
                    } else {
                        return true;
                    }
                }
            ).map<RegexRule>(
                ([letterSecond]) => [new RegExp(`${letterFirst}${Arabic.Sukun}\\s${letterSecond}[${Arabic.Shadda}]?`),
                    letterFirst + ' ' + letterSecond + Arabic.Shadda]
            )
        )
    );

const idghamMutajanisainSameWordRules: Rule[] =
    idghamMutajanisainConsonantRules.flatMap<RegexRule>(
        (groupLetter) => groupLetter.flatMap<RegexRule>(
            ([letterFirst]) => groupLetter.filter(
                ([letterSecond]) => {
                    if (letterFirst === letterSecond) {
                        return false;
                    }
                    else {
                        return true;
                    }
                }
            ).map<RegexRule>(
                ([letterSecond]) => [new RegExp(`${letterFirst}${Arabic.Sukun}${letterSecond}`),
                    letterFirst + letterSecond]
                
            )
        )
    );

// Dead Consonant Followed by Similar Sound End Rules
const groupIdghamDifferentWordRules: Rule[] =
    chainRule(
        idghamMutamatsilainDifferentWordRules,
        idghamMutaqaribainDifferentWordRules,
        idghamMutajanisainDifferentWordRules
    );

const groupIdghamSameWordRules: Rule[] =
    chainRule(
        idghamMutamatsilainSameWordRules,
        idghamMutaqaribainSameWordRules,
        idghamMutajanisainSameWordRules
    );

///// Latin to Pegon End Rules
const latinToArabScheme: Rule[] =
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
const ginverseConsonantSyllableRules: PlainRule[] =
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
const inverseShortHarakatRules: PlainRule[] =
    chainRule(
        asInverse(shortHarakatRules),
        asInverse(oSoundRules)
    );

const inverseTanwinHarakatRules: PlainRule[] =
    chainRule(
        asInverse(tanwinHarakatRules)
    );

// For long harakat, only specified the alt part,
// on normal term, already covered by harakat short and consonant
const inverseLongHarakatRules: Rule[] = [
    [new RegExp(`(${Arabic.Fatha})?${Arabic.SuperscriptAlif}`), 'a^a'],
    [new RegExp(`(${Arabic.Fatha})?${Arabic.SubAlef}`), 'i^i'],
    [new RegExp(`(${Arabic.Kasra})?${Arabic.SmallYa}`), 'i^Y'],
    [new RegExp(`(${Arabic.Damma})?${Arabic.InvertedDhamma}`), 'u^u'],
    [new RegExp(`(${Arabic.Damma})?${Arabic.SmallWaw}`), 'u^W'],
];

// Sukun is a must actually, but we never know what our user type
const inverseDigraphHarakatRules: Rule[] = [
    [new RegExp(`${Arabic.Fatha}${Arabic.Ya}(${Arabic.Sukun})?`), 'ay'],
    [new RegExp(`${Arabic.Fatha}${Arabic.Waw}(${Arabic.Sukun})?`), 'aw'],
];

const ginverseAdditionalHarakatRules: PlainRule[] =
    chainRule(
        asInverse(additionalHarakatRule)
    );

const vanishingAlifRules: PlainRule[] = [
    [Arabic.Alif, ''],
];

// as word beginning cannot contain RegexRule, so manual add beginning
const inverseLongHarakatBeginningRules: RegexRule[] = [
    [new RegExp(`(^|[${wordDelimitingPatterns}])${Arabic.Alif}(${Arabic.Fatha})?${Arabic.SuperscriptAlif}`), `$1` + '^a'],
    [new RegExp(`(^|[${wordDelimitingPatterns}])${Arabic.Alif}(${Arabic.Fatha})?${Arabic.SubAlef}`), '^i'],
    [new RegExp(`(^|[${wordDelimitingPatterns}])${Arabic.Alif}(${Arabic.Kasra})?${Arabic.SmallYa}`), `$1` + 'i^Y'],
    [new RegExp(`(^|[${wordDelimitingPatterns}])${Arabic.Alif}(${Arabic.Damma})?${Arabic.InvertedDhamma}`), '^u'],
    [new RegExp(`(^|[${wordDelimitingPatterns}])${Arabic.Alif}(${Arabic.Damma})?${Arabic.SmallWaw}`), `$1` + 'u^W'],
];

const inverseHarakatBeginningRules: Rule[] =
    chainRule(
        inverseLongHarakatBeginningRules,
        asWordBeginning(
            ruleProduct(vanishingAlifRules, inverseShortHarakatRules)
        )
    );

const vanishingTatwilRules: PlainRule[] = [
    [Arabic.Tatwil, ''],
];

// Inverse Harakat End Rules
const ginverseHarakatRules: Rule[] =
    chainRule(
        inverseHarakatBeginningRules,

        inverseTanwinHarakatRules,
        inverseDigraphHarakatRules,
        inverseLongHarakatRules,
        inverseShortHarakatRules,

        vanishingTatwilRules
    );

// Inverse Hamza Start Rules
const inverseHamzaRules: Rule[] = [
    [new RegExp(`${Arabic.Hamza}(${Arabic.Sukun})?`), '\`'],
    [new RegExp(`${Arabic.AlifWithHamzaAbove}(${Arabic.Sukun})?`), '\`'],
    [new RegExp(`${Arabic.AlifWithHamzaBelow}(${Arabic.Sukun})?`), '\`'],
    [new RegExp(`${Arabic.WawWithHamzaAbove}(${Arabic.Sukun})?`), '\`'],
    [new RegExp(`${Arabic.YaWithHamzaAbove}(${Arabic.Sukun})?`), '\`'],
];

// Common rules have . to sukun
// it disturbing the reverse
const inverseHamzaAboveAlifRules: PlainRule[] =
    chainRule(
        addSukun(hamzaAboveAlifRules),
        hamzaAboveAlifRules
    );

const inverseHamzaAboveWawRules: PlainRule[] =
    chainRule(
        addSukun(hamzaAboveWawRules),
        hamzaAboveWawRules
    );

const inverseHamzaAboveYaRules: PlainRule[] =
    chainRule(
        addSukun(hamzaAboveYaRules),
        hamzaAboveYaRules
    );

const inverseHamzaAfterConnectedConstantWithFathaRules: PlainRule[] =
    chainRule(
        asInverse(ruleProduct(connectedFathaSyllableRules, inverseHamzaAboveAlifRules)),
        asInverse(addLetterBeforeRules(inverseHamzaAboveAlifRules, Arabic.Fatha))
    )

const inverseHamzaAfterConnectedConstantWithDammaRules: PlainRule[] =
    chainRule(
        asInverse(ruleProduct(connectedDammaSyllableRules, inverseHamzaAboveWawRules)),
        asInverse(addLetterBeforeRules(inverseHamzaAboveWawRules, Arabic.Damma))
    );

const inverseHamzaAfterConnectedConstantWithKasraRules: PlainRule[] =
    chainRule(
        asInverse(ruleProduct(connectedKasraSylableRules, inverseHamzaAboveYaRules)),
        asInverse(addLetterBeforeRules(inverseHamzaAboveWawRules, Arabic.Kasra))
    );

// Inverse Hamza End Rules
// 1. For hamza after connected constant with specific harakat
//     --> use additional letter, e.g. `A, `w, `y
// 2. Else or if input not correct, use default e.g. ` only
const ginverseHamzaRules: Rule[] =
    chainRule(
        inverseHamzaAfterConnectedConstantWithFathaRules,
        inverseHamzaAfterConnectedConstantWithDammaRules,
        inverseHamzaAfterConnectedConstantWithKasraRules,
        inverseHamzaRules
    );

// Inverse Alif Lam Start Rules
const inverseAlifLamJalalahRules: RegexRule[] = [
    [new RegExp(`${Arabic.Alif}(${Arabic.Fatha})?${Arabic.Lam}${Arabic.Lam}(${Arabic.Shadda})?${Arabic.SuperscriptAlif}${Arabic.Ha}`),
        'alla^ah'],
    [new RegExp(`${Arabic.Alif}(${Arabic.Fatha})?${Arabic.Lam}${Arabic.Lam}(${Arabic.Shadda})?(${Arabic.Fatha})?${Arabic.Ha}`),
        'allah'],
    [new RegExp(`${Arabic.AlifWasla}${Arabic.Lam}${Arabic.Lam}(${Arabic.Shadda})?${Arabic.SuperscriptAlif}${Arabic.Ha}`),
        '*alla^ah'],
    [new RegExp(`${Arabic.AlifWasla}${Arabic.Lam}${Arabic.Lam}(${Arabic.Shadda})?(${Arabic.Fatha})?${Arabic.Ha}`),
        '*allah'],
];

const inverseQomarConsonantRules: PlainRule[] =
    chainRule(
        asInverse(qomarDigraphConsonantRules),
        asInverse(qomarMonographConsonantRules),
        asInverse(hamzaAboveAlifRules)
    );

const inverseSyamsiConsonantRules: PlainRule[] =
    chainRule(
        asInverse(syamsiDigraphConsonantRules),
        asInverse(syamsiMonographConsonantRules)
    );

const inverseAlifLamQomarWithPrefixRules: RegexRule[] =
    inverseQomarConsonantRules.flatMap<RegexRule>(
        ([key, val]) => asInverse(prefixSyllableRules).map<RegexRule>(
            ([arabicPrefix, latinPrefix]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${arabicPrefix}${Arabic.Alif}(?:${Arabic.Fatha})?${Arabic.Lam}(?:${Arabic.Sukun})?${key}`),
                `$1` + latinPrefix + 'al-' + val]
        )
    );

const inverseAlifWaslaLamQomarWithPrefixRules: RegexRule[] =
    inverseQomarConsonantRules.flatMap<RegexRule>(
        ([key, val]) => asInverse(prefixSyllableRules).map<RegexRule>(
            ([arabicPrefix, latinPrefix]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${arabicPrefix}${Arabic.AlifWasla}${Arabic.Lam}(?:${Arabic.Sukun})?${key}`),
                `$1` + latinPrefix + '*al-' + val]
        )
    );

const inverseAlifLamQomarWithoutPrefixRules: RegexRule[] =
    inverseQomarConsonantRules.map(
        ([key, val]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${Arabic.Alif}(?:${Arabic.Fatha})?${Arabic.Lam}(?:${Arabic.Sukun})?${key}`),
            `$1` + 'al-' + val]
    );

const inverseAlifWaslaLamQomarWithoutPrefixRules: RegexRule[] =
    inverseQomarConsonantRules.map(
        ([key, val]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${Arabic.AlifWasla}${Arabic.Lam}(?:${Arabic.Sukun})?${key}`),
            `$1` + '*al-' + val]
    );

const inverseAlifLamSyamsiWithPrefixRules: RegexRule[] =
    inverseSyamsiConsonantRules.flatMap<RegexRule>(
        ([key, val]) => asInverse(prefixSyllableRules).map<RegexRule>(
            ([arabicPrefix, latinPrefix]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${arabicPrefix}${Arabic.Alif}(?:${Arabic.Fatha})?${Arabic.Lam}${key}(?:${Arabic.Shadda})?`),
                `$1` + latinPrefix + 'al-' + val + val]
        )
    );

const inverseAlifWaslaLamSyamsiWithPrefixRules: RegexRule[] =
    inverseSyamsiConsonantRules.flatMap<RegexRule>(
        ([key, val]) => asInverse(prefixSyllableRules).map<RegexRule>(
            ([arabicPrefix, latinPrefix]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${arabicPrefix}${Arabic.AlifWasla}${Arabic.Lam}${key}(?:${Arabic.Shadda})?`),
                `$1` + latinPrefix + '*al-' + val + val]
        )
    );

const inverseAlifLamSyamsiWithoutPrefixRules: RegexRule[] =
    inverseSyamsiConsonantRules.map(
        ([key, val]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${Arabic.Alif}(?:${Arabic.Fatha})?${Arabic.Lam}${key}(?:${Arabic.Shadda})?`),
            `$1` + 'al-' + val + val]
    );

const inverseAlifWaslaLamSyamsiWithoutPrefixRules: RegexRule[] =
    inverseSyamsiConsonantRules.map(
        ([key, val]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${Arabic.AlifWasla}${Arabic.Lam}${key}(?:${Arabic.Shadda})?`),
            `$1` + '*al-' + val + val]
    );

const inverseShaddaRules: PlainRule[] =
    asInverse(allConsonantRules).map(
        ([key, val]) => [key + Arabic.Shadda, val + val]
    );

const ginverseAlifLamRules: RegexRule[] =
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

const ginverseShaddaRules: PlainRule[] =
    chainRule(
        inverseShaddaRules
    );

//////////========== Arab To Latin : Step 2 ==========//////////

////////// Util Section //////////

const changeSukunAltToSukun: PlainRule[] = [
    [Arabic.SukunAlt, Arabic.Sukun],
];

////////// Special Rule Section //////////

    // different or same word applied
// delete shadda if
const inverseNunMeetSixRules: Rule[] =
    mimNunWawYaLamRa.map(
        ([letter]) => [new RegExp(`${Arabic.Nun}(?:${Arabic.Sukun})?(\\s)?${letter}${Arabic.Shadda}`),
            Arabic.Nun + Arabic.Sukun + `$1` + letter]
    );

    // different or same word applied
// delete high mim if
const inverseNunMeetBa: Rule[] = [
    [new RegExp(`${Arabic.Nun}(?:${Arabic.Sukun})?${Arabic.SmallHighMim}(\\s)?${Arabic.Ba}`),
        Arabic.Nun + Arabic.Sukun + `$1` + Arabic.Ba],
];

// delete Shadda if
const inverseTanwinMeetSixRules: Rule[] =
    tanwinHarakatRules.flatMap<RegexRule>(
        ([key, val]) => mimNunWawYaLamRa.map<RegexRule>(
            ([letter]) => [new RegExp(`${val}\\s${letter}${Arabic.Shadda}`), val + ' ' + letter]
        )
    );

// delete high mim if
const inverseTanwinMeetBa: Rule[] =
    tanwinHarakatRules.map(
        ([key, val]) => [val + Arabic.SmallHighMim + ' ' + Arabic.Ba, val + ' ' + Arabic.Ba]
    );

    // different or same word applied
// delete shadda if
const inverseMimMeetMim: Rule[] = [
    [new RegExp(`${Arabic.Mim}(?:${Arabic.Sukun})?(\\s)?${Arabic.Mim}${Arabic.Shadda}`),
        Arabic.Mim + Arabic.Sukun + `$1` + Arabic.Mim],
];

// Inverse Nun Tanwin Mim End Rules
const ginverseNunTanwinMimRules: Rule[] =
    chainRule(
        inverseNunMeetSixRules,
        inverseTanwinMeetSixRules,
        inverseNunMeetBa,
        inverseTanwinMeetBa,
        inverseMimMeetMim
    );

// Inverse Dead Consonant Followed by Similar Sound Start Rule
const inverseIdghamMutamatsilainRules: Rule[] =
    exceptAlifWaYaConsonantRules.filter(
        ([latinKey, arabicVal]) => arabicVal !== Arabic.Mim
    ).map(
        ([latinKey, arabicVal]) => [new RegExp(`${arabicVal}(${Arabic.Sukun})?(\\s)?${arabicVal}(${Arabic.Shadda})?`),
            arabicVal + `$1` + `$2` + arabicVal]
    );

const inverseIdghamMutaqaribainRules: Rule[] =
    idghamMutaqaribainConsonantRules.map(
        ([precedeLetter, Letter]) => [new RegExp(`${precedeLetter}(${Arabic.Sukun})?(\\s)?${Letter}(${Arabic.Shadda})?`),
            precedeLetter + `$1` + `$2` + Letter]
    );

const inverseIdghamMutajanisainRules: Rule[] =
    idghamMutajanisainConsonantRules.flatMap<RegexRule>(
        (groupLetter) => groupLetter.flatMap<RegexRule>(
            ([letterFirst]) => groupLetter.filter(
                ([letterSecond]) => {
                    if (letterFirst === letterSecond) {
                        return false;
                    } else {
                        return true;
                    }
                }
            ).map<RegexRule>(
                ([letterSecond]) => [new RegExp(`${letterFirst}(${Arabic.Sukun})?(\\s)?${letterSecond}(${Arabic.Shadda})?`),
                    letterFirst + `$1` + `$2` + letterSecond]
            )
        )
    );

// Dead Consonant Followed by Similar Sound End Rules
const ginverseIdghamRules: Rule[] =
    chainRule(
        inverseIdghamMutamatsilainRules,
        inverseIdghamMutaqaribainRules,
        inverseIdghamMutajanisainRules
    );

///// Latin to Pegon End Rules
const arabToLatinScheme: Rule[] = 
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
const standardSukunRules: PlainRule[] = [
    ['.', ''],
];

const standardOSoundRules: PlainRule[] = [
    ['o', 'a'],
];

const standardTanwinHarakatRules: PlainRule[] = [
    ['an-', 'an'],
    ['an_', 'an'],

    ['un-', 'un'],
    ['un_', 'un'],

    ['in-', 'in'],
    ['in_', 'in'],
];

const standardLongHarakatRules: PlainRule[] = [
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
const standardLongHarakatAmbiguousRules: Rule[] = [
    [new RegExp(`iy($|[^aiuy])`), 'ī' + `$1`],
    [new RegExp(`uw($|[^aiuw])`), 'ū' + `$1`],
];

const standardDigraphHarakatRules: Rule[] = [
    // ai
    [new RegExp(`ay($|[^aiuy])`), 'ai' + `$1`],

    // au
    [new RegExp(`aw($|[^aiuw])`), 'au' + `$1`],
];

// Standard Harakat and Consonant End Rules
const gstandardHarakatRules: Rule[] =
    chainRule(
        standardDigraphHarakatRules,
        standardTanwinHarakatRules,
        standardLongHarakatAmbiguousRules,
        standardLongHarakatRules,
        standardOSoundRules,
        standardSukunRules
    );

// Standard Consonant Start Rules
const standardConsonantRules: PlainRule[] = [
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

const standardAlifWawYaConsonantRules: PlainRule[] = [
    ['A', 'a'],
    ['W', 'w'],
    ['Y', 'y'],
]

// Ta Marbuta
const standardTaMarbutaEndingRules: PlainRule[] = [
    ['t-', 'h'],
    ['h-', 'h']
];

const standardQomarMonographConsonantRules: PlainRule[] = [
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

const standardQomarDigraphConsonantRules: PlainRule[] = [
    ['h_h', 'ḥ'],
    ['k_h', 'kh'],
    ['g_h', 'g'],
];

const standardSyamsiMonographConsonantRules: PlainRule[] = [
    ['t', 't'],
    ['d', 'd'],
    ['r', 'r'],
    ['z', 'z'],
    ['s', 's'],
    ['l', 'l'],
    ['n', 'n'],
];

const standardSyamsiDigraphConsonantRules: PlainRule[] = [
    ['t_s', 'ṡ'],
    ['d_z', 'ẑ'],
    ['s_y', 'sy'],
    ['s_h', 'ṣ'],
    ['d_l', 'ḍ'],
    ['t_t', 'ṭ'],
    ['z_h', 'ẓ'],
];

const gstandardConsonantRules: Rule[] =
    chainRule(
        standardConsonantRules
    );

const gstandardAlifWawYaConsonantRules: Rule[] =
    chainRule(
        standardAlifWawYaConsonantRules
    );

const gstandardTaMarbutaEndingRules: Rule[] =
    chainRule(
        asWordEnding(standardTaMarbutaEndingRules)
    );

// Standard Hamza Start Rules
const standardHamzaBeginningRules: PlainRule[] = [
    ['`a', 'a'],
    ['`u', 'u'],
    ['`i', 'i'],
];

const standardHamzaAfterSpecialHarakatRules: Rule[] = [
    ['u`w', 'u`'],
    ['i`y', 'i`'],
];

// Standard Hamza End Rules
const gstandardHamzaRules: Rule[] =
    chainRule(
        asWordBeginning(standardHamzaBeginningRules),
        standardHamzaAfterSpecialHarakatRules
    )

// Standard Alif Lam Start Rules

// Alif Lam Jalalah
const standardAlifLamJalalahWithoutPrefixBeginningRules: RegexRule[] = [
    [new RegExp(`(^|[${wordDelimitingPatterns}])(?:\\*)?al(?:-)?l(a|\\^a|a\\^a)h(?!_h)`), `$1` + 'allah'],
];

const standardAlifLamJalalahWithoutPrefixContinueRules: RegexRule[] = [
    [new RegExp(`([aiu])\\s(?:\\*)?all(a|\\^a|a\\^a)h(?!_h)`), `$1` + 'llah']
];

const standardAlifLamJalalahWithPrefixRules: RegexRule[] =
    prefixSyllableRules.map<RegexRule>(
        ([latinPrefix, arabPrefix]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${latinPrefix}(?:\\*)?all(a|\\^a|a\\^a)h(?!_h)`),
        `$1` + 'llah']
    );

// Combination [Qomar, Syamsi][Digraph, Monograph][With, Without][Beginning, Continue]
// Qomar
const standardAlifLamQomarDigraphWithoutPrefixBeginningRules: RegexRule[] =
    alifLamRules.flatMap<RegexRule>(
        ([latinKeyAl, ArabicValAl]) => standardQomarDigraphConsonantRules.map<RegexRule>(
            ([latinKeyQomar, latinValQomar]) => [new RegExp(`(^|[${wordDelimitingPatterns}])(?:\\*)?${latinKeyAl}${latinKeyQomar}`),
                `$1` + 'al-' + latinValQomar]
        )
    );

const standardAlifLamQomarDigraphWithoutPrefixContinueRules: RegexRule[] =
    alifLamRules.flatMap<RegexRule>(
        ([latinKeyAl, ArabicValAl]) => standardQomarDigraphConsonantRules.map<RegexRule>(
            ([latinKeyQomar, latinValQomar]) => [new RegExp(`([aiu])\\s(?:\\*)?${latinKeyAl}${latinKeyQomar}`),
                `$1` + 'l-' + latinValQomar]
        )
    );

const standardAlifLamQomarDigraphWithPrefixRules: RegexRule[] =
    alifLamRules.flatMap<RegexRule>(
        ([latinKeyAl, ArabicValAl]) => standardQomarDigraphConsonantRules.flatMap<RegexRule>(
            ([latinKeyQomar, latinValQomar]) => prefixSyllableRules.map<RegexRule>(
                ([latinPrefix, arabPrefix]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${latinPrefix}(?:\\*)?${latinKeyAl}${latinKeyQomar}`),
                `$1` + 'l-' + latinValQomar]
            )
        )
    );

const standardAlifLamQomarMonographWithoutPrefixBeginningRules: RegexRule[] =
    alifLamRules.flatMap<RegexRule>(
        ([latinKeyAl, ArabicValAl]) => standardQomarMonographConsonantRules.map<RegexRule>(
            ([latinKeyQomar, latinValQomar]) => [new RegExp(`(^|[${wordDelimitingPatterns}])(?:\\*)?${latinKeyAl}${latinKeyQomar}`),
                `$1` + 'al-' + latinValQomar]
        )
    );

const standardAlifLamQomarMonographWithoutPrefixContinueRules: RegexRule[] =
    alifLamRules.flatMap<RegexRule>(
        ([latinKeyAl, ArabicValAl]) => standardQomarMonographConsonantRules.map<RegexRule>(
            ([latinKeyQomar, latinValQomar]) => [new RegExp(`([aiu])\\s(?:\\*)?${latinKeyAl}${latinKeyQomar}`),
                `$1` + 'l-' + latinValQomar]
        )
    );

const standardAlifLamQomarMonographWithPrefixRules: RegexRule[] =
    alifLamRules.flatMap<RegexRule>(
        ([latinKeyAl, ArabicValAl]) => standardQomarMonographConsonantRules.flatMap<RegexRule>(
            ([latinKeyQomar, latinValQomar]) => prefixSyllableRules.map<RegexRule>(
                ([latinPrefix, arabPrefix]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${latinPrefix}(?:\\*)?${latinKeyAl}${latinKeyQomar}`),
                `$1` + 'l-' + latinValQomar]
            )
        )
    );

// Syamsi
const standardAlifLamSyamsiDigraphWithoutPrefixBeginningRules: RegexRule[] =
    alifLamRules.flatMap<RegexRule>(
        ([latinKeyAl, ArabicValAl]) => standardSyamsiDigraphConsonantRules.map<RegexRule>(
            ([latinKeySyamsi, latinValSyamsi]) => [new RegExp(`(^|[${wordDelimitingPatterns}])(?:\\*)?${latinKeyAl}${latinKeySyamsi}(?:${latinKeySyamsi})?`),
                `$1` + 'a' + latinValSyamsi + '-' + latinValSyamsi]
        )
    );

const standardAlifLamSyamsiDigraphWithoutPrefixContinueRules: RegexRule[] =
    alifLamRules.flatMap<RegexRule>(
        ([latinKeyAl, ArabicValAl]) => standardSyamsiDigraphConsonantRules.map<RegexRule>(
            ([latinKeySyamsi, latinValSyamsi]) => [new RegExp(`([aiu])\\s(?:\\*)?${latinKeyAl}${latinKeySyamsi}(?:${latinKeySyamsi})?`),
                `$1` + latinValSyamsi + '-' + latinValSyamsi]
        )
    );

const standardAlifLamSyamsiDigraphWithPrefixRules: RegexRule[] =
    alifLamRules.flatMap<RegexRule>(
        ([latinKeyAl, ArabicValAl]) => standardSyamsiDigraphConsonantRules.flatMap<RegexRule>(
            ([latinKeySyamsi, latinValSyamsi]) => prefixSyllableRules.map<RegexRule>(
                ([latinPrefix, arabPrefix]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${latinPrefix}(?:\\*)?${latinKeyAl}${latinKeySyamsi}(?:${latinKeySyamsi})?`),
                `$1` + latinValSyamsi + '-' + latinValSyamsi]
            )
        )
    );

const standardAlifLamSyamsiMonographWithoutPrefixBeginningRules: RegexRule[] =
    alifLamRules.flatMap<RegexRule>(
        ([latinKeyAl, ArabicValAl]) => standardSyamsiMonographConsonantRules.map<RegexRule>(
            ([latinKeySyamsi, latinValSyamsi]) => [new RegExp(`(^|[${wordDelimitingPatterns}])(?:\\*)?${latinKeyAl}${latinKeySyamsi}(?:${latinKeySyamsi})?`),
                `$1` + 'a' + latinValSyamsi + '-' + latinValSyamsi]
        )
    );

const standardAlifLamSyamsiMonographWithoutPrefixContinueRules: RegexRule[] =
    alifLamRules.flatMap<RegexRule>(
        ([latinKeyAl, ArabicValAl]) => standardSyamsiMonographConsonantRules.map<RegexRule>(
            ([latinKeySyamsi, latinValSyamsi]) => [new RegExp(`([aiu])\\s(?:\\*)?${latinKeyAl}${latinKeySyamsi}(?:${latinKeySyamsi})?`),
                `$1` + latinValSyamsi + '-' + latinValSyamsi]
        )
    );

const standardAlifLamSyamsiMonographWithPrefixRules: RegexRule[] =
    alifLamRules.flatMap<RegexRule>(
        ([latinKeyAl, ArabicValAl]) => standardSyamsiMonographConsonantRules.flatMap<RegexRule>(
            ([latinKeySyamsi, latinValSyamsi]) => prefixSyllableRules.map<RegexRule>(
                ([latinPrefix, arabPrefix]) => [new RegExp(`(^|[${wordDelimitingPatterns}])${latinPrefix}(?:\\*)?${latinKeyAl}${latinKeySyamsi}(?:${latinKeySyamsi})?`),
                `$1` + latinValSyamsi + '-' + latinValSyamsi]
            )
        )
    );

// Standard Alif Lam End Rules
const gstandardAlifLamRules: Rule[] =
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
const gstandardDeleteAlifEndingRule: RegexRule[] = [
    [new RegExp(`A($|[${wordDelimitingPatterns}])`), `$1`]
];

////////// Special Rule Section //////////

// Standard Nun Tanwin Mim Start Rules
const standardMimNunWawYaLamRa = ['m', 'n', 'w', 'y', 'l', 'r'];

const standardNMeetSixRules: RegexRule[] =
    standardMimNunWawYaLamRa.map(
        ([letter]) => [new RegExp(`n\\s${letter}(?:${letter})?`), letter + ' ' + letter]
    );

const standardNMeetBa: RegexRule[] = [
    [new RegExp(`n\\sb`), 'm' + ' ' + 'b']
];

const standardMimMeetMim: RegexRule[] = [
    [new RegExp(`m\\sm(?:m)?`), 'm m']
];

// Standard Nun Tanwin Mim End Rules
const gstandardNunTanwinMimRules: Rule[] =
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

const standardIdghamMutaqaribainDifferentWordRules: RegexRule[] =
    standardIdghamMutaqaribainConsonantRules.map(
        ([precedeLetter, letter]) => [new RegExp(`${precedeLetter}\\s${letter}`), letter + ' ' + letter]
    );

const standardIdghamMutaqaribainSameWordRules: RegexRule[] =
    standardIdghamMutaqaribainConsonantRules.map(
        ([precedeLetter, letter]) => [new RegExp(`${precedeLetter}${letter}`), letter]
    );

const standardIdghamMutajanisainDifferentWordRules: RegexRule[] =
    standardIdghamMutajanisainConsonantRules.flatMap<RegexRule>(
        (groupLetter) => groupLetter.flatMap<RegexRule>(
            ([letterFirst]) => groupLetter.filter(
                ([letterSecond]) => {
                    if (letterFirst === letterSecond) {
                        return false;
                    } else {
                        return true;
                    }
                }
            ).map<RegexRule>(
                ([letterSecond]) => [new RegExp(`${letterFirst}\\s${letterSecond}`),
                    letterSecond + ' ' + letterSecond]
            )
        )
    );

const standardIdghamMutajanisainSameWordRules: RegexRule[] =
    standardIdghamMutajanisainConsonantRules.flatMap<RegexRule>(
        (groupLetter) => groupLetter.flatMap<RegexRule>(
            ([letterFirst]) => groupLetter.filter(
                ([letterSecond]) => {
                    if (letterFirst === letterSecond) {
                        return false;
                    } else {
                        return true;
                    }
                }
            ).map<RegexRule>(
                ([letterSecond]) => [new RegExp(`${letterFirst}${letterSecond}`),
                    letterSecond]
            )
        )
    );

// Standard Idgham Start Rules
const gstandardIdghamRules: Rule[] =
    chainRule(
        standardIdghamMutaqaribainDifferentWordRules,
        standardIdghamMutajanisainDifferentWordRules,

        standardIdghamMutaqaribainSameWordRules,
        standardIdghamMutajanisainSameWordRules
    );

///// Latin to Pegon End Rules
const arabToStandardLatinScheme: Rule[] = 
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
