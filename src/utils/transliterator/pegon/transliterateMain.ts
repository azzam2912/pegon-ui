import { stem, type StemResult } from "./stemmer/stemmer";
import { transliterateLatinToPegon, transliteratePegonToLatin, transliterateLatinToPegonStemResult, transliterateReversibleLatinToStandardLatin } from "./transliterate";
import { transliterateLatinToArab, transliterateArabToLatin, transliterateLatinArabToStandardLatin } from "./arab";

export interface TransliterateResult {
    translitrateResult: string;
    standardLatin: string;
}

export const transliterateFromView = (stringToTransliterate: string, isLatinToPegon: boolean, lang: string): TransliterateResult => {
    let transliterateResult: TransliterateResult = {
        translitrateResult: '',
        standardLatin: '',
    };

    let sliceBracket = /(.*)(\()([^()]*)(\))(.*)/;
    let regexResult = sliceBracket.exec(stringToTransliterate);
    if (regexResult !== null) {
        let leftSideBracket = regexResult[1];
        let insideBracket = regexResult[3];
        let rightSideBracket = regexResult[5];
        
        // Regex is greedy algorithm, match from right first
        let leftSideString: TransliterateResult = transliterateFromView(leftSideBracket, isLatinToPegon, lang);
        let middleSideString = isLatinToPegon ? transliterateLatinToArab(insideBracket) : transliterateArabToLatin(insideBracket);
        let middleSideStandardString = isLatinToPegon ?
                        transliterateLatinArabToStandardLatin(insideBracket) :
                        transliterateLatinArabToStandardLatin(middleSideString);
        let rightSideString = isLatinToPegon ? stemLatinToPegon(rightSideBracket, lang) : transliteratePegonToLatin(rightSideBracket, lang);
        let rightSideStandardString = isLatinToPegon ?
                       transliterateReversibleLatinToStandardLatin(rightSideBracket) :
                       transliterateReversibleLatinToStandardLatin(rightSideString);

        transliterateResult.translitrateResult = leftSideString.translitrateResult + "(" + middleSideString + ")" + rightSideString;
        transliterateResult.standardLatin = leftSideString.standardLatin + "(" + middleSideStandardString + ")" + rightSideStandardString;
        return transliterateResult;
    } else {
        if (isLatinToPegon) {
            transliterateResult.translitrateResult = stemLatinToPegon(stringToTransliterate, lang);
            transliterateResult.standardLatin = transliterateReversibleLatinToStandardLatin(stringToTransliterate);
            return transliterateResult;
        } else {
            transliterateResult.translitrateResult = transliteratePegonToLatin(stringToTransliterate, lang);
            transliterateResult.standardLatin = transliterateReversibleLatinToStandardLatin(transliterateResult.translitrateResult);
            return transliterateResult;
        }
    }
}

// Stem is used only when latin to pegon
const stemLatinToPegon = (text: string, lang: string): string => {
    const words = text.split(" ");
    let result = new Array<String>();
    for (let index = 0; index < words.length; index++) {
      const stemResult: StemResult = stem(words[index], lang);
      if (stemResult.affixSequence.length != 0) 
        result[index] = transliterateLatinToPegonStemResult(stemResult, lang);
      else
        result[index] = transliterateLatinToPegon(stemResult.baseWord);
    }
    return result.join(" ");
}
