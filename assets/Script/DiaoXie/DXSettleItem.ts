import UIMgr from "../BaseUI/UIMgr";
import BaseSettleItem from "../Game/BaseSettleItem";
import PokersItem from "../Game/PokersItem";
import ScoreItem from "../Game/ScoreItem";
import RoomMgr from "../Room/RoomMgr";
import GameUtil from "../Util/GameUtil";
import DXOperate, { DXOperateName } from "./DXOperate";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DXSettleItem extends BaseSettleItem {

    @property(cc.Node)
    node_operaters: cc.Node;

    updateView(data) {
        super.updateView(data);
        this.updateOperate(data.operates);
    }

    updateOperate(operates) {
        let i = 0;
        for (let data of operates) {
            let operate = data.operate;
            if (operate == DXOperate.WAIVE || operate == DXOperate.NO_BELT) {
                continue;
            }
            let name = DXOperateName[operate];
            let node = this.node_operaters.children[i];
            node.getComponent(cc.Label).string = name;
            node.active = true;
            i++;
        }
    }
}
