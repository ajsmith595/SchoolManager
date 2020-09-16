import express, { NextFunction, Response, Request } from "express";
import User from "../classes/User.class";
import functions from "../functions";
import { Form } from "../classes/Form.class";
import constants from "../constants";
import { mongoose } from "@typegoose/typegoose";
import { MongoError } from "mongodb";
import Functions from "../functions";
import HTTPError from "../classes/HTTPError.class";
import { MutableKeys } from "../classes/TestType";
let UserRouter = express.Router();

UserRouter.use((req, res, next) => {
    res.locals.User = User;
    next();
});

//#region LoginAndSignup
function requireNotLogin(req: Request, res: Response, next: NextFunction) {
    if (req.Session.Get("User")) {
        res.redirect("/");
    } else {
        next();
    }
}

let newLoginForm = Form.GetForm(User, "Login");
UserRouter.get("/login", requireNotLogin, (req, res) => {
    res.render("User/Login", { form: newLoginForm });
});
UserRouter.post("/login", requireNotLogin, async (req, res) => {
    let result = await newLoginForm.Validate(req.body);
    if (result.HasErrors) {
        res.render("User/Login", { form: result });
    } else {
        let user: User = await result.Compile();
        req.Session.Set("User", user);
        res.redirect("/");
    }
});

let newSignupForm = Form.GetForm(User, "Create");
UserRouter.get("/signup", requireNotLogin, (req, res) => {
    res.render("User/Signup", { form: newSignupForm });
});
UserRouter.post("/signup", requireNotLogin, async (req, res) => {
    let result = await newSignupForm.Validate(req.body);
    if (result.HasErrors) {
        res.render("User/Signup", { form: result });
    } else {
        let user: User = await result.Compile();
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
    } else {
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

export default UserRouter;
