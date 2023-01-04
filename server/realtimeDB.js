"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rtdb = void 0;
const app_1 = __importDefault(require("firebase/compat/app"));
/* importarlo en su totalidad para no pasar por archivos ts  */
require("firebase/compat/auth");
require("firebase/compat/database");
const app = app_1.default.initializeApp({
    apiKey: "MVIpodUmTmMef3RtGPtncNLY4cieR7pUaH8yYPFG",
    databaseURL: "https://clase-firebase-e7501-default-rtdb.firebaseio.com",
    authDomain: "clase-firebase.firebaseapp.com",
    projectId: "clase-firebase-e7501",
});
const rtdb = app_1.default.database();
exports.rtdb = rtdb;
