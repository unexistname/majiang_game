import UIMgr from "../BaseUI/UIMgr";
import { GameConst } from "../Const/GameConst";
import AudioTool from "../Global/AudioTool";
import LoginMgr from "./LoginMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LoginView extends cc.Component {

    @property(cc.Node)
    node_guest: cc.Node;

    onLoad() {
        this.node_guest.active = false;
        LoginMgr.ins.updateServerList();
        AudioTool.ins.playLoginBGM();
    }

    protected onEnable(): void {
        cc.director.on("can_guest_login", this.updateGuestLogin, this);        
    }

    protected onDestroy(): void {
        cc.director.off("can_guest_login", this.updateGuestLogin, this);
    }

    updateGuestLogin(show: boolean) {
        this.node_guest.active = show;
    }

    CC_onClickGuest() {
        LoginMgr.ins.loginByGuest();
    }

    CC_onClickPhone() {
        UIMgr.showView("PhoneLoginView");
    }

    CC_onClickWechat() {
        LoginMgr.ins.loginByWechat();
    }
}