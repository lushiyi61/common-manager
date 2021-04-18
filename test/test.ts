import log4js from "common-log4js";
import { basename } from "path";
const logger = log4js.getLogger(basename(__filename));
///////////////////////////////////////////////////////
import { get_server_by_type, server_manager_start_async } from "../client/serverMgr";

const HALL = "HALL-SERVER";
(async () => {
    await server_manager_start_async([
        HALL
    ], "127.0.0.1", 9000, 50000);
    logger.info("==========================程序 启动 完毕==========================");

    logger.debug(get_server_by_type(HALL))
})()
