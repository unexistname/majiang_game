

export default class VoiceEncry {

    private static _ins: VoiceEncry;

    public static get ins() {
        if (this._ins == null) {
            this._ins = new VoiceEncry();
        }
        return this._ins;
    }

    radix: number;
    base: number;

    encodermap = {};
    decodermap = {};

    constructor() {
        this.radix = 12;
        this.base = 128 - this.radix;;
        for(let i = 0; i < 256; ++i){
            let code = null;
            let v = i + 1;
            if(v >= this.base){
                code = this.crypto(v);
            } else {
                code = String.fromCharCode(v);    
            }
            
            this.encodermap[i] = code;
            this.decodermap[code] = i;
        }
    }

    crypto(value){
        value -= this.base;
        let h = Math.floor(value / this.radix) + this.base;
        let l = value % this.radix + this.base;
        return String.fromCharCode(h) + String.fromCharCode(l);
    }

    encode(data){
        let content = "";
        let len = data.length;
        let a = (len >> 24) & 0xff;
        let b = (len >> 16) & 0xff;
        let c = (len >> 8) & 0xff;
        let d = len & 0xff;
        content += this.encodermap[a];
        content += this.encodermap[b];
        content += this.encodermap[c];
        content += this.encodermap[d];
        for(let i = 0; i < data.length; ++i){
            content += this.encodermap[data[i]];
        }
        return content;
    }

    getCode(content,index){
        let c = content.charCodeAt(index);
        if(c >= this.base){
            c = content.charAt(index) + content.charAt(index + 1);
        }
        else{
            c = content.charAt(index);
        }
        return c;
    }
    decode(content){
        let index = 0;
        let len = 0;
        for(let i = 0; i < 4; ++i){
            let c = this.getCode(content,index);
            index += c.length;
            let v = this.decodermap[c];
            len |= v << (3-i)*8;
        }
        
        let newData = new Uint8Array(len);
        let cnt = 0;
        while(index < content.length){
            let c = this.getCode(content,index);
            index += c.length;
            newData[cnt] = this.decodermap[c];
            cnt++;
        }
        return newData;
    }
}