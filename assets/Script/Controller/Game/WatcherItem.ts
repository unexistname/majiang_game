import UIMgr from "../../BaseUI/UIMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class WatcherItem extends cc.Component {

    @property(cc.Label)
    txt_name: cc.Label;
    
    @property(cc.Label)
    txt_userId: cc.Label;

    @property(cc.Sprite)
    sp_avatar: cc.Sprite;

    updateView(data) {
        this.txt_userId.string = data.userId;
        this.txt_name.string = data.userName;
        UIMgr.setSprite(this.sp_avatar, data.avatarUrl);
    }
}