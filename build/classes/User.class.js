"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const typegoose_1 = require("@typegoose/typegoose");
const functions_1 = __importDefault(require("../functions"));
const Address_class_1 = __importDefault(require("./Address.class"));
const Form_class_1 = require("./Form.class");
// @Form.FormClass
let User = /** @class */ (() => {
    var User_1;
    let User = User_1 = class User {
        constructor(userObj) {
            let { email, dob, firstName, middleNames, lastName, address, password, salt, } = userObj;
            this.email = email;
            this.dob = dob;
            this.firstName = firstName;
            this.middleNames = middleNames;
            this.lastName = lastName;
            this.address = address;
            this.password = password;
            this.salt = salt;
        }
        get Email() {
            return this.email;
        }
        get Dob() {
            return this.dob;
        }
        get FirstName() {
            return this.firstName;
        }
        get MiddleNames() {
            return this.middleNames;
        }
        get LastName() {
            return this.lastName;
        }
        get Address() {
            return this.Address;
        }
        get Password() {
            return this.password;
        }
        get Salt() {
            return this.salt;
        }
        toString() {
            return `User {email: '${this.email}'; dob: '${this.dob}'; firstName: '${this.firstName}'; middleNames: '${this.middleNames}'; lastName: '${this.lastName}'}`;
        }
        static FromDocument(userObj) {
            return new User_1(userObj);
        }
        /**
         * Creates a
         * @param user
         */
        static async Create(userObject) {
            let salt = functions_1.default.randomString(32);
            userObject.password = functions_1.default.passwordHash(userObject.password, salt);
            userObject.salt = salt;
            let user = new User_1.Model(userObject);
            try {
                await user.save();
                return User_1.FromDocument(user);
            }
            catch (e) {
                return e;
            }
        }
        static async EmailExists(email) {
            let x = await this.GetByEmail(email);
            if (x instanceof User_1.UserError.NotFoundError.EmailError) {
                return false;
            }
            return true;
        }
        static Get(id) { }
        static async GetByEmail(email) {
            let user = await User_1.Model.findOne({
                email,
            });
            if (user) {
                return User_1.FromDocument(user);
            }
            return new User_1.UserError.NotFoundError.EmailError(email);
        }
        static async Login(userObj) {
            let { email, password } = userObj;
            let user = await User_1.GetByEmail(email);
            if (!(user instanceof User_1.UserError)) {
                let hashedPass = functions_1.default.passwordHash(password, user.Salt);
                if (hashedPass == user.Password) {
                    return user;
                }
                return new User_1.UserError.VerificationError.PasswordError(email);
            }
            return user;
        }
    };
    User.Forms = {
        Create: {
            function: User_1.Create,
        },
        Login: {
            function: User_1.Login,
            customValidators: [
                {
                    validate: async (a) => {
                        let res = await User_1.Login(a);
                        if (res instanceof User_1.UserError) {
                            return false;
                        }
                        return true;
                    },
                    failureString: "Incorrect password provided",
                    relatedField: "password",
                },
                {
                    validate: async (a) => {
                        let res = await User_1.Login(a);
                        if (res instanceof mongoose_1.mongo.MongoError) {
                            return false;
                        }
                        return true;
                    },
                    failureString: "Database connection failed",
                },
            ],
        },
    };
    User.MAX_USERNAME_LENGTH = 32;
    User.MAX_EMAIL_LENGTH = 255;
    User.MAX_FIRST_NAME_LENGTH = 255;
    User.MAX_MIDDLE_NAMES_LENGTH = 255;
    User.MAX_LAST_NAME_LENGTH = 255;
    User.MAX_PASSWORD_LENGTH = 255;
    User.MIN_USERNAME_LENGTH = 4;
    User.MIN_EMAIL_LENGTH = 5;
    User.MIN_FIRST_NAME_LENGTH = 1;
    User.MIN_MIDDLE_NAMES_LENGTH = 0;
    User.MIN_LAST_NAME_LENGTH = 1;
    User.MIN_PASSWORD_LENGTH = 8;
    __decorate([
        typegoose_1.prop({ required: true, unique: true }),
        Form_class_1.Form.RegisterProperty({
            regex: {
                pattern: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
                failString: "Please enter an email",
            },
            columnSpace: 8,
            overrideType: "email",
            minLength: User_1.MIN_EMAIL_LENGTH,
            maxLength: User_1.MAX_EMAIL_LENGTH,
            autocomplete: "email",
        }),
        Form_class_1.Form.RegisterFormProperty({
            customValidators: [
                {
                    validate: async (a) => {
                        if (typeof a == "string") {
                            let result = !(await User_1.EmailExists(a));
                            return result;
                        }
                        return false;
                    },
                    failureString: "Email is already used with another account",
                },
            ],
        }),
        Form_class_1.Form.RegisterFormProperty({
            columnSpace: 12,
            customValidators: [
                {
                    validate: async (a) => {
                        if (typeof a == "string") {
                            return await User_1.EmailExists(a);
                        }
                        return false;
                    },
                    failureString: "Email not found",
                },
            ],
        }, "Login"),
        __metadata("design:type", String)
    ], User.prototype, "email", void 0);
    __decorate([
        typegoose_1.prop({ required: true }),
        Form_class_1.Form.RegisterProperty({
            displayName: "Date of Birth",
        }),
        Form_class_1.Form.RegisterFormProperty({
            columnSpace: 4,
        }),
        __metadata("design:type", Date)
    ], User.prototype, "dob", void 0);
    __decorate([
        typegoose_1.prop({ required: true }),
        Form_class_1.Form.RegisterProperty({ columnSpace: 4 }),
        Form_class_1.Form.RegisterFormProperty(),
        __metadata("design:type", String)
    ], User.prototype, "firstName", void 0);
    __decorate([
        typegoose_1.prop({ required: true }),
        Form_class_1.Form.RegisterProperty({ columnSpace: 4 }),
        Form_class_1.Form.RegisterFormProperty(),
        __metadata("design:type", String)
    ], User.prototype, "middleNames", void 0);
    __decorate([
        typegoose_1.prop({ required: true }),
        Form_class_1.Form.RegisterProperty({ columnSpace: 4 }),
        Form_class_1.Form.RegisterFormProperty(),
        __metadata("design:type", String)
    ], User.prototype, "lastName", void 0);
    __decorate([
        typegoose_1.prop({ required: true }),
        Form_class_1.Form.RegisterProperty({
            secret: true,
            columnSpace: 6,
        }),
        Form_class_1.Form.RegisterFormProperty({
            autocomplete: "new-password",
            confirm: true,
        }),
        Form_class_1.Form.RegisterFormProperty({
            columnSpace: 12,
        }, "Login"),
        __metadata("design:type", String)
    ], User.prototype, "password", void 0);
    __decorate([
        typegoose_1.prop({ required: true }),
        Form_class_1.Form.RegisterProperty(),
        Form_class_1.Form.RegisterFormProperty(),
        __metadata("design:type", Address_class_1.default)
    ], User.prototype, "address", void 0);
    __decorate([
        typegoose_1.prop({ required: true }),
        __metadata("design:type", String)
    ], User.prototype, "salt", void 0);
    User = User_1 = __decorate([
        Form_class_1.Form.RegisterFormClass("User"),
        __metadata("design:paramtypes", [Object])
    ], User);
    return User;
})();
User.Model = typegoose_1.getModelForClass(User);
(function (User) {
    class UserError extends Error {
        constructor() {
            super(...arguments);
            this.name = "UserError";
            this.message = "User error occured";
        }
    }
    User.UserError = UserError;
    (function (UserError) {
        class VerificationError extends UserError {
            constructor() {
                super(...arguments);
                this.name = "UserVerificationError";
                this.message = "User verification error occured";
            }
        }
        UserError.VerificationError = VerificationError;
        (function (VerificationError) {
            class PasswordError extends VerificationError {
                constructor(email) {
                    super(`Incorrect password for user with email '${email}'`);
                    this.name = "UserVerificationPasswordError";
                }
            }
            VerificationError.PasswordError = PasswordError;
        })(VerificationError = UserError.VerificationError || (UserError.VerificationError = {}));
        class NotFoundError extends UserError {
            constructor() {
                super(...arguments);
                this.name = "UserNotFoundError";
                this.message = "User could not be found";
            }
        }
        UserError.NotFoundError = NotFoundError;
        (function (NotFoundError) {
            class EmailError extends NotFoundError {
                constructor(email) {
                    super(`User could not be found with email '${email}'`);
                    this.name = "UserNotFoundWithEmailError";
                }
            }
            NotFoundError.EmailError = EmailError;
            class IDError extends NotFoundError {
                constructor(id) {
                    super(`User could not be found with ID '${id}'`);
                    this.name = "UserNotFoundWithIDError";
                }
            }
            NotFoundError.IDError = IDError;
        })(NotFoundError = UserError.NotFoundError || (UserError.NotFoundError = {}));
    })(UserError = User.UserError || (User.UserError = {}));
})(User || (User = {}));
exports.default = User;
