"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const express_session_1 = __importDefault(require("express-session"));
const body_parser_1 = __importDefault(require("body-parser"));
const UserRouter_1 = __importDefault(require("./routes/UserRouter"));
const typegoose_1 = require("@typegoose/typegoose");
const HTTPError_class_1 = __importDefault(require("./classes/HTTPError.class"));
const SessionManager_class_1 = __importDefault(require("./classes/SessionManager.class"));
require("ejs").rmWhitespace = true;
const app = express_1.default();
typegoose_1.mongoose.connect("mongodb://localhost:27017/schoolmanager", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
app.use(express_session_1.default({
    secret: "twd",
    saveUninitialized: true,
    resave: false,
}));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static(path_1.default.join(__dirname, "/../public")));
app.use((req, res, next) => {
    req.Session = SessionManager_class_1.default.Get(req.session.id);
    res.locals.currentUser = req.Session.Get("User") || null;
    next();
});
EJSSetup: {
    app.set("view engine", "ejs");
    app.engine("ejs", require("ejs-mate"));
    app.set("views", path_1.default.join(__dirname, "/../views"));
    app.locals._layoutFile = "Layouts/Main"; // Default
    FunctionSetup: {
        app.locals.dateFormat = require("dateformat");
        app.locals.cssFile = function (href) {
            this.block("styles").append(`<link rel="stylesheet" type="text/css" href="${href}">`);
        };
        app.locals.jsFile = function (src, module = false) {
            let moduleStr = module ? 'type="module"' : "";
            this.block("scripts").append(`<script ${moduleStr} src="${src}"></script>`);
        };
        app.locals.cssFileFirst = function (href) {
            this.block("styles").prepend(`<link rel="stylesheet" type="text/css" href="${href}">`);
        };
        app.locals.jsFileFirst = function (src, module = false) {
            let moduleStr = module ? 'type="module"' : "";
            this.block("scripts").prepend(`<script ${moduleStr} src="${src}"></script>`);
        };
        app.locals.title = function (title) {
            this.block("title").replace(title);
        };
        app.locals.setActiveNavbar = function (url) {
            this.block("navbar-active").replace(url);
        };
        // app.locals.require = function (url: string) {
        //     console.log(this);
        //     return require(url);
        // };
        // app.locals.__dirname = __dirname;
        // app.locals.createInput = function(name: string, type: string = "text", required: boolean = false, class:string = "", id: string = "", minLength: number = 0, maxLength: number = 0, min: number = 0, max: number = 0) {
        app.locals.createElement = function (elmt, options, innerHTML = "") {
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
    }
    else {
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
app.use("/user", UserRouter_1.default);
// app.get("*", (req, res) => {
//     res.send("hey");
//     res.end();
// });
app.use((req, res, next) => {
    next(new HTTPError_class_1.default(404));
});
app.use((err, req, res, next) => {
    if (!(err instanceof HTTPError_class_1.default)) {
        // Log the error
        console.log(`Error occured: ${err.stack}`);
        err = new HTTPError_class_1.default(500);
    }
    res.status(err.code);
    res.render("Error", { error: err });
});
app.listen(process.env.PORT, () => {
    console.log("Running: http://localhost:" + process.env.PORT);
});
