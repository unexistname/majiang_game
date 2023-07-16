import BaseSettleItem from "../Game/BaseSettleItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FDDZSettleItem extends BaseSettleItem {

    @property(cc.Label)
    txt_point: (cc.Label)

    updateView(data) {
        super.updateView(data);
        this.txt_point.string = data.point;
    }
}
