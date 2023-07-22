import UIMgr from "../BaseUI/UIMgr";
import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import ResUtil from "../Util/ResUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DXRubCardView extends cc.Component {

    @property(cc.Node)
    node_poker: cc.Node;

    @property(cc.Node)
    node_back: cc.Node;

    startPos: cc.Vec2;

    backPos: cc.Vec2;

    canTouch: boolean;

    data: any;

    start() {
        this.canTouch = true;
        this.node_back.setPosition(new cc.Vec2(0, 0));
        this.node_back.on(cc.Node.EventType.TOUCH_START, this.onTouchDown, this);
        this.node_back.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node_back.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node_back.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);

        NetMgr.addListener(this, NetDefine.WS_Resp.G_RubCard, this.G_RubCard);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_ShowCard, this.hidden);
        this.node.active = false;
    }

    updateView(holds) {
        this.setPoker(this.node_back, holds[0]);
        this.setPoker(this.node_poker, holds[1]);
    }

    setPoker(node, pokerId) {
        UIMgr.setSprite(node.getComponent(cc.Sprite), ResUtil.getPokerDecorResPath(pokerId));
        let path = ResUtil.getPokerValueResPath(pokerId);
        for (let child of node.children) {
            if (path) {
                UIMgr.setSprite(child.getComponent(cc.Sprite), path);
            }
            child.active = path != null;
        }
    }

    onTouchDown(event) {
        if (!this.canTouch) {
            return;
        }
        this.backPos = this.node_back.getPosition();
        this.startPos = event.getLocation();
    }

    hidden() {
        this.node.active = false;
    }

    rubCardOver() {
        cc.director.emit("rub_card_over", this.data);
        this.hidden();
    }

    G_RubCard(data) {
        this.data = data;
        this.updateView(data.holds);
        this.node_back.setPosition(new cc.Vec2(0, 0));
        this.node.active = true;
    }

    onTouchMove(event) {
        if (!this.canTouch) {
            return;
        }
        let movePos = event.getLocation();
        let targetX = movePos.x - this.startPos.x + this.backPos.x;
        let targetY = movePos.y - this.startPos.y + this.backPos.y;
        this.node_back.x = targetX;
        this.node_back.y = targetY;

        if (this.canRubOver(targetX, targetY)) {
            let pos = this.getRubEndPos(targetX, targetY);
            this.canTouch = false;
            this.node_back.runAction(cc.sequence(
                cc.moveBy(0.3, pos),
                cc.delayTime(0.5),
                cc.callFunc(() => {
                    this.canTouch = true;
                    this.rubCardOver();
                }),
            ));
        }
    }

    onTouchEnd() {
        if (!this.canTouch) {
            return;
        }
        this.startPos = null;
    }

    onTouchCancel() {
        this.onTouchEnd();
    }

    canRubOver(posX: number, posY: number) {
        return Math.abs(posX) > 200 || Math.abs(posY) > 300;
    }

    getRubEndPos(posX: number, posY: number) {
        if (posY < -100) {
            return new cc.Vec2(posX, -720);
        }
        if (posX < -60) {
            return new cc.Vec2(-1280, posX);
        }
        if (posY > 100) {
            return new cc.Vec2(posX, 720);
        }
        if (posX > 60) {
            return new cc.Vec2(1280, posY);
        }
    }
}