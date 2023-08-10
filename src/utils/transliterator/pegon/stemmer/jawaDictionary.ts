import { kataDasarJawa } from './data/kataDasarJawa';
 

export class JawaDictionary {
    private arrayDict = kataDasarJawa

    public isRootWord(word: string): boolean {
        return this.arrayDict.includes(word)
     }
  
}
