import UIMgr from "../BaseUI/UIMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ChatItem extends cc.Component {

    CC_onClickChat() {
        UIMgr.showView("ChatView");
    }
}