import UIMgr from "../BaseUI/UIMgr";
import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SSSGameView extends cc.Component {

    @property(cc.Node)
    node_combine: cc.Node;

    @property(cc.Prefab)
    prefab_combine_view: cc.Prefab;

    node_combine_view: cc.Node;

    protected start(): void {
        this.initView();
        NetMgr.addListener(this, NetDefine.WS_Resp.G_Betting, this.G_Betting);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_Combine, this.hidden);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_ShowCard, this.hidden);
        // NetMgr.addListener(this, NetDefine.WS_Resp.G_Special, this.G_Special);
        
    }

    initView() {
        this.node_combine.active = false;
        this.node_combine_view = UIMgr.createNode(this.prefab_combine_view, this.node);
    }

    G_Betting() {
        this.node_combine.active = true;
    }

    hidden() {
        this.node_combine.active = false;
        this.node_combine_view.active = false;
    }

    CC_onClickCombine() {
        this.node_combine_view.active = true;
    }
}