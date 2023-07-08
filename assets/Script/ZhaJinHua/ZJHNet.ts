import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import UrlModel from "../Global/UrlModel";


export default class ZJHNet {
    
    static C_Call() {
        NetMgr.tcpSend(NetDefine.WS_Req.C_Call, {}, UrlModel.gameUrl);
    }
    
    static C_ShowRaise() {
        NetMgr.tcpSend(NetDefine.WS_Req.C_ShowRaise, {}, UrlModel.gameUrl);
    }

    static C_Raise(betting: number) {
        let data = {betting: betting};
        NetMgr.tcpSend(NetDefine.WS_Req.C_Raise, data, UrlModel.gameUrl);
    }

    static C_Watch() {
        NetMgr.tcpSend(NetDefine.WS_Req.C_Watch, {}, UrlModel.gameUrl);
    }

    static C_Compare(cmpUserId: string) {
        let data = {cmpUserId: cmpUserId};
        NetMgr.tcpSend(NetDefine.WS_Req.C_Compare, data, UrlModel.gameUrl);
    }

    static C_CompareSelect() {
        NetMgr.tcpSend(NetDefine.WS_Req.C_CompareSelect, {}, UrlModel.gameUrl);
    }

    static C_Waive() {
        NetMgr.tcpSend(NetDefine.WS_Req.C_Waive, {}, UrlModel.gameUrl);
    }
}