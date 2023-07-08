import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import UrlModel from "../Global/UrlModel";

export default class LoginNet {

    static C_GetServers(callback: Function) {
        NetMgr.httpSend(NetDefine.HTTP_Get.C_GetServers, {}, callback, UrlModel.centerUrl);
    }

    static C_GetAddress(index: number, callback: Function) {
        NetMgr.httpSend(NetDefine.HTTP_Get.C_GetAddress, {index: index}, callback, UrlModel.centerUrl);
    }

    static C_GetWechatToken(code: string, area: string, callback: Function) {
        let data = {
            code: code,
            os: cc.sys.os,
            area: area,
        }
        NetMgr.httpSend(NetDefine.HTTP_Get.C_GetWechatToken, data, callback, UrlModel.loginUrl);
    }

    static C_WechatLogin(account: string, sign: string, serverIndex: number, serverToken: string, callback: Function) {
        let data = {
            account: account,
            sign: sign,
            index: serverIndex,
            token: serverToken,
        }
        NetMgr.httpSend(NetDefine.HTTP_Get.C_WechatLogin, data, callback, UrlModel.loginUrl);
    }

    static C_GuestLogin(account: string, sign: string, serverIndex: number, serverToken: string, callback: Function) {
        let data = {
            account: account,
            sign: sign,
            index: serverIndex,
            token: serverToken,
        }
        NetMgr.httpSend(NetDefine.HTTP_Get.C_GuestLogin, data, callback, UrlModel.loginUrl);
    }

    static C_GetGuestToken(account: string, callback: Function) {
        let data = { account: account };
        NetMgr.httpSend(NetDefine.HTTP_Get.C_GetGuestToken, data, callback, UrlModel.loginUrl);
    }

    static C_GetPhoneToken(phone: string, callback: Function) {
        let data = { account: phone };
        NetMgr.httpSend(NetDefine.HTTP_Get.C_GetPhoneToken, data, callback, UrlModel.loginUrl);
    }

    static C_PhoneLogin(phone: string, sign: string, verify: string, serverIndex: number, serverToken: string, callback: Function) {
        let data = {account:phone,verifyCode:verify,sign:sign,index:serverIndex,token:serverToken}
        NetMgr.httpSend(NetDefine.HTTP_Get.C_PhoneLogin, data, callback, UrlModel.loginUrl);
    }
}