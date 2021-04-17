export interface HttpReturn {
    code?: string;
    msg?: string;
    data?: any;
}
/**
 * HTTP post 请求接口
 * @param host
 * @param port
 * @param path
 * @param data
 * @returns
 */
export declare function http_post_async(host: string, port: number, path: string, data: any): Promise<HttpReturn>;
