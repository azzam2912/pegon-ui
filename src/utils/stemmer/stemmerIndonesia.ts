import type { StemResult } from "./stemmer";
import { IndonesianDictionary } from "./indonesianDictionary";
import { StemmerCache } from "./stemmerCache";
import { suffixRules } from "./indonesianStemmingRules";
import { prefixRules } from "./indonesianStemmingRules";
import { satisfyRulePrecedenceAdjustment } from "./indonesianStemmingRules";
import { hasInvalidAffixPair } from "./indonesianStemmingRules";
import { normalizeText } from "./textNormalizer";

export class StemmerIndonesia {
    private idnDict = new IndonesianDictionary()
    private cache = new StemmerCache()

    public stem(word: string): StemResult {
        return this.getData(word)
    }

    private getData(word: string): StemResult  {
        const dataFromCache = this.cache.get(word)
        if (!!dataFromCache) {
            return dataFromCache.result
        }

        return this.setData(word)
    }

    private setData(word: string): StemResult {
        const context = new Context(word, this.idnDict)
        const result = context.execute()
      
        this.cache.set(word, result)

        return result
    }
}

class Context {
    private originalWord: string
    private currentWord: string
    private currentRemoved: string[]
    private result: StemResult
    private dictionary: IndonesianDictionary

    constructor(originalWord: string, dictionary: IndonesianDictionary) {
        this.originalWord = originalWord
        this.currentWord = originalWord
        this.result = {
            baseWord: originalWord,
            affixSequence: []
        }
        this.dictionary = dictionary
        this.currentRemoved = []
    }


    public execute(): StemResult {
        this.stem()
        this.recodeAffixes()
        this.result.baseWord = this.currentWord
        this.result.affixSequence = this.currentRemoved
        return this.result
    }

    private stem(): void {
        if ( this.dictionary.isRootWord(normalizeText(this.currentWord)) )
            return

        if(hasInvalidAffixPair(this.currentWord)) {
            this.removePrefixes()

            if ( this.dictionary.isRootWord(normalizeText(this.currentWord)) )
                return

            this.currentWord = this.originalWord
            this.currentRemoved = []

            this.removeSuffixes()

            return
        }

        if (satisfyRulePrecedenceAdjustment(this.currentWord)){
            this.removePrefixes()

            if ( this.dictionary.isRootWord(this.currentWord) )
                return

            this.removeSuffixes()

            if ( this.dictionary.isRootWord(normalizeText(this.currentWord)) )
                return
            else {
                this.currentWord = this.originalWord
                this.currentRemoved = []
            }

        } 

        this.removeSuffixes()

        if ( this.dictionary.isRootWord(normalizeText(this.currentWord)) )
            return

        if (this.countSyllable(this.currentWord) <= 2) {
            this.currentWord = this.originalWord
            this.currentRemoved = []
        }

        this.removePrefixes()

        return
        
    }

    private removeSuffixes(): void {
        let res: string = this.currentWord
        let removed: string[] = []
        let temp: string[] = []

        for(var rule of suffixRules) {
            [res, removed] = rule(this.currentWord)
            this.currentWord = res
            //this.currentRemoved = [...removed, ...this.currentRemoved]
            temp = [...removed, ...temp]
            if ( this.dictionary.isRootWord(normalizeText(this.currentWord)) ){
                this.currentRemoved = [...this.currentRemoved, ...temp]
                return
            }
        }
        this.currentRemoved = [...this.currentRemoved, ...temp]
        return 
    }

    private removePrefixes(): void {
        let res: string = this.currentWord
        let removed: string[] = []
        let temp: string[] = []

        for (var ruleArr of prefixRules) {
          if ( this.dictionary.isRootWord(normalizeText(this.currentWord))){
             return
          }

        for (var rule of ruleArr) {
            [res, removed] = rule(this.currentWord)
            if ( this.dictionary.isRootWord(normalizeText(res)) ) {
                this.currentWord = res
                temp = [...temp, ...removed]
                this.currentRemoved = [...temp, ...this.currentRemoved]
                return              
            }
        }

        if (removed.length !== 0)
            this.currentWord = res
        temp = [...temp, ...removed]
       }
       this.currentRemoved = [...temp, ...this.currentRemoved]
       return
    }

    private recodeAffixes(): void {
        for (let i=0; i<this.currentRemoved.length; i++) {
            const prefixMatches = this.currentRemoved[i].match(/^(n_g\^e|n_g|n_y|r|n|m)-$/)
            if(prefixMatches) {
                if (this.currentWord[0].match(/[bcdfghjklmnpqrstvwxyz]/) && prefixMatches[1] !== 'n_g^e') {
                    this.currentWord = prefixMatches[1]+this.currentWord.substring(1)
                } 
                else {
                    this.currentWord = prefixMatches[1]+this.currentWord
                }

                this.currentRemoved.splice(i, 1)
                break
            }
        }
    }

    private countSyllable(word: string): number {
        const matches = word.match(/[aiueo]{1}/g)
        if (matches)
            return matches.length
        return 0
    }
}

