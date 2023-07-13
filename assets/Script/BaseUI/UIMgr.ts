import { ErrorCode, ErrorMsg } from "../ErrorCode";
import { GlobalConst } from "../GlobalConst";
import { GameConst } from "../Const/GameConst";
import LogUtil from "../Util/LogUtil";
import RemoteFileLoader from "../Util/RemoteFileLoader";
import ResUtil from "../Util/ResUtil";
import RoomView from "../Room/RoomView";
import GameUtil from "../Util/GameUtil";
import MahjongUnitItem from "../Mahjong/MahjongUnitItem";
import MahjongItem from "../Mahjong/MahjongItem";


export default class UIMgr {

    static rootNode: cc.Node;

    static showView(viewName: string, data?: any, callback?: Function, unique: boolean = true) {
        let parent = cc.find("Canvas");
        if (unique && parent.getChildByName(viewName)) {
            return;
        }
        let path = ResUtil.getPrefabPath(viewName);
        cc.loader.loadRes(path, cc.Prefab, (err, prefab) => {
            if (err) {
                LogUtil.Error(err);
                callback && callback(err, null);
            } else {
                let node = this.createNode(prefab, parent);
                if (data) {
                    node.getComponent(viewName).updateView(data);
                }
                callback && callback(err, node);
            }
        });
    }

    static showItemInRoot(itemName: string, data?: any, callback?: Function) {
        let parent = this.rootNode;
        let path = ResUtil.getPrefabPath(itemName);
        cc.loader.loadRes(path, cc.Prefab, (err, prefab) => {
            if (err) {
                LogUtil.Error(err);
                callback && callback(err, null);
            } else {
                let node = this.createNode(prefab, parent);
                if (data) {
                    node.getComponent(itemName).updateView(data);
                }
                callback && callback(err, node);
            }
        });
    }

    static closeView(viewName: string) {
        let parent = cc.find("Canvas");
        let viewNode = parent.getChildByName(viewName);
        if (viewNode) {
            viewNode.parent = null;
        }
    }

    static showTip(content: string) {
        this.showView("TipsView", content, null, false);
    }

    static showAlert(content: string, successCB?: Function) {
        let data = {content: content, successCB: successCB};
        this.showView("AlertView", data, null, false);
    }

    static showError(errorCode: ErrorCode, data?: any) {
        let errorMsg = ErrorMsg[errorCode];
        if (!data) {
            data = {};
        }
        if (!data.showType) {
            data.showType = GlobalConst.ShowType.TIPS;
        }
        if (data.showType == GlobalConst.ShowType.HIDE) {
            LogUtil.Error(errorMsg);
        } else if (data.showType == GlobalConst.ShowType.TIPS) {
            this.showTip(errorMsg);
        } else if (data.showType == GlobalConst.ShowType.ALERT) {
            this.showAlert(errorMsg);
        }
    }

    static setRoot(node: cc.Node) {
        this.rootNode = node;
    }

    static getRoot() {
        return this.rootNode;
    }

    static createPrefab(prefabName: string, parent?: cc.Node, data?: any, callback?: Function) {
        let path = ResUtil.getPrefabPath(prefabName);
        cc.loader.loadRes(path, cc.Prefab, (err, prefab) => {
            if (err) {
                LogUtil.Error(err);
                callback && callback(err, null);
            } else {
                let node = this.createNode(prefab, parent);
                if (data) {
                    let component = node.getComponent(prefabName);
                    // @ts-ignore
                    component.updateView(data);
                }
                callback && callback(err, node);
            }
        });
    }

    static createNode(prefab: cc.Node | cc.Prefab, parent?: cc.Node, type?: { prototype: cc.Component }, data?: any) {
        // @ts-ignore
        let node: cc.Node = cc.instantiate(prefab);
        if (type && data) {
            let component = node.getComponent(type);
            // @ts-ignore
            component.updateView(data);
        }
        if (parent) {
            parent.addChild(node);
        }
        return node;
    }

    static createSpriteNode(path: string, parent: cc.Node, callback?: Function) {
        let node = new cc.Node();
        let sprite = node.addComponent(cc.Sprite);
        parent.addChild(node);
        this.setSprite(sprite, path, (err, spriteFrame) => {
            callback && callback(err, node);
        });
    }

    static updateLayout(node: cc.Node, sitPos: GameConst.SitPos, dis?: number) {
        let layout: cc.Layout = node.getComponent(cc.Layout);
        switch (sitPos) {
            case GameConst.SitPos.DOWN:
                layout.type = cc.Layout.Type.HORIZONTAL;
                layout.horizontalDirection = cc.Layout.HorizontalDirection.LEFT_TO_RIGHT;
                if (dis) {
                    layout.spacingX = dis;
                }
                break;
            case GameConst.SitPos.TOP:
                layout.type = cc.Layout.Type.HORIZONTAL;
                layout.horizontalDirection = cc.Layout.HorizontalDirection.LEFT_TO_RIGHT;
                if (dis) {
                    layout.spacingX = dis;
                }
                break;
            case GameConst.SitPos.LEFT:
                layout.type = cc.Layout.Type.VERTICAL;
                layout.verticalDirection = cc.Layout.VerticalDirection.TOP_TO_BOTTOM;
                if (dis) {
                    layout.spacingY = dis;
                }
                break;
            case GameConst.SitPos.RIGHT:
                layout.type = cc.Layout.Type.VERTICAL;
                layout.verticalDirection = cc.Layout.VerticalDirection.BOTTOM_TO_TOP;
                if (dis) {
                    layout.spacingY = dis;
                }
                break;
        }
    }

