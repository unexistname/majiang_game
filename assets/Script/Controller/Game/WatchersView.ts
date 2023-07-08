import UIMgr from "../../BaseUI/UIMgr";
import WatcherItem from "./WatcherItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class WatchersView extends cc.Component {

    @property(cc.Node)
    node_watchers: cc.Node;

    @property(cc.Prefab)
    prefab_watcherItem: cc.Prefab;

    updateView(data) {
        for (let watcherData of data) {
            UIMgr.createNode(this.prefab_watcherItem, this.node_watchers, WatcherItem, watcherData);
        }
    }
}