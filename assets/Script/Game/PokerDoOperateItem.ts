import { GameConst } from "../Const/GameConst";
import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import DXOperate from "../DiaoXie/DXOperate";
import RoomMgr from "../Room/RoomMgr";
import GameMgr from "./GameMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PokerDoOperateItem extends cc.Component {

    @property(cc.Label)
    txt_betting: cc.Label;

    @property(cc.Node)
    node_betting: cc.Node;

    @property(cc.Node)
    node_waive: cc.Node;

    userId: string;

    protected start(): void {
        NetMgr.addListener(this, NetDefine.WS_Resp.G_TurnBetting, this.G_TurnBetting);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_DoOperate, this.G_DoOperate);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_GameSettle, this.G_GameSettle);
        this.node_betting.active = false;
        this.node_waive.active = false;
    }

    updateView(userId) {
        this.userId = userId;
        let opData = GameMgr.ins.getLastOperate(userId);
        if (opData) {
            this.G_DoOperate(opData);
        }
    }

    G_TurnBetting(data) {
        if (data.userId == this.userId) {
            this.node_betting.active = false;
        }
    }

    G_GameSettle() {
        this.node_betting.active = false;
        this.node_waive.active = false;
    }

    G_DoOperate(data) {
        if (data.userId == this.userId) {
            if (GameMgr.ins.isWaive(data.operate)) {
                this.node_waive.active = true;
            } else {
                if (typeof data.value == "number") {
                    this.txt_betting.string = data.value.toString();
                    this.node_betting.active = true;
                    if (!data.isSync) {
                        this.showBettingAnim();
                    }
                }           
            }
        }
    }

    showBettingAnim() {
        let position = this.node_betting.position;
        this.node_betting.position = new cc.Vec3(0, 0, 0);
        this.node_betting.runAction(cc.moveTo(0.3, position.x, position.y));
    }

}