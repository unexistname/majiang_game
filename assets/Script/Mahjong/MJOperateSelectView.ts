import UIMgr from "../BaseUI/UIMgr";
import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import MJOperateSelectItem from "./MJOperateSelectItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MJOperateSelectView extends cc.Component {

    @property(cc.Prefab)
    prefab_select: cc.Prefab;

    protected start(): void {
        NetMgr.addListener(this, NetDefine.WS_Resp.G_TurnPlayCard, this.G_TurnPlayCard);
    }

    G_TurnPlayCard() {
        UIMgr.closeSelf(this);
    }

    updateView(data) {
        if (data.chiPai.length > 0) {
            for (let chiData of data.chiPai) {
                UIMgr.createNode(this.prefab_select, this.node, MJOperateSelectItem, chiData);
            }
        } else if (data.gangPai.length > 0) {
            for (let gangPai of data.gangPai) {
                UIMgr.createNode(this.prefab_select, this.node, MJOperateSelectItem, gangPai);
            }
        }
    }
}