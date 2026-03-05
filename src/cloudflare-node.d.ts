declare module 'cloudflare:node' {
    export function httpServerHandler(...args: any[]): any;
    export function handleAsNodeRequest(...args: any[]): any;
}
