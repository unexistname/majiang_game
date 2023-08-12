import UIMgr from "../BaseUI/UIMgr";
import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import GameMgr from "../Game/GameMgr";
import SSSCombineCardView from "./SSSCombineCardView";

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
        NetMgr.addListener(this, NetDefine.WS_Resp.G_InitHolds, this.G_InitHolds);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_ShowCard, this.G_ShowCard);
    }

    initView() {
        this.node_combine.active = GameMgr.ins.isBettingState();
        this.node_combine_view = UIMgr.createNode(this.prefab_combine_view, this.node);
    }

    G_InitHolds() {
        this.node_combine.active = true;
    }

    G_ShowCard() {
        this.node_combine.active = false;
    }

    CC_onClickCombine() {
        this.node_combine_view.getComponent(SSSCombineCardView).show();
    }
}