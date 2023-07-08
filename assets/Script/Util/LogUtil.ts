
export default class LogUtil {

    // static Info(...args: any[]) {
    //     console.log(args);
    // }

    // static Log(...args: any[]) {
    //     console.log(args);
    // }

    // static Warn(...args: any[]) {
    //     console.warn(args);
    // }

    // static Error(...args: any[]) {
    //     console.error(args);
    // }
    static Info = console.log;

    static Log = console.log;

    static Warn = console.warn;

    static Error = console.error;
}