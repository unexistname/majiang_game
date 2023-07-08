import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import EllipseLayout from "../Util/EllipseLayout";
import UIMgr from "../BaseUI/UIMgr";
import PokerHoldsItem from "../Game/PokerHoldsItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DZGameView extends cc.Component {

    @property(PokerHoldsItem)
    item_commonCards: PokerHoldsItem;

    @property(cc.Prefab)
    prefab_operate_view: cc.Prefab;

    @property(cc.Node)
    node_fundPool: cc.Node;

    @property(cc.Prefab)
    prefab_holds: cc.Prefab;

    @property(cc.Label)
    txt_fundPool: cc.Label;

    @property(cc.Node)
    node_commonHold: cc.Node;

    protected start(): void {
        this.initView();
        NetMgr.addListener(this, NetDefine.WS_Resp.G_BeginGame, this.G_BeginGame);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_FundPoolChange, this.G_FundPoolChange);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_CommonHolds, this.G_CommonHolds);
    }

    initView() {
        UIMgr.createNode(this.prefab_operate_view, this.node);
    }
    
    G_BeginGame() {
        this.node_commonHold.active = false;
    }

    G_FundPoolChange(data) {
        this.txt_fundPool.string = data.fundPool.toString();
    }

    G_CommonHolds(data) {
        this.node_commonHold.active = true;
        this.item_commonCards.updateHolds(data.commonHolds);
    }
}