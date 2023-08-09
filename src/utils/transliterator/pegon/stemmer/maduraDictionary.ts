import { kataDasarMadura } from './data/kataDasarMadura';
 

export class MaduraDictionary {
    private arrayDict = kataDasarMadura

    public isRootWord = (word: string) => {
        return this.arrayDict.includes(word)
     }
  
}