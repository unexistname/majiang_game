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
        this.node_guest.active = !!GameConst.Config.IS_DEBUG;
        LoginMgr.ins.updateServerList();
        AudioTool.ins.playLoginBGM();
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