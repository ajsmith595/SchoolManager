"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Group_class_1 = require("./Group.class");
class Class extends Group_class_1.Group {
    constructor(id, admins, otherMembers) {
        super(id, admins, otherMembers);
        this.admins = admins;
        this.otherMembers = otherMembers;
    }
}
exports.default = Class;
