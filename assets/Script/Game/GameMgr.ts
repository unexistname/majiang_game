import UIMgr from "../BaseUI/UIMgr";
import { GameConst } from "../Const/GameConst";
import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import DZOperate from "../DeZhou/DZOperate";
import DXOperate from "../DiaoXie/DXOperate";
import MeModel from "../Global/MeModel";
import RoomMgr from "../Room/RoomMgr";
import GameUtil from "../Util/GameUtil";
import ZJHOperate from "../ZhaJinHua/ZJHOperate";


export default class GameMgr {
    private static _ins: GameMgr = null;
    public static get ins() {
        if (this._ins == null) {
            this._ins = new GameMgr();
            this._ins.init();
        }
        return this._ins;
    }

    bankerId: string;

    huns: number[] = [];

    holds: { [key: string]: number[] } = {};
    
    selectCards: number[] = [];

    gamberScores: { [key: string]: any } = {};

    fundPool: number = 0;

    gameState: GameConst.GameState;

    operates: { [key: string]: any } = {};

    drawCard: { [key: string]: any } = {};

    init() {
        NetMgr.addListener(this, NetDefine.WS_Resp.G_Hun, this.G_Hun);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_InitHolds, this.G_InitHolds);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_SyncHolds, this.G_SyncHolds);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_DecideBanker, this.G_DecideBanker);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_GameSettle, this.G_GameSettle);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_GamberScoreChange, this.G_GamberScoreChange);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_FundPoolChange, this.G_FundPoolChange);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_GameState, this.G_GameState);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_DoOperate, this.G_DoOperate);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_LeaveRoom, this.G_LeaveRoom);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_TurnBetting, this.G_TurnBetting);
    }

    G_GameState(data) {
        this.gameState = data.gameState;
    }

    G_DoOperate(data) {
        this.operates[data.userId] = data;
    }

    getLastOperate(userId) {
        return this.operates[userId];
    }

    G_TurnBetting(data) {
        this.operates[data.userId] = null;
    }

    G_LeaveRoom(data) {
        let userId = data.userId;
        this.holds[userId] = null;
        this.operates[userId] = null;
        this.gamberScores[userId] = null;
    }

    isBettingState() {
        return this.gameState == GameConst.GameState.BETTING;
    }

    G_GamberScoreChange(data) {
        this.gamberScores[data.userId] = data;
    }

    getGamberScore(userId) {
        if (this.gamberScores[userId]) {
            return this.gamberScores[userId].finalScore;
        }
        return 0;
    }

    getBettingScore(userId) {
        if (this.gamberScores[userId]) {
            return this.gamberScores[userId].bettingScore;
        }
        return 0;
    }

    G_FundPoolChange(data) {
        this.fundPool = data.fundPool;
    }

    getFundPool() {
        return this.fundPool;
    }

    G_Hun(data) {
        this.huns = data.huns;
    }

    isHun(mahjongId: number) {
        return this.huns.indexOf(mahjongId) >= 0;
    }

    G_InitHolds(data) {
        this.holds = data;
    }

    G_SyncHolds(data) {
        this.drawCard = {};
        this.drawCard[data.userId] = data.draw;
        this.holds[data.userId] = data.holds;
    }

    getDrawCard(userId) {
        return this.drawCard[userId];
    }

    G_DecideBanker(data) {
        this.bankerId = data.bankerId;
    }

    getHoldsByUserId(userId) {
        return GameUtil.deepClone(this.holds[userId]) || [];
    }

    getMyHolds() {
        return this.getHoldsByUserId(MeModel.userId);
    }

    isBanker(userId) {
        return this.bankerId == userId;
    }

    G_GameSettle(data) {
        this.operates = {};
        UIMgr.showView("SettleView", data);
    }

    selectCard(pokerId) {
        this.selectCards.push(pokerId);
    }

    cancelSelectCard(pokerId) {
        let index = this.selectCards.indexOf(pokerId);
        if (index >= 0) {
            this.selectCards.splice(index, 1);
        }
    }

    getSelectCards() {
        return this.selectCards;
    }

    clearSelectCards() {
        this.selectCards = [];
    }

    isWaive(operate: number) {
        switch (RoomMgr.ins.getGameType()) {
            case GameConst.GameType.DE_ZHOU:
                return operate == DZOperate.WAIVE;
            case GameConst.GameType.DIAO_XIE:
                return operate == DXOperate.WAIVE;
            case GameConst.GameType.ZHA_JIN_HUA:
                return operate == ZJHOperate.WAIVE;
            default:
                return false;
        }
    }
}