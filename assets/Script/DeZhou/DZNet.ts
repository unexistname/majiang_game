import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import UrlModel from "../Global/UrlModel";



export default class DZNet {

    static C_Call() {
        NetMgr.tcpSend(NetDefine.WS_Req.C_Call, {}, UrlModel.gameUrl);
    }

    static C_Raise() {
        NetMgr.tcpSend(NetDefine.WS_Req.C_Raise, {}, UrlModel.gameUrl);
    }

    static C_Waive() {
        NetMgr.tcpSend(NetDefine.WS_Req.C_Waive, {}, UrlModel.gameUrl);
    }
}