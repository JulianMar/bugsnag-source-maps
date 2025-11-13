"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = parseSourceMap;
function parseSourceMap(sourceMapContent, sourceMapPath, logger) {
    try {
        return JSON.parse(sourceMapContent);
    }
    catch (e) {
        logger.error(`The source map was not valid JSON.\n\n  "${sourceMapPath}"`);
        throw e;
    }
}
//# sourceMappingURL=ParseSourceMap.js.map