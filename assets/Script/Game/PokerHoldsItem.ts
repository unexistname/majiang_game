import UIMgr from "../BaseUI/UIMgr";
import CardEventHandle from "../Mahjong/CardEventHandle";
import GameUtil from "../Util/GameUtil";
import PokerItem from "./PokerItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PokerHoldsItem extends CardEventHandle {

    @property(cc.Prefab)
    prefab_poker: cc.Prefab;

    holdNodes: cc.Node[] = [];

    holds: [] = [];

    updateHolds(holds) {
        for (var i = 0; i < holds.length; ++i) {
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
        for (; i < this.holds.length; ++i) {
            if (this.holdNodes[i]) {
                this.holdNodes[i].active = false;
            }
        }
        this.holds = holds;
    }

    forceClear() {
        GameUtil.clearChildren(this.node);
        this.holdNodes = [];
        this.holds = [];
    }
}