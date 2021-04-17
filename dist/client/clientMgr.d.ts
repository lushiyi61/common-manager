import { IServerReq } from "./api";
/**
 * 更新本服务负载
 * @param load
 */
export declare function server_update_load(load: number): Promise<void>;
/**
 * 上报本服务
 * @param server_info 本服务信息
 * @param manage_ip 管理服务器IP
 * @param manage_port 管理服务器端口
 * @param tick_time 心跳时间
 */
export declare function server_report_async(server_info: IServerReq, manage_ip: string, manage_port: number, tick_time: number): Promise<void>;
