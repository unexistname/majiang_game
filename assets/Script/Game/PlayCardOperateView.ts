import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import MeModel from "../Global/MeModel";
import GameMgr from "./GameMgr";
import GameNet from "./GameNet";
import PlayCardOperate from "./PlayCardOperate";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayCardOperateView extends cc.Component {

    @property(cc.Node)
    node_play: cc.Node;

    @property(cc.Node)
    node_tip: cc.Node;

    @property(cc.Node)
    node_waive: cc.Node;

    protected start(): void {
        NetMgr.addListener(this, NetDefine.WS_Resp.G_TurnBetting, this.G_TurnBetting);
        let turnData = GameMgr.ins.getTurnData();
        if (turnData) {
            this.G_TurnBetting(turnData);
        } else {
            this.node.active = false;
        }
    }

    G_TurnBetting({turnUserId, optionalOperate}) {
        if (MeModel.isMe(turnUserId)) {
            this.node.active = true;
            this.updateOperate(optionalOperate);
        } else {
            this.node.active = false;
        }
    }
    
    updateOperate(optionalOperate: any) {
        this.node_play.active = !!(optionalOperate & PlayCardOperate.PLAY);
        this.node_tip.active = !!(optionalOperate & PlayCardOperate.TIP);
        this.node_waive.active = !!(optionalOperate & PlayCardOperate.WAIVE);
    }

    CC_onClickPlayCard(event) {
        GameNet.C_PlayCard(GameMgr.ins.getSelectCards());
    }

    CC_onClickTipCard(event) {
        GameNet.C_TipCard(GameMgr.ins.getSelectCards());
    }

    CC_onClickWaive() {
        GameNet.C_Waive();
    }
}