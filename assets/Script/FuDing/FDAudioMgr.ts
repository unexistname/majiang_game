import { GameConst } from "../Const/GameConst";
import FDOperate from "./FDOperate";
import MJAudioMgr from "../Game/MJAudioMgr";


export default class FDAudioMgr extends MJAudioMgr {

    getOperateAudioPath(operate: FDOperate, value) {
        if (operate == FDOperate.BU_HUA) {
            return GameConst.AudioPath.MAHJONG + "buhua";
        } else {
            return super.getOperateAudioPath(operate, value);
        }
    }
}