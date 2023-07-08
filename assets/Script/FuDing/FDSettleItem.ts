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
export default class FDSettleItem extends cc.Component {

    prefab_huType: cc.Node;
    
    prefab_fanType: cc.Node;

    prefab_winType: cc.Node;

    @property(cc.Label)
    txt_userName: cc.Label;

    @property(cc.Sprite)
    sp_avatar: cc.Sprite;

    @property(ScoreItem)
    item_score: ScoreItem;

    @property(cc.Label)
    txt_huNum: cc.Label;

    @property(cc.Label)
    txt_fanNum: cc.Label;
    
    @property(cc.Node)
    node_huTypes: cc.Node;
    
    @property(cc.Node)
    node_fanTypes: cc.Node;

    @property(cc.Node)
    node_winTypes: cc.Node;

    @property(MJHoldsItem)
    item_holds: MJHoldsItem;

    @property(MahjongStraightItem)
    item_flowers: MahjongStraightItem;

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
        this.prefab_huType = this.node_huTypes.children[0];
        this.prefab_fanType = this.node_fanTypes.children[0];
        GameUtil.clearChildren(this.node_winTypes);
        GameUtil.clearChildren(this.node_huTypes);
        GameUtil.clearChildren(this.node_fanTypes);

        let userId = data.userId;
        let gamber = RoomMgr.ins.getGamber(userId);
        this.txt_userName.string = GameUtil.cutString(gamber.userName, 15);
        UIMgr.setAvatar(this.sp_avatar, gamber.avatarUrl);

        this.txt_huNum.string = data.hu;
        this.txt_fanNum.string = data.fan;

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
        this.item_flowers.mahjongs = data.flowers;

        if (data.huTypes) {
            for (let huType of data.huTypes) {
                let type = huType.type;
                let hu = huType.hu;
                let huTypeNode = UIMgr.createNode(this.prefab_huType, this.node_huTypes);
                huTypeNode.getComponent(cc.Label).string = this.getType(type) + this.getHu(hu);
            }
        }
        if (data.fanTypes) {
            for (let fanType of data.fanTypes) {
                let type = fanType.type;
                let fan = fanType.fan;
                let fanTypeNode = UIMgr.createNode(this.prefab_fanType, this.node_fanTypes);
                fanTypeNode.getComponent(cc.Label).string = this.getType(type) + this.getFan(fan);
            }
        }
        this.node_banker.active = data.isBanker;

        const DIRECTION = "东南西北";
        if (data.direction != null) {
            this.txt_wind.string = DIRECTION.charAt(data.direction);
        }

        this.item_score.updateScore(data.score);
    }

    getHu(hu) {
        return hu + "胡";
        // const MJ_NUM = "半12345678";
        // let si = Math.floor(hu / 4);
        // return MJ_NUM.charAt(si) + "四";
    }

    getFan(fan) {
        const MJ_NUM = "一二三四五六七八九";
        return fan + "台";
    }

    getType(type) {
        if (type == "jin") {
            return "金";
        } else if (type == "hua") {
            return "花";
        } else if (type == "zimo") {
            return "自摸";
        } else if (type == "hunyise") {
            return "混一色";
        } else if (type == "duiduihu") {
            return "对对胡";
        } else if (type == "red") {
            return "红花";
        } else if (type == "black") {
            return "黑花";
        } else if (type == "di") {
            return "底胡";
        } else if (!isNaN(Number(type))) {
            let pai = Number(type);
            const MJ_NUM = "一二三四五六七八九";
            const MJ_TYPE = "筒万条";
            const MJ_ZI = ["东风", "南风", "西风", "北风", "红中", "發财", "白板"];
            const MJ_HUA = "春夏秋冬梅蘭菊竹";
            if (pai >= 0 && pai < 27) {
                return MJ_NUM.charAt(pai % 9) + MJ_TYPE.charAt(pai / 9);
            } else if (pai >= 27 && pai < 34) {
                return MJ_ZI[pai - 27];
            } else {
                return MJ_HUA.charAt(pai - 34);
            }
        }
    }
}