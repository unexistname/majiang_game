
export default class BaseMgr {

    model: any = null;

    setModel(model: any) {
        if (model != null) {
            this.model = model;
            for (const key in this.model) {
                if (Object.getOwnPropertyDescriptor(this.model, key)) {
                    const fun = Object.getOwnPropertyDescriptor(this.model, key);
                    if (typeof fun == "function") {
                        this[key] = fun;
                    }
                }
            }
        }
    }
}