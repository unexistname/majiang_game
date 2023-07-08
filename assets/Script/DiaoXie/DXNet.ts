import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import GameNet from "../Game/GameNet";
import UrlModel from "../Global/UrlModel";


export default class DXNet extends GameNet {
    
    static C_Eat() {
        NetMgr.tcpSend(NetDefine.WS_Req.C_Eat, {}, UrlModel.gameUrl);
    }

    static C_BlindEat() {
        NetMgr.tcpSend(NetDefine.WS_Req.C_BlindEat, {}, UrlModel.gameUrl);
    }

    static C_ShowTouch() {
        NetMgr.tcpSend(NetDefine.WS_Req.C_ShowTouch, {}, UrlModel.gameUrl);
    }

    static C_Touch(betting: number) {
        NetMgr.tcpSend(NetDefine.WS_Req.C_Touch, {betting: betting}, UrlModel.gameUrl);
    }

    static C_Belt() {
        NetMgr.tcpSend(NetDefine.WS_Req.C_Belt, {}, UrlModel.gameUrl);
    }

    static C_ReverseBelt() {
        NetMgr.tcpSend(NetDefine.WS_Req.C_ReverseBelt, {}, UrlModel.gameUrl);
    }

    static C_NoBelt() {
        NetMgr.tcpSend(NetDefine.WS_Req.C_NoBelt, {}, UrlModel.gameUrl);
    }

    static C_SeeCard() {
        NetMgr.tcpSend(NetDefine.WS_Req.C_SeeCard, {}, UrlModel.gameUrl);
    }

    static C_RubCard() {
        NetMgr.tcpSend(NetDefine.WS_Req.C_RubCard, {}, UrlModel.gameUrl);
    }
}