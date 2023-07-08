import UIMgr from "../BaseUI/UIMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SGGameView extends cc.Component {

    @property(cc.Prefab)
    prefab_robbanker_view: cc.Prefab;
    
    @property(cc.Prefab)
    prefab_betting_view: cc.Prefab;

    protected start(): void {
        this.initView();
    }

    initView() {
        UIMgr.createNode(this.prefab_robbanker_view, this.node);
        UIMgr.createNode(this.prefab_betting_view, this.node);
    }
}