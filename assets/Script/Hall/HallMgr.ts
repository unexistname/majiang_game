import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import UrlModel from "../Global/UrlModel";
import HallEncry from "./HallEncry";
import HallNet from "./HallNet";
import RoomMgr from "../Room/RoomMgr";
import MeModel from "../Global/MeModel";
import UIMgr from "../BaseUI/UIMgr";


export default class HallMgr {
    private static _ins: HallMgr = null;
    public static get ins() {
        if (this._ins == null) {
            this._ins = new HallMgr();
            this._ins.init();
        }
        return this._ins;
    }

    roomConfs: any;

    needShowCreate: boolean = false;

    init() {
        this.initMgr();
        
        NetMgr.addListener(this, NetDefine.WS_Resp.G_EnterRoom, this.G_EnterRoom);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_LeaveRoom, this.G_LeaveRoom);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_ShowCreateRoom, this.G_ShowCreateRoom);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_Dissolve, this.G_Dissolve);
    }

    initMgr() {
        HallEncry.ins.register();
    }

    enterRoom(roomId: string) {
        HallNet.C_EnterRoom(roomId);
    }

    G_EnterRoom(data) {
        UrlModel.gameUrl = data.url;
        RoomMgr.ins.goToGame()
    }

    G_LeaveRoom(data) {
        if (MeModel.isMe(data.userId)) {
            this.goToHall();
        }
    }

    G_Dissolve() {
        UIMgr.showTip("房间已解散");
        setTimeout(() => {
            this.goToHall();
        }, 1500);
    }

    showCreateRoom() {
        if (this.roomConfs) {
            UIMgr.showView("CreateRoomView", this.roomConfs);
        } else {
            this.needShowCreate = true;
            HallNet.C_ShowCreateRoom();
        }
    }

    G_ShowCreateRoom(data) {
        this.roomConfs = data;
        if (this.needShowCreate) {
            UIMgr.showView("CreateRoomView", this.roomConfs); 
            this.needShowCreate = false;
        }
    }

    getRoomConfs() {
        return this.roomConfs;
    }

    goToHall() {
        // NetMgr.changeTcpUrl(UrlModel.hallUrl);
        cc.director.loadScene("Hall", () => {
            NetMgr.changeTcpUrl(UrlModel.hallUrl, () => {
                if (!this.roomConfs) {
                    HallNet.C_ShowCreateRoom();
                }
            });
        });
    }
}