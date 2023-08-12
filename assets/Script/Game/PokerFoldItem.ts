import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import CardEventHandle from "../Mahjong/CardEventHandle";
import GameMgr from "./GameMgr";
import { PlayPokerFoldType } from "./PlayPokerFoldType";
import PokerHoldsItem from "./PokerHoldsItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PokerFoldItem extends CardEventHandle {
    
    @property(PokerHoldsItem)
    item_pokers: PokerHoldsItem;

    @property(cc.Node)
    sp_waive: cc.Node;

    userId: string;

    protected onLoad(): void {
        NetMgr.addListener(this, NetDefine.WS_Resp.G_PokerFold, this.G_PokerFold);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_TurnBetting, this.G_TurnBetting);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_GameSettle, this.clear);
    }

    G_PokerFold(data) {
        if (data.userId == this.userId) {
            switch (data.foldType) {
                case PlayPokerFoldType.NONE:
                    this.clear();
                    break;
                case PlayPokerFoldType.WAIVE:
                    this.waive();
                    break;
                case PlayPokerFoldType.PLAY:
                    this.play(data);
                    break;
            }
        }
    }

    clear() {
        this.sp_waive.active = false;
        this.updateHolds([]);
    }

    waive() {
        this.sp_waive.active = true;
        this.updateHolds([]);
    }

    play(data) {
        this.sp_waive.active = false;
        this.updateHolds(data.folds);
    }

    updateHolds(holds) {
        this.item_pokers.updateHolds(holds);
    }

    G_TurnBetting(data) {
        if (data.turnUserId == this.userId) {
            this.clear();
        }
    }

    setUserId(userId: string) {
        this.userId = userId;
        let foldData = GameMgr.ins.getPokerFoldsByUserId(userId);
        foldData && this.G_PokerFold(foldData);
    }
}
