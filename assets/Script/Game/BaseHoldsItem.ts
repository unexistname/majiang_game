import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import CardEventHandle from "../Mahjong/CardEventHandle";
import PokerHoldsItem from "./PokerHoldsItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BaseHoldsItem extends CardEventHandle {
    
    @property(PokerHoldsItem)
    item_pokers: PokerHoldsItem;

    userId: string;

    protected start(): void {
        NetMgr.addListener(this, NetDefine.WS_Resp.G_InitHolds, this.G_InitHolds);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_ShowCard, this.G_ShowCard);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_GameSettle, this.G_GameSettle);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_SeeCard, this.G_SeeCard);
    }

    G_SeeCard(data) {
        if (data.userId == this.userId) {
            this.updateHolds(data.holds);
        }
    }

    G_InitHolds(data) {
        if (data[this.userId]) {
            console.log("初始化手牌", data[this.userId]);
            this.updateHolds(data[this.userId]);
        }
    }

    G_ShowCard(data) {
        if (data[this.userId]) {
            this.updateHolds(data[this.userId].holds);
        }
    }

    G_GameSettle() {
        this.updateHolds([]);
    }

    updateHolds(holds) {
        this.item_pokers.updateHolds(holds);
    }

    setUserId(userId: string) {
        this.userId = userId;
    }
}