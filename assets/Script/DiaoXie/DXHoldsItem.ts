import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import BaseHoldsItem from "../Game/BaseHoldsItem";
import GameMgr from "../Game/GameMgr";
import DXOperate from "./DXOperate";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DXHoldsItem extends BaseHoldsItem {

    @property(cc.Label)
    txt_op: cc.Label;

    protected start(): void {
        super.start();
        cc.director.on("rub_card_over", (data) => this.G_SeeCard(data));
        NetMgr.addListener(this, NetDefine.WS_Resp.G_DoOperate, this.G_DoOperate);
        this.initView();
    }

    initView() {
        this.txt_op.string = "";
        let data = GameMgr.ins.getLastOperate(this.userId);
        data && this.G_DoOperate(data);
    }

    protected onDestroy(): void {
        cc.director.off("rub_card_over");
    }

    G_DoOperate(data) {
        if (this.userId == data.userId) {
            if (data.operate == DXOperate.EAT) {
                this.txt_op.string = "吃";
            } else if (data.operate == DXOperate.TOUCH) {
                this.txt_op.string = "碰";
            } else if (data.operate == DXOperate.BELT) {
                this.txt_op.string = "带";
            } else if (data.operate == DXOperate.BLIND_EAT) {
                this.txt_op.string = "头家闷吃";
            } else if (data.operate == DXOperate.REVERSE_BELT) {
                this.txt_op.string = "头家反带";
            } else if (data.operate == DXOperate.NO_BELT) {
                this.txt_op.string = "不带";
            } else if (data.operate == DXOperate.WAIVE) {
                this.txt_op.string = "弃";
            } else {
                this.txt_op.string = "";
            }
        }
    }

    G_GameSettle() {
        super.G_GameSettle();
        this.txt_op.string = "";
    }
}