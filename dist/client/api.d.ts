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
    remark: string;
}
export interface IServerRes {
    server_type: string;
    server_id: string;
    http_ip: string;
    http_port: number;
    ws_ip: string;
    ws_port: number;
    remark: string;
}
export interface IFindReq {
    server_type: string;
    server_id?: string;
}
