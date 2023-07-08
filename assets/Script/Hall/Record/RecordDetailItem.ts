import UIMgr from "../../BaseUI/UIMgr";


const { ccclass, property } = cc._decorator;

@ccclass
export default class RecordDetailItem extends cc.Component {

    @property(cc.Label)
    txt_round: cc.Label;

    @property(cc.Node)
    node_scores: cc.Node;

    updateView(data) {
        this.txt_round.string = data.round;
        for (let score of data.score) {
            UIMgr.createPrefab("ScoreItem", this.node_scores, score);
        }
    }

}
