"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var User_class_1 = __importDefault(require("../classes/User.class"));
var functions_1 = __importDefault(require("../functions"));
var Form_1 = __importDefault(require("../classes/Form"));
var router = express_1.default.Router();
var USER_LOGIN_FIELDS = ["email", "password"];
var USER_SIGNUP_FIELDS = [
    "firstName",
    "middleNames",
    "lastName",
    "username",
    "email",
    "dob",
    "password",
    "passwordConfirm",
];
router.use(function (req, res, next) {
    res.locals.User = User_class_1.default;
});
var loginForm = new Form_1.default([
    {
        name: "firstName",
        type: "text",
        displayName: "First Name",
        required: true,
        minLength: User_class_1.default.MIN_FIRST_NAME_LENGTH,
        maxLength: User_class_1.default.MAX_FIRST_NAME_LENGTH,
        autocomplete: "given-name",
    },
]);
router.get("/login", function (req, res) {
    res.render("User/Login");
});
router.post("/login", function (req, res) {
    if (functions_1.default.verifyFormPost(req, res, USER_LOGIN_FIELDS)) {
        // Login
    }
    else {
        res.render("User/Login", {
            missingFields: functions_1.default.getMissingFormFields(req, res, USER_LOGIN_FIELDS),
        });
    }
});
router.get("/signup", function (req, res) {
    res.render("User/Signup", { form: loginForm.Display() });
});
router.post("/signup", function (req, res) {
    if (functions_1.default.verifyFormPost(req, res, USER_SIGNUP_FIELDS)) {
        // Login and redirect
    }
    else {
        res.render("User/Signup", {
            missingFields: functions_1.default.getMissingFormFields(req, res, USER_SIGNUP_FIELDS),
        });
    }
});
exports.default = router;
