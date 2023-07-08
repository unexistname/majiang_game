import AudioMgr from "../Controller/Game/AudioMgr";
import MeModel from "../Global/MeModel";
import { GameConst } from "../Const/GameConst";


export default class BaseAudioMgr extends cc.Component {

    G_Rob(data) {
        if (data.isSync) {
            return;
        }
        let path;
        if (data.robScore) {
            path = GameConst.AudioPath.COMMON + "qiang";
        } else {
            path = GameConst.AudioPath.COMMON + "buqiang";
        }
        AudioMgr.ins.playEffect(path);
    }

    G_SeeCard(data) {
        if (data.isSync) {
            return;
        }
        if (MeModel.isMe(data.userId)) {
            let path = this.getCardTypeAudioPath(data.cardType);
            AudioMgr.ins.playEffect(path);
        }
    }

    G_ShowCard(data) {
        if (data.isSync) {
            return;
        }
        for (let userId in data) {
            let path = this.getCardTypeAudioPath(data[userId].cardType);
            AudioMgr.ins.playEffect(path);
        }
    }

    getCardTypeAudioPath(cardType: number) {
        return "";
    }

    G_DoOperate(data) {
        if (data.isSync) {
            return;
        }
        let path = this.getOperateAudioPath(data.operate, data.value);
        AudioMgr.ins.playEffect(path);
    }

    getOperateAudioPath(operate, value) {
        if (value > 0) {
            return GameConst.AudioPath.BETTING + "bei" + value;
        }
    }
}