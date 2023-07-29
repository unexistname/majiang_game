import UIMgr from "../BaseUI/UIMgr";
import { GameConst } from "../Const/GameConst";
import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import ClockItem from "../Game/ClockItem";
import AudioTool from "../Global/AudioTool";
import MeModel from "../Global/MeModel";
import EllipseLayout from "../Util/EllipseLayout";
import GameUtil from "../Util/GameUtil";
import CustomLayout from "./CustomLayout";
import RoomMgr from "./RoomMgr";
import RoomNet from "./RoomNet";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RoomView extends cc.Component {

    @property(cc.Label)
    txt_time: cc.Label;

    @property(cc.Label)
    txt_roundNow: cc.Label;

    @property(cc.Label)
    txt_roundTotal: cc.Label;

    @property(cc.Label)
    txt_gameName: cc.Label;

    @property({type: [cc.Node]})
    node_modes: cc.Node[] = [];

    node_gambers: EllipseLayout | CustomLayout;

    node_allHolds: EllipseLayout | CustomLayout;

    @property(cc.Node)
    node_operate: cc.Node;

    @property(cc.Node)
    node_ready: cc.Node;

    @property(cc.Node)
    node_begin: cc.Node;

    @property(cc.Node)
    node_dissolve: cc.Node;

    @property(cc.Prefab)
    prefab_gamber: cc.Prefab;

    @property(ClockItem)
    item_clock: ClockItem;

    @property(cc.Node)
    node_watchers: cc.Node;

    @property(cc.Node)
    node_sit: cc.Node;

    @property(cc.Label)
    txt_roomId: cc.Label;

    @property(cc.Prefab)
    prefab_gameover_view: cc.Prefab;

    gameName: GameConst.GameType;

    gameView: cc.Node;

    gambers: { [key: string]: any } = {};

    protected start(): void {
        UIMgr.createNode(this.prefab_gameover_view, this.node);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_AddGamber, this.G_AddGamber);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_WatcherToGamber, this.G_WatcherToGamber);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_PushRoomInfo, this.G_PushRoomInfo);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_UpdateRoomOperate, this.G_UpdateRoomOperate);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_BeginGame, this.G_BeginGame);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_DecideBanker, this.G_DecideBanker);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_GameSettle, this.G_GameSettle);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_UseProp, this.G_UseProp);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_TransferGem, this.G_TransferGem);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_GameOver, this.G_GameOver);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_ShowDissolve, this.G_ShowDissolve);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_LeaveRoom, this.G_LeaveRoom);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_SwapSeat, this.G_SwapSeat);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_UpdatePermission, this.G_UpdatePermission);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_ShowDissolveVote, this.G_ShowDissolveVote);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_ShowWatchers, this.G_ShowWatchers);
        AudioTool.ins.playRoomBGM();
    }

    G_ShowDissolveVote() {
        UIMgr.showView("DissolveVoteView");
    }

    updateView(data) {
        this.txt_roomId.string = data.roomId;
    }

    G_UpdatePermission() {
        UIMgr.createPrefab("AdminOperateView", this.node);
    }

    G_PushRoomInfo(data) {
        this.txt_roomId.string = data.roomId;
        this.txt_gameName.string = data.gameName;
        this.txt_roundNow.string = data.round;
        this.txt_roundTotal.string = data.roundAmount;
        this.gameName = data.gameName;

        let mode = this.getMode();
        let node_mode = this.node_modes[mode];
        if (mode == 0) {
            this.node_gambers = node_mode.getChildByName("node_gambers").getComponent(EllipseLayout);
        } else {
            this.node_gambers = node_mode.getChildByName("node_gambers").getComponent(CustomLayout);
        }
        this.node_allHolds = node_mode.getChildByName("node_allHolds").getComponent(EllipseLayout);
        this.node_allHolds.setMode(mode);

        GameUtil.clearChildren(this.node_gambers.node);
        GameUtil.clearChildren(this.node_allHolds.node);
        this.gambers = {};
        
        for (let gamberId in data.gambers) {
            let gamber = data.gambers[gamberId];
            this.G_AddGamber(gamber);
        }

        let gameViewName = this.getGameViewName(data.gameName);
        UIMgr.showView(gameViewName, null, (error, node) => {
            if (node) {
                this.initGameViewNode(node);
            }
        });
    }

    getMode() {
        switch (this.gameName) {
            // case GameConst.GameType.SHI_SAN_SHUI:
            case GameConst.GameType.FU_DING_DA_ZHA:
            case GameConst.GameType.PAO_DE_KUAI:
                return 2;
            case GameConst.GameType.FU_DING:
            case GameConst.GameType.QUE_SHENG:
                return 1;
            default:
                return 0;
        }
    }

    G_WatcherToGamber(data) {
        this.node_gambers.updateSeatIndex(RoomMgr.ins.getOldSeatIndex(), RoomMgr.ins.getSeatIndex());
        this.node_allHolds.updateSeatIndex(RoomMgr.ins.getOldSeatIndex(), RoomMgr.ins.getSeatIndex());
        setTimeout(() => this.G_AddGamber(data), 400);
    }

    G_SwapSeat() {
        this.node_gambers.updateSeatIndex(RoomMgr.ins.getOldSeatIndex(), RoomMgr.ins.getSeatIndex());
        this.node_allHolds.updateSeatIndex(RoomMgr.ins.getOldSeatIndex(), RoomMgr.ins.getSeatIndex());
    }

    initGameViewNode(node) {
        this.gameView = node;
        let audioMgr = AudioTool.ins.getAudioMgrByGameName(this.gameName);
        if (audioMgr) {
            node.addComponent(audioMgr);
        }
        this.scheduleOnce(() => {
            if (!RoomMgr.ins.isPlaying()) {
                node.active = false;
            }
        });
    }

    G_UpdateRoomOperate(data) {
        this.node_ready.active = data.canReady;
        this.node_begin.active = data.canBegin;
        this.node_dissolve.active = data.canDissolve;
        this.node_watchers.active = data.canWatch;
        this.node_sit.active = data.canJoin;
    }

    G_AddGamber(data) {
        if (this.gambers[data.userId]) {
            return;
        }
        let gamberItemName = this.getGamberItemName(this.gameName);
        UIMgr.createPrefab(gamberItemName, null, data, (err, node) => {
            let localIndex = RoomMgr.ins.getLocalSeatIndex(data.userId);
            this.node_gambers.addChild(node, localIndex);
            this.gambers[data.userId] = node.getComponent(gamberItemName).item_gamber;
            this.addHoldItem(data.userId);
        });
    }

    G_LeaveRoom(data) {
        let userId = data.userId;
        let localIndex = RoomMgr.ins.getLocalSeatIndex(userId);
        if (localIndex == null) {
            return;
        }
        this.node_gambers.removeChild(localIndex);
        this.node_allHolds.removeChild(localIndex);
        delete this.gambers[userId];
    }

    getGamberNode(userId) {
        let item_gamber = this.gambers[userId];
        if (item_gamber) {
            return item_gamber.node.parent;
        }
    }

    getGamberPos(userId) {
        let gamber = this.getGamberNode(userId);
        if (gamber) {
            return gamber.parent.convertToWorldSpaceAR(gamber.position);
        }
    }

    getGamber(userId: string) {
        return this.gambers[userId];
    }

    getGambers() {
        return this.gambers;
    }

    G_BeginGame(data) {
        this.node_operate.active = false;
        this.txt_roundNow.string = data.round.toString();
        
        if (this.gameView) {
            this.gameView.active = true;
        }
    }

    G_GameOver(data) {
        this.gameView.active = false;
    }

    G_ShowDissolve() {
        UIMgr.showAlert("你确定要解散房间？", () => {
            RoomNet.C_Dissolve();
        });
    }

    addHoldItem(userId) {
        let itemName = this.getHoldsItemName(this.gameName);
        UIMgr.createPrefab(itemName, null, null, (err, node) => {
            let localIndex = RoomMgr.ins.getLocalSeatIndex(userId);
            this.node_allHolds.addChild(node, localIndex);
            node.getComponent(itemName).setUserId(userId);
        });
    }

    G_GameSettle() {
        this.node_operate.active = true;
        // GameUtil.clearChildren(this.node_allHolds.node);
        // for (let userId of RoomMgr.ins.getGamberIds()) {
        //     this.addHoldItem(userId);
        // }
    }

    getComberItemByNode(node: cc.Node) {
        return node.getComponent(this.getGamberItemComponentName());
    }

    getGamberItemComponentName() {
        return this.prefab_gamber.name;
    }

    private getGamberItemName(gameName) {
        switch (gameName) {
            case GameConst.GameType.DIAO_XIE:
                return "BettingGamberItem";
            case GameConst.GameType.DE_ZHOU:
                return "BettingGamberItem";
            // case GameConst.GameType.FU_DING_DA_ZHA:
            //     return "FDDZGameView";
            // case GameConst.GameType.FU_DING:
            //     return "FDGameView";
            case GameConst.GameType.NIU_NIU:
                return "RobGamberItem";
            // case GameConst.GameType.QUE_SHENG:
            //     return "QSGameView";
            case GameConst.GameType.SAN_GONG:
                return "RobGamberItem";
            // case GameConst.GameType.SHI_SAN_SHUI:
            //     return "SSSGameView";
            case GameConst.GameType.ZHA_JIN_HUA:
                return "ZJHGamberItem";
            // case GameConst.GameType.PAO_DE_KUAI:
            //     return "BaseGamberItem";
            default:
                return "BaseGamberItem";
        }
    }

    private getHoldsItemName(gameName) {
        switch (gameName) {
            case GameConst.GameType.DIAO_XIE:
                return "DXHoldsItem";
            case GameConst.GameType.DE_ZHOU:
                return "DZHoldsItem";
            case GameConst.GameType.FU_DING_DA_ZHA:
                return "PlayCardHoldsItem";
            case GameConst.GameType.FU_DING:
                return "FDHoldsItem";
            case GameConst.GameType.NIU_NIU:
                return "NNHoldsItem";
            case GameConst.GameType.QUE_SHENG:
                return "QSHoldsItem";
            case GameConst.GameType.SAN_GONG:
                return "SGHoldsItem";
            case GameConst.GameType.SHI_SAN_SHUI:
                return "SSSHoldsItem";
            case GameConst.GameType.ZHA_JIN_HUA:
                return "ZJHHoldsItem";
            case GameConst.GameType.PAO_DE_KUAI:
                return "PlayCardHoldsItem";
            default:
                return "BaseHoldsItem";
        }
    }

    private getGameViewName(gameName) {
        switch (gameName) {
            case GameConst.GameType.DIAO_XIE:
                return "DXGameView";
            case GameConst.GameType.DE_ZHOU:
                return "DZGameView";
            case GameConst.GameType.FU_DING_DA_ZHA:
                return "FDDZGameView";
            case GameConst.GameType.FU_DING:
                return "FDGameView";
            case GameConst.GameType.NIU_NIU:
                return "NNGameView";
            case GameConst.GameType.QUE_SHENG:
                return "QSGameView";
            case GameConst.GameType.SAN_GONG:
                return "SGGameView";
            case GameConst.GameType.SHI_SAN_SHUI:
                return "SSSGameView";
            case GameConst.GameType.ZHA_JIN_HUA:
                return "ZJHGameView";
            case GameConst.GameType.PAO_DE_KUAI:
                return "PDKGameView";
        }
    }

    G_DecideBanker(data) {
        let bankerId = data.bankerId;
        let userIdArr = data.userIdArr;
        let decideBankerTime = data.decideBankerTime;
        
        let lastGamber = null;
        let chooseBankerIndex = 0;
        let chooseBankerTime = 0;

        if (data.isSync) {
            return;
        }
        if (userIdArr.length <= 1) {
            this.getGamber(bankerId).chooseBanker(true);
            this.getGamber(bankerId).decideBanker(true);
            return;
        }

        let stopDecideBanker = () => {
            clearInterval(bankerAnimTimer);
            bankerAnimTimer = null;
            this.getGamber(bankerId).decideBanker(true);
        }

        let bankerAnimTimer = setInterval(() => {
            if (lastGamber) {
                lastGamber.chooseBanker(false);
            }
            let userId = userIdArr[chooseBankerIndex];
            let gamber = this.getGamber(userId);
            gamber.chooseBanker(true);
            lastGamber = gamber;

            if (chooseBankerTime > 12 && userId == bankerId) {
                stopDecideBanker();
                return;
            }
            chooseBankerIndex = (chooseBankerIndex + 1) % userIdArr.length;
            chooseBankerTime += 1;
        }, 100);
    }

    G_TransferGem(data) {
        if (MeModel.isMe(data.userId)) {
            UIMgr.showTip(`转让${data.gem}钻石成功`);
        } else if (MeModel.isMe(data.userId2)) {
            let gamber = RoomMgr.ins.getGamber(data.userId);
            UIMgr.showTip(`${gamber.userName}向你转让了${data.gem}钻石`);
        } else {
            
        }
    }

    G_UseProp(data){
        let gamber = this.getGamberNode(data.userId);
        let gamber2 = this.getGamberNode(data.userId2);
        if (!gamber || !gamber2) {
            return;
        }
        let x = gamber2.position.x - gamber.position.x;
        let y = gamber2.position.y - gamber.position.y;
        let pos = new cc.Vec2(x, y);   
        let startPos = gamber.parent.convertToWorldSpaceAR(gamber.getPosition());
        startPos = UIMgr.getRoot().convertToNodeSpaceAR(startPos);

        let prop = data.prop;
        let porpEndNode = null;
        UIMgr.createSpriteNode(prop.begin, UIMgr.getRoot(), (err, propStartNode) => {
            if (prop.end) {
                UIMgr.createSpriteNode(prop.end, gamber2, (err, node) => {
                    porpEndNode = node;
                });
            }
            propStartNode.scaleX = 0;
            propStartNode.scaleY = 0;
            propStartNode.rotation = 0;
            propStartNode.setPosition(startPos);
            propStartNode.runAction(cc.sequence(
                cc.spawn(
                    cc.scaleTo(1, 1),
                    cc.moveBy(1, pos),
                    // @ts-ignore
                    cc.rotateBy(1,360)).easing(cc.easeElasticInOut(3.0)
                ),
                cc.callFunc(() => {
                    if (porpEndNode) {
                        porpEndNode.parent = null;
                    }
                    propStartNode.parent = null;
                    this.playAnim(prop, gamber2);
                })
            ));
        })
    }

    playAnim(prop, parent) {
        // cc.vv.audioMgr.playSFX(content + ".mp3","chat");

        cc.loader.loadRes(prop.anim, cc.AnimationClip, function(err, clip) {
            if( err ){
                console.error(err);
                return;
            }
            if( clip ){
                var node = new cc.Node();
                node.addComponent(cc.Sprite);
                var anim = node.addComponent(cc.Animation);

                anim.addClip(clip);
                anim.defaultClip = clip;
                
                node.setPosition(new cc.Vec2(0,0));

                parent.addChild(node);

                anim.play(prop.propName);
            }
        });
    }

    G_ShowWatchers(data) {
        UIMgr.showView("WatchersView", data);
    }

    CC_onClickWatchers() {
        RoomNet.C_ShowWatchers();
    }

    CC_onClickSit() {
        RoomNet.C_WatcherToGamber();
    }

    CC_onClickReady() {
        RoomNet.C_Ready();
    }

    CC_onClickBegin() {
        RoomNet.C_BeginGame();
    }

    CC_onClickDissolve() {
        this.G_ShowDissolve();
    }

    CC_onClickExit() {
        RoomNet.C_LeaveRoom();
        // HallMgr.ins.goToHall();
    }
}   