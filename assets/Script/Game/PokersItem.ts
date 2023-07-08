import UIMgr from "../BaseUI/UIMgr";
import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import PokerItem from "./PokerItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PokersItem extends cc.Component {

    @property(cc.Prefab)
    prefab_poker: cc.Prefab;

    holdNodes: cc.Node[] = [];

    userId: string;

    holds: [] = [];

    protected start(): void {
        NetMgr.addListener(this, NetDefine.WS_Resp.G_InitHolds, this.G_InitHolds);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_ShowCard, this.G_ShowCard);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_SeeCard, this.G_SeeCard);
        cc.director.on("rub_card_over", (data) => this.G_SeeCard(data));
    }

    protected onDestroy(): void {
        cc.director.off("rub_card_over");
    }

    G_SeeCard(data) {
        if (data.userId == this.userId) {
            this.updateHolds(data.holds);
        }
    }

    G_InitHolds(data) {
        if (data[this.userId]) {
            this.updateHolds(data[this.userId]);
        }
    }

    G_ShowCard(data) {
        if (data[this.userId]) {
            this.updateHolds(data[this.userId].holds);
        }
    }

    setUserId(userId: string) {
        this.userId = userId;
    }

    updateHolds(holds) {
        for (var i = 0; i < holds.length; ++i) {
            let pokerId = holds[i];
            if (pokerId == this.holds[i]) {
                continue;
            }
            if (!this.holdNodes[i]) {
                this.holdNodes[i] = UIMgr.createNode(this.prefab_poker, this.node, PokerItem, pokerId);
            } else {
                this.holdNodes[i].getComponent(PokerItem).updateView(pokerId);
            }
            this.holdNodes[i].active = true;
        }
        for (; i < this.holds.length; ++i) {
            if (this.holdNodes[i]) {
                this.holdNodes[i].active = false;
            }
        }
        this.holds = holds;
    }
}