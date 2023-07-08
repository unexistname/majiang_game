const { set, get, getset } = cc.js;

export function Combine(_class: any, _attrName: string): void {
    set(_class, _attrName, (descriptor: any) => {
        if (descriptor) {
            for (const key in descriptor) {
                if (!Object.getOwnPropertyDescriptor(_class, key)) {
                    const fun = Object.getOwnPropertyDescriptor(descriptor, key);
                    if (fun && typeof fun == "function") {
                        // 如果是方法直接拷贝
                        _class[key] = fun;
                    } else {
                        // 如果是属性，就间接调用
                        // get(_class, key, () => {
                        //     return Object.getOwnPropertyDescriptor(descriptor, key);
                        // });
                        getset(_class, key, () => {
                            return descriptor[key];
                        }, (value: any) => {
                            descriptor[key] = value;
                        });
                    }
                }
            }
        }
    });
}