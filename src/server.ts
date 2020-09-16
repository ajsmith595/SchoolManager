require("dotenv").config();

import express, { Request, Response } from "express";
import path from "path";
import User from "./classes/User.class";
import session from "express-session";
import bodyParser from "body-parser";
import functions from "./functions";
import UserRouter from "./routers/UserRouter";
import SchoolRouter from "./routers/SchoolRouter";
import {
    mongoose,
    prop,
    getModelForClass,
    isRefType,
} from "@typegoose/typegoose";
import HTTPError from "./classes/HTTPError.class";
import SessionManager from "./classes/SessionManager.class";
import Address from "./classes/Address.class";
// import Form from "./classes/Form.class";
import { Form } from "./classes/Form.class";

// console.log(JSON.stringify(Form.Metadata, null, 4));
// let service = Form.GetForm(User);
// console.log(JSON.stringify(service, null, 4));
// console.log(Form.Get("User/Login"));

let minifier = require("express-minify-html-2");

require("ejs").rmWhitespace = true;
const app = express();

app.use(
    minifier({
        override: true,
        htmlMinifier: {
            removeComments: true,
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            removeAttributeQuotes: true,
            removeEmptyAttributes: true,
            minifyJS: true,
        },
    })
);

mongoose.connect("mongodb://localhost:27017/schoolmanager", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(
    session({
        secret: "twd",
        saveUninitialized: true,
        resave: false,
    })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/../public")));

app.use((req, res, next) => {
    req.Session = SessionManager.Get(req.session!.id);
    res.locals.currentUser = req.Session.Get("User") || null;

    let urlString = req.url.replace(/\/\/+/, "/");
    console.log(urlString);
    if (urlString.endsWith("/")) {
        urlString = urlString.substr(0, urlString.length - 1);
    }
    console.log(urlString);
    let urlParts = urlString.split("/");
    while (urlParts[urlParts.length - 1] == "" && urlParts.length > 0) {
        urlParts.splice(0, 1);
    }
    let siblingURL: string;
    let subURL: string;
    if (urlParts.length <= 2) {
        siblingURL = "/";
    } else {
        siblingURL = urlParts.slice(0, urlParts.length - 1).join("/") + "/";
    }
    if (urlParts.length <= 1) {
        subURL = "/";
    } else {
        subURL = urlParts.join("/") + "/";
    }

    res.locals.siblingURL = (str: string) => {
        while (str.startsWith("/")) {
            str = str.substr(1);
        }
        return siblingURL + str;
    };
    res.locals.subURL = (str: string) => {
        while (str.startsWith("/")) {
            str = str.substr(1);
        }
        return subURL + str;
    };

    next();
});

EJSSetup: {
    app.set("view engine", "ejs");
    app.engine("ejs", require("ejs-mate"));
    app.set("views", path.join(__dirname, "/../views"));
    app.locals._layoutFile = "Layouts/Main"; // Default

    FunctionSetup: {
        app.locals.dateFormat = require("dateformat");
        app.locals.cssFile = function (href: string) {
            this.block("styles").append(
                `<link rel="stylesheet" type="text/css" href="${href}">`
            );
        };
        app.locals.jsFile = function (src: string, module: boolean = false) {
            let moduleStr = module ? 'type="module"' : "";
            this.block("scripts").append(
                `<script ${moduleStr} src="${src}"></script>`
            );
        };
        app.locals.cssFileFirst = function (href: string) {
            this.block("styles").prepend(
                `<link rel="stylesheet" type="text/css" href="${href}">`
            );
        };
        app.locals.jsFileFirst = function (
            src: string,
            module: boolean = false
        ) {
            let moduleStr = module ? 'type="module"' : "";
            this.block("scripts").prepend(
                `<script ${moduleStr} src="${src}"></script>`
            );
        };
        app.locals.title = function (title: string) {
            this.block("title").replace(title);
        };
        app.locals.setActiveNavbar = function (url: string) {
            this.block("navbar-active").replace(url);
        };
        // app.locals.require = function (url: string) {
        //     console.log(this);
        //     return require(url);
        // };
        // app.locals.__dirname = __dirname;
        // app.locals.createInput = function(name: string, type: string = "text", required: boolean = false, class:string = "", id: string = "", minLength: number = 0, maxLength: number = 0, min: number = 0, max: number = 0) {
        app.locals.createElement = function (
            elmt: string,
            options?: {
                [prop: string]: any;
            },
            innerHTML: string = ""
        ) {
            let props = "";
            for (let prop in options) {
                props += `${prop}="${options[prop]}" `;
            }
            let str = `<${elmt} ${props}>`;
            if (!["input", "img"].includes(elmt.toLowerCase())) {
                str += `${innerHTML}</${elmt}>`;
            }
            return str;
        };
    }
}

app.get("/", (req, res) => {
    if (req.Session.Get("User")) {
        res.render("Index");
    } else {
        res.redirect("/login");
    }
});
app.get("/login", (req, res) => {
    res.redirect("/user/login");
});
app.get("/signup", (req, res) => {
    res.redirect("/user/signup");
});
app.get("/logout", (req, res) => {
    res.redirect("/user/logout");
});
app.get("/account", (req, res) => {
    res.redirect("/user/account");
});

app.use("/user", UserRouter);
app.use("/school", SchoolRouter);

// app.get("*", (req, res) => {
//     res.send("hey");
//     res.end();
// });
app.use((req, res, next) => {
    next(new HTTPError(404));
});
app.use((err: Error, req: Request, res: Response, next: () => void) => {
    if (!(err instanceof HTTPError)) {
        // Log the error
        console.log(`Error occured: ${err.stack}`);
        err = new HTTPError(500);
    }
    res.status((err as HTTPError).code);
    res.render("Error", { error: err });
});
app.listen(process.env.PORT, () => {
    console.log("Running: http://localhost:" + process.env.PORT);
});
