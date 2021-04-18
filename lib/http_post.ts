import log4js from "common-log4js";
import { basename } from "path";
const logger = log4js.getLogger(basename(__filename));
///////////////////////////////////////////////////////
import http = require("http");


// HTTP 返回数据结构///////////////////////////////////////////////////////////////////////////
export interface HttpReturn {
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
export async function http_post_async(host: string, port: number, path: string, data: any): Promise<HttpReturn> {
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

    let res: HttpReturn = {};
    await new Promise((resolve, reject) => {
        const req = http.request(opt, function (res) {
            res.setEncoding("utf-8");
            res.on("data", function (chunk) {
                resolve(Object.assign(res, JSON.parse(chunk)));
            });
        });

        req.on("error", function (err) {
            res.msg = err.message;
            reject();
        });
        req.write(JSON.stringify(data));
        req.end();
    }).catch(() => { logger.warn(res.msg) });
    return res;
};
