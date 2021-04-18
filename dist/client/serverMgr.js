"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.post_to_server_async = exports.server_manager_start_async = exports.get_server_by_type = void 0;
var common_log4js_1 = require("common-log4js");
var path_1 = require("path");
var logger = common_log4js_1.default.getLogger(path_1.basename(__filename));
///////////////////////////////////////////////////////
var http_post_1 = require("../lib/http_post");
var api_1 = require("./api");
// 依赖服务器信息
var SERVER_MAP_INFO = new Map();
/**
 * 获取指定依赖服务的相关信息
 * @param server_type 游戏依赖服务
 * @returns
 */
function get_server_by_type(server_type) {
    return SERVER_MAP_INFO.get(server_type);
}
exports.get_server_by_type = get_server_by_type;
/**
 * 定期刷新依赖服务
 * @param server_types
 */
function server_manager_start_async(server_types, manage_ip, manage_port, tick_time) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all(server_types.map(function (server_type) { return __awaiter(_this, void 0, void 0, function () {
                        var findreq, server, result;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    findreq = {
                                        server_type: server_type
                                    };
                                    server = SERVER_MAP_INFO.get(server_type);
                                    if (server) {
                                        findreq.server_id = server.server_id;
                                    }
                                    return [4 /*yield*/, http_post_1.http_post_async(manage_ip, manage_port, api_1.SERVER_REQUEST.FIND, findreq)];
                                case 1:
                                    result = _a.sent();
                                    if (result.data) {
                                        SERVER_MAP_INFO.set(server_type, result.data);
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); }))];
                case 1:
                    _a.sent();
                    setTimeout(server_manager_start_async, tick_time, server_types, manage_ip, manage_port, tick_time);
                    return [2 /*return*/];
            }
        });
    });
}
exports.server_manager_start_async = server_manager_start_async;
/**
 * 向指定服务器，执行HTTP指令
 * @param server_type
 * @param cmd
 * @param params
 * @returns
 */
function post_to_server_async(server_type, cmd, params) {
    return __awaiter(this, void 0, void 0, function () {
        var server, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    server = SERVER_MAP_INFO.get(server_type);
                    if (!server) return [3 /*break*/, 2];
                    return [4 /*yield*/, http_post_1.http_post_async(server.http_ip, server.http_port, cmd, params)];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result];
                case 2:
                    logger.warn("该服务器未注册，类型[%s]", server_type);
                    return [2 /*return*/, { code: undefined }];
            }
        });
    });
}
exports.post_to_server_async = post_to_server_async;