    static createMahjongUnit(sitPos: GameConst.SitPos, parent: cc.Node, data?: any, callback?: Function) {
        let name = this.getMahjongUnitName(sitPos);
        this.createPrefab(name, parent, null, (err, node) => {
            if (err) {
                callback && callback(err, null);
                LogUtil.Error("创建麻将失败", err);
                return;
            }
            let component = node.getComponent(MahjongUnitItem);
            component.setSitPos(sitPos);
            if (data) {
                component.updateView(data);
            }
            callback && callback(err, node);
        });
    }

    static createMahjongItem(sitPos: GameConst.SitPos, parent?: cc.Node, data?: any, callback?: Function) {
        let name = "MahjongItem";
        this.createPrefab(name, parent, null, (err, node) => {
            if (err) {
                callback && callback(err, null);
                LogUtil.Error("创建麻将失败", err);
                return;
            }
            let component = node.getComponent(MahjongItem);
            component.setSitPos(sitPos);
            if (data) {
                component.updateView(data);
            }
            callback && callback(err, node);
        });
    }

    static getMahjongUnitName(sitPos: GameConst.SitPos) {
        switch(sitPos) {
            case GameConst.SitPos.TOP:
                return "MahjongItemTop";
            case GameConst.SitPos.DOWN:
                return "MahjongItemDown";
            case GameConst.SitPos.LEFT:
                return "MahjongItemLeft";
            case GameConst.SitPos.RIGHT:
                return "MahjongItemRight";
        }
    }

    static setCost(sprite: cc.Sprite, costType: number) {
        let path = ResUtil.getCostPath(costType);
        this.setSprite(sprite, path);
    }

    static setSprite(sprite: cc.Sprite, path: string, callback?: Function) {
        if (!path) {
            callback && callback("path is null", null);
            return;
        }
        if (GameUtil.isRemoteUrl(path)) {
            sprite["lastUrl"] = path;
            RemoteFileLoader.ins.loadRemoteImage(path, (spriteFrame) => {
                if (sprite["lastUrl"] != path) {
                    LogUtil.Warn(`[UIMgr.setSprite] sprite lastUrl(${sprite["lastUrl"]}) != path(${path})`);
                } else if (cc.isValid(sprite)) {
                    // delete sprite["lastUrl"];
                    sprite.spriteFrame = spriteFrame;
                    callback && callback(null, spriteFrame);
                }
            });
        } else {
           this.loadImg(sprite, path, callback);
        }
    }

    static loadImg(sprite: cc.Sprite, path: string, callback?: Function) {
        if (!CC_EDITOR) {
            sprite["lastUrl"] = path;
        }
        cc.loader.loadRes(path, cc.SpriteFrame, function(err, spriteFrame){
            if (err) {
                LogUtil.Error(err);
                callback && callback(err, null);
            } else if (!CC_EDITOR && sprite["lastUrl"] != path) {
                LogUtil.Warn(`[UIMgr.loadImg] sprite lastUrl(${sprite["lastUrl"]}) != path(${path})`);
            } else if (cc.isValid(sprite)) {
                // delete sprite["lastUrl"];
                sprite.spriteFrame = spriteFrame;
                callback && callback(err, spriteFrame);
            }
        });
    }

    static setAvatar(sprite: cc.Sprite, path: string, callback?: Function) {
        if (path == null) {
            this.loadImg(sprite, ResUtil.getAvatar(), callback);
        } else {
            this.setSprite(sprite, path, (err, sp) => {
                if (sp == null) {
                    this.setAvatar(sprite, null, callback);
                } else {
                    callback && callback(err, sp);
                }
            });
        }
    }

    static setPoker(sprite: cc.Sprite, pokerId: number, callback?: Function) {
        let path = ResUtil.getPokerResPath(pokerId);
        this.loadImg(sprite, path, callback);
    }

    static setMahjong(sprite: cc.Sprite, mahjongId: number, showType: GameConst.CardShowType, sitPos: GameConst.SitPos, callback?: Function) {
        let path = ResUtil.getMahjongResPath(mahjongId, showType, sitPos);
        if (!path) {
            LogUtil.Error("[UIMgr.setMahjong] error, path is null", mahjongId, showType, sitPos);
        }
        this.loadImg(sprite, path, callback);
    }

    

    static getRoomView() {
        let node = cc.find("Canvas");
        if (node) {
            return node.getComponent(RoomView);
        }
    }

    static getGambers() {
        let view = this.getRoomView();
        if (view) {
            return view.getGambers();
        }
    }

    static closeSelf(view: any) {
        view.node.parent = null;
    }
}