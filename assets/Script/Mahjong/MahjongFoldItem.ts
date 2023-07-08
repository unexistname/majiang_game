import UIMgr from "../BaseUI/UIMgr";
import { GameConst } from "../Const/GameConst";
import MJStraightLayout from "../Util/MJStraightLayout";
import MahjongStraightItem from "./MahjongStraightItem";

const { ccclass, menu, property, executeInEditMode } = cc._decorator;

@ccclass
@menu("麻将组件/MahjongFoldItem")
@executeInEditMode
export default class MahjongFoldItem extends cc.Component {

    _mahjongs: Array<number> = [];
    
    @property({type: cc.Integer})
    mahjongNumOneLine: number = 10;

    @property({ type: [cc.Integer] })
    set mahjongs(val) {
        this.updateMahjongs(val);
    }

    get mahjongs() {
        return this._mahjongs;
    }

    _showType: GameConst.CardShowType = GameConst.CardShowType.STAND;

    _sitPos: GameConst.SitPos = GameConst.SitPos.DOWN;

    get sitPos() {
        return this._sitPos;
    }
    
    @property({ type:cc.Enum(GameConst.SitPos) })
    set sitPos(val) {
        if (val == this._sitPos) {
            return;
        }
        this._sitPos = val;

        this.node.getComponent(MJStraightLayout).sitPos = val;
    };
    
    @property({ type:cc.Enum(GameConst.CardShowType) })
    set showType(val) {
        if (val == this._showType) {
            return;
        }
        this._showType = val;

        for (let mahjongStraight of this.node.children) {
            let item = mahjongStraight.getComponent(MahjongStraightItem);
            if (item) {
                item.showType = val;
            }
        }
    };

    get showType() {
        return this._showType;
    }

    @property(cc.Node)
    sp_mark: cc.Node;

    loadingNodes: {} = {};

    protected onLoad(): void {
        this.sp_mark.parent = null;
    }

    updateLayout() {
        this.updateMahjongs(this.mahjongs);
    }

    showMark() {
        this.sp_mark.active = true;
    }

    hiddenMark() {
        this.sp_mark.active = false;
    }

    updateMahjongs(mahjongs, callback?: Function) {
        let mahjongStraights = this.node.children;

        for (let i = 0; i < mahjongStraights.length; ++i) {
            if (mahjongStraights[i]) {
                mahjongStraights[i].active = false;
            }
        }
        for (let i = 0, k = 0; k < mahjongs.length; ++i) {
            let subMahjongs = [];
            for (let j = 0; j < this.mahjongNumOneLine && k < mahjongs.length; ++j, ++k) {
                subMahjongs.push(mahjongs[k]);
            }
            if (!mahjongStraights[i]) {
                this._addMahjongStraight(i, subMahjongs, callback);
            } else {
                let item = mahjongStraights[i].getComponent(MahjongStraightItem);
                item.updateMahjongs(subMahjongs, (j, node) => {
                    this.updateMark(i, j, node, callback);
                });
            }
        }
        this._mahjongs = mahjongs;
    }

    _addMahjongStraight(index, mahjongs, callback?: Function) {
        UIMgr.createPrefab("MahjongStraightItem", null, null, (err, node: cc.Node) => {
            let item = node.getComponent(MahjongStraightItem);
            item.showType = this.showType;
            item.sitPos = this.sitPos;
            node.anchorX = 0;
            node.anchorY = 0;

            this.loadingNodes[index] = node;
            for (let i = this.node.children.length; this.loadingNodes[i]; i = this.node.children.length) {
                this.node.addChild(this.loadingNodes[i]);
                this.loadingNodes[i] = null;
            }
            item.updateMahjongs(mahjongs, (subIndex, node) => {
                this.updateMark(index, subIndex, node, callback);
            });
        })
    }

    updateMark(i, j, node, callback?: Function) {
        let id = i * this.mahjongNumOneLine + j;
        if (id == this._mahjongs.length - 1) {
            this.sp_mark.parent = node;
            this.sp_mark.setPosition(new cc.Vec2(0, 50));
        }
        callback && callback(id, node);
    }
}