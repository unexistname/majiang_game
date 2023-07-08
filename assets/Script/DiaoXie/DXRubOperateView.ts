import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import DXNet from "./DXNet";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DXRubOperateView extends cc.Component {

    protected start(): void {
        NetMgr.addListener(this, NetDefine.WS_Resp.G_InitHolds, this.G_InitHolds);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_SeeCard, this.hidden);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_ShowCard, this.hidden);
        // NetMgr.addListener(this, NetDefine.WS_Resp.G_RubCard, this.hidden);
        cc.director.on("rub_card_over", this.hidden.bind(this));
        this.node.active = false;
    }

    protected onDestroy(): void {
        cc.director.off("rub_card_over");
    }

    hidden(data) {
        this.node.active = false;
    }

    G_InitHolds() {
        this.node.active = true;
    }
    
    CC_onClickRubCard() {
        DXNet.C_RubCard();
    }

    CC_onClickSeeCard() {
        DXNet.C_SeeCard();
    }
}
