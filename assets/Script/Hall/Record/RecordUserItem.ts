import UIMgr from "../../BaseUI/UIMgr";
import ScoreItem from "../../Game/ScoreItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RecordUserItem extends cc.Component {

    @property(cc.Sprite)
    sp_avatar: cc.Sprite;

    @property(cc.Label)
    txt_userName: cc.Label;

    @property(ScoreItem)
    txt_score: ScoreItem;

    updateView(data) {
        UIMgr.setAvatar(this.sp_avatar, data.avatarUrl);
        this.txt_userName.string = data.userName;
        this.txt_score.updateScore(data.score);
    }
}