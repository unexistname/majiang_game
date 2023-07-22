
import { GameConst } from "../Const/GameConst";
import LogUtil from "./LogUtil";


export default class ResUtil {

    static loadImg(sprite: cc.Sprite, path: string, callback?: Function) {
        sprite["lastUrl"] = path;
        cc.loader.loadRes(path, cc.SpriteFrame,function(err, spriteFrame){
            if (err) {
                LogUtil.Error(err);
                callback && callback(err, null);
            } else if (sprite["lastUrl"] != path) {
                LogUtil.Warn(`[ResUtil.loadRes] sprite lastUrl(${sprite["lastUrl"]}) != path(${path})`);
            } else if (cc.isValid(sprite)) {
                sprite.spriteFrame = spriteFrame;
                callback && callback(err, null);
            }
        });
    }

    static getRobScoreImagePath(score: number) {
        return "textures/rob/qiang" + score;
    }

    static getNiuNiuCardTypeImagePath(cardType: number) {
        return "textures/niuniu/niu/niu" + cardType;
    }

    static getPrefabPath(prefabName: string) {
        return "prefabs/" + prefabName;
    }

    static getCostPath(costType: number) {
        if (costType == 3) {
            return "textures/purchase/item100";
        }
        return "textures/purchase/item110";
    }

    static getAudioPath(gameType: string, audioName: string, sex?: number) {
        let basePath = "resources/sounds/";
        
    }

    static getAvatar(sex?: number) {
        if (sex != null) {
            return "textures/icon/"+ (sex ? "head_man" : "head_girl");
        } else {
            return "textures/icon/"+ (sex ? "head_man" : "head_girl");
            // return "textures/icon/head_default";
        }
    }

    static getPokerResPath(pokerId: number) {
        if (pokerId == -1) {
            return "textures/poker/card_backsmall";
        } else {
            return "textures/poker/" + pokerId;
        }
    }

    static getPokerDecorResPath(pokerId: number) {
        if (pokerId == -1) {
            return "textures/pokerBig/card_backsmall";
        } else {
            let decor = pokerId % 10;
            let value = this.getPokerValue(pokerId);
            return "textures/pokerBig/" + value + decor;
        }
    }

    static getPokerValueResPath(pokerId: number) {
        if (pokerId == -1) {
            return "textures/pokerBig/card_backsmall";
        } else {
            let decor = pokerId % 10;
            let value = this.getPokerValue(pokerId);
            if (decor == 5) {
                return
            } else if (decor % 2 == 1) {
                return "textures/pokerBig/black_" + value;
            } else {
                return "textures/pokerBig/red_" + value;
            }
        }
    }

    static getPokerValue(pokerId) {
        let value = Math.floor(pokerId / 10);
        if (value > 10) {
            return "JQK".charAt(value - 11);
        } else {
            return value + "";
        }
    }

    static getMahjongResId(mahjongId: number) {
        if (mahjongId >= 0 && mahjongId < 9) {
            return mahjongId + 11;
        } else if (mahjongId >= 9 && mahjongId < 18) {
            return mahjongId + 12;
        } else if (mahjongId >= 18 && mahjongId < 27) {
            return mahjongId + 13;
        } else if (mahjongId >= 27 && mahjongId < 34) {
            return mahjongId + 14;
        } else if (mahjongId >= 34 && mahjongId < 42) {
            return mahjongId + 17;
        } else {
            return mahjongId;
        }
    }
    
    static getMahjongResPath(mahjongId: number, showType: GameConst.CardShowType, sitPos: GameConst.SitPos) {
        if (mahjongId == -1 && showType == GameConst.CardShowType.SHOW) {
            showType = GameConst.CardShowType.FALL;
        }
        let resId = this.getMahjongResId(mahjongId);
        if (showType == GameConst.CardShowType.STAND) {
            if (sitPos == GameConst.SitPos.TOP) {
                return "textures/common/MJ/hand_2";
            } else if (sitPos == GameConst.SitPos.LEFT) {
                return "textures/common/MJ/hand_3";
            } else if (sitPos == GameConst.SitPos.RIGHT) {
                return "textures/common/MJ/hand_1";
            } else if (sitPos == GameConst.SitPos.DOWN) {
                if (resId == -1) {
                    LogUtil.Error("[获取麻将资源出错]", mahjongId, showType, sitPos, resId);
                    return "textures/common/MJ/hand_2";
                }
                return "textures/common/MJ/2/handmah_" + resId;
            }
        } else if (showType == GameConst.CardShowType.FALL) {
            if (sitPos == GameConst.SitPos.TOP) {
                return "textures/common/MJ/2/mingmah_00";
            } else if (sitPos == GameConst.SitPos.LEFT) {
                return "textures/common/MJ/3/mingmah_00";
            } else if (sitPos == GameConst.SitPos.RIGHT) {
                return "textures/common/MJ/1/mingmah_00";
            } else if (sitPos == GameConst.SitPos.DOWN) {
                return "textures/common/MJ/2/mingmah_00";
            }
        } else if (showType == GameConst.CardShowType.SHOW) {
            if (sitPos == GameConst.SitPos.TOP) {
                return "textures/common/MJ/2/mingmah_" + resId;
            } else if (sitPos == GameConst.SitPos.LEFT) {
                return "textures/common/MJ/3/mingmah_" + resId;
            } else if (sitPos == GameConst.SitPos.RIGHT) {
                return "textures/common/MJ/1/mingmah_" + resId;
            } else if (sitPos == GameConst.SitPos.DOWN) {
                return "textures/common/MJ/2/mingmah_" + resId;
            }
        }
    }
}