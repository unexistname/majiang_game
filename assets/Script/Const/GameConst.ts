// import GameType from "./Game/GameType";
// import ErrorCode from "./Game/ErrorCode";
// import SystemSignal from "./Game/SystemSignal";
// import NetSignal from "./Game/NetSignal";
// import GameState from "./Game/GameState";
// import RoomState from "./Game/RoomState";
// import SitPos from "./Game/SitPos";
// import CardShowType from "./Game/CardShowType";
// import ResType from "./Game/ResType";
// import LoginMethod from "./Login/LoginMethod";

export namespace GameConst {
    // export class GameSignal;
    // static GameType = GameType;
    // static ErrorCode = ErrorCode;
    // static SystemSignal = SystemSignal;
    // static NetSignal = NetSignal;
    // static Config = {};
    // static LoginMethod = LoginMethod;

    // static GameState = GameState;
    // static RoomState = RoomState;
    // static CardShowType = CardShowType;
    // static SitPos = SitPos;
    // static ResType = ResType;

    export class GameSignal {
        // 背景音乐开关发生变化
        static OPEN_BG_MUSIC_CHANGE = "OPEN_BG_MUSIC_CHANGE";

        // 音效开关发生变化
        static OPEN_SOUND_CHANGE = "OPEN_SOUND_CHANGE";

        // 震动开关发生变化
        static OPEN_SHOCK_CHANGE = "OPEN_SHOCK_CHANGE";

        // 时钟发生变化
        static CLOCK_CHANGE = "CLOCK_CHANGE";

        // 执行操作
        static DO_OPERATE = "DO_OPERATE";

        // 定庄
        static DECIDE_BANKER = "DECIDE_BANKER";

        // 更新房主
        static UPDATE_OWNER = "UPDATE_OWNER";

        // 用户手牌更新
        static USER_HOLDS = "USER_HOLDS";

        // 用户分数变化
        static USER_SCORE = "USER_SCORE";

        // 用户准备
        static USER_READY = "USER_READY";

        // 用户离线
        static USER_ONLINE = "USER_ONLINE";
    }

    export class GameType {
        static DIAO_XIE = "钓蟹";
        static NIU_NIU = "牛牛";
        static ZHA_JIN_HUA = "炸金花";
        static SHI_SAN_SHUI = "十三水";
        static DE_ZHOU = "德州扑克";
        static SAN_GONG = "三公";
        static FU_DING = "福鼎麻将";
        static FU_DING_DA_ZHA = "福鼎打炸";
        static QUE_SHENG = "广州雀神麻将";
        static PAO_DE_KUAI = "跑得快";
    }

    export enum PokerType {
        NONE,
        SINGLE,
        PAIR,
        THREE,
        SINGLE_STRAIGHT,
        PAIR_STRAIGHT,
        THREE_STRAIGHT,
        THREE_BELT_ONE,
        THREE_BELT_PAIR,
        THREE_STRAIGHT_BELT_ONE,
        THREE_STRAIGHT_BELT_PAIR,
        FOUR_BELT_TWO,
        FOUR_BELT_TWO_PAIR,
        FOUR_STRAIGHT_BELT_MULTI_SINGLE,
        FOUR_STRAIGHT_BELT_MULTI_PAIR,
        FOUR_BELT_PAIR,
        FOUR_STRAIGHT_BELT_PAIR,
        BOMB,
    }

    export class SystemSignal {
        static SYSTEM_PAUSE = "SYSTEM_PAUSE";
        static SYSTEM_RESUME = "SYSTEM_RESUME";
    }
    export class NetSignal {
        static NET_CONNECTING = "NET_CONNECTING";
        static NET_CONNECT_FAIL = "NET_CONNECT_FAIL";
        static NET_CONNECT_SUCCESS = "NET_CONNECT_SUCCESS";
        static NET_CLOSE = "NET_CLOSE";
    }

