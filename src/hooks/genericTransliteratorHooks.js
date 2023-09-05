import * as Cham from "src/utils/transliterator/cham/transliterate";
import * as Baybayin from "src/utils/transliterator/baybayin/transliterate";
import * as Hanunoo from "src/utils/transliterator/hanunoo/transliterate";
import * as Buhid from "src/utils/transliterator/buhid/transliterate";
import * as Tagbanwa from "src/utils/transliterator/tagbanwa/transliterate";
import * as JawiCham from "src/utils/transliterator/jawi-cham/transliterate";
import * as Toba from "src/utils/transliterator/batak/toba";
import * as Karo from "src/utils/transliterator/batak/karo";
import * as Mandailing from "src/utils/transliterator/batak/mandailing";
import * as Pakpak from "src/utils/transliterator/batak/pakpak";
import * as Simalungun from "src/utils/transliterator/batak/simalungun";
import * as Rejang from "src/utils/transliterator/ulu/rejang";
import * as Makassar from "src/utils/transliterator/lontaraq/makassar";
import * as Bugis from "src/utils/transliterator/lontaraq/lontara";
import * as KayahLi from "src/utils/transliterator/mon-burmese/kayah-li";
import * as Mon from "src/utils/transliterator/mon-burmese/mon";

const genericTransliteratorHook =
  (initIME, toLatin, fromLatin, toStandardLatin) =>
  (inputText, setInputText, isLatinInput) => {
    const ime = initIME();

    const inputMethodEdit = (text) => {
      const lastSpaceIndex = text.lastIndexOf(" ") + 1;
      const lastWord = text.slice(lastSpaceIndex);
      return text.slice(0, lastSpaceIndex).concat(ime.inputEdit(lastWord));
    };

    const transliterate = (useLatinInput) => {
      let outputText;
      if (!useLatinInput) {
        setInputText(inputMethodEdit(inputText));
        outputText = toLatin(inputText);
        return {
          outputText: outputText,
          standardLatin: toStandardLatin(outputText),
        };
      } else {
        return {
          outputText: fromLatin(inputText),
          standardLatin: toStandardLatin(inputText),
        };
      }
    };

    return transliterate(isLatinInput);
  };

export const useChamTransliterator = genericTransliteratorHook(
  Cham.initIME,
  Cham.toLatin,
  Cham.fromLatin,
  Cham.toStandardLatin,
);

export const useKayahLiTransliterator = genericTransliteratorHook(
  KayahLi.initIME,
  KayahLi.toLatin,
  KayahLi.fromLatin,
  KayahLi.toStandardLatin,
);

export const useBaybayinTransliterator = genericTransliteratorHook(
  Baybayin.initIME,
  Baybayin.toLatin,
  Baybayin.fromLatin,
  Baybayin.toStandardLatin,
);

export const useBuhidTransliterator = genericTransliteratorHook(
  Buhid.initIME,
  Buhid.toLatin,
  Buhid.fromLatin,
  Buhid.toStandardLatin,
);

export const useHanunooTransliterator = genericTransliteratorHook(
  Hanunoo.initIME,
  Hanunoo.toLatin,
  Hanunoo.fromLatin,
  Hanunoo.toStandardLatin,
);

export const useTagbanwaTransliterator = genericTransliteratorHook(
  Tagbanwa.initIME,
  Tagbanwa.toLatin,
  Tagbanwa.fromLatin,
  Tagbanwa.toStandardLatin,
);

export const useJawiChamTransliterator = genericTransliteratorHook(
  JawiCham.initIME,
  JawiCham.toLatin,
  JawiCham.fromLatin,
  JawiCham.toStandardLatin,
);

export const useTobaTransliterator = genericTransliteratorHook(
  Toba.initIME,
  Toba.toLatin,
  Toba.fromLatin,
  Toba.toStandardLatin,
);

export const useKaroTransliterator = genericTransliteratorHook(
  Karo.initIME,
  Karo.toLatin,
  Karo.fromLatin,
  Karo.toStandardLatin,
);

export const useMandailingTransliterator = genericTransliteratorHook(
  Mandailing.initIME,
  Mandailing.toLatin,
  Mandailing.fromLatin,
  Mandailing.toStandardLatin,
);

export const usePakpakTransliterator = genericTransliteratorHook(
  Pakpak.initIME,
  Pakpak.toLatin,
  Pakpak.fromLatin,
  Pakpak.toStandardLatin,
);

export const useSimalungunTransliterator = genericTransliteratorHook(
  Simalungun.initIME,
  Simalungun.toLatin,
  Simalungun.fromLatin,
  Simalungun.toStandardLatin,
);

export const useRejangTransliterator = genericTransliteratorHook(
  Rejang.initIME,
  Rejang.toLatin,
  Rejang.fromLatin,
  Rejang.toStandardLatin,
);

export const useMakassarTransliterator = genericTransliteratorHook(
  Makassar.initIME,
  Makassar.toLatin,
  Makassar.fromLatin,
  Makassar.toStandardLatin,
);

export const useBugisTransliterator = genericTransliteratorHook(
  Bugis.initIME,
  Bugis.toLatin,
  Bugis.fromLatin,
  Bugis.toStandardLatin,
);

export const useMonTransliterator = genericTransliteratorHook(
  Mon.initIME,
  Mon.toLatin,
  Mon.fromLatin,
  Mon.toStandardLatin,
);