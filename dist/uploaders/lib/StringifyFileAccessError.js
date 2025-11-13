"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = stringifyFileAccessError;
function stringifyFileAccessError(e) {
    switch (e.code) {
        case 'ENOENT':
            return `No file exists at the provided path.`;
            break;
        case 'EISDIR':
            return `The path contained a directory, not a file.`;
            break;
        case 'EACCES':
            return `This process did not have sufficient permissions to read the file.`;
            break;
        default:
            return `Tried at the following location.`;
    }
}
//# sourceMappingURL=StringifyFileAccessError.js.map