import { GameConst } from "../GameConst";


export default class NetConfig {
    static NET_HEART_BEAT_INTERVAL = 6000;   // 心跳包时间
    static NET_HEART_BEAT_TIMEOUT = 6000 * 5;   // 心跳包超时时间
}

GameConst.Config = Object.assign({}, GameConst.Config, NetConfig);