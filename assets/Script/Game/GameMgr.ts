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

    friendCard: number;

    penggangs: { [key: string]: any } = {};

    wind: { [key: string]: number } = {};

    pokerFolds: { [key: string]: any } = {};

    turnData: any = null;

    foldPointCard: any = null;

    optionalCardData: any = null;

    init() {
        NetMgr.addListener(this, NetDefine.WS_Resp.G_Hun, this.G_Hun);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_InitHolds, this.G_InitHolds);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_SyncHolds, this.G_SyncHolds);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_SeeCard, this.G_SeeCard);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_SyncCombines, this.G_SyncCombines);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_DecideBanker, this.G_DecideBanker);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_GameSettle, this.G_GameSettle);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_GamberScoreChange, this.G_GamberScoreChange);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_FundPoolChange, this.G_FundPoolChange);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_GameState, this.G_GameState);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_DoOperate, this.G_DoOperate);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_LeaveRoom, this.G_LeaveRoom);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_TurnBetting, this.G_TurnBetting);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_FriendCard, this.G_FriendCard);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_DecideWind, this.G_DecideWind);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_OptionalCard, this.G_OptionalCard);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_PokerFold, this.G_PokerFold);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_FoldPointCard, this.G_FoldPointCard);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_TipCard, this.G_TipCard);
        // NetMgr.addListener(this, NetDefine.WS_Resp.G_PushRoomInfo, this.G_PushRoomInfo);
    }

    G_FriendCard(data) {
        this.friendCard = data.card;
    }

    getFriendCard() {
        return this.friendCard;
    }

    G_FoldPointCard(data) {
        this.foldPointCard = data;
    }

    getFoldPointCard() {
        return this.foldPointCard;
    }

    G_PushRoomInfo() {
        this.holds = {};
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
        this.turnData = data;
    }

    getTurnData() {
        return this.turnData;
    }

    G_LeaveRoom(data) {
        let userId = data.userId;
        if (MeModel.isMe(userId)) {
            this.reset();
        } else {
            this.holds[userId] = null;
            this.operates[userId] = null;
            this.gamberScores[userId] = null;
            this.penggangs[userId] = null;
            this.wind[userId] = null;
            this.drawCard[userId] = null;
            this.pokerFolds[userId] = null;
        }
    }

    reset() {
        this.gameState = GameConst.GameState.IDLE;
        this.bankerId = null;
        this.huns = [];
        this.holds = {};
        this.selectCards = [];
        this.gamberScores = {};
        this.fundPool = 0;
        this.operates = {};
        this.drawCard = {};
        this.friendCard = null;
        this.penggangs = {};
        this.wind = {};
        this.pokerFolds = {};
        this.turnData = null;
        this.foldPointCard = null;
    }

    isBettingState() {
        return this.gameState == GameConst.GameState.BETTING;
    }

    G_DecideWind(data) {
        this.wind = data;
    }

    getGamberWind(userId) {
        return this.wind[userId];
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

    G_SeeCard(data) {
        this.holds[data.userId] = data.holds;
    }

    G_SyncHolds(data) {
        this.drawCard = {};
        this.drawCard[data.userId] = data.draw;
        this.holds[data.userId] = data.holds;
    }

    G_SyncCombines(data) {
        this.penggangs[data.userId] = data.penggangs;
    }

    getDrawCard(userId) {
        return this.drawCard[userId];
    }

    G_DecideBanker(data) {
        this.bankerId = data.bankerId;
    }

    G_OptionalCard(data) {
        this.optionalCardData = data;
    }

    G_PokerFold(data) {
        this.pokerFolds[data.userId] = data;
    }

    getPokerFoldsByUserId(userId) {
        return this.pokerFolds[userId];
    }

    getOptionalCardData() {
        return this.optionalCardData;
    }

    getHoldsByUserId(userId) {
        return GameUtil.deepClone(this.holds[userId]) || [];
    }

    getMyHolds() {
        return this.getHoldsByUserId(MeModel.userId);
    }

    getPengGangs(userId) {
        return this.penggangs[userId] || [];
    }

    isBanker(userId) {
        return this.bankerId == userId;
    }

    G_GameSettle(data) {
        this.holds = {};
        this.drawCard = {};
        this.penggangs = {};
        this.operates = {};
        this.pokerFolds = {};
        if (!data.isReady) {
            UIMgr.showView("SettleView", data);
        }
    }

    selectCard(holdIndex) {
        this.selectCards.push(holdIndex);
    }

    cancelSelectCard(holdIndex) {
        let index = this.selectCards.indexOf(holdIndex);
        if (index >= 0) {
            this.selectCards.splice(index, 1);
        }
    }

    G_TipCard(data) {
        this.selectCards = data.tipIndexs;
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