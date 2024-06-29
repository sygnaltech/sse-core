export * from './page';
export * from './debug';
export * from './init';
export * from './routeDispatcher';
interface SSEGlobalDataType {
    baseUrl?: string;
}
declare global {
    interface Window {
        SSE: SSEGlobalDataType;
    }
}
export declare function initSSE(): void;
