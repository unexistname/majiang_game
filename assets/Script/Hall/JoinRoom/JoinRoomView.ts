import UIMgr from "../../BaseUI/UIMgr";
import { GameConst } from "../../Const/GameConst";
import HallNet from "../HallNet";

const { ccclass, property } = cc._decorator;

@ccclass
export default class JoinRoomView extends cc.Component {

    @property(cc.Label)
    txt_roomId: cc.Label;

    @property(cc.Node)
    desc_roomId: cc.Node;

    private _roomId: string;
    get roomId() {
        return this._roomId;
    }

    set roomId(val: string) {
        this._roomId = val;
        if (val.length <= 0) {
            this.txt_roomId.node.active = false;
            this.desc_roomId.active = true;
        } else {
            this.txt_roomId.string = val.split("").join("  ");
            this.txt_roomId.node.active = true;
            this.desc_roomId.active = false;
        }
    }

    protected onLoad(): void {
        this.roomId = "";
    }

    CC_onClickNum(event, num) {
        if (this.roomId.length >= GameConst.Config.ROOM_ID_LENGTH) {
            return;
        }
        this.roomId += num;
        if (this.roomId.length == GameConst.Config.ROOM_ID_LENGTH) {
            this.CC_onClickJoin();
        }
    }

    CC_onClickDel() {
        if (this.roomId.length <= 0) {
            return;
        }
        this.roomId = this.roomId.slice(0, this.roomId.length - 1);
    }

    CC_onClickJoin() {
        if (this.roomId.length != GameConst.Config.ROOM_ID_LENGTH) {
            return;
        }
        HallNet.C_EnterRoom(this.roomId);
    }

    CC_onClickClear() {
        this.roomId = "";
    }

    CC_onClickClose() {
        UIMgr.closeSelf(this);
    }
}