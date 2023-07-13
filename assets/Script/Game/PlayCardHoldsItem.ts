import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import MeModel from "../Global/MeModel";
import BaseHoldsItem from "./BaseHoldsItem";
import GameMgr from "./GameMgr";


const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayCardHoldsItem extends BaseHoldsItem {

    clickNodes: cc.Node[] = [];

    @property(cc.Label)
    txt_leftCard: cc.Label;

    protected start(): void {
        super.start();
        // NetMgr.addListener(this, NetDefine.WS_Resp.G_TurnBetting, this.G_TurnBetting);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_DoOperate, this.G_DoOperate);
    }

    setUserId(userId: string): void {
        super.setUserId(userId);
        if (MeModel.isMe(userId)) {
            this.register("click_card", this.Slot_ClickPoker.bind(this));
        }
    }

    selectOrCancelSelect(node: cc.Node, isSelect: boolean) {
        let pos = node.getPosition();
        let offset = node.height / 2;
        if (!isSelect) {
            offset = -offset;
        }
        node.setPosition(new cc.Vec2(pos.x, pos.y + offset));
    }

    Slot_ClickPoker(pokerId, node, component) {
        let index = this.clickNodes.indexOf(node);
        if (index >= 0) {
            this.clickNodes.splice(index, 1);
            GameMgr.ins.cancelSelectCard(pokerId);
            this.selectOrCancelSelect(node, false);
        } else {
            GameMgr.ins.selectCard(pokerId);
            this.clickNodes.push(node);
            this.selectOrCancelSelect(node, true);
        }
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