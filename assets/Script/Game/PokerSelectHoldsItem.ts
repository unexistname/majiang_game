import UIMgr from "../BaseUI/UIMgr";
import CardEventHandle from "../Mahjong/CardEventHandle";
import GameUtil from "../Util/GameUtil";
import PokerItem from "./PokerItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PokerSelectHoldsItem extends CardEventHandle {

    @property(cc.Prefab)
    prefab_poker: cc.Prefab;

    holdNodes: cc.Node[] = [];

    holds: [] = [];

    protected onEnable(): void {
        this.updateLayout();
    }

    updateHolds(holds) {
        for (let i = 0; i < holds.length; ++i) {
            let pokerId = holds[i];
            if (pokerId == this.holds[i]) {
                continue;
            }
            if (!this.holdNodes[i]) {
                this.holdNodes[i] = UIMgr.createNode(this.prefab_poker, this.node, PokerItem, pokerId);
                this.collect(this.holdNodes[i]);
            } else {
                this.holdNodes[i].getComponent(PokerItem).updateView(pokerId);
            }
            this.holdNodes[i].active = true;
        }
        for (let i = holds.length; i < this.holds.length; ++i) {
            if (this.holdNodes[i]) {
                this.holdNodes[i].parent = null;
                this.holdNodes[i] = null;
            }
        }
        this.holds = holds;
        if (this.node.active) {
            this.updateLayout();
        }
    }

    addHold(hold) {
        this.addHold([hold]);
    }

    addHolds(holds) {
        let realHolds = this.holds.concat(holds);
        this.updateHolds(realHolds);
    }

    updateLayout() {
        let layout = this.node.getComponent(cc.Layout);
        if (layout) {
            layout.enabled = true;
            this.scheduleOnce(() => {
                layout.enabled = false;
            });
        }
    }

    forceClear() {
        GameUtil.clearChildren(this.node);
        this.holdNodes = [];
        this.holds = [];
    }
}