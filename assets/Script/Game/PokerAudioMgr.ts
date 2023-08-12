import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import { GameConst } from "../Const/GameConst";
import AudioMgr from "../Controller/Game/AudioMgr";
import ResUtil from "../Util/ResUtil";

export default class PokerAudioMgr extends cc.Component {

    start() {
        NetMgr.addListener(this, NetDefine.WS_Resp.G_PokerFold, this.G_PokerFold);
    }

    G_PokerFold(data) {
        if (data.isSync) {
            return;
        }
        let path = this.getPokerCardTypeAudioPath(data.cardType, data.folds);
        AudioMgr.ins.playEffect(path);
    }

    getPokerCardTypeAudioPath(cardType, value) {
        switch (cardType) {
            case GameConst.PokerType.SINGLE:
                return GameConst.AudioPath.POKER + ResUtil.getPokerValue(value[0]);
            case GameConst.PokerType.PAIR:
                return GameConst.AudioPath.POKER + "yidui";
            case GameConst.PokerType.THREE:
                return GameConst.AudioPath.POKER + "3_" + ResUtil.getPokerValue(value[0]);
            case GameConst.PokerType.SINGLE_STRAIGHT:
                return GameConst.AudioPath.POKER + "shunzi";
            case GameConst.PokerType.PAIR_STRAIGHT:
                return GameConst.AudioPath.POKER + "liandui";
            case GameConst.PokerType.THREE_STRAIGHT:
                return GameConst.AudioPath.POKER + "feiji";
            case GameConst.PokerType.THREE_BELT_ONE:
                return GameConst.AudioPath.POKER + "sandaiyi";
            case GameConst.PokerType.THREE_BELT_PAIR:
                return GameConst.AudioPath.POKER + "sandaiyidui";
            case GameConst.PokerType.THREE_STRAIGHT_BELT_ONE:
                return GameConst.AudioPath.POKER + "feiji";
            case GameConst.PokerType.THREE_STRAIGHT_BELT_PAIR:
                return GameConst.AudioPath.POKER + "feiji";
            case GameConst.PokerType.FOUR_BELT_TWO:
                return GameConst.AudioPath.POKER + "sidaier";
            case GameConst.PokerType.FOUR_BELT_TWO_PAIR:
                return GameConst.AudioPath.POKER + "sidailiangdui";
            case GameConst.PokerType.BOMB:
                return GameConst.AudioPath.POKER + "zhadan";
        }
    }
}