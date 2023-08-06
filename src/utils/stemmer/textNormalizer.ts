import type { PlainTransliteration } from '../transliterator/transliterate'
import { transliterate } from '../transliterator/transliterate'
import { prepareRules } from '../transliterator/transliterate'

const textNormalizingRules: PlainTransliteration[] = [
    ["t_h", "th"],
    ["T_h", "th"],
    ["t_s", "ts"],
    ["h_h", "h"],
    ["k_h", "kh"],
    ["d_h", "dh"],
    ["d_H", "dh"],
    ["d_l", "dl"],
    ["d_z", "dz"],
    ["s_y", "sy"],
    ["s_h", "sh"],
    ["t_t", "t"],
    ["z_h", "zh"],
    ["g_h", "g"],
    ["n_g", "ng"],
    ["n_y", "ny"],
    ["e_u", "eu"],
    ["a_i", "ai"],
    ["a_u", "au"],
    ["^e", "e"],
    ["`a", "a"],
    ["`i", "i"],
    ["`u", "u"],
    ["`e", "e"],
    ["`o", "o"],
    ["`A", "a"],
    ["`I", "i"],
    ["`U", "u"],
    ["`E", "e"],
    ["`O", "o"],
    ["Y", "i"],
    ["O", "o"],
    ["A", "a"],
    ["U", "u"],
    ["G", "g"],
    ["oW", "o"],
    ["OW", "o"],
    ["Ho", "o"],
    ["uW", "u"],
    ["UW", "u"],
    ["Hu", "u"],
    ["Yu", "u"],
    ["Hi", "i"],
    ["Ha", "a"],
    ["Ya", "a"],
    ["Wa", "a"],
    ["He", "e"],
];

export const normalizeText =
    (reversibleString: string): string =>
    transliterate(reversibleString, prepareRules(textNormalizingRules));