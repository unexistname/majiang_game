import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import UIMgr from "../BaseUI/UIMgr";
import PokerItem from "../Game/PokerItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FDDZGameView extends cc.Component {

    @property(cc.Prefab)
    prefab_operate_view: cc.Prefab;

    @property(cc.Node)
    node_friendCard: cc.Node;

    @property(cc.Node)
    item_friendCard: PokerItem;

    protected start(): void {
        this.initView();
        NetMgr.addListener(this, NetDefine.WS_Resp.G_FriendCard, this.G_FriendCard);
    }

    initView() {
        this.node_friendCard.active = false;
        UIMgr.createNode(this.prefab_operate_view, this.node);
    }

    G_FriendCard(data) {
        this.item_friendCard.pokerId = data.card;
        this.node_friendCard.active = true;
    }
}