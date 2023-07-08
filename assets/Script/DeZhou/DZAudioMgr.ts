import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import { GameConst } from "../Const/GameConst";
import DZOperate from "./DZOperate";
import BaseAudioMgr from "../Game/BaseAudioMgr";


export default class DZAudioMgr extends BaseAudioMgr {

    start() {
        NetMgr.addListener(this, NetDefine.WS_Resp.G_DoOperate, this.G_DoOperate);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_ShowCard, this.G_ShowCard);
    }

    getCardTypeAudioPath(cardType: any) {
        if (cardType != null) {
            return GameConst.AudioPath.DE_ZHOU + "dz_" + cardType;
        }
    }

    getOperateAudioPath(operate: DZOperate) {
        switch (operate) {
            case DZOperate.CALL:
                return GameConst.AudioPath.DE_ZHOU + "genzhu";
            case DZOperate.RAISE:
                return GameConst.AudioPath.DE_ZHOU + "jiazhu";
            case DZOperate.WAIVE:
                return GameConst.AudioPath.DE_ZHOU + "buyao";
        }
    }
}