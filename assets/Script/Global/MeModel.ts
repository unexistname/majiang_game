import LocalStorage from "../Util/LocalStorage";


export default class MeModel {

    private static _account: string;
    static get account() {
        if (this._account == null) {
            this._account = LocalStorage.getItem("account");
        }
        return this._account;
    }
    static set account(val: string) {
        LocalStorage.setItem("account", val);
        this._account = val;
    }

    static _sign: string;
    static get sign() {
        if (this._sign == null) {
            this._sign = LocalStorage.getItem("sign");
        }
        return this._sign;
    }
    static set sign(val: string) {
        LocalStorage.setItem("sign", val);
        this._sign = val;
    }

    static area: string;
    static userId: string;
    static userName: string;
    static sex: number;
    static headImg: string;
    static lv: number;
    static exp: number;
    static gems: number;
    static coins: number;
    static roomCard: number;
    static ip: number;
    static address: number;
    static oldRoomId: string;
    static records: any[];

    static isMe(userId: string) {
        return this.userId == userId;
    }
}