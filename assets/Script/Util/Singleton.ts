import { Key } from "readline";

const { get, getPropertyDescriptor } = cc.js;

// export function Singleton(_class?: Function): void {
//     console.log(_class);
//     get(_class, "ins", () => {
//         if (getPropertyDescriptor(_class, "_ins") == null) {
//             _class.prototype._ins = _class();
//         }
//         return getPropertyDescriptor(_class, "_ins");
//     });

// }
// export function Singleton<T extends object, K extends PropertyKey, V>(_class?: Function) {
//     let key: PropertyKey = "ins";
//     let value = () => {
//         if (getPropertyDescriptor(_class, "_ins") == null) {
//             _class.prototype._ins = _class();
//         }
//         return getPropertyDescriptor(_class, "_ins");
//     };
//     return { ..._class.prototype, [key]: value } as T & Record<K, V>;
// }

export function Singleton<T extends new (...args: any[]) => {}>(constructor: T) {
    return class extends constructor {
        static _ins = null;
        static get ins() {
            if (this._ins == null) {
                this._ins = new constructor();
            }
            return this._ins;
        }
    };
}
