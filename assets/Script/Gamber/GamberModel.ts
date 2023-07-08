import UserModel from "../Room/UserModel";

export default class GamberModel extends UserModel {

    // @Signal(GameConst.GameSignal.USER_HOLDS, this)
    // 手牌
    holds: any = [];

    // @Signal(GameConst.GameSignal.USER_SCORE, this)
    // 当前得分
    score: number = 0;
    
    // @Signal(GameConst.GameSignal.UPDATE_OWNER, this)
    // 房主
    owner: boolean = false;

    // @Signal(GameConst.GameSignal.DECIDE_BANKER, this)
    // 是否是庄
    banker: boolean = false;
    
    // @Signal(GameConst.GameSignal.USER_READY, this)
    // 是否已准备
    ready: boolean = false;

    // @Signal(GameConst.GameSignal.USER_ONLINE, this)
    // 是否在线
    online: boolean = false;
}