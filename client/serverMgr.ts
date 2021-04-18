import log4js from "common-log4js";
import { basename } from "path";
const logger = log4js.getLogger(basename(__filename));
///////////////////////////////////////////////////////
import { HttpReturn, http_post_async } from "../lib/http_post";
import { IFindReq, IServerRes, SERVER_REQUEST } from "./api";


// 依赖服务器信息
const SERVER_MAP_INFO: Map<string, IServerRes> = new Map();

/**
 * 获取指定依赖服务的相关信息
 * @param server_type 游戏依赖服务
 * @returns 
 */
export function get_server_by_type(server_type: string): IServerRes | undefined {
    return SERVER_MAP_INFO.get(server_type);
}

/**
 * 定期刷新依赖服务
 * @param server_types 
 */
export async function server_manager_start_async(server_types: string[], manage_ip: string, manage_port: number, tick_time: number) {
    await Promise.all(
        server_types.map(async server_type => {
            const findreq: IFindReq = {
                server_type
            }

            const server = SERVER_MAP_INFO.get(server_type);
            if (server) {
                findreq.server_id = server.server_id;
            }

            const result: HttpReturn = await http_post_async(
                manage_ip,
                manage_port,
                SERVER_REQUEST.FIND,
                findreq
            )
            if (result.data) {
                SERVER_MAP_INFO.set(server_type, result.data);
            }
        })
    )
    setTimeout(server_manager_start_async, tick_time, server_types, manage_ip, manage_port, tick_time);
}

/**
 * 向指定服务器，执行HTTP指令
 * @param server_type 
 * @param cmd 
 * @param params 
 * @returns 
 */
export async function post_to_server_async(server_type: string, cmd: string, params: any): Promise<HttpReturn> {
    const server = SERVER_MAP_INFO.get(server_type);
    if (server) {
        const result: HttpReturn = await http_post_async(
            server.http_ip,
            server.http_port,
            cmd,
            params
        )
        return result;
    }
    logger.warn("该服务器未注册，类型[%s]", server_type);
    return { code: undefined }
}