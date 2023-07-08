import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import MeModel from "../Global/MeModel";
import BaseHoldsItem from "./BaseHoldsItem";
import GameMgr from "./GameMgr";


const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayCardHoldsItem extends BaseHoldsItem {

    clickNodes: cc.Node[] = [];

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

    Slot_ClickPoker(pokerId, node) {
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
}