const {ccclass, property} = cc._decorator;
import { Singleton } from "./Util/Singleton";

@ccclass
@Singleton
export default class Helloworld extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    start () {
        // init logic
        // this.label.string = this.text;
        console.log(Helloworld.ins); 
    }
}
