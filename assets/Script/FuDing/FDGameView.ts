import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";
import EllipseLayout from "../Util/EllipseLayout";
import GameUtil from "../Util/GameUtil";
import RoomMgr from "../Room/RoomMgr";
import UIMgr from "../BaseUI/UIMgr";
import { GameConst } from "../Const/GameConst";
import MJFoldItem from "../Mahjong/MJFoldItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FDGameView extends cc.Component {
    
    @property(EllipseLayout)
    node_allHolds: EllipseLayout;

    @property(cc.Prefab)
    prefab_holds: cc.Prefab;

    @property(cc.Prefab)
    prefab_mjoperate_view: cc.Prefab;

    @property(cc.Node)
    node_hun: cc.Node;

    @property(cc.Sprite)
    sp_hun: cc.Sprite;

    @property(cc.Node)
    node_baseHu: cc.Node;

    @property(cc.Label)
    txt_baseHu: cc.Label;

    @property(cc.Node)
    node_leftCard: cc.Node;

    @property(cc.Label)
    txt_leftCard: cc.Label;

    @property(EllipseLayout)
    node_allFolds: EllipseLayout;

    @property(cc.Prefab)
    prefab_folds: cc.Prefab;

    protected start(): void {
        this.initView();
        NetMgr.addListener(this, NetDefine.WS_Resp.G_BeginGame, this.G_BeginGame);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_Hun, this.G_Hun);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_LeftCard, this.G_LeftCard);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_BaseHu, this.G_BaseHu);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_ShowCard, this.G_ShowCard);
        NetMgr.addListener(this, NetDefine.WS_Resp.G_GameSettle, this.G_GameSettle);
    }

    initView() {
        UIMgr.createNode(this.prefab_mjoperate_view, this.node);
        this.node_baseHu.active = false;
        this.node_leftCard.active = false;
        this.node_hun.active = false;
    }

    G_Hun(data) {
        UIMgr.setMahjong(this.sp_hun, data.hun, GameConst.CardShowType.SHOW, GameConst.SitPos.DOWN, () => {
            this.node_hun.active = true;
        });
    }

    G_LeftCard(data) {
        this.node_leftCard.active = true;
        this.txt_leftCard.string = data.left;
    }

    G_BaseHu(data) {
        this.node_baseHu.active = true;
        this.txt_baseHu.string = data.baseHu;
    }
    
    G_BeginGame(data) {        
        GameUtil.clearChildren(this.node_allFolds.node);
        for (let userId of RoomMgr.ins.getGamberIds()) {
            let node = UIMgr.createNode(this.prefab_folds);
            let localIndex = RoomMgr.ins.getLocalSeatIndex(userId);
            this.node_allFolds.addChild(node, localIndex);
            node.getComponent(MJFoldItem).setUserId(userId);
        }
    }

    G_ShowCard() {
        GameUtil.clearChildren(this.node_allFolds.node);
    }

    G_GameSettle() {
        this.node_baseHu.active = false;
        this.node_leftCard.active = false;
        this.node_hun.active = false;
    }

}