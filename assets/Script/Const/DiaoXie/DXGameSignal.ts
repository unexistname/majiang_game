
import { GameConst } from "../GameConst";

let DXGameOperate = {
    OPERATE_EAT: "OPERATE_EAT",
    OPERATE_TOUCH: "OPERATE_TOUCH",
    OPERATE_BELT: "OPERATE_BELT",
    OPERATE_WAIVE: "OPERATE_WAIVE",
    OPERATE_REVERSE_BELT: "OPERATE_REVERSE_BELT",
    OPERATE_STUFFY_EAT: "OPERATE_STUFFY_EAT",
}

GameConst.GameOperate = Object.assign({}, GameConst.GameOperate, DXGameOperate);