"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Form_class_1 = require("../classes/Form.class");
const School_class_1 = __importDefault(require("../classes/School.class"));
let SchoolRouter = express_1.default.Router();
SchoolRouter.get("/", (req, res) => {
    res.render("School/List");
});
const SchoolCreateForm = Form_class_1.Form.GetForm(School_class_1.default);
SchoolRouter.get("/create", (req, res) => {
    res.render("School/Create", {
        form: SchoolCreateForm,
    });
});
exports.default = SchoolRouter;
