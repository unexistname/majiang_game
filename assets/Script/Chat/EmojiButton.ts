import RoomNet from "../Room/RoomNet";

const { ccclass, property } = cc._decorator;

@ccclass
export default class EmojiButton extends cc.Component {

    // @property(cc.Sprite)
    // sp_emoji: cc.Sprite;

    content: string;

    protected start(): void {
        this.content = this.node.name;
    }

    // updateView({spriteFrame, content}) {
    //     this.content = content;
    //     this.sp_emoji.spriteFrame = spriteFrame;
    // }

    CC_onClickEmoji() {
        RoomNet.C_Emoji(this.content);
    }
}