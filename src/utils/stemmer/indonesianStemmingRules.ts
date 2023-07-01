export const hasInvalidAffixPair = (input: string): boolean => {
    if (input === 'ketahui')
        return false

    const invalid_affixes = [
            /^b\^er(.*)i$/,
            /^di(.*)(?<!k)an$/,
            /^k\^e(.*)i$/,
            /^k\^e(.*)kan$/,
            /^m\^e(.*)(?<!k)an$/,
            /^t\^er(.*)(?<!k)an$/,
        ]
    
    for (let rule of invalid_affixes) {
        if (input.match(rule))
            return true
    }

    return false
}

export const satisfyRulePrecedenceAdjustment = (input: string): boolean => {
    const rules = [
            /^b\^e(.*)lah$/,
            /^b\^e(.*)an$/,
            /^m\^e(.*)i$/,
            /^di(.*)i$/,
            /^p\^e(.*)i$/,
            /^t\^er(.*)i$/
        ]

    for (let rule of rules) {
        if (input.match(rule))
            return true
    }

    return false
}

const deleteInflectionalParticle = (input: string): [string, string[]] => {
    //Hapus suffiks -lah,-kah,-tah,-pun
    var regex = /(.*)(lah|kah|tah|pun)$/
    const matches = input.match(regex)
    if (matches) {
        return [matches[1], ['-'+matches[2]] ]
    }
    return [input, []]
}

const deletePosessivePronouns = (input: string): [string, string[]] => {
    //Hapus suffiks -ku,-mu, -nya
    var regex = /(.*)(ku|mu|n_ya)$/
    const matches = input.match(regex)
    if (matches) {
        return [matches[1], ['-'+matches[2]] ]
    }
    return [input, []]
}

const deleteDerivationalSuffix = (input: string): [string, string[]] => {
    //Hapus suffiks -i, -kan, -an
    var regex = /(.*)(i|kan|(?<!k)an)$/
    const matches = input.match(regex)
    if (matches) {
        return [matches[1], ['-'+matches[2]] ]
    }
    return [input, []]
}

const deletePlainPrefix = (input: string): [string, string[]] => {
    //Hapus prefix di-, ke-, se-
    var regex = /^(di|k\^e|s\^e)(.*)/
    const matches = input.match(regex)
    if (matches) {
        return [matches[2], [matches[1]+'-'] ]
    }
    return [input, []]
}

const deletePrefixRule1a = (input: string): [string, string[]] => {
    // ber-V, V=Vowel
    var regex = /^(b\^er)([aiueo]|\^e)(.*)/
    const matches = input.match(regex)
    if (matches) {
        return [matches[2]+matches[3], ['b\^e-', 'r-'] ]
    }
    return [input, []]
}

const deletePrefixRule1b = (input: string): [string, string[]] => {
    // be-rV, V=Vowel
    var regex = /^(b\^e)(r[aiueo]|r\^e)(.*)/
    const matches = input.match(regex)
    if (matches) {
        return [matches[2]+matches[3], ['b\^e-'] ]
    }
    return [input, []]
}

const deletePrefixRule2 = (input: string): [string, string[]] => {
    // ber-CAP, where C!=r and P!=er, C=Consonant, A=any, P=Particle
    var regex = /^(b\^er)([bcdfghjklmnpqstvwxyz])([a-z]|\^e)(.*)/
    const matches = input.match(regex)
    if (matches && (!matches[4].match(/(^er|er)(.*)/)) ) {
        return [matches[2] + matches[3] + matches[4], ['b\^er-']]
    }
    return [input, []]
}

const deletePrefixRule3 = (input: string): [string, string[]] => {
    // ber-CAerV, where C!=r, C=Consonant, A=any, V=Vowel
    var regex = /^(b\^er)([bcdfghjklmnpqstvwxyz])([a-z]|\^e)(er|\^er)([aiueo]|\^e)(.*)/
    const matches = input.match(regex)
    if (matches) {
        return [matches[2]+matches[3]+matches[4]+matches[5]+matches[6], ['ber-']]
    }
    return [input, []]
}

const deletePrefixRule4 = (input: string): [string, string[]] => {
    if (input === 'b\^elajar') {
        return ['lajar', ['b\^e-']]
    }
    return [input, []]
}

