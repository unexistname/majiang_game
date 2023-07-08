import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import { GameConst } from "../Const/GameConst";
import BaseAudioMgr from "../Game/BaseAudioMgr";


export default class SGAudioMgr extends BaseAudioMgr {

    start() {
        NetMgr.addListener(this, NetDefine.WS_Resp.G_ShowCard, this.G_ShowCard);
    }

    getCardTypeAudioPath(cardType: number) {
        if (cardType) {
            return GameConst.AudioPath.SAN_GONG + "sg_" + cardType;
        }
    }
}