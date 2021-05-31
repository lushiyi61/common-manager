import log4js from "common-log4js";
import { basename } from "path";
const logger = log4js.getLogger(basename(__filename));
///////////////////////////////////////////////////////
import { http_post_async } from "../lib/http_post";
import { IServerReq, SERVER_REQUEST } from "./api";


// 本服务器信息
const SERVER_INFO: IServerReq = {
    server_type: "",
    server_id: "",
    tick_time: 0,
    http_ip: "",
    http_port: 0,
    ws_ip: "",
    ws_port: 0,
    load: 0,
    memory: "",
    remark: "",
};

/**
 * 更新本服务负载
 * @param load 
 */
export async function server_update_load(load: number) {
    SERVER_INFO.load = load;
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
            logger.warn("cann't connect to manage server. ip:[%s] port:[%s] ", manage_ip, manage_port);
        }
    }
    setTimeout(create_async, tick_time, manage_ip, manage_port, tick_time);
}

function mem_format(bytes: number) {
    return (bytes / 1024 / 1024).toFixed(2) + 'MB';
};


