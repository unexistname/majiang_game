import { GameConst } from "../Const/GameConst";
import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import RoomMgr from "../Room/RoomMgr";
import GameUtil from "../Util/GameUtil";
import MJOperate from "./MJOperate";
import MahjongFoldItem from "./MahjongFoldItem";
import MahjongUtil from "./MahjongUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MJFoldItem extends cc.Component {

    @property(MahjongFoldItem)
    item_folds: MahjongFoldItem;

    userId: string;

    sitPos: GameConst.SitPos;

    folds: number[] = [];

    chupai: number = null;

    protected start(): void {
        NetMgr.addListener(this, NetDefine.WS_Resp.G_PushRoomInfo, this.clear);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_DoOperate, this.G_DoOperate);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_Fold, this.G_Fold);
        this.item_folds.showType = GameConst.CardShowType.SHOW;
    }

    setUserId(userId) {
        this.userId = userId;
        let localIndex = RoomMgr.ins.getLocalSeatIndex(userId);
        let seatAmount = RoomMgr.ins.getSeatNum();
        let sitPos = MahjongUtil.getSitPosByLocalIndex(localIndex, seatAmount);
        this.setSitPos(sitPos);
    }

    setSitPos(sitPos) {
        this.sitPos = sitPos;
        this.item_folds.sitPos = sitPos;
    }

    G_DoOperate(data) {
        if (this.chupai != null && MahjongUtil.isMJBaseOperate(data.operate)) {
            GameUtil.reverseRemove(this.folds, this.chupai);
            this.item_folds.mahjongs = this.folds;
            this.chupai = null;
        }
        if (data.userId == this.userId) {
            if (MahjongUtil.hasOperate(data.operate, MJOperate.CHU_PAI)) {
                let pai = data.value;
                this.folds.push(pai);
                this.item_folds.mahjongs = this.folds;
                this.item_folds.showMark();
                this.chupai = pai;
                console.log("当前的弃牌", this.folds, pai, this.item_folds.node.children);
            }
        } else if (MahjongUtil.isMJBaseOperate(data.operate) || MahjongUtil.hasOperate(data.operate, MJOperate.CHU_PAI)) {
            this.item_folds.hiddenMark();
        }
    }

    G_Fold(data) {
        if (data.userId == this.userId) {
            this.chupai = null;
        }
    }

    clear() {
        this.chupai = null;
        this.folds = [];
        this.item_folds.mahjongs = [];
    }
}