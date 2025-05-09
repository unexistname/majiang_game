import UIMgr from "../BaseUI/UIMgr";
import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import GameMgr from "../Game/GameMgr";
import MeModel from "../Global/MeModel";
import MahjongUtil from "../Mahjong/MahjongUtil";
import RoomMgr from "../Room/RoomMgr";
import GameUtil from "../Util/GameUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GamberItem extends cc.Component {

    @property(cc.Node)
    node_choose_banker: cc.Node;

    @property(cc.Node)
    node_score_add: cc.Node;

    @property(cc.Label)
    txt_score_add: cc.Label;

    @property(cc.Label)
    txt_score_sub: cc.Label;

    @property(cc.Label)
    txt_betting: cc.Label;

    @property(cc.Node)
    node_betting: cc.Node;

    @property(cc.Label)
    txt_score: cc.Label;

    @property(cc.Node)
    node_banker: cc.Node;

    @property(cc.Node)
    node_ownner: cc.Node;

    @property(cc.Node)
    node_offline: cc.Node;

    @property(cc.Sprite)
    sp_avatar: cc.Sprite;

    @property(cc.Node)
    node_ready: cc.Node;

    @property(cc.Node)
    node_wind: cc.Node;

    @property(cc.Label)
    txt_wind: cc.Label;

    @property(cc.Label)
    txt_userName: cc.Label;

    scoreAnimCB?: Function;

    userId: string;

    protected start(): void {
        NetMgr.addListener(this, NetDefine.WS_Resp.G_Ready, this.G_Ready);
        // NetMgr.addListener(this, NetDefine.WS_Resp.G_DoOperate, this.G_DoOperate);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_BeginGame, this.G_BeginGame);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_UserState, this.G_UserState);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_GameSettle, this.G_GameSettle);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_GamberScoreChange, this.G_GamberScoreChange);
        // NetMgr.addListener(this, NetDefine.WS_Resp.G_GameOver, this.G_GameOver);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_QuickChat, this.G_Chat);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_Chat, this.G_Chat);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_Voice, this.G_Voice);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_Emoji, this.G_Emoji);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_DecideWind, this.G_DecideWind);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_EatPoint, this.G_EatPoint);
    }

    updateView(data: any) {
        this.userId = data.userId;
        this.txt_userName.string = GameUtil.cutString(data.userName, 10);
        this.node_ownner.active = RoomMgr.ins.isOwner(this.userId);
        this.node_banker.active = GameMgr.ins.isBanker(this.userId);
        this.node_choose_banker.active = GameMgr.ins.isBanker(this.userId);
        this.txt_betting.string = GameMgr.ins.getBettingScore(this.userId).toString();
        this.txt_score.string = GameMgr.ins.getGamberScore(this.userId).toString();
        this.node_offline.active = !RoomMgr.ins.isGamberOnline(this.userId);
        this.node_ready.active = this.getReadyState(data);
        if (this.node_wind) this.node_wind.active = GameMgr.ins.getGamberWind(this.userId) != null;
        UIMgr.setSprite(this.sp_avatar, data.avatarUrl);
    }

    G_Chat(data) {
        if (data.userId == this.userId) {
            data.pos = this.getGlobalPos();
            UIMgr.showItemInRoot("GamberChatItem", data);
        }
    }

    G_Voice(data) {
        if (data.userId == this.userId) {
            data.pos = this.getGlobalPos();
            UIMgr.showItemInRoot("GamberVoiceItem", data);
        }
    }

    G_Emoji(data) {
        if (data.userId == this.userId) {
            data.pos = this.getGlobalPos();
            UIMgr.showItemInRoot("GamberEmojiItem", data);
        }
    }

    getGlobalPos() {
        return UIMgr.getRoot().convertToNodeSpaceAR(
            this.node.parent.convertToWorldSpaceAR(
                this.node.getPosition()));
    }

    G_BeginGame() {
        this.node_ready.active = false;
        this.node_banker.active = false;
        this.txt_betting.string = "0";
        this.node_score_add.active = false;
        this.node_betting.active = GameUtil.isBettingGame();
    }

    showAddScoreAnim(score: number, callback?: Function) {
        let action = cc.sequence(
            cc.spawn(
                cc.scaleTo(0.3,1),
                cc.moveBy(0.3, new cc.Vec2(0,50))
            ),
            cc.delayTime(2),
            cc.callFunc(() => {
                this.node_score_add.active = false;
                this.scoreAnimCB && this.scoreAnimCB();
                this.scoreAnimCB = null;
            }),
        )

        this.scoreAnimCB && this.scoreAnimCB();
        this.node_score_add.stopAllActions();
        this.node_score_add.active = true;
        this.scoreAnimCB = callback;
        if (score > 0) {
            this.txt_score_add.node.active = true;
            this.txt_score_sub.node.active = false;
            this.txt_score_add.string = "+" + score;
        } else if (score < 0) {
            this.txt_score_add.node.active = false;
            this.txt_score_sub.node.active = true;
            this.txt_score_sub.string = score.toString();
        }
        this.node_score_add.position = new cc.Vec3(0, 0, 0);
        this.node_score_add.runAction(action);
    }

    G_GameSettle(data) {
        this.node_betting.active = false;
        this.node_choose_banker.active = false;
        this.node_ready.active = !!data.isReady;
    }

    G_GamberScoreChange(data) {
        if (this.userId == data.userId) {
            if (data.isSync || GameMgr.ins.isBettingState()) {
                this.txt_score.string = data.finalScore;
                this.txt_betting.string = data.bettingScore;
            } else {
                this.showAddScoreAnim(data.changeScore, () => {
                    this.txt_score.string = data.finalScore;
                    this.txt_betting.string = data.bettingScore;
                });
            }
        }
    }

    G_DecideWind(data) {
        if (data[this.userId] != null) {
            this.txt_wind.string = MahjongUtil.getDirection(data[this.userId]);
            this.node_wind.active = true;
        }
    }

    G_EatPoint(data) {
        // if (data.userId == this.userId) {
        //     this.node_betting.getChildByName("desc_betting").active = false;
        //     this.txt_betting.string = "吃分:" + data.finalPoint;
        //     this.node_betting.active = true;
        // }
    }

    G_UserState(data) {
        if (this.userId == data.userId) {
            this.node_offline.active = !data.online;
        }
    }

    G_Ready(data) {
        if (this.userId == data.userId) {
            this.node_ready.active = this.getReadyState(data);
        }
    }

    getReadyState(data) {
        return RoomMgr.ins.isPlaying() ? false : data.isReady;
    }

    chooseBanker(isBanker: boolean) {
        this.node_choose_banker.active = isBanker;
        cc.director.emit("choose_banker");
    }

    decideBanker(isBanker) {
        this.node_banker.active = isBanker;
        if (!isBanker) {
            return;
        }
        
        let node = this.node_choose_banker;
        let scaleX = node.scaleX;
        let scaleY = node.scaleY;
        node.runAction(cc.sequence(
            cc.delayTime(1),
            cc.scaleTo(0.1,0.9),
            cc.callFunc(() => {
                cc.director.emit("decide_banker_over");

                node.scaleX = scaleX;
                node.scaleY = scaleY;
            })
        ));
    }

    CC_onClickGamber() {
        if (MeModel.isMe(this.userId)) {
            return;
        }
        UIMgr.showView("GamberInfoView", this.userId);
    }

    CC_onClickKick() {

    }

    isThisGamber(userId: string) {
        return this.userId == userId;
    }
}