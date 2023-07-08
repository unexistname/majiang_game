import UIMgr from "../BaseUI/UIMgr";
import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import ResUtil from "../Util/ResUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PokerRobItem extends cc.Component {
    @property(cc.Sprite)
    sp_rob: cc.Sprite;

    @property(cc.Node)
    node_waive: cc.Node;

    userId: string;

    needHidden: boolean = false;
    playingAnim: boolean = false;

    protected start(): void {
        NetMgr.addListener(this, NetDefine.WS_Resp.G_Rob, this.G_Rob);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_TurnBetting, this.hidden);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_Betting, this.hidden);
        this.sp_rob.node.active = false;
        this.node_waive.active = false;
    }

    updateView(userId) {
        this.userId = userId;
    }

    hidden() {
        if (this.playingAnim) {
            this.needHidden = true;
        } else {
            this.sp_rob.node.active = false;
        }
        this.node_waive.active = false;
    }

    G_Rob(data) {
        if (data.userId == this.userId) {
            if (data.robScore) {
                this.sp_rob.node.active = true;
                this.showRobAnim(data.robScore);
            } else {
                this.node_waive.active = true;
            }
        }
    }

    showRobAnim(score) {
        let path = ResUtil.getRobScoreImagePath(score);
        UIMgr.setSprite(this.sp_rob, path, (err, spriteFrame) => {
            let node = this.sp_rob.node;
            if (err) {
                node.active = false;
            } else {
                let scale = node.scale;
                node.scale = 2;
                this.playingAnim = true;
                node.runAction(cc.sequence(
                    cc.scaleTo(0.3, scale),
                    cc.callFunc(() => {
                        this.playingAnim = false;
                        if (this.needHidden) {
                            node.active = false;
                            this.needHidden = false;
                        }
                    })
                ));
            }
        });
    }

}