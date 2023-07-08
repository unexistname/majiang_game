import BaseSettleItem from "../Game/BaseSettleItem";
import PokersItem from "../Game/PokersItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DZSettleItem extends BaseSettleItem {

    @property(PokersItem)
    item_tryCards: (PokersItem)

    updateView(data) {
        super.updateView(data);
        if (data.tryCards) {
            this.item_tryCards.updateHolds(data.tryCards);
        }
    }
}
