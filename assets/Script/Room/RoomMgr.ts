import { GameConst } from "../Const/GameConst";
import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import MeModel from "../Global/MeModel";
import UrlModel from "../Global/UrlModel";
import RoomEncry from "./RoomEncry";
import GameMgr from "../Game/GameMgr";
import GameUtil from "../Util/GameUtil";


export default class RoomMgr {
    private static _ins: RoomMgr = null;
    public static get ins() {
        if (this._ins == null) {
            this._ins = new RoomMgr();
            this._ins.init();
        }
        return this._ins;
    }

    seatIndex: {} = {};

    oldSeatIndex: {} = {};

    gambers: {} = {};

    dissolveVotes: {} = {};

    maxGamberNum: number;

    maxGamberSeatIndex: number;

    playing: boolean = false;
    ownerId: string;
    round: number;
    gameName: GameConst.GameType;
    roundAmount: number;
    canJoin: boolean = false;

    init() {
        GameMgr.ins;
        RoomEncry.ins.register()
        NetMgr.addListener(this, NetDefine.WS_Resp.G_PushRoomInfo, this.G_PushRoomInfo);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_UpdateRoomOperate, this.G_UpdateRoomOperate);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_AddGamber, this.updateGamberInfo);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_WatcherToGamber, this.G_WatcherToGamber);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_BeginGame, this.G_BeginGame);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_GameSettle, this.G_GameSettle);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_LeaveRoom, this.G_LeaveRoom);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_SwapSeat, this.G_SwapSeat);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_UserState, this.G_UserState);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_DissolveVote, this.G_DissolveVote);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_DissolveResult, this.G_DissolveResult);
    }

    generateGamberOrder() {
        let myIndex = this.findMySeatIndex(this.gambers);
        this.maxGamberSeatIndex = this.findMaxGamberSeatIndex(this.gambers);
        
        this.seatIndex = {};
        for (let userId in this.gambers) {
            let gamber = this.gambers[userId];
            let mod = this.getSeatNum();
            let localIndex = (gamber.seatIndex - myIndex + mod) % mod;
            this.seatIndex[userId] = localIndex + (this.canJoin ? 1 : 0);
        }
    }

    G_WatcherToGamber(gamber) {
        this.oldSeatIndex = GameUtil.deepClone(this.seatIndex);
        this.gambers[gamber.userId] = gamber;
        this.generateGamberOrder();
    }

    updateGamberInfo(gamber) {
        if (this.gambers[gamber.userId]) {
            return;
        }
        this.oldSeatIndex = GameUtil.deepClone(this.seatIndex);
        this.gambers[gamber.userId] = gamber;
        this.generateGamberOrder();
    }

    G_SwapSeat(data) {
        this.oldSeatIndex = GameUtil.deepClone(this.seatIndex);
        this.gambers[data.userId].seatIndex = data.userSeatIndex;
        this.gambers[data.anotherUserId].seatIndex = data.anotherSeatIndex;
        this.generateGamberOrder();
    }

    G_DissolveVote(data) {
        this.dissolveVotes[data.userId] = data;
    }

    G_DissolveResult(data) {
        this.dissolveVotes = {};
    }

    getDissolveVote() {
        return this.dissolveVotes;
    }

    getOldSeatIndex() {
        return this.oldSeatIndex;
    }

    getSeatIndex() {
        return this.seatIndex;
    }

    G_LeaveRoom(userId: string) {
        if (this.seatIndex[userId] != null) {
            delete this.seatIndex[userId];
        }
        if (this.gambers[userId] != null) {
            delete this.gambers[userId];
        }
    }

    isOwner(userId) {
        return userId == this.ownerId;
    }

    G_BeginGame(data) {
        this.playing = true;
        this.round = data.round;
    }

    G_GameSettle(data) {
        this.playing = false;
    }

    isPlaying() {
        return this.playing;
    }

    getGamberIds() {
        return Object.keys(this.gambers);
    }

    getGamber(userId) {
        return this.gambers[userId];
    }

    getLocalSeatIndex(userId) {
        return this.seatIndex[userId];
    }

    getSeatNum() {
        return this.maxGamberSeatIndex + 1;
    }

    getGameType() {
        return this.gameName;
    }

    findMaxGamberSeatIndex(gambers) {
        let index = 0;
        for (let userId in gambers) {
            let gamber = gambers[userId];
            if (gamber.seatIndex > index) {
                index = gamber.seatIndex;
            }
        }
        return index;
    }

    findMySeatIndex(gambers) {
        for (let userId in gambers) {
            if (MeModel.isMe(userId)) {
                return gambers[userId].seatIndex;
            }
        }
        return -1;
    }

    G_PushRoomInfo(data) {
        this.ownerId = data.ownerId;
        this.round = data.round;
        this.gameName = data.gameName;
        this.roundAmount = data.roundAmount;
        this.gambers = data.gambers;
        this.maxGamberNum = data.gamberAmount;
        this.generateGamberOrder();
    }

    G_UpdateRoomOperate(data) {
        if (data.canJoin != null) {
            this.canJoin = data.canJoin;
        }
    }

    G_UserState(data) {
        if (this.gambers[data.userId]) {
            this.gambers[data.userId].online = data.online;
        }
    }

    isGamberOnline(userId) {
        if (this.gambers[userId] && this.gambers[userId].online != null) {
            return this.gambers[userId].online;
        }
        return true;
    }

    goToGame() {
        cc.director.loadScene("Game", () => {
            NetMgr.changeTcpUrl(UrlModel.gameUrl);
        });
    }
}