    export enum GameState {
        IDLE,
        ROB_BANKER,
        DECIDE_BANKER,
        DRAW_CARD,
        BETTING,
        SHOW_CARD,
        SETTLE,
    }
    // export class GameState {
    //     static IDLE = "IDLE";
    //     static ROB_BANKER = "ROB_BANKER";
    //     static DECIDE_BANKER = "DECIDE_BANKER";
    //     static SHUFFLE_CARD = "SHUFFLE_CARD";
    //     static DEAL_CARD = "SHUFFLE_CARD";
    //     static BETTING = "BETTING";
    //     static COMPARE_CARD = "COMPARE_CARD";
    //     static ROUND_SETTLE = "ROUND_SETTLE";
    // }
    export class RoomState {
        static IDLE = "IDLE";
        static PLAYING = "PLAYING";
    }

    export class AudioPath {
        static BASE_PATH = "resources/sounds/";
        static COMMON = "resources/sounds/common/";
        static BETTING = "resources/sounds/betting/";
        static DIAO_XIE = "resources/sounds/diaoxie/";
        static NIU_NIU = "resources/sounds/niuniu/";
        static ZHA_JIN_HUA = "resources/sounds/zhajinhua/";
        static SHI_SAN_SHUI = "resources/sounds/shisanshui/";
        static DE_ZHOU = "resources/sounds/dezhou/";
        static SAN_GONG = "resources/sounds/angong/";
        static FU_DING = "resources/sounds/fuding/";
        static DA_ZHA = "resources/sounds/dazha/";
        static QUE_SHENG = "resources/sounds/quesheng/";
        static PAO_DE_KUAI = "resources/sounds/paodekuai/";
        static MAHJONG = "resources/sounds/majiang/";
        static POKER = "resources/sounds/poker/";
        static PROP = "resources/sounds/prop/";
    }
    
    // export const SitPos = cc.Enum({
    //     DOWN: 0,
    //     LEFT: 1,
    //     RIGHT: 2,
    //     TOP: 3,
    // });
    export enum SitPos {
        DOWN = 0,
        LEFT = 1,
        RIGHT = 2,
        TOP = 3,
    }
    // export class SitPos {
    //     static DOWN = 0;
    //     static LEFT = 1;
    //     static RIGHT = 2;
    //     static TOP = 3;
    // }
    export enum CardShowType {
        SHOW = 1,
        FALL = 2,
        STAND = 3,
    }

    export enum HuType {
        NONE = "",
        HU = "胡",
        ZI_MO = "自摸",
        HUN_3 = "三金倒",
        HUA_8 = "八花",
        DUI_DUI = "对对胡",
        PING_HU = "平胡",
        QING_YI_SE = "清一色",
        HUN_YI_SE = "混一色",
        TIAN_HU = "天胡",
        DI_HU = "地胡",
        XI_4 = "大四喜",
        LAI_ZI = "辣子",
    }
    
    // export class CardShowType {
    //     static SHOW = 1;
    //     static FALL = 2;
    //     static STAND = 3;
    // }
    export class NetCmd {
        GS_ENTER_ROOM_RESULT = 1;
    };
    export class GameOperate {
        OPERATE_EAT: "OPERATE_EAT"
        OPERATE_TOUCH: "OPERATE_TOUCH"
        OPERATE_BELT: "OPERATE_BELT"
        OPERATE_WAIVE: "OPERATE_WAIVE"
        OPERATE_REVERSE_BELT: "OPERATE_REVERSE_BELT"
        OPERATE_STUFFY_EAT: "OPERATE_STUFFY_EAT"
    }
    // static GameOperate = {};
    export class LoginMethod {
        static GUEST = "GUEST";
        static PHONE = "PHONE";
        static WECHAT = "WECHAT";
    }

    export class Config {

        static IS_DEBUG = false;
        static NET_HEART_BEAT_INTERVAL = 6000;   // 心跳包时间
        static NET_HEART_BEAT_TIMEOUT = 6000 * 5;   // 心跳包超时时间
        static ROOM_ID_LENGTH = 6;
        static VOICE_MAX_TIME = 15000;
    }

    
}

// import "./Game/NetConfig";
// import "./Game/EntranceConfig";

// import "./Base/BaseNetCmd";

// import "./DiaoXie/DXGameSignal";