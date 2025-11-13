"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequiredStrings = validateRequiredStrings;
exports.validateOptionalStrings = validateOptionalStrings;
exports.validateBooleans = validateBooleans;
exports.validateObjects = validateObjects;
exports.validateNoUnknownArgs = validateNoUnknownArgs;
function validateRequiredStrings(opts, keys) {
    // required strings
    for (const requiredString of keys) {
        if (typeof opts[requiredString] !== 'string' || opts[requiredString].length === 0) {
            throw new Error(`${requiredString} is required and must be a string`);
        }
    }
}
function validateOptionalStrings(opts, keys) {
    for (const optionalString of keys) {
        if (typeof opts[optionalString] !== 'undefined') {
            if (typeof opts[optionalString] !== 'string' || opts[optionalString].length === 0) {
                throw new Error(`${optionalString} must be a string`);
            }
        }
    }
}
function validateBooleans(opts, keys) {
    for (const bool of keys) {
        if (typeof opts[bool] !== 'boolean') {
            throw new Error(`${bool} must be true or false`);
        }
    }
}
function validateObjects(opts, keys) {
    for (const obj of keys) {
        if (typeof opts[obj] !== 'object' || !opts[obj]) {
            throw new Error(`${obj} must be an object`);
        }
    }
}
function validateNoUnknownArgs(unknownArgs) {
    if (Object.keys(unknownArgs).length > 0) {
        throw new Error(`Unrecognized option(s): ${Object.keys(unknownArgs).join(', ')}`);
    }
}
//# sourceMappingURL=InputValidators.js.map