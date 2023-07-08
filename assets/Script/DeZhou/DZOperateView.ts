import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import MeModel from "../Global/MeModel";
import DZNet from "./DZNet";
import DZOperate from "./DZOperate";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DZOperateView extends cc.Component {

    @property(cc.Node)
    node_call: cc.Node;

    @property(cc.Node)
    node_raise: cc.Node;

    @property(cc.Node)
    node_waive: cc.Node;

    protected start(): void {
        NetMgr.addListener(this, NetDefine.WS_Resp.G_TurnBetting, this.G_TurnBetting);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_DoOperate, this.hidden);
        this.node.active = false;
    }

    updateView(optionalOperate: number) {
        this.node.active = true;
        this.node_call.active = !!(optionalOperate & DZOperate.CALL);
        this.node_raise.active = !!(optionalOperate & DZOperate.RAISE);
        this.node_waive.active = !!(optionalOperate & DZOperate.WAIVE);
    }

    G_TurnBetting({ turnUserId, optionalOperate, bettingTime }) {
        if (MeModel.isMe(turnUserId)) {
            this.updateView(optionalOperate);
        } else {
            this.hidden();
        }
    }

    hidden() {
        this.node.active = false;
    }

    CC_onClickCall() {
        DZNet.C_Call();
    }

    CC_onClickRaise() {
        DZNet.C_Raise();
    }

    CC_onClickWaive() {
        DZNet.C_Waive();
    }
}