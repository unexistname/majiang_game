

const SPECIAL_CARD_TYPE = {
    SUPREME_DRAGON: 33,  // 至尊清龙
    DRAGON: 32,          // 一条龙
    TWELVE_ROYAL: 31,    // 十二皇族
    THREE_SAME_DECOR_STRAIGHT: 30,   // 三同花顺
    THREE_BOMB: 29,      // 三分天下
    ALL_BIG: 28,         // 全大
    ALL_SMALL: 27,       // 全小
    ALL_SAME_DECOR: 26,  // 凑一色
    DOUBLE_MONSTER_DASH_THREE: 25,       // 双怪冲三
    FOUR_LEOPARD: 24,       // 四套三对
    FIVE_PAIR_ONE_LEOPARD: 23,  // 五对三条
    SIX_PAIR: 22,           // 六对半
    THREE_STRAIGHT: 21,     // 三顺子
    THREE_SAME_DECOR: 20,   // 三同花
};

const COMMON_CARD_TYPE = {
    SAME_DECOR_STRAIGHT: 17,    // 同花顺
    BOMB: 16,           // 炸弹
    GOURD: 15,          // 葫芦
    SAME_DECOR: 14,     // 同花
    STRAIGHT: 13,       // 顺子
    LEOPARD: 12,        // 豹子
    TWO_PAIR: 11,       // 两对
    ONE_PAIR: 10,       // 一对
    NONE: 0,
};



export class SSSCardType {


    static getCardTypeDesc(type: number) {
        switch (type) {
            case SPECIAL_CARD_TYPE.SUPREME_DRAGON:
                return "至尊清龙";
            case SPECIAL_CARD_TYPE.DRAGON:
                return "一条龙";
            case SPECIAL_CARD_TYPE.TWELVE_ROYAL:
                return "十二皇族";
            case SPECIAL_CARD_TYPE.THREE_SAME_DECOR_STRAIGHT:
                return "三同花顺";
            case SPECIAL_CARD_TYPE.THREE_BOMB:
                return "三分天下";
            case SPECIAL_CARD_TYPE.ALL_BIG:
                return "全大";
            case SPECIAL_CARD_TYPE.ALL_SMALL:
                return "全小";
            case SPECIAL_CARD_TYPE.ALL_SAME_DECOR:
                return "凑一色";
            case SPECIAL_CARD_TYPE.DOUBLE_MONSTER_DASH_THREE:
                return "双怪冲三";
            case SPECIAL_CARD_TYPE.FOUR_LEOPARD:
                return "四套三对";
            case SPECIAL_CARD_TYPE.FIVE_PAIR_ONE_LEOPARD:
                return "五对三条";
            case SPECIAL_CARD_TYPE.SIX_PAIR:
                return "六对半";
            case SPECIAL_CARD_TYPE.THREE_STRAIGHT:
                return "三顺子";
            case SPECIAL_CARD_TYPE.THREE_SAME_DECOR:
                return "三同花";
            case COMMON_CARD_TYPE.SAME_DECOR_STRAIGHT:
                return "同花顺";
            case COMMON_CARD_TYPE.BOMB:
                return "炸弹";
            case COMMON_CARD_TYPE.GOURD:
                return "葫芦";
            case COMMON_CARD_TYPE.SAME_DECOR:
                return "同花";
            case COMMON_CARD_TYPE.STRAIGHT:
                return "顺子";
            case COMMON_CARD_TYPE.LEOPARD:
                return "豹子";
            case COMMON_CARD_TYPE.TWO_PAIR:
                return "两对";
            case COMMON_CARD_TYPE.ONE_PAIR:
                return "一对";
            default:
                return "乌龙";
        }
    }
}