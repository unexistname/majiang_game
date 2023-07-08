import UIMgr from "../../BaseUI/UIMgr";
import RecordUserItem from "./RecordUserItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RecordItem extends cc.Component {

    @property(cc.Prefab)
    prefab_recordUser: cc.Prefab;

    @property(cc.Node)
    node_recordUsers: cc.Node;

    @property(cc.Label)
    txt_gameName: cc.Label;

    @property(cc.Label)
    txt_roomId: cc.Label;

    @property(cc.Label)
    txt_round: cc.Label;

    @property(cc.Label)
    txt_time: cc.Label;

    updateView(data) {
        for (let user of data.users) {
            UIMgr.createNode(this.prefab_recordUser, this.node_recordUsers, RecordUserItem, user);
        }
        this.txt_gameName.string = data.gameName;
        this.txt_roomId.string = data.roomId;
        this.txt_round.string = data.round;
        this.txt_time.string = data.time;
    }

    CC_onClickDetail() {
        UIMgr.showView("RecordDetailView");
    }
}