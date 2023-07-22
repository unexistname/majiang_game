import NetMgr from "../Controller/Net/NetMgr";
import { NetDefine } from "../Const/NetDefine";
import MeModel from "../Global/MeModel";
import ZJHNet from "./ZJHNet";
import ZJHOperate from "./ZJHOperate";
import GameMgr from "../Game/GameMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ZJHOpeateView extends cc.Component {

    @property(cc.Node)
    node_call: cc.Node;

    @property(cc.Node)
    node_raise: cc.Node;

    @property(cc.Node)
    node_watch: cc.Node;

    @property(cc.Node)
    node_compare: cc.Node;

    @property(cc.Node)
    node_waive: cc.Node;

    start() {
        NetMgr.addListener(this, NetDefine.WS_Resp.G_TurnBetting, this.G_TurnBetting);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_DoOperate, this.hidden);
        this.initView();
    }

    initView() {
        this.node.active = false;
        let turnData = GameMgr.ins.getTurnData();
        if (turnData) {
            this.G_TurnBetting(turnData);
        }
    }

    updateView(optionalOperate: number) {
        this.node_call.active = !!(optionalOperate & ZJHOperate.CALL);
        this.node_raise.active = !!(optionalOperate & ZJHOperate.RAISE);
        this.node_watch.active = !!(optionalOperate & ZJHOperate.WATCH);
        this.node_compare.active = !!(optionalOperate & ZJHOperate.COMPARE);
        this.node_waive.active = !!(optionalOperate & ZJHOperate.WAIVE);
    }

    G_TurnBetting({ turnUserId, optionalOperate, bettingTime }) {
        if (MeModel.isMe(turnUserId)) {
            this.node.active = true;
            this.updateView(optionalOperate);
        } else {
            this.node.active = false;
        }
    }

    hidden() {
        this.node.active = false;
    }

    CC_onClickCall() {
        ZJHNet.C_Call();
    }

    CC_onClickRaise() {
        ZJHNet.C_ShowRaise();
    }

    CC_onClickWatch() {
        ZJHNet.C_Watch();
    }

    CC_onClickCompare() {
        ZJHNet.C_CompareSelect();
    }

    CC_onClickWaive() {
        ZJHNet.C_Waive();
    }

}