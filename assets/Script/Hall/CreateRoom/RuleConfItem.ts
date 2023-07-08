import UIMgr from "../../BaseUI/UIMgr";
import GameUtil from "../../Util/GameUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RuleConfItem extends cc.Component {

    @property(cc.Node)
    node_confValues: cc.Node;

    @property(cc.Node)
    prefab_confValue: cc.Node;

    confDict: { [key: string]: boolean } = {};

    updateView(confList: []) {
        GameUtil.clearChildren(this.node_confValues);
        for (let name of confList) {
            let confValueNode = UIMgr.createNode(this.prefab_confValue, this.node_confValues);
            let nameLabel = confValueNode.getChildByName("txt_confName").getComponent(cc.Label);
            nameLabel.string = name;
            this.confDict[name] = false;
        }
        this.node.height = this.node_confValues.height;
    }

    getSelectData() {
        let data = [];
        for (let name in this.confDict) {
            data.push({
                name: name,
                value: this.confDict[name],
            });
        }
        return data;
    }

    CC_onSelectConf(event) {
        let label = event.target.getChildByName("txt_confName").getComponent(cc.Label);
        this.confDict[label.string] = event.target.getComponent(cc.Toggle).isChecked;
    }
}