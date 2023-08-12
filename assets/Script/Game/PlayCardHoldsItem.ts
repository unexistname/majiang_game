import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import MeModel from "../Global/MeModel";
import BaseHoldsItem from "./BaseHoldsItem";
import GameMgr from "./GameMgr";
import PokerItem from "./PokerItem";


const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayCardHoldsItem extends BaseHoldsItem {

    clickNodes: cc.Node[] = [];
    dragNodes: cc.Node[] = [];

    @property(cc.Label)
    txt_leftCard: cc.Label;

    protected start(): void {
        super.start();
        NetMgr.addListener(this, NetDefine.WS_Resp.G_DoOperate, this.G_DoOperate);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_TipCard, this.G_TipCard);
    }

    setUserId(userId: string): void {
        super.setUserId(userId);
        if (MeModel.isMe(userId)) {
            this.item_pokers.useDragMode();
            this.register("select_multi_card", this.Slot_SelectMultiPoker.bind(this));
            this.register("select_multi_card_over", this.Slot_SelectMultiPokerOver.bind(this));
        }
    }

    selectOrCancelSelect(node: cc.Node, isSelect: boolean) {
        let pos = node.getPosition();
        node.setPosition(new cc.Vec2(pos.x, isSelect ? node.height / 3 : 0));
    }

    Slot_ClickPoker(pokerId, node) {
        let index = this.clickNodes.indexOf(node);
        let holdIndex = node.getComponent(PokerItem).holdIndex;
        if (index >= 0) {
            this.clickNodes.splice(index, 1);
            GameMgr.ins.cancelSelectCard(holdIndex);
            this.selectOrCancelSelect(node, false);
        } else {
            GameMgr.ins.selectCard(holdIndex);
            this.clickNodes.push(node);
            this.selectOrCancelSelect(node, true);
        }
    }

    Slot_SelectMultiPoker(indexs, dragNodes) {
        this.clearDragSelect();
        let isCancel = this.isOnlyCancel(dragNodes);
        for (let node of dragNodes) {
            this.selectOrCancelSelect(node, !isCancel);
        }
        this.dragNodes = dragNodes;
    }

    isOnlyCancel(dragNodes) {
        for (let node of dragNodes) {
            if (this.clickNodes.indexOf(node) == -1) {
                return false;
            }
        }
        return true;
    }

    clearDragSelect() {
        for (let node of this.dragNodes) {
            this.selectOrCancelSelect(node, false);
        }
        for (let node of this.clickNodes) {
            this.selectOrCancelSelect(node, true);
        }
    }

    Slot_SelectMultiPokerOver(indexs, dragNodes) {
        this.clearDragSelect();
        if (this.isOnlyCancel(dragNodes)) {
            for (let node of dragNodes) {
                let holdIndex = node.getComponent(PokerItem).holdIndex;
                if (this.clickNodes.indexOf(node) != -1) {
                    let index = this.clickNodes.indexOf(node);
                    this.clickNodes.splice(index, 1);
                    GameMgr.ins.cancelSelectCard(holdIndex);
                }
                this.selectOrCancelSelect(node, false);
            }
        } else {
            for (let node of dragNodes) {
                let holdIndex = node.getComponent(PokerItem).holdIndex;
                if (this.clickNodes.indexOf(node) == -1) {
                    GameMgr.ins.selectCard(holdIndex);
                    this.clickNodes.push(node);
                }
                this.selectOrCancelSelect(node, true);
            }
        }
        this.dragNodes = [];
    }

    G_TurnBetting() {
        GameMgr.ins.clearSelectCards();
        for (let node of this.clickNodes) {
            this.selectOrCancelSelect(node, false);
        }
    }

    G_DoOperate(data) {
        if (MeModel.isMe(data.userId)) {
            GameMgr.ins.clearSelectCards();
            for (let node of this.clickNodes) {
                this.selectOrCancelSelect(node, false);
            }
            this.clickNodes = []
        }
    }

    clearSelect() {
        GameMgr.ins.clearSelectCards();
        for (let node of this.clickNodes) {
            this.selectOrCancelSelect(node, false);
        }
        this.clickNodes = [];
    }

    G_InitHolds(data) {
        super.G_InitHolds(data);
        if (data[this.userId]) {
            this.clearSelect();
        }
    }

    G_TipCard(data) {
        if (MeModel.isMe(data.userId)) {
            this.clearSelect();
            let cardNodes = this.item_pokers.getCardNodes(data.cards);
            for (let node of cardNodes) {
                this.selectOrCancelSelect(node, true);
            }
        }
    }

    updateHolds(holds) {
        if (MeModel.isMe(this.userId)) {
            this.item_pokers.updateHolds(holds);
            this.txt_leftCard.node.active = false;
        } else {
            if (holds.length > 0 && holds[0] == -1) {
                this.txt_leftCard.string = holds.length + "";
                this.txt_leftCard.node.active = true;
                holds = [-1];
            } else {
                this.txt_leftCard.node.active = false;
            }
            this.item_pokers.updateHolds(holds);
        }
    }
}