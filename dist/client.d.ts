/**
 * 更新本服务负载
 * @param load
 */
export declare function server_update_load(load: number): Promise<void>;
interface HttpReturn {
    code?: string;
    msg?: string;
    data?: any;
}
/**
 * 获取指定依赖服务的相关信息
 * @param server_type 游戏依赖服务
 * @returns
 */
export declare function get_server_by_type(server_type: string): IServerRes | undefined;
/**
 * 上报本服务
 * @param server_info 本服务信息
 * @param manage_ip 管理服务器IP
 * @param manage_port 管理服务器端口
 * @param tick_time 心跳时间
 */
export declare function server_report_async(server_info: IServerReq, manage_ip: string, manage_port: number, tick_time: number): Promise<void>;
/**
 * 定期刷新依赖服务
 * @param server_types
 */
export declare function server_manager_start_async(server_types: string[], manage_ip: string, manage_port: number, tick_time: number): Promise<void>;
/**
 * 向指定服务器，执行HTTP指令
 * @param server_type
 * @param cmd
 * @param params
 * @returns
 */
export declare function post_to_server_async(server_type: string, cmd: string, params: any): Promise<HttpReturn>;
export declare const SERVER_REQUEST: {
    REPORT: string;
    FIND: string;
    ALL: string;
};
export interface IServerReq {
    server_type: string;
    server_id: string;
    tick_time: number;
    http_ip: string;
    http_port: number;
    ws_ip: string;
    ws_port: number;
    load: number;
    memory: string;
}
export interface IServerRes {
    server_id: string;
    http_ip: string;
    http_port: number;
    ws_ip: string;
    ws_port: number;
}
export interface IFindReq {
    server_type: string;
    server_id?: string;
}
export {};
