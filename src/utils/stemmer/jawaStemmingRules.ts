export const plainPrefixRule = (input: string): [string, string] => {
    //Hapus plain prefix
    var regex = /^(su|pri|wi|dak|tak|kok|tok|di|kapi|kami|ka|k\^e|sa|pa|pi|pra|tar|kuma|ma|m\^e|a)(.*)/
    const matches = input.match(regex)
    if (matches) {
        return [matches[2], matches[1]+'-']
    }
    return [input, '']
}


const allomorphRule1a = (input: string): [string, string] => {
    //ny-sV
    var regex = /^(n_y)([aiueo]|\^e)(.*)/
    const matches = input.match(regex)
    if (matches) {
        return ['s'+matches[2]+matches[3], matches[1]+'-']
    }
    return [input, '']
}

const allomorphRule1b = (input: string): [string, string] => {
    //ny-cV
    var regex = /^(n_y)([aiueo]|\^e)(.*)/
    const matches = input.match(regex)
    if (matches) {
        return ['c'+matches[2]+matches[3], matches[1]+'-']
    }
    return [input, '']
}

const allomorphRule2a = (input: string): [string, string] => {
    //m-pV
    var regex = /^(m)([aiueo]|\^e)(.*)/
    const matches = input.match(regex)
    if (matches) {
        return ['p'+matches[2]+matches[3], matches[1]+'-']
    }
    return [input, '']
}

const allomorphRule2b = (input: string): [string, string] => {
    //mbV
    var regex = /^(m)(b[aiueo]|b\^e)(.*)/
    const matches = input.match(regex)
    if (matches) {
        return [matches[2]+matches[3], matches[1]+'-']
    }
    return [input, '']
}

const allomorphRule2c = (input: string): [string, string] => {
    //m-wV
    var regex = /^(m)([aiueo]|\^e)(.*)/
    const matches = input.match(regex)
    if (matches) {
        return ['w'+matches[2]+matches[3], matches[1]+'-']
    }
    return [input, '']
}

const allomorphRule3a = (input: string): [string, string] => {
    //n-tV
    var regex = /^(n)([aiueo]|\^e)(.*)/
    const matches = input.match(regex)
    if (matches) {
        return ['t'+matches[2]+matches[3], matches[1]+'-']
    }
    return [input, '']
}

const allomorphRule3b = (input: string): [string, string] => {
    //n-thV
    var regex = /^(n)([aiueo]|\^e)(.*)/
    const matches = input.match(regex)
    if (matches) {
        return ['t_h'+matches[2]+matches[3], matches[1]+'-']
    }
    return [input, '']
}

const allomorphRule3c = (input: string): [string, string] => {
    //n-sV
    var regex = /^(n)([aiueo]|\^e)(.*)/
    const matches = input.match(regex)
    if (matches) {
        return ['s'+matches[2]+matches[3], matches[1]+'-']
    }
    return [input, '']
}

const allomorphRule3d = (input: string): [string, string] => {
    //ndV | ndhV
    var regex = /^(n)(d|d_h)([aiueo]|\^e)(.*)/
    const matches = input.match(regex)
    if (matches) {
        return [matches[2]+matches[3]+matches[4], matches[1]+'-']
    }
    return [input, '']
}

const allomorphRule3e = (input: string): [string, string] => {
    //njV
    var regex = /^(n)(j[aiueo]|j\^e)(.*)/
    const matches = input.match(regex)
    if (matches) {
        return [matches[2]+matches[3], matches[1]+'-']
    }
    return [input, '']
}

const allomorphRule4a = (input: string): [string, string] => {
    //ngeC
    var regex = /^(n_g\^e)([bcdfghjklmnpqrstvwxyz])(.*)/
    const matches = input.match(regex)
    if (matches) {
        return [matches[2]+matches[3], matches[1]+'-']
    }
    return [input, '']
}


const allomorphRule5a = (input: string): [string, string] => {
    //ngV
    var regex = /^(n_g)([aiueo]|\^e)(.*)/
    const matches = input.match(regex)
    if (matches) {
        return [matches[2]+matches[3], matches[1]+'-']
    }
    return [input, '']
}

const allomorphRule5b = (input: string): [string, string] => {
    //ng-kV
    var regex = /^(n_g)([aiueo]|\^e)(.*)/
    const matches = input.match(regex)
    if (matches) {
        return ['k'+matches[2]+matches[3], matches[1]+'-']
    }
    return [input, '']
}

const allomorphRule5c = (input: string): [string, string] => {
    //ng-kV
    var regex = /^(n_g)(g|l|r|w|y)([aiueo]|\^e)(.*)/
    const matches = input.match(regex)
    if (matches) {
        return [matches[2]+matches[3]+matches[4], matches[1]+'-']
    }
    return [input, '']
}

export const allomorphRules = [
        [allomorphRule1a, allomorphRule1b],
        [allomorphRule2a, allomorphRule2b, allomorphRule2c],
        [allomorphRule3a, allomorphRule3b, allomorphRule3c, allomorphRule3d, allomorphRule3e],
        [allomorphRule4a],
        [allomorphRule5a, allomorphRule5b, allomorphRule5c]
    ]

export const plainSuffixRule = (input: string): [string, string] => {
    // Hapus plain suffix
    var regex = /(i|en|na|an|ake|a|e|ana)$/
    const matches = input.match(regex)
    var res = ""
    if (matches) {
        //var matchesString = matches.toString()
        var matchesStringLength = matches[1].length
        var inputLength = input.length

        res = input.substring(0, inputLength-matchesStringLength)
        return [res, '-'+matches[1]]
    }
    return [input, '']
}