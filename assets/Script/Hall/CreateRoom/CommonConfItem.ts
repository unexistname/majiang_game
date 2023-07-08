import UIMgr from "../../BaseUI/UIMgr";
import GameUtil from "../../Util/GameUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CommonConfItem extends cc.Component {

    @property(cc.Label)
    txt_confName: cc.Label;

    @property(cc.Node)
    node_confValues: cc.Node;

    @property(cc.Node)
    prefab_confValue: cc.Node;

    value: number;

    updateView({name, values}) {
        GameUtil.clearChildren(this.node_confValues);
        for (let val of values) {
            let confValueNode = UIMgr.createNode(this.prefab_confValue, this.node_confValues);
            let valueLabel = confValueNode.getChildByName("txt_confValue").getComponent(cc.Label);
            valueLabel.string = "" + val;
        }
        this.txt_confName.string = name;
        this.value = values[0];
        this.node.height = this.node_confValues.height;
    }

    getSelectData() {
        return [{
            name: this.txt_confName.string,
            value: this.value,
        }];
    }

    CC_onSelectConf(event) {
        let label = event.target.getChildByName("txt_confValue").getComponent(cc.Label);
        this.value = label.string;
    }
}