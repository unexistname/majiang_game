import GameModel from "./GameModel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PokerBetView extends cc.Component {

    @property(cc.Prefab)
    pfb_gamber: cc.Prefab;

    

    private node_gambers: cc.Node[];

    data: GameModel;

    updateView(data: GameModel) {
        this.data = data;
    }
    
}