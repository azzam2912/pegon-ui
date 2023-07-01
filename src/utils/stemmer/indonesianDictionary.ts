import { kataDasarIndonesia } from './data/kataDasarIndonesia';

export class DictionaryCache {
   private static instance: DictionaryCache
   private cache: { word: string, isRoot: boolean }[] = []
   
   constructor() {
      if (!!DictionaryCache.instance) {
         return DictionaryCache.instance
      }
      DictionaryCache.instance = this
      return this
    }

   public set = (word: string, isRoot: boolean): void => {
      if (!this.recordExists(word)) {
         this.cache.push({
            word,
            isRoot
         })
      }
   }

   public get = (word: string) => {
      const cacheRecord = this.cache.find(x => {
         return x.word === word
      })

      if (cacheRecord) {
         return cacheRecord
      }
      
      return null
   }
    
   public recordExists = (word: string): boolean => {
      return !!this.get(word)
   }
}

export class IndonesianDictionary {
   private dictCache = new DictionaryCache()
   private arrayDict = kataDasarIndonesia

   public isRootWord(word: string) {
      return this.getData(word)
   }

   private getData(word: string) {
      if (this.dictCache.recordExists(word)) {
         return this.dictCache.get(word)?.isRoot
      }

      return this.setData(word)
   }

   private setData(word: string): boolean {
      const isRoot = this.getWordFromArrayDictionary(word)
      
      this.dictCache.set(word, isRoot)
      return isRoot
   }

   private getWordFromArrayDictionary(word: string): boolean {
      return this.arrayDict.includes(word)
   }
}
