"use strict";
// import User from "./User.class";
// import School from "./School.class";
// import { mongoose } from "@typegoose/typegoose";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_class_1 = __importDefault(require("./User.class"));
// export default class Pupil extends User {
//     protected _id: mongoose.Types.ObjectId;
//     protected preferredFirstName: string;
//     protected schoolId: string;
//     constructor(
//         id: mongoose.Types.ObjectId,
//         userID: mongoose.Types.ObjectId,
//         preferredFirstName: string,
//         schoolId: string
//     ) {
//         this.preferredFirstName = preferredFirstName;
//         this.schoolId = schoolId;
//     }
//     public get School() {
//         return School.Get(this.schoolId);
//     }
//     public static get(id: string) {}
// }
class Pupil extends User_class_1.default {
}
exports.default = Pupil;
