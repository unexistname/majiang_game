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
                return GameConst.AudioPath.POKER + this.getPokerSoundValue(value[0]);
            case GameConst.PokerType.PAIR:
                return GameConst.AudioPath.POKER + "2_" + this.getPokerSoundValue(value[0]);
            case GameConst.PokerType.THREE:
                return GameConst.AudioPath.POKER + "3_" + this.getPokerSoundValue(value[0]);
            case GameConst.PokerType.SINGLE_STRAIGHT:
                return GameConst.AudioPath.POKER + "shunzi";
            case GameConst.PokerType.PAIR_STRAIGHT:
                return GameConst.AudioPath.POKER + "liangdui";
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
                if (this.is510K(value)) {
                    return GameConst.AudioPath.POKER + "510K";
                } else {
                    return GameConst.AudioPath.POKER + "zhadan";
                }
        }
    }

    is510K(cards: number[]) {
        if (cards.length == 3) {
            let dict = {};
            for (let pokerId of cards) {
                let value = Math.floor(pokerId / 10);
                dict[value] = true;
            }
            return dict[5] && dict[10] && dict[13];
        }
        return false;
    }

    getPokerSoundValue(pokerId) {
        if (ResUtil.isGhost(pokerId)) {
            let value = Math.floor(pokerId / 10);
            return value == 1 ? "xiaowang" : "dawang"
        } else {
            return ResUtil.getPokerValue(pokerId);
        }
    }
}