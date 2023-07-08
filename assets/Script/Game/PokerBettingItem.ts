import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PokerBettingItem extends cc.Component {

    @property(cc.Label)
    txt_betting: cc.Label;

    @property(cc.Node)
    node_betting: cc.Node;

    // @property(cc.Node)
    // node_waive: cc.Node;

    userId: string;

    needHidden: boolean = false;
    playingAnim: boolean = false;

    protected start(): void {
        NetMgr.addListener(this, NetDefine.WS_Resp.G_TurnBetting, this.G_TurnBetting);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_DoOperate, this.G_DoOperate);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_ShowCard, this.hidden);
        this.node_betting.active = false;
        // this.node_waive.active = false;
    }

    updateView(userId) {
        this.userId = userId;
    }

    G_TurnBetting(data) {
        if (data.userId == this.userId) {
            this.node_betting.active = false;
        }
    }

    hidden() {
        if (this.playingAnim) {
            this.needHidden = true;
        } else {
            this.node_betting.active = false;
        }
        // this.node_waive.active = false;
    }

    G_DoOperate(data) {
        if (data.userId == this.userId) {
            if (data.value) {
                this.showBettingAnim(data.value);
            } else {
                // this.node_waive.active = true;
            }
        }
    }

    showBettingAnim(score) {
        this.txt_betting.string = score.toString();
        let position = this.node_betting.position;
        this.node_betting.position = new cc.Vec3(0, 0, 0);
        this.node_betting.active = true;
        this.playingAnim = true;
        this.node_betting.runAction(cc.sequence(
            cc.moveTo(0.3, position.x, position.y),
            cc.callFunc(() => {
                this.playingAnim = false;
                if (this.needHidden) {
                    this.node_betting.active = false;
                    this.needHidden = false;
                }
            })
        ));
    }

}