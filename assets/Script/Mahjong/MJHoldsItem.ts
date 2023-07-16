import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import MJOperate from "./MJOperate";
import MahjongHoldsItem from "./MahjongHoldsItem";
import MahjongUtil from "./MahjongUtil";
import RoomMgr from "../Room/RoomMgr";
import SitPos from "../Const/Game/SitPos";
import { GameConst } from "../Const/GameConst";
import MJNet from "./MJNet";
import GameUtil from "../Util/GameUtil";
import CardEventHandle from "./CardEventHandle";
import MeModel from "../Global/MeModel";
import GameMgr from "../Game/GameMgr";


const { ccclass, property } = cc._decorator;

@ccclass
export default class MJHoldsItem extends CardEventHandle {

    @property(MahjongHoldsItem)
    item_holds: MahjongHoldsItem;

    combines: any[] = [];

    userId: string;

    sitPos: SitPos;

    wantPlayCard: number;
    clickNode: cc.Node;

    hangang: number = null;

    setUserId(userId: string) {
        this.userId = userId;
        
        if (MeModel.isMe(userId)) {
            this.item_holds.register("click_card", this.Slot_ClickMahjong.bind(this));
        }

        this.updateSitPos();
        let penggangs = GameMgr.ins.getPengGangs(this.userId);
        let holds = GameMgr.ins.getHoldsByUserId(this.userId);
        let drawCard = GameMgr.ins.getDrawCard(this.userId);
        if (holds) {
            this.item_holds.updateHolds(holds);
        }
        if (penggangs) {
            this.updateCombines(penggangs);
        }
        if (drawCard != null) {
            this.item_holds.updateDrawCard(drawCard);
        } else {
            this.item_holds.hideDrawMahjong();
        }
    }

    updateSitPos() {
        let localIndex = RoomMgr.ins.getLocalSeatIndex(this.userId);
        let seatAmount = RoomMgr.ins.getSeatNum();
        let sitPos = MahjongUtil.getSitPosByLocalIndex(localIndex, seatAmount);
        this.setSitPos(sitPos);
    }

    setSitPos(sitPos: GameConst.SitPos) {
        this.sitPos = sitPos;
        this.item_holds.sitPos = sitPos;
    }

