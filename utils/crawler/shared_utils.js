exports.LabelFilter = (records, selection, log) => {
    if (!selection || selection.length == 0) return records;
    let filtered = records.filter(item => selection.includes(item.label))
    log(`Apply selection "${selection.join(" ")}", ${records.length} -> ${filtered.length}`)
    return filtered
}

exports.getISOLikeDate=(dateStr)=>{
    date_format.format(new Date(dateStr)).replaceAll('/', '-')
}

exports.getISBN13 = (str) => {
    if (str.length == 13) {
        if (!exports.VerifyISBN13(str)) throw "ISBN verifying failure:" + str
        return str;
    } else if (str.length == 10) {
        let leading12 = "978" + str.substring(0, 9);
        return leading12 + exports.getISBN13Check(leading12)
    }

}
exports.getISBN10 = (str) => {
    if (str.length == 10) {
        if (!exports.VerifyISBN10(str)) throw "ISBN verifying failure:" + str
        return str;
    } else if (str.length == 13) {
        let leading9 = str.substring(3, 12);
        return leading9 + exports.getISBN10Check(leading9)
    }
}

exports.VerifyISBN13 = (str) => {
    if (str.length != 13) return false;
    let x = exports.getISBN13Check(str);
    if (x == str[12]) return true;
    return false;
}

/**
 * @returns {string} 
 */
exports.getISBN13Check = (str) => {
    let sum = 0;
    let flag = true;
    for (const c of str.substring(0, 12)) {
        sum += parseInt(c) * (flag ? 1 : 3);
        flag = !flag;
    }
    let x = (10 - (sum % 10)) % 10;
    return ("" + x);
}
exports.VerifyISBN10 = (str) => {
    if (str.length != 10) return false;
    let x = exports.getISBN10Check(str);
    if (x == str[9]) return true;
    return false;
}

/**
 * @returns {string} 
 */
exports.getISBN10Check = (str) => {
    let sum = 0;
    let m = 10;
    for (const c of str.substring(0, 9)) {
        sum += parseInt(c) * m;
        m--
    }
    let x = (11 - (sum % 11)) % 11;
    return x == 10 ? "X" : "" + x;
}