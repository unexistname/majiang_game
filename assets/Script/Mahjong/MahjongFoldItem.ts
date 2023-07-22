import UIMgr from "../BaseUI/UIMgr";
import { GameConst } from "../Const/GameConst";
import MJGridLayout from "../Util/MJGridLayout";
import MJStraightLayout from "../Util/MJStraightLayout";
import MahjongItem from "./MahjongItem";
import MahjongStraightItem from "./MahjongStraightItem";

const { ccclass, menu, property, executeInEditMode } = cc._decorator;

@ccclass
@menu("麻将组件/MahjongFoldItem")
@executeInEditMode
export default class MahjongFoldItem extends cc.Component {

    _mahjongs: Array<number> = [];

    _mahjongNumOneLine: number = 16;
    
    @property({type: cc.Integer})
    set mahjongNumOneLine(val) {
        this._mahjongNumOneLine = val;
        let comp = this.node_folds.getComponent(MJGridLayout);
        comp && (comp.mahjongNumOneLine = val);
    }

    get mahjongNumOneLine() {
        return this._mahjongNumOneLine;
    }

    @property(cc.Node)
    node_folds: cc.Node;

    @property({ type: [cc.Integer] })
    set mahjongs(val) {
        this.updateMahjongs(val);
    }

    get mahjongs() {
        return this._mahjongs;
    }

    _showType: GameConst.CardShowType = GameConst.CardShowType.SHOW;

    _sitPos: GameConst.SitPos = GameConst.SitPos.DOWN;

    get sitPos() {
        return this._sitPos;
    }
    
    @property({ type:cc.Enum(GameConst.SitPos) })
    set sitPos(val) {
        // if (val == this._sitPos) {
        //     return;
        // }
        this._sitPos = val;
        if (val == GameConst.SitPos.DOWN || val == GameConst.SitPos.TOP) {
            this.mahjongNumOneLine = 14;
        } else {
            this.mahjongNumOneLine = 12;
        }

        this.node_folds.getComponent(MJGridLayout).sitPos = val;
    }
    
    @property({ type:cc.Enum(GameConst.CardShowType) })
    set showType(val) {
        if (val == this._showType) {
            return;
        }
        this._showType = val;

        for (let mahjongStraight of this.node_folds.children) {
            let item = mahjongStraight.getComponent(MahjongItem);
            if (item) {
                item.showType = val;
            }
        }
    }

    get showType() {
        return this._showType;
    }

    @property(cc.Node)
    sp_mark: cc.Node;

    loading: {} = {};
    loadingNodes: {} = {};

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
        this._mahjongs = mahjongs;
        let mahjongItems = this.node_folds.children;
        for (let i = 0; i < mahjongs.length; ++i) {
            let mahjongId = mahjongs[i];
            if (this.loading[i] || this.loadingNodes[i]) {
                continue;
            }
            if (!mahjongItems[i]) {
                this._addMahjongItem(i, mahjongId, callback);
            } else {
                mahjongItems[i].getComponent(MahjongItem).mahjongId = mahjongId;
                mahjongItems[i].active = true;
            }
        }
        for (let i = mahjongs.length; i < mahjongItems.length; ++i) {
            mahjongItems[i].parent = null;
        }
    }

    _addMahjongItem(index, mahjongId, callback?: Function) {
        let data = {mahjongId: mahjongId, showType: this.showType};

        this.loading[index] = true;
        UIMgr.createMahjongItem(this.sitPos, null, data, (err, node) => {
            this.loading[index] = false;
            this.loadingNodes[index] = node;
            for (let i = this.node_folds.children.length; this.loadingNodes[i]; i = this.node_folds.children.length) {
                this.node_folds.addChild(this.loadingNodes[i]);
                this.adjustSize();
                if (this._mahjongs[i] == null) {
                    this.loadingNodes[i].active = false;
                } else {
                    let item = this.loadingNodes[i].getComponent(MahjongItem);
                    if (item.mahjongId != this._mahjongs[i]) {
                        item.mahjongId = this._mahjongs[i];
                    }
                    this.loadingNodes[i].active = true;
                }
                this.loadingNodes[i] = null;
            }
            this.updateMark(index, node, callback);
            callback && callback(index, node);
        });
    }

    updateMark(id, node, callback?: Function) {
        // let id = i * this.mahjongNumOneLine + j;
        if (id == this._mahjongs.length - 1) {
            this.sp_mark.parent = node;
            this.sp_mark.setPosition(new cc.Vec2(0, 50));
        }
        callback && callback(id, node);
    }

    adjustSize() {
        // let width = 0, height = 0;
        // switch (this.sitPos) {
        //     case GameConst.SitPos.TOP:
        //     case GameConst.SitPos.DOWN:
        //         for (let child of this.node_folds.children) {
        //             height += child.height;
        //             width = Math.max(width, child.width);
        //         }
        //         break;
        //     case GameConst.SitPos.LEFT:
        //     case GameConst.SitPos.RIGHT:
        //         for (let child of this.node_folds.children) {
        //             width += child.width;
        //             height = Math.max(height, child.height);
        //         }
        //         break;
        // }
        // this.node.width = this.node_folds.width;
        // this.node.height = this.node_folds.height;
    }
}