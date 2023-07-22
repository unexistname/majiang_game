import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import MeModel from "../Global/MeModel";
import CardEventHandle from "../Mahjong/CardEventHandle";
import GameMgr from "./GameMgr";
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
        NetMgr.addListener(this, NetDefine.WS_Resp.GA_ReplaceCard, this.GA_ReplaceCard);
        NetMgr.addListener(this, NetDefine.WS_Resp.GA_Perspect, this.GA_Perspect);
    }

    G_SeeCard(data) {
        if (data.userId == this.userId) {
            this.updateHolds(data.holds);
        }
    }

    GA_Perspect(data) {
        if (data[this.userId]) {
            this.updateHolds(data[this.userId]);
        }
    }

    GA_ReplaceCard(data) {
        if (MeModel.isMe(this.userId)) {
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
        let holds = GameMgr.ins.getHoldsByUserId(userId);
        if (holds) {
            this.updateHolds(holds);
        }
    }
}