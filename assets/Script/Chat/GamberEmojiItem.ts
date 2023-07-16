import UIMgr from "../BaseUI/UIMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GamberEmojiItem extends cc.Component {

    @property(cc.Animation)
    anim_emoji: cc.Animation;

    updateView(data) {
        this.node.setPosition(data.pos);
        this.anim_emoji.play(data.emojiId);

        this.node.runAction(cc.sequence(
            cc.delayTime(2),
            cc.callFunc(() => {
                this.anim_emoji.stop();
            }),
            cc.fadeOut(0.3),
            cc.callFunc(() => {
                UIMgr.closeSelf(this);
            })
        ));
    }
}