import UIMgr from "../BaseUI/UIMgr";
import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import GameMgr from "../Game/GameMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DXGameView extends cc.Component {

    @property(cc.Label)
    txt_fundPool: cc.Label;

    @property(cc.Prefab)
    prefab_operate_view: cc.Prefab;

    @property(cc.Prefab)
    prefab_rubcard_view: cc.Prefab;

    @property(cc.Prefab)
    prefab_touch_view: cc.Prefab;

    @property(cc.Prefab)
    prefab_ruboperate_view: cc.Prefab;

    protected start(): void {
        this.initView();
        NetMgr.addListener(this, NetDefine.WS_Resp.G_FundPoolChange, this.G_FundPoolChange);
    }

    initView() {
        UIMgr.createNode(this.prefab_operate_view, this.node);
        UIMgr.createNode(this.prefab_ruboperate_view, this.node);
        UIMgr.createNode(this.prefab_rubcard_view, this.node);
        UIMgr.createNode(this.prefab_touch_view, this.node);
        this.txt_fundPool.string = GameMgr.ins.getFundPool().toString();
    }

    G_FundPoolChange(data) {
        this.txt_fundPool.string = data.fundPool.toString();
    }
}