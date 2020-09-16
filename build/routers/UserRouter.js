"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_class_1 = __importDefault(require("../classes/User.class"));
const Form_class_1 = require("../classes/Form.class");
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
let newLoginForm = Form_class_1.Form.GetForm(User_class_1.default, "Login");
UserRouter.get("/login", requireNotLogin, (req, res) => {
    res.render("User/Login", { form: newLoginForm });
});
UserRouter.post("/login", requireNotLogin, async (req, res) => {
    let result = await newLoginForm.Validate(req.body);
    if (result.HasErrors) {
        res.render("User/Login", { form: result });
    }
    else {
        let user = await result.Compile();
        req.Session.Set("User", user);
        res.redirect("/");
    }
});
let newSignupForm = Form_class_1.Form.GetForm(User_class_1.default, "Create");
UserRouter.get("/signup", requireNotLogin, (req, res) => {
    res.render("User/Signup", { form: newSignupForm });
});
UserRouter.post("/signup", requireNotLogin, async (req, res) => {
    let result = await newSignupForm.Validate(req.body);
    if (result.HasErrors) {
        res.render("User/Signup", { form: result });
    }
    else {
        let user = await result.Compile();
        req.Session.Set("User", user);
        res.redirect("/");
    }
    // let result = signupForm.Validate(req.body);
    // if (result.Errors.length == 0) {
    //     let user = await User.Create(req.body);
    //     if (user instanceof MongoError) {
    //         let failureFields = Object.keys(
    //             Functions.transformObjectToUpperCase(
    //                 (user as { [key: string]: any }).keyPattern
    //             )
    //         );
    //         let finalResult = result.FieldsExist(failureFields);
    //         res.render("User/Signup", { form: finalResult });
    //     } else {
    //         req.Session.Set("User", user);
    //         res.redirect("/");
    //     }
    //     res.end();
    // } else {
    //     res.render("User/Signup", {
    //         form: result,
    //     });
    // }
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
