import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import UIMgr from "../BaseUI/UIMgr";
import PokerItem from "../Game/PokerItem";
import GameUtil from "../Util/GameUtil";
import RoomMgr from "../Room/RoomMgr";
import EllipseLayout from "../Util/EllipseLayout";
import PokerFoldItem from "../Game/PokerFoldItem";
import GameMgr from "../Game/GameMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FDDZGameView extends cc.Component {

    @property(cc.Prefab)
    prefab_operate_view: cc.Prefab;

    @property(cc.Node)
    node_friendCard: cc.Node;

    @property(EllipseLayout)
    node_allFolds: EllipseLayout;

    @property(cc.Prefab)
    prefab_folds: cc.Prefab;

    @property(cc.Prefab)
    prefab_pointCards: cc.Prefab;

    @property(cc.Node)
    node_foldCards: cc.Node;

    @property(PokerItem)
    item_friendCard: PokerItem;

    @property(cc.Label)
    txt_foldPoint: cc.Label;

    protected start(): void {
        this.initView();
        NetMgr.addListener(this, NetDefine.WS_Resp.G_BeginGame, this.G_BeginGame);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_FriendCard, this.G_FriendCard);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_SwapSeat, this.G_SwapSeat);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_FoldPointCard, this.G_FoldPointCard);
    }

    initView() {
        this.node_friendCard.active = false;
        UIMgr.createNode(this.prefab_operate_view, this.node);
        UIMgr.createPrefab("PlayCardSortOperateView", this.node);
        
        let foldData = GameMgr.ins.getFoldPointCard();
        foldData && this.G_FoldPointCard(foldData);
        GameMgr.ins.isBettingState() && this.G_BeginGame();
    }

    G_FoldPointCard({ point, cards }) {
        GameUtil.clearChildren(this.node_foldCards);
        for (let card of cards) {
            UIMgr.createPokerNode(card, this.node_foldCards);
        }
        this.txt_foldPoint.string = "" + point;
    }

    G_FriendCard(data) {
        this.item_friendCard.setPoker(data.card);
        this.node_friendCard.active = true;
    }

    G_SwapSeat() {
        this.node_allFolds.updateSeatIndex(RoomMgr.ins.getOldSeatIndex(), RoomMgr.ins.getSeatIndex());
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