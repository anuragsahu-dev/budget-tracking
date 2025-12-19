"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const winston_1 = require("winston");
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const config_1 = require("./config");
const logDir = node_path_1.default.join(process.cwd(), "logs");
if (!node_fs_1.default.existsSync(logDir)) {
    node_fs_1.default.mkdirSync(logDir, { recursive: true });
}
const logLevel = config_1.config.server.nodeEnv === "production" ? "info" : "debug";
const fileFormat = winston_1.format.combine(winston_1.format.errors({ stack: true }), winston_1.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.format.json());
const consoleFormat = winston_1.format.combine(winston_1.format.colorize(), winston_1.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.format.simple());
const infoFileRotate = new winston_daily_rotate_file_1.default({
    level: logLevel,
    filename: node_path_1.default.join(logDir, "app-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    handleExceptions: true,
    maxSize: "20m",
    maxFiles: "14d",
    format: fileFormat,
});
const errorFileRotate = new winston_daily_rotate_file_1.default({
    level: "error",
    filename: node_path_1.default.join(logDir, "error-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    handleExceptions: true,
    maxSize: "20m",
    maxFiles: "21d",
    format: fileFormat,
});
const transportsList = [infoFileRotate, errorFileRotate];
if (config_1.config.server.nodeEnv === "production") {
    transportsList.push(new winston_1.transports.Console({
        level: "info",
        format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json()),
    }));
}
else {
    transportsList.push(new winston_1.transports.Console({
        level: "debug",
        format: consoleFormat,
        handleExceptions: true,
    }));
}
const logger = (0, winston_1.createLogger)({
    level: logLevel,
    format: fileFormat,
    transports: transportsList,
    exceptionHandlers: [errorFileRotate],
    rejectionHandlers: [errorFileRotate],
    exitOnError: false,
});
exports.default = logger;
