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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = detectAppVersion;
const read_package_up_1 = require("read-package-up");
function detectAppVersion(projectRoot, logger) {
    return __awaiter(this, void 0, void 0, function* () {
        const pkg = yield (0, read_package_up_1.readPackageUp)({ cwd: projectRoot });
        const version = pkg === null || pkg === void 0 ? void 0 : pkg.packageJson.version;
        if (!version) {
            throw new Error('Unable to automatically detect app version. Provide the "--app-version" argument or add a "version" key to your package.json file.');
        }
        logger.debug(`Detected appVersion "${version}"`);
        return version;
    });
}
//# sourceMappingURL=DetectAppVersion.js.map