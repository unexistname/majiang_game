import UIMgr from "../BaseUI/UIMgr";
import RoomNet from "../Room/RoomNet";
import CostItem from "./CostItem";


const { ccclass, property } = cc._decorator;

@ccclass
export default class PropItem extends cc.Component {

    @property(cc.Sprite)
    sp_prop: cc.Sprite;

    @property(CostItem)
    node_cost: CostItem;

    propId: string;

    updateView(data) {
        this.propId = data.id;
        UIMgr.setSprite(this.sp_prop, data.imageUrl);
        this.node_cost.updateView(data);
    }

    CC_onClickProp() {
        cc.director.emit("click_prop", this.propId);
    }
}