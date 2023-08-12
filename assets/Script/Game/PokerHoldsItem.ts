import UIMgr from "../BaseUI/UIMgr";
import CardEventHandle from "../Mahjong/CardEventHandle";
import GameUtil from "../Util/GameUtil";
import PokerItem from "./PokerItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PokerHoldsItem extends CardEventHandle {

    @property(cc.Prefab)
    prefab_poker: cc.Prefab;

    holdNodes: cc.Node[] = [];

    holds: [] = [];

    private beginNode: cc.Node;

    useDragMode(): void {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchDown, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onTouchDown(event) {
        let startPos = event.getLocation();
        this.beginNode = this.getPokerNodeByPos(startPos);
        this.emit("select_multi_card_begin");
    }

    onTouchMove(event) {
        if (!this.beginNode) {
            return;
        }
        let movePos = event.getLocation();
        let endNode = this.getPokerNodeByPos(movePos);
        let dragNodes = this.getNodesByRange(this.beginNode, endNode);
        let pokerIds = [];
        for (let holdNode of dragNodes) {
            pokerIds.push(holdNode.getComponent(PokerItem).pokerId);
        }
        this.emit("select_multi_card", pokerIds, dragNodes);
    }

    onTouchEnd(event) {
        if (!this.beginNode) {
            return;
        }
        let endPos = event.getLocation();
        let endNode = this.getPokerNodeByPos(endPos);
        let dragNodes = this.getNodesByRange(this.beginNode, endNode);
        let pokerIds = [];
        for (let holdNode of dragNodes) {
            pokerIds.push(holdNode.getComponent(PokerItem).pokerId);
        }
        this.emit("select_multi_card_over", pokerIds, dragNodes);
        this.beginNode = null;
    }

    private getPokerNodeByPos(pos) {        
        pos = this.node.convertToNodeSpaceAR(pos);
        for (let i = 0; i < this.holdNodes.length; ++i) {
            let begin = this.holdNodes[i];
            if (!this.holdNodes[i].active) {
                continue;
            }
            let end = this.holdNodes[i + 1];
            let beginX = begin.x - begin.anchorX * begin.width;
            let endX;
            if (end && end.active) {
                endX = end.x - end.anchorX * end.width;
            } else {
                endX = begin.x + (1 - begin.anchorX) * begin.width;
            }
            if (pos.x < beginX || pos.x > endX) {
                continue;
            }
            let beginY = begin.y - begin.anchorY * begin.height;
            let endY = begin.y + (1 - begin.anchorY) * begin.height;
            // if (pos.y < beginY || pos.y > endY) {
            //     continue;
            // }
            return begin;
        }
    }

    private getNodesByRange(node, endNode) {
        if (!node || !endNode) {
            return [];
        }
        let hasBegin = 0;
        let dragNodes = [];
        for (let holdNode of this.holdNodes) {
            if (holdNode == node) {
                hasBegin++;
            }
            if (holdNode == endNode) {
                hasBegin++;
            }
            if (hasBegin) {
                dragNodes.push(holdNode);
                if (hasBegin >= 2) {
                    return dragNodes;
                }
            }
        }
        return [];
    }

    getCardNodes(cards) {
        let res = [];
        let pokerIds = GameUtil.deepClone(cards);
        for (let holdNode of this.holdNodes) {
            let pokerId = holdNode.getComponent(PokerItem).pokerId;
            let index = pokerIds.indexOf(pokerId);
            if (index >= 0) {
                pokerIds.splice(index, 1);
                res.push(holdNode);
            }
        }
        return res;
    }

    updateHolds(holds) {
        for (let i = 0; i < holds.length; ++i) {
            let pokerId = holds[i];
            if (pokerId == this.holds[i]) {
                continue;
            }
            if (!this.holdNodes[i]) {
                this.holdNodes[i] = UIMgr.createNode(this.prefab_poker, this.node, PokerItem, pokerId);
            } else {
                this.holdNodes[i].getComponent(PokerItem).updateView(pokerId);
            }
            this.holdNodes[i].active = true;
        }
        for (let i = holds.length; i < this.holds.length; ++i) {
            if (this.holdNodes[i]) {
                // this.holdNodes[i].parent = null;
                // this.holdNodes[i] = null;
                this.holdNodes[i].active = false;
            }
        }
        this.holds = holds;
    }

    forceClear() {
        GameUtil.clearChildren(this.node);
        this.holdNodes = [];
        this.holds = [];
    }
}