    protected start(): void {
        NetMgr.addListener(this, NetDefine.WS_Resp.G_PushRoomInfo, this.G_PushRoomInfo);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_InitHolds, this.G_InitHolds);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_DrawCard, this.G_DrawCard);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_DoOperate, this.G_DoOperate);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_TurnPlayCard, this.G_TurnPlayCard);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_SyncHolds, this.G_SyncHolds);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_SyncCombines, this.G_SyncCombines);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_ShowCard, this.G_ShowCard);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_GameSettle, this.G_GameSettle);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_AddGamber, this.updateSitPos);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_LeaveRoom, this.updateSitPos);
    }

    cancelClickMahjong() {
        if (this.clickNode) {
            let pos = this.clickNode.getPosition();
            this.clickNode.setPosition(new cc.Vec2(pos.x, pos.y - this.clickNode.height / 2));
        }
        this.wantPlayCard = null;
        this.clickNode = null;
    }

    clickMahjong(mahjongId, node) {
        this.wantPlayCard = mahjongId;
        this.clickNode = node;
        let pos = this.clickNode.getPosition();
        this.clickNode.setPosition(new cc.Vec2(pos.x, pos.y + this.clickNode.height / 2));
    }

    Slot_ClickMahjong(mahjongId, node, component) {
        let clickTwice = this.clickNode == node;
        this.cancelClickMahjong();

        if (!clickTwice) {
            this.clickMahjong(mahjongId, node);
        } else {
            MJNet.C_ChuPai(mahjongId);
        }
    }

    G_InitHolds(data) {
        if (data[this.userId]) {
            console.log("初始化的牌", data[this.userId]);
            this.updateHolds(data[this.userId], GameMgr.ins.isBanker(this.userId));
        }
    }

    G_SyncHolds(data) {
        if (data.userId == this.userId) {
            console.log("同步的牌", data.holds);
            this.item_holds.updateHolds(data.holds);
            if (data.draw != null) {
                this.item_holds.updateDrawCard(data.draw);
            } else {
                this.item_holds.hideDrawMahjong();
            }
        }
    }

    G_SyncCombines(data) {
        if (data.userId == this.userId) {
            this.updateCombines(data.penggangs);
        }
    }

    G_ShowCard(data) {
        if (data[this.userId]) {
            let holds = data[this.userId].holds;
            this.item_holds.showType = GameConst.CardShowType.SHOW;
            this.item_holds.updateHolds(holds);
            this.item_holds.hideDrawMahjong();
            this.updateCombines(data[this.userId].penggangs);
        }
    }

    updateHolds(holds, needSplit = false) {
        if (needSplit) {
            let copyHolds = GameUtil.deepClone(holds);
            let draw = copyHolds.splice(copyHolds.length - 1, 1)[0];
            this.item_holds.updateHolds(copyHolds);
            this.item_holds.updateDrawCard(draw);
        } else {
            this.item_holds.updateHolds(holds);
            this.item_holds.hideDrawMahjong();
        }
    }

    G_PushRoomInfo() { 
        this.hangang = null;
        this.updateCombines([]);
    }

    G_GameSettle() {
        this.item_holds.hideDrawMahjong();
        this.item_holds.updateHolds([]);
        this.updateCombines([]);
        this.cancelClickMahjong();
        this.hangang = null;
        this.item_holds.showType = GameConst.CardShowType.STAND;
    }

    updateCombines(penggangs) {
        this.combines = this.parsePengGang(penggangs);
        this.item_holds.updateCombines(this.combines);
    }

    parsePengGang(penggangs) {
        let combines = [];
        for (let penggang of penggangs) {
            if (penggang[0] == "chi") {
                combines.push({combine: penggang[1].chi});
            } else if (penggang[0] == "peng") {
                let pai = penggang[1];
                combines.push({combine: [pai, pai, pai]});
            } else {
                let pai = penggang[1];
                combines.push({combine: [pai, pai, pai, pai]});
            }
        }
        return combines;
    }

    G_DrawCard(data) {
        if (data.userId == this.userId) {
            this.item_holds.updateDrawCard(data.pai);
        }
    }

    G_TurnPlayCard(data) {
        if (data.userId != this.userId) {
            this.item_holds.hideDrawMahjong();
        }
    }

    G_DoOperate(data) {
        if (data.userId == this.userId) {
            if (MahjongUtil.hasOperate(data.operate, MJOperate.CHU_PAI)) {
                this.item_holds.hideDrawMahjong();
            } else {
                this.dealOperate(data);
            }
        }
    }

    dealOperate({operate, value}) {
        if (MahjongUtil.hasOperate(operate, MJOperate.CHI)) {
            this.playChi(value);
        } else if (MahjongUtil.hasOperate(operate, MJOperate.PENG)) {
            this.playPeng(value);
        } else if (MahjongUtil.hasOperate(operate, MJOperate.HAN_GANG)) {
            this.hangang = value.pai;
            this.playGang(value);
        } else if (MahjongUtil.hasOperate(operate, MJOperate.GANG)) {
            if (this.hangang != value.pai) {
                this.playGang(value);
            }
            this.hangang = null;
        } else if (MahjongUtil.hasOperate(operate, MJOperate.HU)) {
            this.playHu(value);
        } else if (MahjongUtil.hasOperate(operate, MJOperate.ZI_MO)) {
            this.playZiMo(value);
        }
    }

    playChi(chiPai: any) {
        this.combines.push({combine: chiPai.chi});
        this.item_holds.updateCombines(this.combines);
    }

    playPeng(pai) {
        this.combines.push({combine: [pai, pai, pai]});
        this.item_holds.updateCombines(this.combines);
    }

    playGang(gangPai) {
        if (gangPai.gangtype == "wangang") {
            for (let combine of this.combines) {
                let cards = combine.combine;
                if (cards.length == 3 && cards[0] == gangPai.pai) {
                    combine.combine.push(cards[0]);
                    break;
                }
            }
            this.item_holds.updateCombines(this.combines);
        } else {
            let pai = gangPai.gangtype == "angang" ? -1 : gangPai.pai;
            this.combines.push({combine: [pai, pai, pai, pai]});
            this.item_holds.updateCombines(this.combines);
        }
    }

    playHu(huData) {
        console.log("胡了");
    }

    playZiMo(huData) {
        console.log("胡了");
    }
}