import UIMgr from "../../BaseUI/UIMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class WatchersView extends cc.Component {

    @property(cc.Node)
    node_watchers: cc.Node;

    updateView({ watchers }) {
        for (let userId in watchers) {
            let watcherData = watchers[userId];
            UIMgr.createPrefab("WatcherItem", this.node_watchers, watcherData);
        }
    }

    CC_onClickClose() {
        UIMgr.closeSelf(this);
    }
}