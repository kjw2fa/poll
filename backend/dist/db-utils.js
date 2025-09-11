"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbRun = exports.dbAll = exports.dbGet = void 0;
const database_1 = __importDefault(require("./database"));
function dbGet(sql, params) {
    return new Promise((resolve, reject) => {
        database_1.default.get(sql, params, (err, row) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(row);
            }
        });
    });
}
exports.dbGet = dbGet;
function dbAll(sql, params) {
    return new Promise((resolve, reject) => {
        database_1.default.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(rows);
            }
        });
    });
}
exports.dbAll = dbAll;
function dbRun(sql, params) {
    return new Promise((resolve, reject) => {
        database_1.default.run(sql, params, function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve(this);
            }
        });
    });
}
exports.dbRun = dbRun;
