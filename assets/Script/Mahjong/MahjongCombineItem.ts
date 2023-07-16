import UIMgr from "../BaseUI/UIMgr";
import { GameConst } from "../Const/GameConst";
import GameUtil from "../Util/GameUtil";
import MahjongItem from "./MahjongItem";
import MahjongStraightItem from "./MahjongStraightItem";

const { ccclass, menu, property, executeInEditMode } = cc._decorator;

@ccclass
@menu("麻将组件/MahjongCombineItem")
@executeInEditMode
export default class MahjongCombineItem extends cc.Component {
    
    _sitPos: GameConst.SitPos = GameConst.SitPos.DOWN;

    get sitPos() {
        return this._sitPos;
    }

    @property({ type: GameConst.SitPos })
    set sitPos(val) {
        this.setSitPos(val);
    }

    @property(MahjongStraightItem)
    node_combine3: MahjongStraightItem;

    node_mahjong4: cc.Node;

    _mahjongs: number[] = [];

    @property({ type: [cc.Integer] })
    set mahjongs(val) {
        this.updateMahjongs(val);
    }

    get mahjongs() {
        return this._mahjongs;
    }

    showType: GameConst.CardShowType = GameConst.CardShowType.SHOW;

    setSitPos(sitPos) {
        this._sitPos = sitPos;
        this.node_combine3.sitPos = sitPos;
    }

    updateMahjongs(mahjongs) {
        console.log("ccccccccccccccccccc", mahjongs, this._mahjongs);
        if (mahjongs.length == this._mahjongs.length && mahjongs[0] == this._mahjongs[0]) {
            return;
        }
        console.log("ddddddddddddddddddddddddd")
        if (this._mahjongs.length == 3 && mahjongs.length == 4) {
            this.changeCombine3ToCombine4();
        } else {
            GameUtil.clearChildren(this.node_combine3.node);
            if (this.node_mahjong4) {
                this.node_mahjong4.parent = null;
            }
            console.log("eeeeeeeeeeeeeeeee")
            if (mahjongs.length == 3) {
                this.createCombine3(mahjongs);
            } else if (mahjongs.length == 4) {
                console.log("ffffffffffffffffff")
                let mahjong = mahjongs[0];
                this.createCombine4(mahjong, this.showType);
            }
        }
        this._mahjongs = mahjongs;
    }

    updateView(data) {
        this.showType = data[0] == -1 ? GameConst.CardShowType.FALL : GameConst.CardShowType.SHOW;
        this.updateMahjongs(data);
    }

    changeCombine3ToCombine4() {
        let node = this.node_combine3.node.children[1];
        console.log("bbbbbbbbbbbbbbbbb", node, this.mahjongs[0], this.showType);
        this.createMahjong4(node, this.mahjongs[0], this.showType);
    }

    createCombine3(mahjongs, showType = GameConst.CardShowType.SHOW) {
        this.node_combine3.showType = showType;
        this.node_combine3.updateMahjongs(mahjongs, (index, node) => {
            if (this.node_combine3.node.children.length >= 3) {
                this.node.width = this.node_combine3.node.width;
                this.node.height = this.node_combine3.node.height;
            }
        });
    }

    createCombine4(mahjong, showType) {
        this.node_combine3.showType = showType;
        this.node_combine3.updateMahjongs([mahjong, mahjong, mahjong], (index, node) => {
            if (this.node_combine3.node.children.length >= 3) {
                this.node.width = this.node_combine3.node.width;
                this.node.height = this.node_combine3.node.height;

                let middle = this.node_combine3.node.children[1];
                this.createMahjong4(middle, mahjong, showType);
            }
        });
    }

    createMahjong4(mahjongNode: cc.Node, mahjong, showType) {
        let data = { mahjongId: mahjong, showType: showType};
        UIMgr.createMahjongItem(this.sitPos, this.node, data, (err, node) => {
            let y = this.getPositionY(node) + mahjongNode.position.y;
            let pos = new cc.Vec2(mahjongNode.position.x, y);
            let realPos = this.node.convertToNodeSpaceAR(mahjongNode.parent.convertToWorldSpaceAR(pos))
            node.setPosition(realPos);
            console.log("aaaaaaaaaaaaaaaa", mahjong, pos, realPos, node);
            this.node_mahjong4 = node;
        });
    }

    getPositionY(node) {
        switch (this.sitPos) {
            case GameConst.SitPos.TOP:
            case GameConst.SitPos.DOWN:
                return 10;
            case GameConst.SitPos.LEFT:
            case GameConst.SitPos.RIGHT:
                return 10;
        }
    }
}