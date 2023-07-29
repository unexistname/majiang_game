import UIMgr from "../BaseUI/UIMgr";
import PokersItem from "../Game/PokersItem";
import ScoreItem from "../Game/ScoreItem";
import RoomMgr from "../Room/RoomMgr";
import GameUtil from "../Util/GameUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BaseSettleItem extends cc.Component {

    @property(cc.Label)
    txt_userName: cc.Label;

    @property(cc.Sprite)
    sp_avatar: cc.Sprite;

    @property(PokersItem)
    node_holds: PokersItem;

    @property(ScoreItem)
    node_score: ScoreItem;

    updateView(data) {
        let userId = data.userId;
        let gamber = RoomMgr.ins.getGamber(userId);
        if (gamber) {
            this.txt_userName.string = GameUtil.cutString(gamber.userName, 10);
            UIMgr.setAvatar(this.sp_avatar, gamber.avatarUrl);
        }
        this.node_score.updateScore(data.score);
        this.node_holds.updateHolds(data.holds);
    }
}
