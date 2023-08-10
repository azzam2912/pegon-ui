type Kayahli = [string,  string]

const VowelRumKayahli: Kayahli[] = [
    ["a" , "\uA922"],
    ["o_e" , "\uA923"],
    ["i" , "\uA924"],
    ["o_o" , "\uA925"],
    ["u_e" , "\uA926"],
    ["e" , "\uA927"],
    ["u" , "\uA928"],
    ["e_e" , "\uA929"],
    ["o" , "\uA92A"],
]

const TonedRumKayahli: Kayahli[] = VowelRumKayahli.flatMap(([a, b]) => {
    const vowel = a;
    const vowel_high = a + "_3";
    const vowel_low = a + "_1";
    const vowel_mid = a + "_2";

    const uncod = b;
    const uncod_high = b + "\uA92B";
    const uncod_low = b + "\uA92C";
    const uncod_mid = b + "\uA92D";

    return [
        [vowel_high, uncod_high],
        [vowel_low, uncod_low],
        [vowel_mid, uncod_mid],
        [vowel, uncod],
    ];
});

const SingleConsonantRumKayahli : Kayahli[] = [
    ["k" , "\uA90A"],
    ["k_h" , "\uA90B"],
    ["g" , "\uA90C"],
    ["n_g" , "\uA90D"],
    ["s" , "\uA90E"],
    ["s_h" , "\uA90F"],
    ["z" , "\uA910"],
    ["n_y" , "\uA911"],
    ["t" , "\uA912"],
    ["h_t" , "\uA913"],
    ["n" , "\uA914"],
    ["p" , "\uA915"],
    ["p_h" , "\uA916"],
    ["m" , "\uA917"],
    ["d" , "\uA918"],
    ["b" , "\uA919"],
    ["r" , "\uA91A"],
    ["y" , "\uA91B"],
    ["l" , "\uA91C"],
    ["w" , "\uA91D"],
    ["t_h" , "\uA91E"],
    ["h" , "\uA91F"],
    ["v" , "\uA920"],
    ["c" , "\uA921"],
]

const TotalRumKayahli: Kayahli[] = [...TonedRumKayahli, ...SingleConsonantRumKayahli];


const TotalKayahliRum: Kayahli[] = TotalRumKayahli.map(([a, b]) => {
    return [b, a];
});


function transliterate(stringToTranslate: string, translationMap: Kayahli[]): 
    string {
        let translatedString: string = translationMap.reduce<string>((acc, [key, val]) => acc.replace(new RegExp(key, 'gi'), val),
        stringToTranslate.slice()
    )
    return translatedString;
}


function chainTransliterate(inputString: string, transliterationRules: Kayahli[][]):
    string {
        let outputString = transliterationRules.reduce<string>(
        (acc, rule) => transliterate(acc, rule),
        inputString.slice()
    )
    return outputString;
}

export function transliterateLatinToKayahli(latinString: string): 
    string {
    let firstLetter = transliterate(latinString.charAt(0), TotalRumKayahli);
    return "\u200E".concat(
        chainTransliterate(firstLetter.concat(latinString.slice(1)),
                           [TotalRumKayahli]));
}

export function transliterateKayahliToLatin(latinString: string): 
    string {
    let firstLetter = transliterate(latinString.charAt(0), TotalKayahliRum);
    return "\u200E".concat(
        chainTransliterate(firstLetter.concat(latinString.slice(1)),
                           [TotalKayahliRum]));
}
