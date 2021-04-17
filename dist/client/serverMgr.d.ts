import { HttpReturn } from "../lib/http_post";
import { IServerRes } from "./api";
/**
 * 获取指定依赖服务的相关信息
 * @param server_type 游戏依赖服务
 * @returns
 */
export declare function get_server_by_type(server_type: string): IServerRes | undefined;
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
