import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import MeModel from "../Global/MeModel";
import UrlModel from "../Global/UrlModel";

export default class RoomNet {

    static C_Ready(ready: boolean = true) {
        NetMgr.tcpSend(NetDefine.WS_Req.C_Ready, {ready: ready}, UrlModel.gameUrl);
    }

    static C_BeginGame() {
        NetMgr.tcpSend(NetDefine.WS_Req.C_BeginGame, {}, UrlModel.gameUrl);
    }

    static C_Dissolve() {
        NetMgr.tcpSend(NetDefine.WS_Req.C_Dissolve, {}, UrlModel.gameUrl);
    }

    static C_GamberInfo(userId: string) {
        NetMgr.tcpSend(NetDefine.WS_Req.C_GamberInfo, {userId: userId}, UrlModel.gameUrl);
    }

    static C_LeaveRoom() {
        NetMgr.tcpSend(NetDefine.WS_Req.C_LeaveRoom, {}, UrlModel.gameUrl);
    }

    static C_ContinueGame() {
        NetMgr.tcpSend(NetDefine.WS_Req.C_ContinueGame, {}, UrlModel.gameUrl);
    }

    static C_OverSettle() {
        NetMgr.tcpSend(NetDefine.WS_Req.C_OverSettle, {}, UrlModel.gameUrl);
    }

    static C_TransferGem(userId: string, gemNum: number) {
        let data = { userId: userId, gemNum: gemNum };
        NetMgr.tcpSend(NetDefine.WS_Req.C_TransferGem, data, UrlModel.gameUrl);
    }

    static C_ShowProp() {
        NetMgr.tcpSend(NetDefine.WS_Req.C_ShowProp, {}, UrlModel.gameUrl);
    }

    static C_UseProp(userId: string, propId: string) {
        let data = { userId: userId, propId: propId };
        NetMgr.tcpSend(NetDefine.WS_Req.C_UseProp, data, UrlModel.gameUrl);
    }

    static C_Voice(content: any, time: number, receiveUserId?: string) {
        let data = {
            content: content,
            time: time,
            receiveUserId: receiveUserId,
        }
        NetMgr.tcpSend(NetDefine.WS_Req.C_Voice, data, UrlModel.gameUrl);
    }

    static C_Chat(content: string) {
        let data = { content: content };
        NetMgr.tcpSend(NetDefine.WS_Req.C_Chat, data, UrlModel.gameUrl);
    }

    static C_QuickChat(chatId: number) {
        let data = { chatId: chatId };
        NetMgr.tcpSend(NetDefine.WS_Req.C_QuickChat, data, UrlModel.gameUrl);
    }

    static C_Emoji(emojiId: string) {
        let data = { emojiId: emojiId };
        NetMgr.tcpSend(NetDefine.WS_Req.C_Emoji, data, UrlModel.gameUrl);
    }

    static C_DissolveVote(vote: boolean) {
        let data = { vote: vote };
        NetMgr.tcpSend(NetDefine.WS_Req.C_DissolveVote, data, UrlModel.gameUrl);
    }
}