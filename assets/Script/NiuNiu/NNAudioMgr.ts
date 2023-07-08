import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import { GameConst } from "../Const/GameConst";
import BaseAudioMgr from "../Game/BaseAudioMgr";


export default class NNAudioMgr extends BaseAudioMgr {

    start() {
        NetMgr.addListener(this, NetDefine.WS_Resp.G_Rob, this.G_Rob);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_DoOperate, this.G_DoOperate);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_SeeCard, this.G_SeeCard);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_ShowCard, this.G_ShowCard);
    }

    getCardTypeAudioPath(cardType: number) {
        return GameConst.AudioPath.NIU_NIU + "niu_" + cardType;
    }
}