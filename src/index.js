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
exports.__esModule = true;
exports.runner = exports.updater = exports.builder = exports.cleaner = exports.Greeter = exports.exec = void 0;
var fs = require("fs");
var config = require("../config");
var execSync = require("child_process");
var callback = function (err) {
    if (err) {
        return console.error(err);
    }
    console.log("Success!");
};
var exec = function (command) {
    var value = execSync.execSync(command, { encoding: 'utf-8' });
    return value;
};
exports.exec = exec;
var Greeter = function (name) { return "Hello ".concat(name, "."); };
exports.Greeter = Greeter;
// cleaner is working
var cleaner = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        /*
          clears all tests folder
        */
        fs.rmdirSync(config.testsFolderPath, { recursive: true });
        // fs.mkdirSync(path.join(__dirname, config.testsFolderPath));
        fs.mkdirSync(config.testsFolderPath);
        return [2 /*return*/];
    });
}); };
exports.cleaner = cleaner;
var builder = function () {
    /*
      builds test files on "__tests__" folder based on controllers
      for each controller:
        1. checks all requests
        2. creates test file
        3. imports all dependencies and related repositories to test file
        4. creates a before() and after()
        5. creates models data on before
        6. deletes models data on after
        7. writes tests
    */
    // let's break things apart
    // 1st lets try to create the basic test file using:
    // - controller name; - test to write; - model to check; - repositories to check;
    var controller = 'todo';
    var newTest = "\
  import { Greeter } from '../src/index';\r\n\n\
  test('My Greeter', () => {\r\n\
    expect(Greeter('Carl')).toBe('Hello Carl');\r\n\
  });";
    var createFile = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            fs.writeFile("".concat(config.testsFolderPath, "/").concat(controller, ".acceptance.ts"), newTest, callback);
            return [2 /*return*/];
        });
    }); };
    /////////////////
    createFile();
    return;
};
exports.builder = builder;
var updater = function () {
    /*
      recreates test files on "__tests__" folder based on controllers
    */
    (0, exports.cleaner)();
    (0, exports.builder)();
    return "All test files have been recreated.";
};
exports.updater = updater;
var runner = function () {
    /*
      runs tests
    */
    (0, exports.exec)('npm test');
    return;
};
exports.runner = runner;
// const greetings = Greeter("Pedro");
// console.log(greetings);
// const folder = exec('pwd');
// console.log("Current folder: "+folder);
// const output = exec('ls');
// console.log("Folder files: ", output);
var isIt = (0, exports.updater)();
// runner();
