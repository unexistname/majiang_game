require("./CryptoJS");

export default class EncryUtils {

    static fromBase64(content) {
        // @ts-ignore
        let parsedWordArray = CryptoJS.enc.Base64.parse(content);
        // @ts-ignore
        let parsedStr = parsedWordArray.toString(CryptoJS.enc.Utf8);
        return parsedStr;
    }

    static toBase64(content) {
        // @ts-ignore
        return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(content));
    }
}