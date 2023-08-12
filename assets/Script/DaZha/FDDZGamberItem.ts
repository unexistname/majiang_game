import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import GamberItem from "../Gamber/GamberItem";
import PokerPointCardItem from "../Game/PokerPointCardItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FDDZGamberItem extends cc.Component {
    
    @property(GamberItem)
    item_gamber: GamberItem;

    @property(cc.Label)
    txt_point: cc.Label;

    @property(cc.Label)
    txt_bonus: cc.Label;
    
    @property(PokerPointCardItem)
    item_pointCard: PokerPointCardItem;

    userId: string;

    protected start(): void {
        NetMgr.addListener(this, NetDefine.WS_Resp.G_EatPoint, this.G_EatPoint);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_BombBonus, this.G_BombBonus);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_GameSettle, this.G_GameSettle);
    }

    G_GameSettle() {
        this.txt_point.string = "";
        this.txt_bonus.string = "";
    }

    updateView(data) {
        this.userId = data.userId;
        this.item_gamber.updateView(data);
        this.item_pointCard.setUserId(data.userId);
    }

    G_EatPoint(data) {
        if (data.userId == this.userId) {
            this.txt_point.string = "吃分:" + data.finalPoint;
        }
    }

    G_BombBonus(data) {
        if (data.userId == this.userId) {
            this.txt_bonus.string = "奖励:" + data.bonus;
        }
    }

}