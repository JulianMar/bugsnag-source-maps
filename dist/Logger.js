"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.noopLogger = void 0;
const consola_1 = __importDefault(require("consola"));
const consola_2 = require("consola");
exports.default = consola_1.default;
consola_1.default.level = consola_2.LogLevels.debug;
exports.noopLogger = {
    trace: () => { },
    debug: () => { },
    info: () => { },
    success: () => { },
    warn: () => { },
    error: () => { },
    fatal: () => { },
    level: -1
};
//# sourceMappingURL=Logger.js.map