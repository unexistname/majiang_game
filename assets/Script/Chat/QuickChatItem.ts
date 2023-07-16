import RoomNet from "../Room/RoomNet";
import { QuickChat } from "./QuickChat";

const { ccclass, property } = cc._decorator;

@ccclass
export default class QuickChatItem extends cc.Component {

    chatId: number;

    @property(cc.Label)
    txt_content: cc.Label;

    updateView(chatId) {
        this.chatId = chatId;
        this.txt_content.string = QuickChat[chatId];
    }

    CC_onClickQuickChat() {
        RoomNet.C_QuickChat(this.chatId);
    }
}