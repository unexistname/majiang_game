import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import UrlModel from "../Global/UrlModel";


export default class SSSNet {
    static C_Combine(cards: number[][]) {
        let data = {cards: cards};
        NetMgr.tcpSend(NetDefine.WS_Req.C_Combine, data, UrlModel.gameUrl);
    }
}