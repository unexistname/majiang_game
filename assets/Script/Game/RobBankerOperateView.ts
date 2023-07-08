import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import MeModel from "../Global/MeModel";
import GameUtil from "../Util/GameUtil";
import GameNet from "./GameNet";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RobBankerOperateView extends cc.Component {

    @property(cc.Node)
    node_robs: cc.Node;

    @property(cc.Node)
    node_rob: cc.Node;

    protected start(): void {
        this.node_rob.parent = null;
        this.node.active = false;
        NetMgr.addListener(this, NetDefine.WS_Resp.G_RobBanker, this.G_RobBanker);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_Rob, this.G_Rob);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_TurnBetting, this.hidden);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_Betting, this.hidden);
    }

    G_RobBanker(data) {
        if (data.values) {
            GameUtil.clearChildren(this.node_robs);
            for (let value of data.values) {
                let node = cc.instantiate(this.node_rob);
                let label = node.getChildByName("txt_rob").getComponent(cc.Label);
                label.string = "抢X" + value;
                this.node_robs.addChild(node);
                // @ts-ignore
                node._rob = value;
            }
        }
        this.node.active = true;
    }

    G_Rob(data) {
        if (MeModel.isMe(data.userId)) {
            this.node.active = false;
        }
    }

    hidden() {
        this.node.active = false;
    }

    CC_onClickRob(event) {
        let node = event.target;
        if (node._rob != null) {
            GameNet.C_Rob(node._rob);
        }
    }

    CC_onClickWaive() {
        GameNet.C_Rob(0);
    }
}