const deletePrefixRule5 = (input: string): [string, string[]] => {
    // be-C1erC2, where C1!={r|l}, C=Consonant
    var regex = /^(b\^e)([bcdfghjkmnpqstvwxyz])(er|\^er)([bcdfghjklmnpqrstvwxyz])(.*)$/
    const matches = input.match(regex)
    if (matches) {
        return [matches[2]+matches[3]+matches[4]+matches[5], ['b\^e-']]
    }
    return [input, []]
}

const deletePrefixRule6a = (input: string): [string, string[]] => {
    // ter-V, V=Vowel
    var regex = /^(t\^er)([aiueo]|\^e)(.*)/
    const matches = input.match(regex)
    if (matches) {
        return [matches[2]+matches[3], ['t\^e-', 'r-']]
    }
    return [input, []]
}

const deletePrefixRule6b = (input: string): [string, string[]] => {
    // te-rV, V=Vowel
    var regex = /^(t\^e)(r[aiueo]|r\^e)(.*)/
    const matches = input.match(regex)
    if (matches) {
        return [matches[2]+matches[3], ['t\^e-']]
    }
    return [input, []]
}

const deletePrefixRule7 = (input: string): [string, string[]] => {
    // ter-CerV where C!=r
    var regex = /^(t\^er)([bcdfghjklmnpqstvwxyz])(\^er|er)([aiueo]|\^e)(.*)/
    const matches = input.match(regex)
    if (matches) {
        return [matches[2]+matches[3]+matches[4]+matches[5], ['t\^er-']]
    }
    return [input, []]
}

const deletePrefixRule8 = (input: string): [string, string[]] => {
    // ter-CP where C!=r and P!=er
    var regex = /^(t\^er)([bcdfghjklmnpqstvwxyz])(.*)/
    const matches = input.match(regex)
    if (matches && (!matches[3].match(/^(\^er|er)(.*)/)) ) {
        return [matches[2]+matches[3], ['t\^er-']]
    }
    return [input, []]
}

const deletePrefixRule9 = (input: string): [string, string[]] => {
    // te-C1erC2, where C1!=r, C=Consonant
    var regex = /^(t\^e)([bcdfghjklmnpqstvwxyz])(er|\^er)([bcdfghjklmnpqrstvwxyz])(.*)$/
    const matches = input.match(regex)
    if (matches) {
        return [matches[2]+matches[3]+matches[4]+matches[5], ['t\^e-']]
    }
    return [input, []]
}

const deletePrefixRule10 = (input: string): [string, string[]] => {
    // me-{l|r|w|y}V, V=Vowel
    var regex = /^(m\^e)([lrwy])([aiueo]|\^e)(.*)/
    const matches = input.match(regex)
    if (matches) {
        return [matches[2]+matches[3]+matches[4], ['m\^e-']]
    }
    return [input, []]
}

const deletePrefixRule11 = (input: string): [string, string[]] => {
    // mem-{b|f|v}
    var regex = /^(m\^em)([bfv].*)/
    const matches = input.match(regex)
    if (matches) {
        return [matches[2], ['m\^em-']]
    }
    return [input, []]
}

const deletePrefixRule12 = (input: string): [string, string[]] => {
    // mem-pe
    var regex = /^(m\^em)(p\^e|pe)(.*)/
    const matches = input.match(regex)
    if (matches) {
        return [matches[2]+matches[3], ['m\^em-']]
    }
    return [input, []]
}

const deletePrefixRule13a = (input: string): [string, string[]] => {
    // me-m{rV|V} 
    var regex = /^(m\^e)(m[aiueo]|m\^e)(.*)/
    const matches = input.match(regex)
    if (matches) {
        return [matches[2]+matches[3], ['m\^e-']]
    }
    return [input, []]
}

const deletePrefixRule13b = (input: string): [string, string[]] => {
    // me-p{rV|V} 
    var regex = /^(m\^em)([aiueo]|\^e)(.*)/
    const matches = input.match(regex)
    if (matches) {
        return ['p'+matches[2]+matches[3], ['m\^e-', 'm-']]
    }
    return [input, []]
}

const deletePrefixRule14 = (input: string): [string, string[]] => {
    // men-{c||d|j|z} 
    var regex = /^(m\^en)([cdjzst].*)/
    const matches = input.match(regex)
    if (matches) {
        return [matches[2], ['m\^en-']]
    }
    return [input, []]
}

