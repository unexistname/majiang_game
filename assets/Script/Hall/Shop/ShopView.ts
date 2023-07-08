import UIMgr from "../../BaseUI/UIMgr";
import GameUtil from "../../Util/GameUtil";
import ShopSeriesItem from "./ShopSeriesItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ShopView extends cc.Component {

    @property(cc.Label)
    txt_gem: cc.Label;

    @property(cc.Prefab)
    prefab_shopItem: cc.Prefab;

    @property(cc.Node)
    node_shopItems: cc.Node;

    updateView(data: any[]) {
        GameUtil.clearChildren(this.node_shopItems);
        for (let seriesData of data) {
            UIMgr.createNode(this.prefab_shopItem, this.node_shopItems, ShopSeriesItem, seriesData);
        }
    }

    CC_onClickClose() {
        UIMgr.closeSelf(this);
    }
}