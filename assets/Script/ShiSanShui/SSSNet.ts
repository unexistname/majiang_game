import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import UrlModel from "../Global/UrlModel";


export default class SSSNet {
    static C_Combine(cards: number[][]) {
        let data = {cards: cards};
        NetMgr.tcpSend(NetDefine.WS_Req.C_Combine, data, UrlModel.gameUrl);
    }

    static C_UseSpecial(cardType: number) {
        let data = {cardType: cardType};
        NetMgr.tcpSend(NetDefine.WS_Req.C_UseSpecial, data, UrlModel.gameUrl);
    }
}