import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import CardEventHandle from "../Mahjong/CardEventHandle";
import PlayCardOperate from "./PlayCardOperate";
import PokerHoldsItem from "./PokerHoldsItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PokerFoldItem extends CardEventHandle {
    
    @property(PokerHoldsItem)
    item_pokers: PokerHoldsItem;

    @property(cc.Node)
    sp_waive: cc.Node;

    userId: string;

    protected start(): void {
        NetMgr.addListener(this, NetDefine.WS_Resp.G_DoOperate, this.G_DoOperate);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_Fold, this.G_Fold);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_EatPoint, this.G_EatPoint);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_TurnBetting, this.G_TurnBetting);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_GameSettle, this.G_GameSettle);
    }

    G_Fold(data) {
        if (data.userId == this.userId) {
            this.updateHolds(data.pai);
            this.sp_waive.active = false;
        }
    }

    G_EatPoint() {
        this.sp_waive.active = false;
        this.updateHolds([]);
    }

    G_GameSettle() {
        this.updateHolds([]);
    }

    updateHolds(holds) {
        this.item_pokers.updateHolds(holds);
    }

    G_DoOperate(data) {
        if (data.userId == this.userId) {
            if (data.operate == PlayCardOperate.PLAY) {
                // this.updateHolds(data.value);   
            } else if (data.operate == PlayCardOperate.WAIVE) {
                this.updateHolds([]);
                this.sp_waive.active = true;
            }
        }
    }

    G_TurnBetting(data) {
        if (data.turnUserId == this.userId) {
            this.sp_waive.active = false;
            this.updateHolds([]);
        }
    }

    setUserId(userId: string) {
        this.userId = userId;
    }
}
