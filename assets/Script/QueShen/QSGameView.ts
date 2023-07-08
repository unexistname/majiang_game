import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import EllipseLayout from "../Util/EllipseLayout";
import GameUtil from "../Util/GameUtil";
import RoomMgr from "../Room/RoomMgr";
import UIMgr from "../BaseUI/UIMgr";
import MJFoldItem from "../Mahjong/MJFoldItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FDGameView extends cc.Component {

    @property(cc.Prefab)
    prefab_mjoperate_view: cc.Prefab;

    node_mjoperate_view: cc.Node;

    @property(cc.Node)
    node_leftCard: cc.Node;

    @property(cc.Label)
    txt_leftCard: cc.Label;

    @property(EllipseLayout)
    node_allFolds: EllipseLayout;

    @property(cc.Prefab)
    prefab_folds: cc.Prefab;

    protected start(): void {
        this.initView();
        NetMgr.addListener(this, NetDefine.WS_Resp.G_BeginGame, this.G_BeginGame);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_LeftCard, this.G_LeftCard);
    }

    initView() {
        this.node_mjoperate_view = UIMgr.createNode(this.prefab_mjoperate_view, this.node);
        this.node_leftCard.active = false;
    }

    G_LeftCard(data) {
        this.node_leftCard.active = true;
        this.txt_leftCard.string = data.left;
    }
    
    G_BeginGame(data) {
        GameUtil.clearChildren(this.node_allFolds.node);
        for (let userId of RoomMgr.ins.getGamberIds()) {
            let node = UIMgr.createNode(this.prefab_folds);
            let localIndex = RoomMgr.ins.getLocalSeatIndex(userId);
            this.node_allFolds.addChild(node, localIndex);
            node.getComponent(MJFoldItem).setUserId(userId);
        }
    }

}