const deletePrefixRule15a = (input: string): [string, string[]] => {
    // me-nV
    var regex = /^(m\^e)(n[aiueo]|\^e)(.*)/
    const matches = input.match(regex)
    if (matches) {
        return [matches[2]+matches[3], ['m\^e-']]
    }
    return [input, []]
}

const deletePrefixRule15b = (input: string): [string, string[]] => {
    // me-tV
    var regex = /^(m\^en)([aiueo]|\^e)(.*)/
    const matches = input.match(regex)
    if (matches) {
        return ['t'+matches[2]+matches[3], ['m\^e-', 'n-']]
    }
    return [input, []]
}

const deletePrefixRule16 = (input: string): [string, string[]] => {
    // meng-{g|h|k|q}
    var regex = /^(m\^en_g)([ghqk].*)/
    const matches = input.match(regex)
    if (matches) {
        return [matches[2], ['m\^en_g-']]
    }
    return [input, []]
}

const deletePrefixRule17a = (input: string): [string, string[]] => {
    // meng-V
    var regex = /^(m\^en_g)([aiueo]|\^e)(.*)/
    const matches = input.match(regex)
    if (matches) {
        return [matches[2]+matches[3], ['m\^e-', 'n_g-']]
    }
    return [input, []]
}

const deletePrefixRule17b = (input: string): [string, string[]] => {
    // meng-kV
    var regex = /^(m\^en_g)([aiueo]|\^e)(.*)/
    const matches = input.match(regex)
    if (matches) {
        return ['k'+matches[2]+matches[3], ['m\^e-', 'n_g-']]
    }
    return [input, []]
}

const deletePrefixRule17c = (input: string): [string, string[]] => {
    // meng-V where V=e
    var regex = /^(m\^e)(n_g\^e|n_ge)(.*)/
    const matches = input.match(regex)
    if (matches) {
        return [matches[3], ['m\^e-', matches[2]+'-']]
    }
    return [input, []]
}

const deletePrefixRule17d = (input: string): [string, string[]] => {
    // me-ngV, ex=mengerikan
    var regex = /^(m\^en_g)([aiueo]|\^e)(.*)/
    const matches = input.match(regex)
    if (matches) {
        return ['n_g'+matches[2]+matches[3], ['m\^e-']]
    }
    return [input, []]
}

const deletePrefixRule18a = (input: string): [string, string[]] => {
    // me-nyV, ex=menyala
    var regex = /^(m\^en_y)([aiueo]|\^e)(.*)/
    const matches = input.match(regex)
    if (matches) {
        return ['n_y'+matches[2]+matches[3], ['m\^e-']]
    }
    return [input, []]
}

const deletePrefixRule18b = (input: string): [string, string[]] => {
    // meny-sV
    var regex = /^(m\^en_y)([aiueo]|\^e)(.*)/
    const matches = input.match(regex)
    if (matches) {
        return ['s'+matches[2]+matches[3], ['m\^e-','n_y-']]
    }
    return [input, []]
}


const deletePrefixRule19 = (input: string): [string, string[]] => {
    // mem-pA where A!=e
    var regex = /^(m\^emp)([abcdfghijklmnopqrstuvwxyz].*)/
    const matches = input.match(regex)
    if (matches) {
        return ['p'+matches[2], ['m\^em-']]
    }
    return [input, []]
}

const deletePrefixRule20 = (input: string): [string, string[]] => {
    // pe-{w|y}V
    var regex = /^(p\^e)([wy])([aiueo]|\^e)(.*)/
    const matches = input.match(regex)
    if (matches) {
        return [matches[2]+matches[3]+matches[4], ['p\^e-']]
    }
    return [input, []]
}

const deletePrefixRule21a = (input: string): [string, string[]] => {
    // per-V, ex=perizinan
    var regex = /^(p\^er)([aiueo]|\^e)(.*)/
    const matches = input.match(regex)
    if (matches) {
        return [matches[2]+matches[3], ['p\^e-', 'r-']]
    }
    return [input, []]
}

const deletePrefixRule21b = (input: string): [string, string[]] => {
    // pe-rV, ex=perasaan
    var regex = /^(p\^e)(r[aiueo]|r\^e)(.*)/
    const matches = input.match(regex)
    if (matches) {
        return [matches[2]+matches[3], ['p\^e-']]
    }
    return [input, []]
}

