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

    static C_TipCard(cards: number[]) {
        let data = { cards: cards };
        NetMgr.tcpSend(NetDefine.WS_Req.C_TipCard, data, UrlModel.gameUrl);
    }
    
    static C_SortCard() {
        NetMgr.tcpSend(NetDefine.WS_Req.C_SortCard, {}, UrlModel.gameUrl);
    }

    static C_RestoreCard() {
        NetMgr.tcpSend(NetDefine.WS_Req.C_RestoreCard, {}, UrlModel.gameUrl);
    }

    static C_ArrangeCard(cards: number[]) {
        let data = { cards: cards };
        NetMgr.tcpSend(NetDefine.WS_Req.C_ArrangeCard, data, UrlModel.gameUrl);
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

    static CA_ReplaceCard(myCardIndex: number, myCard: number, heapCardIndex: number, heapCard: number) {
        let data = { myCardIndex: myCardIndex, myCard: myCard, heapCardIndex: heapCardIndex, heapCard: heapCard };
        NetMgr.tcpSend(NetDefine.WS_Req.CA_ReplaceCard, data, UrlModel.gameUrl);
    }
}