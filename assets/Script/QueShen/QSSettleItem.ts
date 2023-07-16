import UIMgr from "../BaseUI/UIMgr";
import RoomMgr from "../Room/RoomMgr";
import GameUtil from "../Util/GameUtil";
import MJHoldsItem from "../Mahjong/MJHoldsItem";
import MahjongStraightItem from "../Mahjong/MahjongStraightItem";
import ScoreItem from "../Game/ScoreItem";
import MahjongUtil from "../Mahjong/MahjongUtil";
import { GameConst } from "../Const/GameConst";

const { ccclass, property } = cc._decorator;

@ccclass
export default class QSSettleItem extends cc.Component {

    prefab_winType: cc.Node;

    @property(cc.Label)
    txt_userName: cc.Label;

    @property(cc.Sprite)
    sp_avatar: cc.Sprite;

    @property(ScoreItem)
    item_score: ScoreItem;

    @property(cc.Node)
    node_winTypes: cc.Node;

    @property(MJHoldsItem)
    item_holds: MJHoldsItem;

    @property(cc.Node)
    node_hu: cc.Node;

    @property(cc.Node)
    node_zimo: cc.Node;

    @property(cc.Label)
    txt_wind: cc.Label;

    @property(cc.Node)
    node_banker: cc.Node;

    updateView(data) {
        console.log("结算数据", data);
        this.prefab_winType = this.node_winTypes.children[0];
        GameUtil.clearChildren(this.node_winTypes);

        let userId = data.userId;
        let gamber = RoomMgr.ins.getGamber(userId);
        this.txt_userName.string = GameUtil.cutString(gamber.userName, 15);
        UIMgr.setAvatar(this.sp_avatar, gamber.avatarUrl);

        this.node_zimo.active = MahjongUtil.isZiMo(data.winTypes);
        this.node_hu.active = data.hued && !MahjongUtil.isZiMo(data.winTypes);


        if (data.hued) {
            for (let winType of data.winTypes) {
                if (winType == GameConst.HuType.HU || winType == GameConst.HuType.ZI_MO) {
                    continue;
                } else {
                    let winTypeNode = UIMgr.createNode(this.prefab_winType, this.node_winTypes);
                    winTypeNode.getComponent(cc.Label).string = winType;
                }
            }
        }

        this.item_holds.updateHolds(data.holds, data.hued);
        this.item_holds.updateCombines(data.penggangs);

        this.node_banker.active = data.isBanker;

        const DIRECTION = "东南西北";
        if (data.direction != null) {
            this.txt_wind.string = DIRECTION.charAt(data.direction);
        }

        this.item_score.updateScore(data.score);
    }

}