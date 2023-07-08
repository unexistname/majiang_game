import LogUtil from "./LogUtil";

export function DataCheck(dataName: string) {
    return function(_class: any, _funcName: string, descriptor: PropertyDescriptor): void {
        let fn = descriptor.value;
        descriptor.value = (...args) => {
            if (_class[dataName] == null) {
                LogUtil.Error(`[${_class}.${_funcName}]${dataName} is Null`);
                return;
            }
            fn(...args);
        }
    }
}