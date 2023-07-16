import UIMgr from "../BaseUI/UIMgr";
import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import RoomNet from "../Room/RoomNet";
import { QuickChat } from "./QuickChat";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ChatView extends cc.Component {

    @property(cc.EditBox)
    edit_chat: cc.EditBox;

    @property(cc.Node)
    node_quickChats: cc.Node;

    protected start(): void {
        this.initView();
        NetMgr.addListener(this, NetDefine.WS_Resp.G_Chat, this.CC_onClickClose);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_QuickChat, this.CC_onClickClose);
    }

    initView() {
        for (let chatId in QuickChat) {
            if (isNaN(Number(chatId))) {
                continue;
            }
            UIMgr.createPrefab("QuickChatItem", this.node_quickChats, chatId);
        }
    }

    CC_onClickSend() {
        let content = this.edit_chat.string;
        if (!content || content.length <= 0) {
            return
        }
        RoomNet.C_Chat(content);
    }

    CC_onClickClose() {
        UIMgr.closeSelf(this);
    }
}