import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import PokerSelectHoldsItem from "../Game/PokerSelectHoldsItem";
import PokerItem from "../Game/PokerItem";
import SSSNet from "./SSSNet";
import GameUtil from "../Util/GameUtil";
import UIMgr from "../BaseUI/UIMgr";
import GameMgr from "../Game/GameMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SSSCombineCardView extends cc.Component {

    @property({type: [cc.Node]})
    piers: cc.Node[] = [];

    @property({type: [cc.Node]})
    pierViews: cc.Node[] = [];

    selectCombineCard: any[];

    startPos: cc.Vec2;

    @property(cc.Node)
    node_holds: cc.Node;

    @property(cc.Node)
    node_optionals: cc.Node;

    combineCardValue: [number[], number[], number[]];

    protected start(): void {
        this.selectCombineCard = [];
        this.combineCardValue = [[], [], []];
        this.node.active = false;
        NetMgr.addListener(this, NetDefine.WS_Resp.G_InitHolds, this.G_InitHolds);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_ShowCard, this.G_ShowCard);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_Combine, this.hidden);
    }

    show() {
        GameUtil.clearChildren(this.node_optionals);
        let data = GameMgr.ins.getOptionalCardData();
        if (data) {
            for (let subData of data) {
                subData.clickCB = this.onClickOptionalCard.bind(this);
                UIMgr.createPrefab("SSSCombineCardItem", this.node_optionals, subData);
            }
        } else {
            this.updateHolds(GameMgr.ins.getMyHolds());
        }
        this.node.active = true;
    }

    hidden() {
        this.node.active = false;
    }

    G_ShowCard() {
        this.hidden();
        this.clear();
    }

    onClickOptionalCard(data) {
        if (data.special) {
            SSSNet.C_UseSpecial(data.special);
            this.node.active = false;
        } else {
            this.setCombineCards(data.combineCards);
        }
    }

    clear() {
        this.selectCombineCard = [];
        this.combineCardValue = [[], [], []];
        let item = this.node_holds.getComponent(PokerSelectHoldsItem);
        if (item) {
            item.forceClear();
        }
    }

    updateHolds(holds: number): void {
        let item = this.node_holds.getComponent(PokerSelectHoldsItem);
        if (item) {
            item.forceClear();
            item.updateHolds(holds);
            for (let child of this.node_holds.children) {
                child.on(cc.Node.EventType.TOUCH_START, this.onTouchDown, this);
                child.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
                child.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
                child.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
            }
        }
    }

    G_InitHolds() {
        let holds = GameMgr.ins.getMyHolds();
        this.setCombineCards([holds.slice(0, 3), holds.slice(3, 8), holds.slice(8)]);
    }

    setCombineCards(cards: number[][]) {
        this.clear();
        for (let i = 0; i < 3; ++i) {
            this.combineCardValue[i] = GameUtil.deepClone(cards[i]);
            this.piers[i].getComponent(PokerSelectHoldsItem).updateHolds(cards[i], (index, child) => {
                child.on(cc.Node.EventType.TOUCH_START, this.onTouchDown, this);
                child.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
                child.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
                child.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
            });
        }
    }

    isInBox(boxPos: cc.Vec2, anchor: cc.Vec2, boxSize: any, point: cc.Vec2) {
        if (point.x < (boxPos.x - anchor.x * boxSize.width)) return false;
        if (point.x > (boxPos.x + (1 - anchor.x) * boxSize.width)) return false;
        if (point.y < (boxPos.y - anchor.y * boxSize.height)) return false;
        if (point.y > (boxPos.y + (1 - anchor.y) * boxSize.height)) return false;
        return true;
    }
    
    onTouchDown(event) {
        this.startPos = event.getLocation();
        let node = event.target;
        node.initPos = node.getPosition();
        let select = node.getChildByName("sp_select");
        let index = this.selectCombineCard.indexOf(node);
        if (index < 0) {
            select.active = true;
            this.selectCombineCard.push(node);
        } else {
            select.active = false;
            this.selectCombineCard.splice(index, 1);
        }
    }

    onTouchMove(event) {
        let endPos = event.getLocation();
        let distanceX = endPos.x - this.startPos.x;
        let distanceY = endPos.y - this.startPos.y;
        for (let i = 0; i < this.selectCombineCard.length; ++i) {
            let node = this.selectCombineCard[i];
            node.setPosition(new cc.Vec2(node.initPos.x + distanceX, node.initPos.y + distanceY));
        }
        for (let i = 0; i < this.pierViews.length; ++i) {
            let pierView: cc.Node = this.pierViews[i];
            let anchor = new cc.Vec2(pierView.anchorX, pierView.anchorY);
            pierView.getChildByName("node_select").active = this.isInBox(pierView.convertToWorldSpaceAR(new cc.Vec2(0, 0)), anchor, pierView.getContentSize(), endPos);
        }
    }

    onTouchEnd = function(event) {
        let endPos = event.getLocation();

        let selectPierIndex = -1;
        for (let i = 0; i < this.pierViews.length; ++i) {
            let pierView = this.pierViews[i];
            pierView.getChildByName("node_select").active = false;
            let anchor = new cc.Vec2(pierView.anchorX, pierView.anchorY);
            if (this.isInBox(pierView.convertToWorldSpaceAR(new cc.Vec2(0, 0)), anchor, pierView.getContentSize(), endPos)) {
                selectPierIndex = i;
            }
        }

        if (selectPierIndex >= 0) {
            // 如果选中的牌在墩中，要先移除
            for (let i = 0; i < this.selectCombineCard.length; ++i) {
                let node = this.selectCombineCard[i];
                let cardValue = node.getComponent(PokerItem).pokerId;

                for (let j = 0; j < this.combineCardValue.length; ++j) {
                    let index = this.combineCardValue[j].indexOf(cardValue);
                    if (index >= 0) {
                        this.combineCardValue[j].splice(index, 1);
                    }
                }
            }

            // 将选中的牌移动到对应的墩
            for (let i = 0; i < this.selectCombineCard.length; ++i) {
                let node = this.selectCombineCard[i];
                let cardValue = node.getComponent(PokerItem).pokerId;

                node.getChildByName("sp_select").active = false;
                // this.piers[selectPierIndex].getComponent(PokerSelectHoldsItem).addHold(cardValue);
                node.parent = this.piers[selectPierIndex];
                node.setPosition(new cc.Vec2(0, 0));
                this.combineCardValue[selectPierIndex].push(cardValue);
            }

            // 然后将墩归位一下
            for (let i = 0; i < this.piers.length; ++i) {
                let pier = this.piers[i];
                let children = pier.children;
                for (let j = 0; j < children.length; ++j) {
                    let node = children[j];
                    let cardWorldPos = pier.convertToWorldSpaceAR(new cc.Vec2(j * 50 + node.getContentSize().width / 2, 0));
                    node.setPosition(node.parent.convertToNodeSpaceAR(cardWorldPos));
                    node.setSiblingIndex(j);
                }
            }
            this.selectCombineCard = [];
        } else {
            if (Math.abs(endPos.x - this.startPos.x) < 5 && Math.abs(endPos.y - this.startPos.y) < 5) {
                // 点击事件
            } else {
                // 拖动事件
                for (let i = 0; i < this.selectCombineCard.length; ++i) {
                    let node = this.selectCombineCard[i];
                    node.setPosition(node.initPos);
                    node.getChildByName("sp_select").active = false;
                }
                this.selectCombineCard = [];
            }
        }
    }

    onTouchCancel(event) {
        for (let i = 0; i < this.selectCombineCard.length; ++i) {
            let node = this.selectCombineCard[i];
            node.setPosition(node.initPos);
            node.getChildByName("sp_select").active = false;
        }
        this.selectCombineCard = [];
    }

    CC_onClickCombineFinish() {
        // let limit = [3, 5, 5];
        // for (let i = 0; i < this.combineCardValue.length; ++i) {
        //     if (this.combineCardValue[i].length != limit[i]) {
        //         console.log("组牌有误", this.combineCardValue);
        //         return ;
        //     }
        // }
        SSSNet.C_Combine(this.combineCardValue);
    }

    CC_onClickClose() {
        this.node.active = false;
    }
}