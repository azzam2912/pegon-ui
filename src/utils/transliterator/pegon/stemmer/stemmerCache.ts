import type { StemResult } from "./stemmer";

export class StemmerCache {
   private static instance: StemmerCache;
   private cache: { word: string, result: StemResult }[] = [];
   
   constructor() {
      if (!!StemmerCache.instance) {
         return StemmerCache.instance;
      }
      StemmerCache.instance = this;
      return this;
    }

   public set = (word: string, result: StemResult): void => {
      if (!this.recordExists(word)) {
         this.cache.push({
            word,
            result
         });
      }
   }

   public get = (word: string) => {
      const cacheRecord = this.cache.find(x => {
         return x.word === word;
      });

      if (cacheRecord) {
         return cacheRecord;
      }
      
      return null;
   }
    
   public recordExists = (word: string): boolean => {
      return !!this.get(word);
   }
}