const deletePrefixRule23 = (input: string): [string, string[]] => {
    // per-CAP, where C!=r, P!=er, ex=permasalahan
    var regex = /^(p\^er)([bcdfghjklmnpqstvwxyz])([a-z])(.*)$/
    const matches = input.match(regex)
    if (matches && !matches[4].match(/(^er|er)(.*)/)) {
        return [matches[2]+matches[3]+matches[4], ['p\^er-']]
    }
    return [input, []]
}

const deletePrefixRule24 = (input: string): [string, string[]] => {
    // per-CAerV, where C!=r
    var regex = /^(p\^er)([bcdfghjklmnpqstvwxyz])([a-z]|\^e)(er|\^er)([aiueo]|\^e)(.*)$/
    const matches = input.match(regex)
    if (matches) {
        return [matches[2]+matches[3]+matches[4]+matches[5]+matches[6], ['p\^er-']]
    }
    return [input, []]
}

const deletePrefixRule25 = (input: string): [string, string[]] => {
    // pem-{b|f|v}
    var regex = /^(p\^em)([bfv].*)$/
    const matches = input.match(regex)
    if (matches) {
        return [matches[2], ['p\^em-']]
    }
    return [input, []]
}

const deletePrefixRule26a = (input: string): [string, string[]] => {
    // pe-m{rV|V}
    var regex = /^(p\^em)([aiueo]|\^e)(.*)$/
    const matches = input.match(regex)
    if (matches) {
        return ['m'+matches[2]+matches[3], ['p\^e-']]
    }
    return [input, []]
}

const deletePrefixRule26b = (input: string): [string, string[]] => {
    // pe-p{rV|V}
    var regex = /^(p\^em)([aiueo]|\^e)(.*)$/
    const matches = input.match(regex)
    if (matches) {
        return ['p'+matches[2]+matches[3], ['p\^e-','m-']]
    }
    return [input, []]
}

const deletePrefixRule27 = (input: string): [string, string[]] => {
    // pen-{c|d|j|z|s|t}
    var regex = /^(p\^en)([cdjzst].*)$/
    const matches = input.match(regex)
    if (matches) {
        return [matches[2], ['p\^en-']]
    }
    return [input, []]
}

const deletePrefixRule28a = (input: string): [string, string[]] => {
    // pe-nV
    var regex = /^(p\^en)([aiueo]|\^e)(.*)$/
    const matches = input.match(regex)
    if (matches) {
        return ['n'+matches[2]+matches[3], ['p\^e-']]
    }
    return [input, []]
}

const deletePrefixRule28b = (input: string): [string, string[]] => {
    // pe-tV
    var regex = /^(p\^en)([aiueo]|\^e)(.*)$/
    const matches = input.match(regex)
    if (matches) {
        return ['t'+matches[2]+matches[3], ['p\^e-','n-']]
    }
    return [input, []]
}

const deletePrefixRule29 = (input: string): [string, string[]] => {
    // peng-C
    var regex = /^(p\^en_g)([bcdfghjklmnpqrstvwxyz].*)$/
    const matches = input.match(regex)
    if (matches) {
        return [matches[2], ['p\^en_g-']]
    }
    return [input, []]
}

const deletePrefixRule30a = (input: string): [string, string[]] => {
    // peng-V
    var regex = /^(p\^en_g)([aiueo]|\^e)(.*)$/
    const matches = input.match(regex)
    if (matches) {
        return [matches[2]+matches[3], ['p\^e-','n_g-']]
    }
    return [input, []]
}

const deletePrefixRule30b = (input: string): [string, string[]] => {
    // peng-kV
    var regex = /^(p\^en_g)([aiueo]|\^e)(.*)$/
    const matches = input.match(regex)
    if (matches) {
        return ['k'+matches[2]+matches[3], ['p\^e-','n_g-']]
    }
    return [input, []]
}

const deletePrefixRule30c = (input: string): [string, string[]] => {
    // pengV where V=e
    var regex = /^(p\^e)(n_g\^e|n_ge)(.*)$/
    const matches = input.match(regex)
    if (matches) {
        return [matches[3], ['p\^e-',matches[2]+'-']]
    }
    return [input, []]
}

