"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TargetType = exports.PermissionType = void 0;
var PermissionType;
(function (PermissionType) {
    PermissionType["Edit"] = "EDIT";
    PermissionType["View"] = "VIEW";
    PermissionType["Vote"] = "VOTE";
})(PermissionType = exports.PermissionType || (exports.PermissionType = {}));
var TargetType;
(function (TargetType) {
    TargetType["Public"] = "PUBLIC";
    TargetType["User"] = "USER";
})(TargetType = exports.TargetType || (exports.TargetType = {}));
