
const { ccclass, property } = cc._decorator;

@ccclass
export default class ScoreItem extends cc.Component {

    @property(cc.Label)
    txt_score_add: cc.Label;

    @property(cc.Label)
    txt_score_sub: cc.Label;

    updateScore(score) {
        if (score >= 0) {
            this.txt_score_add.string = "+" + score;
            this.txt_score_add.node.active = true;
            this.txt_score_sub.node.active = false;
        } else {
            this.txt_score_sub.string = score.toString();
            this.txt_score_sub.node.active = true;
            this.txt_score_add.node.active = false;
        }
    }

    updateView(score) {
        this.updateScore(score);
    }
}