import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ClockItem extends cc.Component {

    @property(cc.Label)
    txt_clock: cc.Label;

    protected start(): void {
        NetMgr.addListener(this, NetDefine.WS_Resp.G_DoOperate, this.hidden);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_UpdateTimer, this.G_UpdateTimer);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_ShowCard, this.hidden);
        this.node.active = false;
    }

    hidden() {
        this.node.active = false;
    }

    G_UpdateTimer(data) {
        this.txt_clock.string = data.time;
        if (data.time <= 0) {
            this.node.active = false;
        } else {
            this.node.active = true;
        }
    }
}