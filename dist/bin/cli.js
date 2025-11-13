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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = run;
const command_line_args_1 = __importDefault(require("command-line-args"));
const command_line_usage_1 = __importDefault(require("command-line-usage"));
const Logger_1 = __importDefault(require("../Logger"));
const UploadBrowserCommand_1 = __importDefault(require("../commands/UploadBrowserCommand"));
const UploadReactNativeCommand_1 = __importDefault(require("../commands/UploadReactNativeCommand"));
const UploadNodeCommand_1 = __importDefault(require("../commands/UploadNodeCommand"));
const package_json_1 = require("../../package.json");
const topLevelDefs = [
    {
        name: 'command',
        defaultOption: true
    },
    {
        name: 'help',
        alias: 'h',
        type: Boolean,
        description: 'show this message'
    },
    {
        name: 'version',
        type: Boolean,
        description: 'output the version of the CLI module'
    }
];
function run(argv) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const opts = (0, command_line_args_1.default)(topLevelDefs, { argv, stopAtFirstUnknown: true });
            if (opts.version) {
                return console.log(`@bugsnag/source-maps v${package_json_1.version}`);
            }
            switch (opts.command) {
                case 'upload-browser':
                    yield (0, UploadBrowserCommand_1.default)(opts._unknown || [], opts);
                    break;
                case 'upload-node':
                    yield (0, UploadNodeCommand_1.default)(opts._unknown || [], opts);
                    break;
                case 'upload-react-native':
                    yield (0, UploadReactNativeCommand_1.default)(opts._unknown || [], opts);
                    break;
                default:
                    if (opts.help)
                        return usage();
                    if (opts.command) {
                        Logger_1.default.error(`Unrecognized command "${opts.command}".`);
                    }
                    else {
                        Logger_1.default.error(`Command expected, nothing provided.`);
                    }
                    usage();
            }
        }
        catch (e) {
            Logger_1.default.error(`Invalid options. ${e.message}`);
            process.exitCode = 1;
        }
    });
}
function usage() {
    console.log((0, command_line_usage_1.default)([
        { content: 'bugsnag-source-maps <command>' },
        { header: 'Available commands', content: 'upload-browser\nupload-node\nupload-react-native' },
        { header: 'Options', optionList: topLevelDefs, hide: ['command'] }
    ]));
}
//# sourceMappingURL=cli.js.map