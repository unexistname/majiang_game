import UIMgr from "../BaseUI/UIMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class EmojiItem extends cc.Component {

    CC_onClickEmoji() {
        UIMgr.showView("EmojiView");
    }
}