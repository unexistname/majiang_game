import UIMgr from "../BaseUI/UIMgr";
import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ZJHGameView extends cc.Component {

    @property(cc.Label)
    txt_fundPool: cc.Label;

    @property(cc.Prefab)
    prefab_operate_view: cc.Prefab;

    @property(cc.Prefab)
    prefab_raise_view: cc.Prefab;

    @property(cc.Prefab)
    prefab_compare_view: cc.Prefab;

    protected start(): void {
        this.initView();
        NetMgr.addListener(this, NetDefine.WS_Resp.G_FundPoolChange, this.G_FundPoolChange);
    }

    initView() {
        UIMgr.createNode(this.prefab_operate_view, this.node);
        UIMgr.createNode(this.prefab_compare_view, this.node);
        UIMgr.createNode(this.prefab_raise_view, this.node);
    }

    G_FundPoolChange(data) {
        this.txt_fundPool.string = data.fundPool.toString();
    }
}