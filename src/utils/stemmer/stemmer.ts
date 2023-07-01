import { StemmerIndonesia } from './stemmerIndonesia';
import { StemmerJawa } from './stemmerJawa';

export interface StemResult {
    baseWord: string;
    affixSequence: string[];
}

const stemmerIndonesia = new StemmerIndonesia()
const stemmerJawa = new StemmerJawa()

export function stem(kataAwal: string, bahasa: string): StemResult {
    const stemResultTemp: StemResult = {
        baseWord: '',
        affixSequence: [],
    };
    if (bahasa === "Jawa") {
        // Function Jawa Stemmer
        return stemmerJawa.stem(kataAwal);
    } else if (bahasa === "Sunda") {
        // Function Sunda Stemmer
        stemResultTemp.baseWord = kataAwal;
        return stemResultTemp;
    } else if (bahasa === "Madura") {
        // Function Madura Stemmer
        stemResultTemp.baseWord = kataAwal;
        return stemResultTemp;
    } else {
        // Function Indonesian Stemmer
        return stemmerIndonesia.stem(kataAwal);
    }
}