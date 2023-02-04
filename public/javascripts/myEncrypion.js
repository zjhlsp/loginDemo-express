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

//解密函数
export const myDecrypt = function (word) {
    if (!word) return
   let key = getKey()
   var options = {
     mode: CryptoJS.mode.ECB,
     padding: CryptoJS.pad.Pkcs7
   };
   key = CryptoJS.enc.Utf8.parse(key);
   // 解密
   var decryptedData = CryptoJS.AES.decrypt(word, key, options);

   // Utf8格式转换为字符串
   var decryptedStr = decryptedData.toString(CryptoJS.enc.Utf8);
   return decryptedStr ;
 }


 // 前端加密
 export const myEncrypt = function (value) {
    const options = {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }
    const key = CryptoJS.enc.Utf8.parse(getKey())
    const encryptedData = CryptoJS.AES.encrypt(value, key, options)
    const encrypted = encryptedData.toString()
    return encrypted
  }