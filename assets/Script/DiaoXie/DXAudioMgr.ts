import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import { GameConst } from "../Const/GameConst";
import DXOperate from "./DXOperate";
import BaseAudioMgr from "../Game/BaseAudioMgr";


export default class DXAudioMgr extends BaseAudioMgr {

    start() {
        NetMgr.addListener(this, NetDefine.WS_Resp.G_DoOperate, this.G_DoOperate);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_ShowCard, this.G_ShowCard);
    }

    getCardTypeAudioPath(cardType: any) {
        if (cardType) {
            return GameConst.AudioPath.DIAO_XIE + cardType;
        }
    }

    getOperateAudioPath(operate: DXOperate) {
        switch (operate) {
            case DXOperate.EAT:
            case DXOperate.BLIND_EAT:
                return GameConst.AudioPath.DIAO_XIE + "chi";
            case DXOperate.TOUCH:
                return GameConst.AudioPath.DIAO_XIE + "peng";
            case DXOperate.BELT:
                return GameConst.AudioPath.DIAO_XIE + "dai";
            case DXOperate.REVERSE_BELT:
                return GameConst.AudioPath.DIAO_XIE + "fandai";
            case DXOperate.NO_BELT:
            case DXOperate.WAIVE:
                return GameConst.AudioPath.DIAO_XIE + "buyao";
        }
    }
}