import GamberItem from "../Gamber/GamberItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BaseGamberItem extends cc.Component {
    
    @property(GamberItem)
    item_gamber: GamberItem;

    userId: string;

    updateView(data) {
        this.userId = data.userId;
        this.item_gamber.updateView(data);
    }
}