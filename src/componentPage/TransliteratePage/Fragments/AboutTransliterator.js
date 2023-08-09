import { Heading, Text } from "@chakra-ui/react";
import React from "react";


// ini bisa jadi bahan FAQ (Pindah ajah ke FAQ aja)
export const AboutTransliterator = () => {
  return (
    <>
      <Heading as="h3" size="md" mb={4}>
        Transliterator
      </Heading>
      <Text>
        Transliterator ini dapat mengubah dari abjad latin ke abjad pegon maupun
        sebaliknya.
      </Text>
      <Text mt={4}>
        Untuk mengubah arah transliterasi, bisa menekan tombol dua panah yang
        ada di tengah layar.
      </Text>
      <Heading as="h3" size="md" mt={8} mb={4}>
        Penggunaan tulisan arab
      </Heading>
      <Text>
        Tidak jarang pada karangan pegon terdapat kalimat-kalimat arab yang
        penulisannya berbeda dengan kalimat pada tulisan pegon.
      </Text>
      <Text mt={4}>
        Untuk mengubahnya ke/dari arab, bisa meletakkan kalimat yang ingin
        ditranslasikan ke dalam tanda kurung.
      </Text>
      <Text mt={4}>Sebagai contoh:</Text>
      <Text fontStyle="italic" fontWeight="bold">
        bacalah (bismi *allahi) sebelum makan
      </Text>
      <Text mt={2}>باچالَه (بِسۡمِ ٱللَّهِ) سَيبَيلوم مَكان</Text>
      <Heading as="h3" size="md" mt={8} mb={4}>
        Memilih Bahasa
      </Heading>
      <Text>
        Bahasa ini digunakan untuk memisahkan aturan kata berimbuhan yang
        memiliki aturan berbeda dengan kata tak berimbuhan.
      </Text>
    </>
  );
};
