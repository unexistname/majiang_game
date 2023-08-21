import { Singleton } from "../Util/Singleton";
import LocalStorage from "../Util/LocalStorage";

// @Singleton
export default class SDKMgr {

    private static _ins: SDKMgr = null;
    public static get ins() {
        if (this._ins == null) {
            this._ins = new SDKMgr();
        }
        return this._ins;
    }

    private ANDROID_API = "com/autoeco/majiang/Anysdk";
    private IOS_API = "AppController";

    private loginCB = null;

    isAndroid() {
        return cc.sys.os == cc.sys.OS_ANDROID;
    }

    isIOS() {
        return cc.sys.os == cc.sys.OS_IOS;
    }

    login(loginCB) {
        this.loginCB = loginCB;
        if (this.isAndroid()) {
            jsb.reflection.callStaticMethod(this.ANDROID_API, "login", "()V");
        } else if (this.isIOS()) {
            // @ts-ignore
            jsb.reflection.callStaticMethod(this.IOS_API, "login");
        } else {
            console.log("platform:" + cc.sys.os + " dosn't implement login.");
        }
    }

    onWXPay(data: any) {
        data = JSON.stringify(data);
        if (this.isAndroid()) {
            console.log("调用java wx支付", data);
            jsb.reflection.callStaticMethod(this.ANDROID_API, "wxpay", "(Ljava/lang/String;)V", data);
        } else if (this.isIOS()) {
            console.log("调用ios wx支付", data);
            jsb.reflection.callStaticMethod(this.IOS_API, "wxpay:", data);
        } else {
            console.log("platform:" + cc.sys.os + " dosn't implement onWXPay.");
        }
    }

    getLocation() {
        let longitude, latitude, city;
        if (this.isAndroid()) {
            longitude = jsb.reflection.callStaticMethod(this.ANDROID_API, "getLongitude", "()F");
            latitude = jsb.reflection.callStaticMethod(this.ANDROID_API, "getLatitude", "()F");
            city = jsb.reflection.callStaticMethod(this.ANDROID_API, "getCity", "()Ljava/lang/String;");
        } else if (this.isIOS()) {
            // @ts-ignore
            longitude = jsb.reflection.callStaticMethod(this.IOS_API, "getLongitude");
            // @ts-ignore
            latitude = jsb.reflection.callStaticMethod(this.IOS_API, "getLatitude");
            // @ts-ignore
            city = jsb.reflection.callStaticMethod(this.IOS_API, "getCity");
        } else {
            longitude = -1;
            latitude = -1;
            city = "";
            console.log("platform:" + cc.sys.os + " dosn't implement onUploadLocation.");
        }
        console.log("经度", longitude);
        console.log("维度", latitude);
        console.log("城市", city);
        return {
            longitude: longitude,
            latitude: latitude,
            city: city,
        };
    }

    onLoginResp(code: any) {
        this.loginCB && this.loginCB(code);
    }

    onPayResp(code: any) {
        var msg = "";
        if (code == 0) {    // 支付成功
            msg = "支付成功";
        } else if (code == -1) {
            msg = "支付失败";
        } else {
            msg = code.toString();
        }
        console.log("支付结果:", msg);
    }
}