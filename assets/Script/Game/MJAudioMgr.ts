import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import { GameConst } from "../Const/GameConst";
import MJOperate from "../Mahjong/MJOperate";
import AudioMgr from "../Controller/Game/AudioMgr";


export default class MJAudioMgr extends cc.Component {

    start() {
        NetMgr.addListener(this, NetDefine.WS_Resp.G_DoOperate, this.G_DoOperate);
    }

    G_DoOperate(data) {
        if (data.isSync) {
            return;
        }
        let path = this.getOperateAudioPath(data.operate, data.value);
        AudioMgr.ins.playEffect(path);
    }

    getOperateAudioPath(operate, value) {
        switch (operate) {
            case MJOperate.CHI:
                return GameConst.AudioPath.MAHJONG + "chi";
            case MJOperate.PENG:
                return GameConst.AudioPath.MAHJONG + "peng";
            case MJOperate.GANG:
                if (value.gangtype == "angang") {
                    return GameConst.AudioPath.MAHJONG + "angang";
                } else {
                    return GameConst.AudioPath.MAHJONG + "gang";
                }
            case MJOperate.HU:
                return GameConst.AudioPath.MAHJONG + "hu";
            case MJOperate.ZI_MO:
                return GameConst.AudioPath.MAHJONG + "zimo";
            case MJOperate.CHU_PAI:
                return GameConst.AudioPath.MAHJONG + value;
        }
    }
}