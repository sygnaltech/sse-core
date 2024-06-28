export declare class Debug {
    private _localStorageDebugFlag;
    private _appName;
    private _enabled;
    private _label;
    get persistentDebug(): boolean;
    set persistentDebug(active: boolean);
    get enabled(): boolean;
    set enabled(active: boolean);
    constructor(label: string, appName?: string);
    group(name: string): void;
    groupEnd(): void;
    debug(...args: any[]): void;
}
