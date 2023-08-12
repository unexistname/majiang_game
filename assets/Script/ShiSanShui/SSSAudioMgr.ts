import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import { GameConst } from "../Const/GameConst";
import BaseAudioMgr from "../Game/BaseAudioMgr";
import AudioMgr from "../Controller/Game/AudioMgr";


export default class SSSAudioMgr extends BaseAudioMgr {

    start() {
        NetMgr.addListener(this, NetDefine.WS_Resp.G_ShowCard, this.G_ShowCard);
    }

    G_ShowCard(data) {
        if (data.isSync) {
            return;
        }
        for (let userId in data) {
            let cardType = data[userId].cardType;
            if (typeof cardType == "object") {
                for (let i = 0; i < cardType.length; ++i) {                    
                    let path = this.getCardTypeAudioPath(cardType[i]);
                    this.scheduleOnce(() => {
                        AudioMgr.ins.playEffect(path);
                    }, i * 1.5);
                }
            } else {
                let path = this.getCardTypeAudioPath(cardType);
                this.scheduleOnce(() => {
                    AudioMgr.ins.playEffect(path);
                }, 4);
            }
        }
    }

    getCardTypeAudioPath(cardType: number) {
        if (cardType) {
            return GameConst.AudioPath.SHI_SAN_SHUI + "sss_" + cardType;
        }
    }
}