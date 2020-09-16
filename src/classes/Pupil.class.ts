// import User from "./User.class";
// import School from "./School.class";
// import { mongoose } from "@typegoose/typegoose";

import User from "./User.class";

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
export default class Pupil extends User {}
