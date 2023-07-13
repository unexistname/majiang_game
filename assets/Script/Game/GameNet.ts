import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import UrlModel from "../Global/UrlModel";


export default class GameNet {

    static C_Betting(scoreBetting: number) {
        let data = { score: scoreBetting };
        NetMgr.tcpSend(NetDefine.WS_Req.C_Betting, data, UrlModel.gameUrl);
    }

    static C_Raise(scoreBetting: number) {
        let data = { score: scoreBetting };
        NetMgr.tcpSend(NetDefine.WS_Req.C_Raise, data, UrlModel.gameUrl);
    }

    static C_Rob(scoreRob: number) {
        let data = { score: scoreRob };
        NetMgr.tcpSend(NetDefine.WS_Req.C_Rob, data, UrlModel.gameUrl);
    }

    static C_PlayCard(cards: number[]) {
        let data = { cards: cards };
        NetMgr.tcpSend(NetDefine.WS_Req.C_PlayCard, data, UrlModel.gameUrl);
    }
    
    static C_Waive() {
        NetMgr.tcpSend(NetDefine.WS_Req.C_Waive, {}, UrlModel.gameUrl);
    }

    static CA_Perspect() {
        NetMgr.tcpSend(NetDefine.WS_Req.CA_Perspect, {}, UrlModel.gameUrl);
    }

    static CA_ShowReplaceCard() {
        NetMgr.tcpSend(NetDefine.WS_Req.CA_ShowReplaceCard, {}, UrlModel.gameUrl);
    }

    static CA_ReplaceCard(myCard: number, heapCard: number) {
        let data = { myCard: myCard, heapCard: heapCard };
        NetMgr.tcpSend(NetDefine.WS_Req.CA_ReplaceCard, data, UrlModel.gameUrl);
    }
}