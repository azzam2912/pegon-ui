type Kawi = [string,  string]

const BaseCase : Kawi[] = [
    ["ka" , "\u11F12"],
    ["kha" , "\u11F13"],
    ["ga" , "\u11F14"],
    ["gha" , "\u11F15"],
    ["nga" , "\u11F16"],
    ["ca" , "\u11F17"],
    ["cha" , "\u11F18"],
    ["ja" , "\u11F19"],
    ["jha" , "\u11F1A"],
    ["nya" , "\u11F1B"],
    ["tta" , "\u11F1C"],
    ["ttha" , "\u11F1D"],
    ["dda" , "\u11F1E"],
    ["ddha" , "\u11F1F"],
    ["nna" , "\u11F20"],
    ["ta" , "\u11F21"],
    ["tha" , "\u11F22"],
    ["da" , "\u11F23"],
    ["dha" , "\u11F24"],
    ["na" , "\u11F25"],
    ["pa" , "\u11F26"],
    ["pha" , "\u11F27"],
    ["ba" , "\u11F28"],
    ["bha" , "\u11F29"],
    ["ma" , "\u11F2A"],
    ["ya" , "\u11F2B"],
    ["ra" , "\u11F2C"],
    ["la" , "\u11F2D"],
    ["wa" , "\u11F2E"],
    ["sha" , "\u11F2F"],
    ["ssa" , "\u11F30"],
    ["sa" , "\u11F31"],
    ["sa" , "\u11F32"],
    ["sa" , "\u11F33"],
]

const SyllabelsRumKawi: Kawi[] = BaseCase.flatMap(([a, b]) => {
    const vowel_a = a;
    const vowel_aa = a.slice(0, -1) + "a_a";
    const vowel_i = a.slice(0, -1) + "i";
    const vowel_ii = a.slice(0, -1) + "i_i";
    const vowel_u = a.slice(0, -1) + "u";
    const vowel_uu = a.slice(0, -1) + "u_u";
    const vowel_e = a.slice(0, -1) + "e";
    const vowel_ai = a.slice(0, -1) + "ai";
    const vowel_eu = a.slice(0, -1) + "e_u";

    const uncod_a = b;
    const uncod_aa = b + "\u11F34";
    const uncod_i = b + "\u11F36";
    const uncod_ii = b + "\u11F37";
    const uncod_u = b + "\u11F38";
    const uncod_uu = b + "\u11F39";
    const uncod_e = b + "\u11F3E";
    const uncod_ai = b + "\u11F3F";
    const uncod_eu = b + "\u11F40";

    return [
        [vowel_a, uncod_a],
        [vowel_aa, uncod_aa],
        [vowel_i, uncod_i],
        [vowel_ii, uncod_ii],
        [vowel_u, uncod_u],
        [vowel_uu, uncod_uu],
        [vowel_e, uncod_e],
        [vowel_ai, uncod_ai],
        [vowel_eu, uncod_eu],
    ];
});

const ConsonantsRumKawi: Kawi[] = BaseCase.map(([a, b]) => {
    const consonant = a.slice(0, -1);
    const uncod = b + "\u11F41";
    return [consonant, uncod];
});

const VowelsRumKawi: Kawi[] = [
    ["a" , "\u11F12"],
    ["a_a" , "\u11F13"],
    ["i" , "\u11F14"],
    ["i_i" , "\u11F15"],
    ["u" , "\u11F16"],
    ["u_u" , "\u11F17"],
    ["e" , "\u11F16"],
    ["ai" , "\u11F17"],
    ["o" , "\u11F16"],
]

const SingleRumKawi: Kawi[] = [...ConsonantsRumKawi, ...VowelsRumKawi];


const SyllabelsKawiRum: Kawi[] = SyllabelsRumKawi.map(([a, b]) => {
    return [b, a];
});

const SingleKawiRum: Kawi[] = SingleRumKawi.map(([a, b]) => {
    return [b, a];
});


function transliterate(stringToTranslate: string, translationMap: Kawi[]): 
    string {
        let translatedString: string = translationMap.reduce<string>((acc, [key, val]) => acc.replace(new RegExp(key, 'gi'), val),
        stringToTranslate.slice()
    )
    return translatedString;
}


function chainTransliterate(inputString: string, transliterationRules: Kawi[][]):
    string {
        let outputString = transliterationRules.reduce<string>(
        (acc, rule) => transliterate(acc, rule),
        inputString.slice()
    )
    return outputString;
}

export function transliterateLatinToKawi(latinString: string): 
    string {
    let firstLetter = transliterate(latinString.charAt(0), SingleRumKawi);
    return "\u200E".concat(
        chainTransliterate(firstLetter.concat(latinString.slice(1)),
                           [SingleRumKawi, SyllabelsRumKawi]));
}

export function transliterateKawiToLatin(latinString: string): 
    string {
    let firstLetter = transliterate(latinString.charAt(0), SingleKawiRum);
    return "\u200E".concat(
        chainTransliterate(firstLetter.concat(latinString.slice(1)),
                           [SingleKawiRum, SyllabelsKawiRum]));
}