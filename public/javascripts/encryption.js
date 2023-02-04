
const CryptoJS = require('crypto-js')

/**
 * getKey () returns a string
 * @return {String} 随机生成的 key
 */
export const getKey = function () {
    const nums = [6, 7, 6, 6, 6, 6, 6, 6]
    const times = [34, 44, 22, 22, 22, 22, 22, 22]
    let result = ''
    let tmp = ''

    for (let i = 0; i < 8; i++) {
        tmp = Math.pow(2, nums[i])
        for (let j = 0; j < times[i]; j++) {
            tmp = (Math.round(tmp / 2) + 1) * 2
        }
        result += String.fromCharCode(Math.round(tmp / 2))
    }

    for (let k = 7; k > -1; k--) {
        tmp = Math.pow(2, nums[k])
        for (let l = 0; l < times[k]; l++) {
            tmp = (Math.round(tmp / 2) + 1) * 2
        }
        result += String.fromCharCode(Math.round(tmp / 2))
    }
    return result
}

/**
 * getToken () returns a string
 * @return {String} 随机生成的 混淆后缀
 */
export const getSuffix = function (len = 8) {
    let template = ''
    let tokenSource = ''
    for (let i = 0; i < 128; i++) {
        template += String.fromCharCode(i)
    }
    for (let j = 0; j < len; j++) {
        tokenSource += template[Math.round(Math.random() * (template.length - 1))]
    }

    return tokenSource
}

/**
 * @param {String} word 需要加密的明文
 * @param {String} needPad 是否需要自动补全
 * @return {String} 加密之后的密文
 */
export const encrypt = function (word, needPad = true) {
    // 固定数组和对象数据
    if (word.constructor !== String) {
        word = JSON.stringify(word)
    }

    // 转换为 utf-8 字符串
    const key = CryptoJS.enc.Utf8.parse(getKey())
    const srcs = CryptoJS.enc.Utf8.parse(word)

    // 配置参数
    const config = {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
    }

    if (!needPad) {
        config.padding = CryptoJS.pad.NoPadding
    }

    // 加密
    const encrypted = CryptoJS.AES.encrypt(srcs, key, config)

    // 转换成 hex
    const hexStr = encrypted.ciphertext.toString().toUpperCase()

    return hexStr
}

/**
 * @param {String} key 解密所用密钥
 * @param {String} word 需要解密的密文
 * @return {String} 解密之后的明文
 */

export const decrypt = function (word, needPad = true, encry = 'Utf8') {
    const key = CryptoJS.enc.Utf8.parse(getKey())
    const encryptedHexStr = CryptoJS.enc.Hex.parse(word)
    const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr)

    // 配置参数
    const config = {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    }

    if (!needPad) {
        config.padding = CryptoJS.pad.NoPadding
    }
    // 解密
    const decrypt = CryptoJS.AES.decrypt(srcs, key, config)

    // 判断使用那种编码进行转换
    let decryptedStr = null

    switch (true) {
        case encry === 'Utf8':
            decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
            break
        case encry === 'Latin1':
            decryptedStr = decrypt.toString(CryptoJS.enc.Latin1)
            break
        case encry === 'Base64':
            decryptedStr = decrypt.toString(CryptoJS.enc.Base64)
            break
        case encry === 'Hex':
            decryptedStr = decrypt.toString(CryptoJS.enc.Hex)
            break
        case encry === 'Utf16':
            decryptedStr = decrypt.toString(CryptoJS.enc.Utf16)
            break
        case encry === 'Utf16BE':
            decryptedStr = decrypt.toString(CryptoJS.enc.Utf16BE)
            break
        case encry === 'Utf16LE':
            decryptedStr = decrypt.toString(CryptoJS.enc.Utf16LE)
            break
        default:
            decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
            break
    }
    let result = decryptedStr.toString()
    // 解析对象和数组数据
    if (/(\[[\S\s]*\])|({[\S\s]*})/g.test(result)) {
        result = JSON.parse(result)
    }
    return result
}

/**
 * @param {String} password 密码
 * @param {String} splitLen 分割长度
 * @param {String} suffixLen 混淆字符长度
 * @return {String} 加了混淆之后的密码密文
 */
export const encryptPassword = function (password = null, splitLen = 8, suffixLen = 8) {
    const passLen = password.length
    const lenSuffix = passLen < 10 ? `0${passLen}` : passLen
    const afterSuffix = 16 - (passLen - splitLen) - 2
    const temp = `${password.slice(0, splitLen)}${getSuffix(suffixLen)}${password.slice(8, passLen)}${getSuffix(afterSuffix)}${lenSuffix}`
    console.log('temp=' + temp);
    const encryptedPassword = encrypt(password, false)

    return encryptedPassword
}

export const splitToken = function (token = null, len = 10) {
    const tokenLen = token.length
    const splitLen = Math.floor(tokenLen / len)
    const result = []
    const marginLen = 8 / splitLen

    for (let i = 0; i < tokenLen; i = i + len + marginLen) {
        result.push(token.slice(i, i + len))
    }

    return result
}

/**
 * @param {String} token
 * @param {String} splitLen 分割长度
 * @param {String} suffixLen 混淆字符长度
 * @return {String} 加了混淆之后的 token 密文
 */
export const encryptToken = function (token = null, splitLen = 10, suffixLen = 2) {
    const dec = decrypt(token, false, 'Latin1')
    const tokenSplit = splitToken(dec, splitLen)

    tokenSplit.map((item, index) => {
        tokenSplit[index] = `${item}${getSuffix(suffixLen)}`
    })
    const encryptedToken = encrypt(tokenSplit.join(''), false)

    return encryptedToken
}
