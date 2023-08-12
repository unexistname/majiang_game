import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import BaseHoldsItem from "../Game/BaseHoldsItem";
import PokerHoldsItem from "../Game/PokerHoldsItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SSSHoldsItem extends BaseHoldsItem {

    @property(cc.Node)
    node_combines: cc.Node;

    @property({type: [PokerHoldsItem]})
    item_combines: PokerHoldsItem[] = [];

    protected start(): void {
        super.start();
        NetMgr.addListener(this, NetDefine.WS_Resp.G_BeginGame, this.G_BeginGame);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_Combine, this.G_Combine);
    }

    G_BeginGame() {
        this.node_combines.active = false;
        this.item_pokers.node.active = true;
    }

    G_ShowCard(data) {
        let cardData = data[this.userId];
        if (!cardData) {
            return;
        }
        if (cardData.useSpecial) {
            this.scheduleOnce(() => {
                this.updateCombines(cardData.combineCards, true);
            }, 4);
        } else {
            if (cardData.combineCards) {
                this.updateCombines(cardData.combineCards, true);
            } else if (cardData.holds) {
                this.updateHolds(cardData.holds);
            }
        }
    }

    G_Combine(data) {
        if (data.userId == this.userId) {
            this.updateCombines(data.combineCards);
        }
    }

    updateCombines(combineCards, showAnim = false) {
        this.node_combines.active = true;
        for (let i = 0; i < combineCards.length; ++i) {
            let holds = combineCards[i];
            if (showAnim) {
                this.scheduleOnce(() => {
                    this.item_combines[i].updateHolds(holds);
                }, i * 1.5);
            } else {
                this.item_combines[i].updateHolds(holds);
            }
        }
        this.item_pokers.node.active = false;
    }

    updateHolds(holds) {
        this.item_pokers.node.active = true;
        this.item_pokers.updateHolds(holds);
        this.node_combines.active = false;
    }
}