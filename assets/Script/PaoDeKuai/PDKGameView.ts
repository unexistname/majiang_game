import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import UIMgr from "../BaseUI/UIMgr";
import EllipseLayout from "../Util/EllipseLayout";
import GameUtil from "../Util/GameUtil";
import RoomMgr from "../Room/RoomMgr";
import PDKHoldsItem from "./PDKHoldsItem";
import PokerFoldItem from "../Game/PokerFoldItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PDKGameView extends cc.Component {

    @property(cc.Prefab)
    prefab_operate_view: cc.Prefab;

    @property(EllipseLayout)
    node_allFolds: EllipseLayout;

    @property(cc.Prefab)
    prefab_folds: cc.Prefab;

    protected start(): void {
        this.initView();
        NetMgr.addListener(this, NetDefine.WS_Resp.G_BeginGame, this.G_BeginGame);
    }

    initView() {
        UIMgr.createNode(this.prefab_operate_view, this.node);
    }
    
    G_BeginGame() {
        GameUtil.clearChildren(this.node_allFolds.node);
        for (let userId of RoomMgr.ins.getGamberIds()) {
            let node = UIMgr.createNode(this.prefab_folds);
            let localIndex = RoomMgr.ins.getLocalSeatIndex(userId);
            this.node_allFolds.addChild(node, localIndex);
            node.getComponent(PokerFoldItem).setUserId(userId);
        }
    }
}