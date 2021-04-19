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
    server_type: string,
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