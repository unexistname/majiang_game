import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import BaseHoldsItem from "../Game/BaseHoldsItem";
import PokerHoldsItem from "../Game/PokerHoldsItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SSSHoldsItem extends BaseHoldsItem {

    @property(cc.Node)
    node_combines: cc.Node;

    @property(cc.Node)
    node_pokers: cc.Node;

    @property(cc.Label)
    txt_leftCard: cc.Label;

    @property({type: [PokerHoldsItem]})
    item_combines: PokerHoldsItem[] = [];

    protected start(): void {
        super.start();
        NetMgr.addListener(this, NetDefine.WS_Resp.G_BeginGame, this.G_BeginGame);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_Combine, this.G_Combine);
    }

    G_BeginGame() {
        this.node_combines.active = false;
        this.node_pokers.active = true;
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
        this.node_pokers.active = false;
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
        this.node_combines.active = true;
    }

    updateHolds(holds) {
        this.node_combines.active = false;
        if (holds.length > 0 && holds[0] == -1) {
            this.txt_leftCard.string = holds.length + "";
            this.txt_leftCard.node.active = true;
            holds = [-1];
        } else {
            this.txt_leftCard.node.active = false;
        }
        this.item_pokers.updateHolds(holds);
        this.node_pokers.active = true;
    }
}