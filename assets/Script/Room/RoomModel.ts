import GameType from "../Const/Game/GameType";
import RoomState from "../Const/Game/RoomState";
import UserModel from "./UserModel";

export default class RoomModel {
    roomId: string = "";
    roomType: GameType = null;
    gameType: GameType;
    roomState: RoomState = RoomState.IDLE;
    watcherIds: number[];
    gamberIds: number[];

    // 该房间内的玩家与观战者
    users: UserModel[];
    
    // 房主
    owner: UserModel;
    
    // 最大玩家数
    maxGamberNum: number = 0;

    // 当前回合数
    round: number;

    // 最大回合数
    maxRoundNum: number;

    // 底分
    baseScore: number;
}