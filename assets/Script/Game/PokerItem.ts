import UIMgr from "../BaseUI/UIMgr";
import CardEventHandle from "../Mahjong/CardEventHandle";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PokerItem extends CardEventHandle {

    _end: boolean = true;

    @property(cc.Sprite)
    sp_poker: cc.Sprite;

    @property(cc.Node)
    node_select: cc.Node;

    pokerId = null;

    setPoker(pokerId) {
        this.updateView(pokerId);
    }

    updateView(pokerId) {
        if (pokerId != this.pokerId) {
            UIMgr.setPoker(this.sp_poker, pokerId);
            this.pokerId = pokerId;
        }
    }

    showSelect(isSelect) {
        this.node_select.active = isSelect;
    }

    CC_onClickPoker() {
        console.log("点击了手牌", this.pokerId);
        this.emit("click_card", this.pokerId, this.node, this);
    }
}