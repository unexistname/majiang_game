const { set, getset } = cc.js;

export function Signal(signalName: string, node?: any) {
    return function(_obj: any, _attrName: string): void {
        // set(_obj, _attrName, (value: any) => {
        //     _obj[_attrName] = value;
        //     // descriptor.value = value;
        //     if (node) {
        //         SignalMgr.emitWithNode(signalName, node, value);
        //     } else {
        //         SignalMgr.emit(signalName, value);
        //     }
        // });
        getset(_obj, _attrName, () => {
            return _obj["_" + _attrName];
        }, (value: any) => {
            _obj["_" + _attrName] = value;
            if (node) {
                SignalMgr.emitWithNode(signalName, node, value);
            } else {
                SignalMgr.emit(signalName, value);
            }
        });
    }
}

export function Slot(signalName: string, node?: any): Function {
    return function(_obj: any, _attrName: string, descriptor: PropertyDescriptor): void {
        let fn = descriptor.value;
        let func = fn.bind(_obj);
        if (node) {
            SignalMgr.registerWithNode(_obj, signalName, node, func);
        } else {
            SignalMgr.register(_obj, signalName, func);
        }
        descriptor.value = (...args) => {
            return fn(...args);
        }
    }
}


class SignalMgr {
    static _signals = [];
    static _signalsWithNode = {};
    static emit(signalName, ...args) {
        let slots = this._signals;
        if (!slots || !slots[signalName]) {
            return
        }
        let needRemove = [];
        for (let slot of slots[signalName]) {
            let {obj, func} = slot;
            if (!cc.isValid(obj)) {
                needRemove.push(slot);
            } else {
                func(...args);
            }
        }
        for (let slot in needRemove) {
            slots[signalName] = slots[signalName].splice(slot, 1);
        }
    }
    static emitWithNode(signalName, node, ...args) {
        let slots = this._signalsWithNode[node];
        if (!slots || !slots[signalName]) {
            return
        }
        let needRemove = [];
        for (let slot of slots[signalName]) {
            let {obj, func} = slot;
            if (!cc.isValid(obj)) {
                needRemove.push(slot);
            } else {
                func(...args);
            }
        }
        for (let slot in needRemove) {
            slots[signalName] = slots[signalName].splice(slot, 1);
        }
    }
    static register(obj, signalName, func) {
        if (this._signals[signalName] == null) {
            this._signals[signalName] = [];
        }
        this._signals[signalName].push({ obj: obj, func: func });
    }
    static registerWithNode(obj, signalName, node, func) {
        if (!this._signalsWithNode[node]) {
            this._signalsWithNode[node] = {};
        }
        if (!this._signalsWithNode[node][signalName]) {
            this._signalsWithNode[node][signalName] = [];
        }
        this._signalsWithNode[node][signalName].push({ obj: obj, func: func });
    }
}