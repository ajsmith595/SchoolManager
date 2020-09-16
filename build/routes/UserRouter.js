"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_class_1 = __importDefault(require("../classes/User.class"));
const Form_1 = __importDefault(require("../classes/Form"));
const WORKAROUND_1 = require("../classes/WORKAROUND");
const constants_1 = __importDefault(require("../constants"));
const mongodb_1 = require("mongodb");
const functions_1 = __importDefault(require("../functions"));
let UserRouter = express_1.default.Router();
UserRouter.use((req, res, next) => {
    res.locals.User = User_class_1.default;
    next();
});
//#region LoginAndSignup
function requireNotLogin(req, res, next) {
    if (req.Session.Get("User")) {
        res.redirect("/");
    }
    else {
        next();
    }
}
//#region FORMS
const signupForm = Form_1.default.Create([
    {
        name: "FirstName",
        type: "text",
        displayName: "First Name",
        required: true,
        minLength: User_class_1.default.MIN_FIRST_NAME_LENGTH,
        maxLength: User_class_1.default.MAX_FIRST_NAME_LENGTH,
        autocomplete: "given-name",
        regex: {
            pattern: constants_1.default.nameRegex,
            failureString: "This field can only contain characters",
        },
    },
    {
        name: "MiddleNames",
        type: "text",
        displayName: "Middle Name(s)",
        minLength: User_class_1.default.MIN_MIDDLE_NAMES_LENGTH,
        maxLength: User_class_1.default.MAX_MIDDLE_NAMES_LENGTH,
        autocomplete: "additional-name",
        columnSpace: 8,
        regex: {
            pattern: constants_1.default.nameRegex,
            failureString: "This field can only contain characters",
        },
    },
    {
        name: "LastName",
        type: "text",
        displayName: "Last Name",
        required: true,
        minLength: User_class_1.default.MIN_LAST_NAME_LENGTH,
        maxLength: User_class_1.default.MAX_LAST_NAME_LENGTH,
        autocomplete: "family-name",
        regex: {
            pattern: constants_1.default.nameRegex,
            failureString: "This field can only contain characters",
        },
    },
    {
        name: "Email",
        type: "email",
        displayName: "Email",
        required: true,
        minLength: User_class_1.default.MIN_EMAIL_LENGTH,
        maxLength: User_class_1.default.MAX_EMAIL_LENGTH,
        autocomplete: "email",
        columnSpace: 8,
    },
    {
        name: "Address.FirstLine",
        type: "text",
        displayName: "",
    },
    {
        name: "Dob",
        type: "date",
        displayName: "Date of Birth",
        required: true,
    },
    {
        name: "Password",
        type: "password",
        displayName: "Password",
        required: true,
        minLength: User_class_1.default.MIN_PASSWORD_LENGTH,
        maxLength: User_class_1.default.MAX_PASSWORD_LENGTH,
        autocomplete: "new-password",
    },
    {
        name: "PasswordConfirm",
        type: "password",
        displayName: "Confirm Password",
        required: true,
        minLength: User_class_1.default.MIN_PASSWORD_LENGTH,
        maxLength: User_class_1.default.MAX_PASSWORD_LENGTH,
        autocomplete: "new-password",
        mustMatch: "Password",
    },
], "Sign Up", (s) => s + " has already been used for another account");
const loginForm = Form_1.default.Create([
    {
        name: "Email",
        type: "email",
        displayName: "Email",
        required: true,
        minLength: User_class_1.default.MIN_EMAIL_LENGTH,
        maxLength: User_class_1.default.MAX_EMAIL_LENGTH,
        autocomplete: "email",
        columnSpace: 12,
    },
    {
        name: "Password",
        type: "password",
        displayName: "Password",
        required: true,
        minLength: User_class_1.default.MIN_PASSWORD_LENGTH,
        maxLength: User_class_1.default.MAX_PASSWORD_LENGTH,
        autocomplete: "current-password",
        columnSpace: 12,
    },
], "Login", () => "", (s) => `${s} was not found`);
//#endregion FORMS
UserRouter.get("/login", requireNotLogin, (req, res) => {
    res.render("User/Login", { form: loginForm });
});
UserRouter.post("/login", requireNotLogin, async (req, res) => {
    let result = loginForm.Validate(req.body);
    if (result.Errors.length == 0) {
        let user = await User_class_1.default.Login(result.GetField("Email").value || "", result.GetField("Password").value || "");
        if (user instanceof User_class_1.default.UserError) {
            let finalResult = result.FieldsNotExist(["Email"]);
            res.render("User/Login", { form: finalResult });
        }
        else {
            req.Session.Set("User", user);
            res.redirect("/");
        }
    }
    else {
        res.render("User/Login", {
            form: result,
        });
    }
});
UserRouter.get("/signup", requireNotLogin, (req, res) => {
    let form = WORKAROUND_1.Form.GetForm(User_class_1.default, "Create");
    res.render("User/Signup", { form: form });
});
UserRouter.post("/signup", requireNotLogin, async (req, res) => {
    let result = signupForm.Validate(req.body);
    if (result.Errors.length == 0) {
        let user = await User_class_1.default.Create(req.body);
        if (user instanceof mongodb_1.MongoError) {
            let failureFields = Object.keys(functions_1.default.transformObjectToUpperCase(user.keyPattern));
            let finalResult = result.FieldsExist(failureFields);
            res.render("User/Signup", { form: finalResult });
        }
        else {
            req.Session.Set("User", user);
            res.redirect("/");
        }
        res.end();
    }
    else {
        res.render("User/Signup", {
            form: result,
        });
    }
});
//#endregion LoginAndSignup
UserRouter.use((req, res, next) => {
    if (req.Session.Get("User")) {
        next();
    }
    else {
        res.redirect("/");
    }
});
UserRouter.get("/logout", (req, res) => {
    req.Session.Reset();
    res.redirect("/");
});
UserRouter.get("/account", (req, res) => {
    res.render("User/Account");
});
exports.default = UserRouter;
