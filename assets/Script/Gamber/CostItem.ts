import UIMgr from "../BaseUI/UIMgr";


const { ccclass, property } = cc._decorator;

@ccclass
export default class CostItem extends cc.Component {

    @property(cc.Sprite)
    sp_cost: cc.Sprite;
    
    @property(cc.Label)
    txt_cost: cc.Label;
    
    @property(cc.Node)
    node_cost: cc.Node;
    
    @property(cc.Node)
    node_free: cc.Node;

    updateView(data) {
        if (data.costAmount == 0) {
            this.node_free.active = true;
            this.node_cost.active = false;
        } else {
            UIMgr.setCost(this.sp_cost, data.costPropId);
            this.txt_cost.string = "" + data.costAmount;
            this.node_cost.active = true;
            this.node_free.active = false;
        }
    }
}