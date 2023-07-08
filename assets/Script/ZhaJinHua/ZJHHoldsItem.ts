import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import BaseHoldsItem from "../Game/BaseHoldsItem";
import MeModel from "../Global/MeModel";
import ZJHOperate from "./ZJHOperate";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ZJHHoldsItem extends BaseHoldsItem {

    @property(cc.Node)
    node_seeCard: cc.Node;

    protected start(): void {
        super.start();
        this.node_seeCard.active = false;
        NetMgr.addListener(this, NetDefine.WS_Resp.G_DoOperate, this.G_DoOperate);
    }

    G_DoOperate(data) {
        if (MeModel.isMe(data.userId)) {
            return;
        }
        if (data.userId == this.userId) {
            if (data.operate == ZJHOperate.WATCH) {
                this.node_seeCard.active = true;
            }
        }
    }
}