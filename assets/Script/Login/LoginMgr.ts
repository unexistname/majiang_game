import MeModel from "../Global/MeModel";
import UrlModel from "../Global/UrlModel";
import SDKMgr from "../SDK/SDKMgr";
import EncryUtils from "../Util/EncryUtils";
import LogUtil from "../Util/LogUtil";
import LoginModel from "./LoginModel";
import LoginNet from "./LoginNet";
import HallMgr from "../Hall/HallMgr";


export default class LoginMgr {
    private static _ins: LoginMgr = null;
    public static get ins() {
        if (this._ins == null) {
            this._ins = new LoginMgr();
        }
        return this._ins;
    }

    isLoadingServer: boolean = false;
    loadingCB: Function;

    loginByWechat() {
        if (this.isLoadingServer) {
            this.loadingCB = this.loginByWechat;
            return;
        } else if (!UrlModel.loginUrl || UrlModel.loginUrl.length <= 0) {
            this.updateServerList();
            return;
        }
        SDKMgr.ins.login((code: string) => {
            LoginNet.C_GetWechatToken(code, MeModel.area, (ret) => {
                let { account, sign } = ret;
                MeModel.account = account;
                MeModel.sign = sign;
                this.wechatAuth(account, sign);
            });
        });
    }

    loginByGuest() {
        if (this.isLoadingServer) {
            this.loadingCB = this.loginByGuest;
            return;
        } else if (!UrlModel.loginUrl || UrlModel.loginUrl.length <= 0) {
            this.updateServerList();
            return;
        }
        if (MeModel.account == null || MeModel.account.indexOf("wx_") == 0) {
            MeModel.account = Date.now().toString();
        }
        LoginNet.C_GetGuestToken(MeModel.account, (ret) => {
            let { account, sign } = ret;
            MeModel.account = account;
            MeModel.sign = sign;
            this.guestAuth(account, sign);
        });
    }

    checkPhoneLegal(phone: string) {
        if (!phone || phone.length <= 0) {
            return false;
        }
        return true;
    }

    checkVerifyLegal(verify: string) {
        if (!verify || verify.length <= 0) {
            return false;
        }
        return true;
    }

    getVerify(phone: string) {
        LoginNet.C_GetPhoneToken(phone, (ret: any) => {
            let { account, sign } = ret;
            MeModel.account = account;
            MeModel.sign = sign;
        });
    }

    loginByPhone(phone: string, verify: string) {
        LoginNet.C_PhoneLogin(phone, verify, MeModel.sign, LoginModel.ins.selectServerIndex, LoginModel.ins.selectServerToken, this.GS_Login_R);
    }

    loginQuick() {
        if (MeModel.account != null && MeModel.sign != null) {
            this.wechatAuth(MeModel.account, MeModel.sign);
        } else {
            this.loginByWechat();
        }
    }

    private wechatAuth(account: string, sign: string) {
        LoginNet.C_WechatLogin(account, sign, LoginModel.ins.selectServerIndex, LoginModel.ins.selectServerToken, this.GS_Login_R);
    }

    private guestAuth(account: string, sign: string) {
        LoginNet.C_GuestLogin(account, sign, LoginModel.ins.selectServerIndex, LoginModel.ins.selectServerToken, this.GS_Login_R);
    }

    updateServerList() {
        this.isLoadingServer = true;
        LoginNet.C_GetServers((ret) => {
            this.isLoadingServer = false;
            LoginModel.ins.servers = ret.servers;
            LoginModel.ins.recommend = ret.recommend;

            console.log("[LoginMgr updateServerList]", ret);
            // 默认选择第一个服
            let defaultServer = LoginModel.ins.getRecommendServer();
            this.updateAddress(defaultServer.index);
        });
    }

    updateAddress(selectServerIndex: number) {
        LoginNet.C_GetAddress(selectServerIndex, (ret) => {
            console.log("[LoginMgr updateAddress]", ret);
            LoginModel.ins.selectServerIndex = ret.index;
            LoginModel.ins.selectServerToken = ret.token;
            UrlModel.loginUrl = ret.url;
            MeModel.area = ret.desc;
        });
    }

    GS_Login_R(ret) {
        LogUtil.Info(`[LoginMgr] Login Success ${ret}`);
        let server = ret.server;
        if (server == null) {
            return;
        }
        if(ret.account != null) MeModel.account = ret.account;
        if(ret.userId != null) MeModel.userId = ret.userId;
        if(ret.userName != null) MeModel.userName = EncryUtils.fromBase64(ret.userName);
        if(ret.sex != null) MeModel.sex = ret.sex;
        if(ret.headImg != null) MeModel.headImg = ret.headImg;
        // if(ret.lv != null) MeModel.lv = ret.lv;
        // if(ret.exp != null)MeModel.exp = ret.exp;
        if(ret.gems != null)MeModel.gems = ret.gems;
        if(ret.coins != null)MeModel.coins = ret.coins;
        // if(ret.roomCard != null)MeModel.roomCard = ret.roomCard;
        if(ret.ip != null)MeModel.ip = ret.ip;
        // if(ret.address != null)MeModel.address = ret.address;
        // if(ret.oldRoomId != null)MeModel.oldRoomId = ret.oldRoomId;
        // if(ret.records != null)MeModel.records = ret.records;
        // if(ret.area != null)MeModel.area = ret.area;

        UrlModel.hallUrl = server.url;

        ret.reconnectRoomId ? HallMgr.ins.enterRoom(ret.reconnectRoomId) : HallMgr.ins.goToHall();
    }
}