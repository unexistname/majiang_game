import ScoreItem from "../Game/ScoreItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameOverItem extends cc.Component {

    @property(cc.Sprite)
    sp_avatar: cc.Sprite;

    @property(cc.Label)
    txt_userId: cc.Label;

    @property(cc.Label)
    txt_userName: cc.Label;

    @property(cc.Label)
    txt_winTime: cc.Label;

    @property(ScoreItem)
    txt_score: ScoreItem;

    updateView(data) {
        this.txt_userId.string = data.userId;
        this.txt_userName.string = data.userName;
        this.txt_winTime.string = data.winTime;
        this.txt_score.updateScore(data.score);
    }
}