import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import { GameConst } from "../Const/GameConst";
import ZJHOperate from "./ZJHOperate";
import BaseAudioMgr from "../Game/BaseAudioMgr";


export default class ZJHAudioMgr extends BaseAudioMgr {

    start() {
        NetMgr.addListener(this, NetDefine.WS_Resp.G_DoOperate, this.G_DoOperate);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_SeeCard, this.G_SeeCard);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_ShowCard, this.G_ShowCard);
    }

    getCardTypeAudioPath(cardType: number) {
        if (cardType) {
            return GameConst.AudioPath.ZHA_JIN_HUA + "zjh_" + cardType;
        }
    }

    getOperateAudioPath(operate: ZJHOperate) {
        switch (operate) {
            case ZJHOperate.CALL:
                return GameConst.AudioPath.ZHA_JIN_HUA + "genzhu";
            case ZJHOperate.RAISE:
                return GameConst.AudioPath.ZHA_JIN_HUA + "jiazhu";
            case ZJHOperate.COMPARE:
                return GameConst.AudioPath.ZHA_JIN_HUA + "bipai";
            case ZJHOperate.WAIVE:
                return GameConst.AudioPath.ZHA_JIN_HUA + "buyao";
        }
    }
}