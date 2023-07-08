import SitPos from "../Const/Game/SitPos";
import MJOperate from "./MJOperate";
import { GameConst } from "../Const/GameConst";


export default class MahjongUtil {

    static isMJBaseOperate(operate) {
        return !!(operate & (MJOperate.CHI | MJOperate.PENG | MJOperate.GANG | MJOperate.HAN_GANG));
    }

    static hasOperate(operates, operate) {
        return (operates & operate) != 0;
    }

    static getSitPosByLocalIndex(localIndex, seatAmount) {
        let sitPosList = [];
        if (seatAmount == 2) {
            sitPosList = [SitPos.DOWN, SitPos.TOP];
        } else {
            sitPosList = [SitPos.DOWN, SitPos.RIGHT, SitPos.TOP, SitPos.LEFT];
        }
        return sitPosList[localIndex];
    }

    static hasWinType(winTypes: GameConst.HuType[], ...types: GameConst.HuType[]) {
        for (let winType of winTypes) {
            if (types.indexOf(winType) >= 0) {
                return true;
            }
        }
        return false;
    }

    static isZiMo(winTypes: GameConst.HuType[]) {
        return winTypes.indexOf(GameConst.HuType.ZI_MO) >= 0;
    }
}