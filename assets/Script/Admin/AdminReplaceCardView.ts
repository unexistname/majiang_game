import UIMgr from "../BaseUI/UIMgr";
import { GameConst } from "../Const/GameConst";
import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import GameNet from "../Game/GameNet";
import PokerItem from "../Game/PokerItem";
import CardEventHandle from "../Mahjong/CardEventHandle";
import MahjongItem from "../Mahjong/MahjongItem";
import GameUtil from "../Util/GameUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AdminReplaceCardView extends CardEventHandle {

    @property(cc.Node)
    node_heapCards: cc.Node;

    @property(cc.Node)
    node_myCards: cc.Node;

    selectHold: number;

    item_selectHold: any;

    selectHeap: number;

    item_selectHeap: any;

    protected onLoad(): void {
        NetMgr.addListener(this, NetDefine.WS_Resp.GA_ReplaceCard, this.GA_ReplaceCard);
        this.node_heapCards.getComponent(CardEventHandle).register("click_card", this.Slot_ClickHeap.bind(this));
        this.node_myCards.getComponent(CardEventHandle).register("click_card", this.Slot_ClickHold.bind(this));
    }

    Slot_ClickHold(cardId, node, component) {
        if (this.item_selectHold) {
            this.item_selectHold.showSelect(false);
        }
        component.showSelect(true);
        this.item_selectHold = component;
        this.selectHold = cardId;
    }

    Slot_ClickHeap(cardId, node, component) {
        if (this.item_selectHeap) {
            this.item_selectHeap.showSelect(false);
        }
        component.showSelect(true);
        this.item_selectHeap = component;
        this.selectHeap = cardId;
    }

    GA_ReplaceCard(data) {
        this.selectHold = this.selectHeap = null;
        if (this.item_selectHold) {
            this.item_selectHold.showSelect(false);
            this.item_selectHold = null;
        }
        if (this.item_selectHeap) {
            this.item_selectHeap.showSelect(false);
            this.item_selectHeap = null;
        }
        for (let i = 0; i < this.node_myCards.children.length; ++i) {
            let child = this.node_myCards.children[i];
            let hold = data.holds[i];
            if (GameUtil.isMahjongGame()) {
                let component = child.getComponent(MahjongItem);
                component.setMahjong(hold);
            } else {
                let component = child.getComponent(PokerItem);
                component.setPoker(hold);
            }
        }
        for (let i = 0; i < this.node_heapCards.children.length; ++i) {
            let child = this.node_heapCards.children[i];
            let hold = data.heaps[i];
            if (GameUtil.isMahjongGame()) {
                let component = child.getComponent(MahjongItem);
                component.setMahjong(hold);
            } else {
                let component = child.getComponent(PokerItem);
                component.setPoker(hold);
            }
        }
    }

    updateView(data) {
        if (GameUtil.isMahjongGame()) {
            for (let mahjong of data.holds) {
                let mahjongData = { mahjongId: mahjong, showType: GameConst.CardShowType.SHOW};
                UIMgr.createMahjongItem(GameConst.SitPos.DOWN, this.node_myCards, mahjongData);
            }
            for (let mahjong of data.heaps) {
                let mahjongData = { mahjongId: mahjong, showType: GameConst.CardShowType.SHOW};
                UIMgr.createMahjongItem(GameConst.SitPos.DOWN, this.node_heapCards, mahjongData);
            }
        } else {
            for (let pokerId of data.holds) {
                UIMgr.createPrefab("PokerItem", this.node_myCards, pokerId);
            }
            for (let pokerId of data.heaps) {
                UIMgr.createPrefab("PokerItem", this.node_heapCards, pokerId);
            }
        }
    }

    CC_onClickReplace() {
        if (this.selectHold == null) {
            UIMgr.showTip("未选择手牌");
        } else if (this.selectHeap == null) {
            UIMgr.showTip("请选择要替换的牌");
        } else {
            GameNet.CA_ReplaceCard(this.selectHold, this.selectHeap);
        }
    }

    CC_onClickClose() {
        UIMgr.closeSelf(this);
    }
}