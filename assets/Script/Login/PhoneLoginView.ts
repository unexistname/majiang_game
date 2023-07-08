import ClockMgr from "../Controller/Game/ClockMgr";
import { GameConst } from "../Const/GameConst";
import UIMgr from "../BaseUI/UIMgr";
import LoginMgr from "./LoginMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PhoneLoginView extends cc.Component {

    @property(cc.EditBox)
    edit_phone: cc.EditBox;

    @property(cc.EditBox)
    edit_verify: cc.EditBox;

    @property(cc.Label)
    txt_verify: cc.Label;

    @property(cc.Button)
    btn_verify: cc.Button;

    onLoad() {
        cc.director.on(GameConst.GameSignal.CLOCK_CHANGE, this.updateVerify.bind(this));
    }

    onDestroy() {
        cc.director.off(GameConst.GameSignal.CLOCK_CHANGE, this.updateVerify.bind(this));
    }

    updateVerify(clockName, time) {
        if (clockName != "phone_verify") {
            return;
        }
        if (time <= 0) {
            this.btn_verify.interactable = true;
            this.txt_verify.string = `获取`;
        } else {
            this.txt_verify.string = `(${time}s)`;
        }

    }

    CC_onClickVerify() {
        let phone = this.edit_phone.string;
        if (!LoginMgr.ins.checkPhoneLegal(phone)) {
            UIMgr.showTip("请输入手机号");
        } else {
            this.btn_verify.interactable = false;
            ClockMgr.ins.setTime("phone_verify", 60);
            LoginMgr.ins.getVerify(phone);
        }
    }

    CC_onClickLogin() {
        let phone = this.edit_phone.string;
        if (!LoginMgr.ins.checkPhoneLegal(phone)) {
            UIMgr.showTip("请输入手机号");
            return;
        }
        let verify = this.edit_verify.string;
        if (!LoginMgr.ins.checkVerifyLegal(verify)) {
            UIMgr.showTip("请输入验证码");
            return;
        }
        LoginMgr.ins.loginByPhone(phone, verify);
    }

    CC_onClickClose() {
        UIMgr.closeSelf(this);
    }
}