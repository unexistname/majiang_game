import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import UrlModel from "../Global/UrlModel";

export default class MJNet {
    
    static C_Chi(index) {
        let data = {index: index};
        NetMgr.tcpSend(NetDefine.WS_Req.C_Chi, data, UrlModel.gameUrl);
    }
    
    static C_Peng() {
        NetMgr.tcpSend(NetDefine.WS_Req.C_Peng, {}, UrlModel.gameUrl);
    }
    
    static C_Gang(pai) {
        let data = {pai: pai};
        NetMgr.tcpSend(NetDefine.WS_Req.C_Gang, data, UrlModel.gameUrl);
    }
    
    static C_Guo() {
        NetMgr.tcpSend(NetDefine.WS_Req.C_Guo, {}, UrlModel.gameUrl);
    }
    
    static C_Hu() {
        NetMgr.tcpSend(NetDefine.WS_Req.C_Hu, {}, UrlModel.gameUrl);
    }
    
    static C_ZiMo() {
        NetMgr.tcpSend(NetDefine.WS_Req.C_ZiMo, {}, UrlModel.gameUrl);
    }

    static C_ChuPai(pai) {
        let data = {pai: pai}
        NetMgr.tcpSend(NetDefine.WS_Req.C_ChuPai, data, UrlModel.gameUrl);
    }
}