"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
var Constants_1 = require("./Constants");
var utils_1 = require("./utils");
var domain = require("domain");
var domainContext = require("domain-context");
var completedTasks_1 = require("./completedTasks");
function wait(task) {
    return __awaiter(this, void 0, void 0, function () {
        var taskHashCode, completedTasksKey, _completedTasks, completedTaskIndex, state_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    taskHashCode = utils_1.getHashCode(task.toString());
                    if (!utils_1.isNode()) {
                        completedTasksKey = "completedTasks";
                        _completedTasks = window[completedTasksKey];
                        if (_completedTasks) {
                            completedTaskIndex = _completedTasks.indexOf(taskHashCode);
                            if (completedTaskIndex > -1) {
                                _completedTasks.splice(completedTaskIndex, 1);
                                window[completedTasksKey] = _completedTasks;
                                return [2];
                            }
                        }
                        else {
                            console.log("domain-wait: Array \"window." + completedTasksKey + "\" not defined. Please define it to use the \"wait\" method. This will prevent fething your data twice.");
                        }
                    }
                    if (!!utils_1.isNode()) return [3, 2];
                    return [4, task(utils_1.transformUrl)];
                case 1:
                    _a.sent();
                    return [2];
                case 2:
                    if (!(task && domain.active)) return [3, 6];
                    state_1 = domainContext.get(Constants_1.domainTasksStateKey);
                    if (!state_1) return [3, 6];
                    state_1.numRemainingTasks++;
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4, task(utils_1.transformUrl)];
                case 4:
                    _a.sent();
                    if (completedTasks_1.completedTasks.indexOf(taskHashCode) === -1) {
                        completedTasks_1.completedTasks.push(taskHashCode);
                    }
                    setTimeout(function () {
                        state_1.numRemainingTasks--;
                        if (state_1.numRemainingTasks === 0 && !state_1.hasIssuedSuccessCallback) {
                            state_1.hasIssuedSuccessCallback = true;
                            setTimeout(function () {
                                state_1.completionCallback(null);
                            }, 0);
                        }
                    }, 0);
                    return [3, 6];
                case 5:
                    error_1 = _a.sent();
                    state_1.completionCallback(error_1);
                    return [3, 6];
                case 6: return [2];
            }
        });
    });
}
exports.wait = wait;
//# sourceMappingURL=wait.js.map