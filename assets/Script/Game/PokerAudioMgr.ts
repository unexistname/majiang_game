import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import { GameConst } from "../Const/GameConst";

export default class PokerAudioMgr extends cc.Component {

    start() {
        NetMgr.addListener(this, NetDefine.WS_Resp.G_Fold, this.G_Fold);
    }

    G_Fold(data) {
        // let path = this.getPokerCardTypeAudioPath(data.cardType, data.pai);
        // AudioMgr.ins.playEffect(path);
    }

    getPokerCardTypeAudioPath(cardType, value) {
        switch (cardType) {
            case GameConst.PokerType.SINGLE:
                return GameConst.AudioPath.POKER + "";
            case GameConst.PokerType.PAIR:
                return GameConst.AudioPath.POKER + "";
            case GameConst.PokerType.THREE:
                return GameConst.AudioPath.POKER + "";
            case GameConst.PokerType.SINGLE_STRAIGHT:
                return GameConst.AudioPath.POKER + "";
            case GameConst.PokerType.PAIR_STRAIGHT:
                return GameConst.AudioPath.POKER + "";
            case GameConst.PokerType.THREE_STRAIGHT:
                return GameConst.AudioPath.POKER + "";
            case GameConst.PokerType.THREE_BELT_ONE:
                return GameConst.AudioPath.POKER + "";
            case GameConst.PokerType.THREE_BELT_PAIR:
                return GameConst.AudioPath.POKER + "";
            case GameConst.PokerType.THREE_STRAIGHT_BELT_ONE:
                return GameConst.AudioPath.POKER + "";
            case GameConst.PokerType.THREE_STRAIGHT_BELT_PAIR:
                return GameConst.AudioPath.POKER + "";
            case GameConst.PokerType.BOMB:
                return GameConst.AudioPath.POKER + "";
        }
    }
}