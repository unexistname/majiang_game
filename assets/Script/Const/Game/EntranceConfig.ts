import { GameConst } from "../GameConst";

let EntranceConfig = {
    IS_DEBUG: true,
}

GameConst.Config = Object.assign({}, GameConst.Config, EntranceConfig);