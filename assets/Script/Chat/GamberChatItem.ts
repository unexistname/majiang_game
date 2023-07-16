import UIMgr from "../BaseUI/UIMgr";
import { QuickChat } from "./QuickChat";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GamberChatItem extends cc.Component {

    @property(cc.Label)
    txt_content: cc.Label;

    @property([cc.Sprite])
    sp_bubbles: cc.Sprite[] = [];

    @property(cc.Sprite)
    sp_bg: cc.Sprite;

    updateView(data) {
        this.adjustPos(data.pos);

        let content = data.content || QuickChat[data.chatId];
        this.txt_content.string = content;
        let len = content.length;
        this.node.runAction(cc.sequence(
            cc.delayTime(len * 0.12 + 0.5),
            cc.fadeOut(0.3),
            cc.callFunc(() => {
                UIMgr.closeSelf(this);
            })));
    }

    adjustPos(pos) {
        let left = false, top = true;
        if (pos.x < 0) {
            left = true;
        }
        if (pos.y < 0) {
            top = false;
        }
        let width = this.sp_bg.node.width / 2;
        let height = this.sp_bg.node.height / 2;
        let offsetX = left ? width : -width;
        let offsetY = top ? -height : height;
        let itemPos = new cc.Vec2(pos.x + offsetX, pos.y + offsetY);
        this.node.setPosition(itemPos);
        this.adjustBg(left, top);
    }

    adjustBg(left: boolean, top: boolean) {
        let index = Number(left) * 2 + Number(top);
        this.sp_bg.spriteFrame = this.sp_bubbles[index].spriteFrame;
    }
}