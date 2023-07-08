import MJHoldsItem from "../Mahjong/MJHoldsItem";
import MahjongStraightItem from "../Mahjong/MahjongStraightItem";
import MahjongUtil from "../Mahjong/MahjongUtil";
import FDOperate from "./FDOperate";
import { GameConst } from "../Const/GameConst";
import { NetDefine } from "../Const/NetDefine";
import NetMgr from "../Controller/Net/NetMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FDHoldsItem extends MJHoldsItem {

    @property(MahjongStraightItem)
    item_flowers: MahjongStraightItem;

    flowers: number[] = [];

    protected start(): void {
        super.start();
        this.item_flowers.showType = GameConst.CardShowType.SHOW;
        NetMgr.addListener(this, NetDefine.WS_Resp.G_PushRoomInfo, this.G_PushRoomInfo);
    }

    dealOperate({operate, value}) {
        super.dealOperate({operate, value});
        if (MahjongUtil.hasOperate(operate, FDOperate.BU_HUA)) {
            this.playPlugFlower(value);
        }
    }

    setSitPos(sitPos) {
        super.setSitPos(sitPos);
        this.item_flowers.sitPos = sitPos;

        let pos = this.item_holds.node.getPosition();

        let gap = 80;
        switch (sitPos) {
            case GameConst.SitPos.DOWN:
                this.item_flowers.node.setPosition(new cc.Vec2(pos.x, pos.y + gap));
                break;
            case GameConst.SitPos.TOP:
                this.item_flowers.node.setPosition(new cc.Vec2(pos.x, pos.y - gap));
                break;
            case GameConst.SitPos.LEFT:
                this.item_flowers.node.setPosition(new cc.Vec2(pos.x + gap, pos.y));
                break;
            case GameConst.SitPos.RIGHT:
                this.item_flowers.node.setPosition(new cc.Vec2(pos.x - gap, pos.y));
                break;
        }
    }

    playPlugFlower(pai) {
        this.flowers.push(pai);
        this.item_flowers.mahjongs = this.flowers;
    }

    G_PushRoomInfo() {
        this.flowers = [];
        this.item_flowers.mahjongs = this.flowers;
    }
}