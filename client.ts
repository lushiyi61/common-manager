import log4js from "common-log4js";
import { basename } from "path";
const logger = log4js.getLogger(basename(__filename));
///////////////////////////////////////////////////////
import http = require("http");

// 依赖服务器信息
const SERVER_MAP_INFO: Map<string, IServerRes> = new Map();
// 本服务器信息
const SERVER_INFO: IServerReq = { server_type: "", server_id: "", tick_time: 0, http_ip: "", http_port: 0, ws_ip: "", ws_port: 0, load: 0, memory: "" };


/**
 * 更新本服务负载
 * @param load 
 */
export async function server_update_load(load: number) {
    SERVER_INFO.load = load;
}

// HTTP 返回数据结构///////////////////////////////////////////////////////////////////////////
interface HttpReturn {
    code?: string,
    msg?: string,
    data?: any,
}

/**
 * HTTP post 请求接口
 * @param host 
 * @param port 
 * @param path 
 * @param data 
 * @returns 
 */
async function http_post_async(host: string, port: number, path: string, data: any): Promise<HttpReturn> {
    // logger.debug(JSON.stringify(data).length);
    const opt = {
        host,
        port,
        path,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    };

    return new Promise((resolve, reject) => {
        const req = http.request(opt, function (res) {
            res.setEncoding("utf-8");
            res.on("data", function (chunk) {
                resolve(JSON.parse(chunk));
            });
        });

        req.on("error", function (err) {
            logger.warn(err.message);
            reject({ code: undefined });
        });
        req.write(JSON.stringify(data));
        req.end();
    })
};



/////////////////////////////////////////////////////////////////////////////////////////////
/**
 * 获取指定依赖服务的相关信息
 * @param server_type 游戏依赖服务
 * @returns 
 */
export function get_server_by_type(server_type: string): IServerRes | undefined {
    return SERVER_MAP_INFO.get(server_type);
}

/**
 * 上报本服务
 * @param server_info 本服务信息
 * @param manage_ip 管理服务器IP
 * @param manage_port 管理服务器端口
 * @param tick_time 心跳时间
 */
export async function server_report_async(server_info: IServerReq, manage_ip: string, manage_port: number, tick_time: number) {
    Object.assign(SERVER_INFO, server_info);
    await create_async(manage_ip, manage_port, tick_time);
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

/**
 * 心跳
 * @param manage_ip 管理服务端IP
 * @param manage_port 管理服务端端口
 * @param tick_time 
 */
async function create_async(manage_ip: string, manage_port: number, tick_time: number) {
    const now = Date.now();
    if (now > SERVER_INFO.tick_time + tick_time) {
        SERVER_INFO.tick_time = now;
        const mem = process.memoryUsage();
        SERVER_INFO.memory = JSON.stringify({
            heapTotal: mem_format(mem.heapTotal),
            heapUsed: mem_format(mem.heapUsed),
            rss: mem_format(mem.rss)
        })
        // logger.debug("load:%s memory:%s", SERVER_INFO.load, SERVER_INFO.memory);
        try {
            await http_post_async(manage_ip, manage_port, SERVER_REQUEST.REPORT, SERVER_INFO);
        } catch (error) {
            logger.warn("cann't connect to find server. ip:[%s] port:[%s] ", manage_ip, manage_port);
        }
    }
    setTimeout(create_async, tick_time, manage_ip, manage_port, tick_time);
}

function mem_format(bytes: number) {
    return (bytes / 1024 / 1024).toFixed(2) + 'MB';
};


///////////////////////////////////////////////////////////////////////////////////////
export const SERVER_REQUEST = {
    REPORT: "/report",
    FIND: "/find",
    ALL: "/all"
}


export interface IServerReq {
    server_type: string,    // 服务类型/名称
    server_id: string,      // 服务ID
    tick_time: number;      // 心跳时间
    http_ip: string,
    http_port: number,
    ws_ip: string,
    ws_port: number,
    load: number,           // 负载
    memory: string,         // JSON 字符串
}

export interface IServerRes {
    server_id: string,      // 服务ID
    http_ip: string,
    http_port: number,
    ws_ip: string,
    ws_port: number,
}


export interface IFindReq {
    server_type: string;
    server_id?: string;
}