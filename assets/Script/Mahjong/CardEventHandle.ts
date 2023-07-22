import LogUtil from "../Util/LogUtil";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("特殊组件/CardEventHandle")
export default class CardEventHandle extends cc.Component {

    _end: boolean = false;

    _events: { [key: string]: Function[] } = {};

    _burial: { [key: string]: Function[] } = {};

    protected onEnable(): void {
        this.node.on(cc.Node.EventType.CHILD_ADDED, this._childAdd, this);
    }

    protected onDisable(): void {
        this.node.off(cc.Node.EventType.CHILD_ADDED, this._childAdd, this);
    }

    _childAdd(child) {
        this.collect(child);
    }

    collect(node) {
        let handle = node.getComponent(CardEventHandle);
        if (handle) {
            for (let key in this._burial) {
                for (let func of this._burial[key]) {
                    handle.register(key, func);
                }
            }
        }
    }

    store(key, func) {
        if (this._burial[key] == null) {
            this._burial[key] = [];
        }
        this._burial[key].push(func);
    }

    register(key, func) {
        if (this._end) {
            if (this._events[key] == null) {
                this._events[key] = [];
            }
            this._events[key].push(func);
        } else {
            this.store(key, func);
            this.transfer(key, func, this.node);
        }
    }

    emit(key, ...args) {
        if (this._events[key]) {
            for (let func of this._events[key]) {
                try {
                    func(...args);
                } catch (e) {
                    LogUtil.Error(`[执行"${key}"对应的方法失败], ${e}`);
                }
            }
        }
    }

    transfer(key, func, father) {
        for (let node of father.children) {
            let handle = node.getComponent(CardEventHandle);
            if (handle) {
                handle.register(key, func);
            }
        }
    }
}