const deletePrefixRule31a = (input: string): [string, string[]] => {
    // pe-nyV
    var regex = /^(p\^en_y)([aiueo]|\^e)(.*)$/
    const matches = input.match(regex)
    if (matches) {
        return ['n_y'+matches[2]+matches[3], ['p\^e-']]
    }
    return [input, []]
}

const deletePrefixRule31b = (input: string): [string, string[]] => {
    // peny-sV
    var regex = /^(p\^en_y)([aiueo]|\^e)(.*)$/
    const matches = input.match(regex)
    if (matches) {
        return ['s'+matches[2]+matches[3], ['p\^e-','n_y-']]
    }
    return [input, []]
}

const deletePrefixRule32 = (input: string): [string, string[]] => {
    // pe-lV except pelajar
    var regex = /^(p\^e)(l[aiueo]|l\^e)(.*)$/

    if (input === 'p^elajar') {
        return ['lajar', ['p\^e-']]
    }

    const matches = input.match(regex)
    if (matches) {
        return [matches[2]+matches[3], ['p\^e-']]
    }
    return [input, []]
}

const deletePrefixRule34 = (input: string): [string, string[]] => {
    // pe-CP where C!={w|y|l|m|n}, P!=er
    var regex = /^(p\^e)([bcdfghjkpqstvxz])(.*)$/
    const matches = input.match(regex)
    if (matches && !matches[3].match(/^(er|\^er)(.*)$/)) {
        return [matches[2]+matches[3], ['p\^e-']]
    }
    return [input, []]
}

const deletePrefixRule35 = (input: string): [string, string[]] => {
    // ter-C1erC2, where C1!={r|w|y|l|m|n}, C=Consonant
    var regex = /^(t\^er)([bcdfghjkpqstvxz])(er|\^er)([bcdfghjklmnpqrstvwxyz])(.*)$/
    const matches = input.match(regex)
    if (matches) {
        return [matches[2]+matches[3]+matches[4]+matches[5], ['t\^er-']]
    }
    return [input, []]
}

const deletePrefixRule36 = (input: string): [string, string[]] => {
    // pe-C1erC2, where C1!={r|w|y|l|m|n}, C=Consonant
    var regex = /^(p\^e)([bcdfghjkpqstvxz])(er|\^er)([bcdfghjklmnpqrstvwxyz])(.*)$/
    const matches = input.match(regex)
    if (matches) {
        return [matches[2]+matches[3]+matches[4]+matches[5], ['p\^e-']]
    }
    return [input, []]
}

export const suffixRules = [
        deleteInflectionalParticle,
        deletePosessivePronouns,
        deleteDerivationalSuffix
    ]

export const prefixRules = [
        [deletePlainPrefix],
        [deletePrefixRule1a, deletePrefixRule1b],
        [deletePrefixRule2],
        [deletePrefixRule3],
        [deletePrefixRule4],
        [deletePrefixRule5],
        [deletePrefixRule6a, deletePrefixRule6b],
        [deletePrefixRule7],
        [deletePrefixRule8],
        [deletePrefixRule9],
        [deletePrefixRule10],
        [deletePrefixRule11],
        [deletePrefixRule12],
        [deletePrefixRule13a, deletePrefixRule13b],
        [deletePrefixRule14],
        [deletePrefixRule15a, deletePrefixRule15b],
        [deletePrefixRule16],
        [deletePrefixRule17a, deletePrefixRule17b, 
            deletePrefixRule17c, deletePrefixRule17d],
        [deletePrefixRule18a, deletePrefixRule18b],
        [deletePrefixRule19],
        [deletePrefixRule20],
        [deletePrefixRule21b, deletePrefixRule21a,],
        [deletePrefixRule23],
        [deletePrefixRule24],
        [deletePrefixRule25],
        [deletePrefixRule26a, deletePrefixRule26b],
        [deletePrefixRule27],
        [deletePrefixRule28a, deletePrefixRule28b],
        [deletePrefixRule29],
        [deletePrefixRule30a, deletePrefixRule30b,
            deletePrefixRule30c],
        [deletePrefixRule31a, deletePrefixRule31b],
        [deletePrefixRule32],
        [deletePrefixRule34],
        [deletePrefixRule35],
        [deletePrefixRule36],
    ]