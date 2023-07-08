import UIMgr from "../../BaseUI/UIMgr";


const { ccclass, property } = cc._decorator;

@ccclass
export default class RecordDetailView extends cc.Component {

    @property(cc.Node)
    node_userNames: cc.Node;

    updateView(data) {
        for (let roundData of data.roundDatas) {
            let round = roundData.round;
            let scores = [];
            for (let user of roundData.users) {
                user.userId;
                user.score;
                user.userName;
            }
        }
    }

    CC_onClickClose() {
        UIMgr.closeSelf(this);
    }
}