import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import UrlModel from "../Global/UrlModel";

export default class HallNet {

    static C_CreateRoom(gameName: string, roomConf: any) {
        let data = {
            gameName: gameName,
            roomConf: roomConf,
        }
        NetMgr.tcpSend(NetDefine.WS_Req.C_CreateRoom, data, UrlModel.hallUrl);
    }

    static C_EnterRoom(roomId: string) {
        let data = { roomId: roomId };
        NetMgr.tcpSend(NetDefine.WS_Req.C_EnterRoom, data, UrlModel.hallUrl);
    }

    static C_EnterHall() {
        NetMgr.tcpSend(NetDefine.WS_Req.C_EnterHall, {}, UrlModel.hallUrl);
    }

    static C_ShowCreateRoom() {
        NetMgr.tcpSend(NetDefine.WS_Req.C_ShowCreateRoom, {}, UrlModel.hallUrl);
    }

    static C_ShowRecord() {
        NetMgr.tcpSend(NetDefine.WS_Req.C_ShowRecord, {}, UrlModel.hallUrl);
    }

    static C_Recharge(data: any, callback: Function) {
        NetMgr.httpSend(NetDefine.HTTP_Get.C_Recharge, data, callback, UrlModel.hallUrl);
    }

    static C_ShowRecharge(callback: Function) {
        NetMgr.httpSend(NetDefine.HTTP_Get.C_ShowRecharge, {}, callback, UrlModel.hallUrl);
    }
}