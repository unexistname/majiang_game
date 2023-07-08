import UIMgr from "../../BaseUI/UIMgr";
import { GameConst } from "../../Const/GameConst";

const { ccclass } = cc._decorator;

@ccclass
export default class ClockMgr extends cc.Component {
    private static _ins: ClockMgr = null;
    public static get ins() {
        if (this._ins == null) {
            this._ins = UIMgr.getRoot().getComponent(ClockMgr);
        }
        return this._ins;
    }

    clockTimes: { [key: string]: number } = {};
    clockInterval: { [key: string]: number } = {};

    setTime(clockName: string, time: number) {
        this.clockTimes[clockName] = time;
        this.clockInterval[clockName] = 0;
    }

    update(dt: number) {
        for (let clockName in this.clockInterval) {
            this.clockInterval[clockName] += dt;
            if (this.clockInterval[clockName] >= 1) {
                this.clockInterval[clockName] -= 1;
                this.clockTimes[clockName] -= 1;
                cc.director.emit(GameConst.GameSignal.CLOCK_CHANGE, clockName, this.clockTimes[clockName]);
                if (this.clockTimes[clockName] <= 0) {
                    delete this.clockTimes[clockName];
                    delete this.clockInterval[clockName];
                }
            }
        }
    }
}