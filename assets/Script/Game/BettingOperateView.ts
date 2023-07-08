import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import MeModel from "../Global/MeModel";
import GameUtil from "../Util/GameUtil";
import GameNet from "./GameNet";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BettingOperateView extends cc.Component {

    @property(cc.Node)
    node_bettings: cc.Node;

    @property(cc.Node)
    node_betting: cc.Node;

    protected start(): void {
        this.node_betting.parent = null;
        this.node.active = false;
        NetMgr.addListener(this,NetDefine.WS_Resp.G_Betting, this.G_Betting);
        NetMgr.addListener(this,NetDefine.WS_Resp.G_DoOperate, this.G_DoOperate);
        NetMgr.addListener(this,NetDefine.WS_Resp.G_ShowCard, this.G_ShowCard);
    }

    G_Betting(data) {
        if (data.values) {
            GameUtil.clearChildren(this.node_bettings);
            for (let value of data.values) {
                let node = cc.instantiate(this.node_betting);
                let label = node.getChildByName("txt_betting").getComponent(cc.Label);
                label.string = "X" + value;
                this.node_bettings.addChild(node);
                // @ts-ignore
                node._betting = value;
            }
        }
        this.node.active = true;
    }

    G_DoOperate(data) {
        if (MeModel.isMe(data.userId)) {
            this.node.active = false;
        }
    }

    G_ShowCard() {
        this.node.active = false;
    }

    CC_onClickBetting(event) {

        let node = event.target;
        if (node._betting != null) {
            GameNet.C_Betting(node._betting);
        }
    }

    CC_onClickWaive() {
        GameNet.C_Betting(0);
    }
}