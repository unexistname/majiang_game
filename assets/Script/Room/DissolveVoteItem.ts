import UIMgr from "../BaseUI/UIMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DissolveVoteItem extends cc.Component {

    @property(cc.Sprite)
    sp_avatar: cc.Sprite;

    @property(cc.Label)
    txt_name: cc.Label;

    @property(cc.Node)
    node_agree: cc.Node;

    @property(cc.Node)
    node_reject: cc.Node;

    updateView(data) {
        let user = data.user;
        UIMgr.setAvatar(this.sp_avatar, user.avatarUrl);
        this.txt_name.string = user.userName;
        if (data.vote) {
            this.node_agree.active = true;
            this.node_reject.active = false;
        } else {
            this.node_agree.active = false;
            this.node_reject.active = true;
        }
    }
}