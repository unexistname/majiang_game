import UIMgr from "../BaseUI/UIMgr";
import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import GameUtil from "../Util/GameUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PokerPointCardItem extends cc.Component {
    @property(cc.Node)
    node_pointCards: cc.Node;

    userId: string;

    protected onLoad(): void {
        NetMgr.addListener(this, NetDefine.WS_Resp.G_GameSettle, this.G_GameSettle);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_EatPoint, this.G_EatPoint);
    }

    setUserId(userId: string) {
        this.userId = userId;
    }

    G_GameSettle() {
        GameUtil.clearChildren(this.node_pointCards);
    }

    updateView(cards: number[]) {
        GameUtil.clearChildren(this.node_pointCards);
        for (let card of cards) {
            UIMgr.createPokerNode(card, this.node_pointCards);
        }
    }

    G_EatPoint({ userId, pointCards }) {
        if (this.userId == userId) {
            this.updateView(pointCards);
        }
    }
}