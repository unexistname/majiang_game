import GamberItem from "../Gamber/GamberItem";
import PokerDoOperateItem from "./PokerDoOperateItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BettingGamberItem extends cc.Component {
    
    @property(GamberItem)
    item_gamber: GamberItem;

    @property(PokerDoOperateItem)
    item_operate: PokerDoOperateItem;

    userId: string;

    updateView(data) {
        this.userId = data.userId;
        this.item_gamber.updateView(data);
        this.item_operate.updateView(data.userId);
    }
}