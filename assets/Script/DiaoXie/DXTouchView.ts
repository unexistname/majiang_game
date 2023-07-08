import UIMgr from "../BaseUI/UIMgr";
import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import DXNet from "./DXNet";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DXTouchView extends cc.Component {

    @property(cc.Label)
    txt_betting: cc.Label;

    @property(cc.Node)
    sp_slider: cc.Node;

    bettingMin: number;
    bettingMax: number;
    bettingNow: number;

    start() {
        NetMgr.addListener(this, NetDefine.WS_Resp.G_ShowTouch, this.G_ShowTouch);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_TurnBetting, this.hidden);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_DoOperate, this.hidden);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_ShowCard, this.hidden);
        this.node.active = false;
    }

    updateView({ touchMin, touchMax }) {
        this.bettingMin = touchMin;
        this.bettingMax = touchMax;
        this.updateSlider(0);
    }

    hidden() {
        this.node.active = false;
    }

    G_ShowTouch(data) {
        this.updateView(data);
        this.node.active = true;
    }

    CC_onSliderTouch(event) {
        this.updateSlider(event.progress);
    }

    updateSlider(percentage: number) {
        this.sp_slider.scaleX = percentage;
        this.bettingNow = Math.floor(percentage * (this.bettingMax - this.bettingMin)) + this.bettingMin;
        this.txt_betting.string = "" + this.bettingNow;
    }

    CC_onClickTouch() {
        DXNet.C_Touch(this.bettingNow);
    }

    CC_onClickCancel() {
        UIMgr.closeSelf(this);
    }
}