import ValidationResults from "./ValidationResult.class";
import mongoose, { Mongoose, mongo, Schema, Document } from "mongoose";
import {
    prop,
    getModelForClass,
    DocumentType,
    ReturnModelType,
} from "@typegoose/typegoose";
import Functions from "../functions";
import Address from "./Address.class";
// import Form, { Forms } from "./Form.class";
import { NonFunctionKeys, Mutable } from "utility-types";
import { IForm, FormsLookup, Form } from "./Form.class";

// @Form.FormClass
@Form.RegisterFormClass("User")
class User implements IForm {
    public static readonly Forms: FormsLookup = {
        Create: {
            function: User.Create,
        },
        Login: {
            function: User.Login,
            customValidators: [
                {
                    validate: async (a: any) => {
                        let res = await User.Login(a);
                        if (res instanceof User.UserError) {
                            return false;
                        }
                        return true;
                    },
                    failureString: "Incorrect password provided",
                    relatedField: "password",
                },
                {
                    validate: async (a: any) => {
                        let res = await User.Login(a);
                        if (res instanceof mongo.MongoError) {
                            return false;
                        }
                        return true;
                    },
                    failureString: "Database connection failed",
                },
            ],
        },
    };

    public static readonly MAX_USERNAME_LENGTH = 32;
    public static readonly MAX_EMAIL_LENGTH = 255;
    public static readonly MAX_FIRST_NAME_LENGTH = 255;
    public static readonly MAX_MIDDLE_NAMES_LENGTH = 255;
    public static readonly MAX_LAST_NAME_LENGTH = 255;
    public static readonly MAX_PASSWORD_LENGTH = 255;

    public static readonly MIN_USERNAME_LENGTH = 4;
    public static readonly MIN_EMAIL_LENGTH = 5;
    public static readonly MIN_FIRST_NAME_LENGTH = 1;
    public static readonly MIN_MIDDLE_NAMES_LENGTH = 0;
    public static readonly MIN_LAST_NAME_LENGTH = 1;
    public static readonly MIN_PASSWORD_LENGTH = 8;

    public get Email(): string {
        return this.email;
    }
    public get Dob(): Date {
        return this.dob;
    }
    public get FirstName(): string {
        return this.firstName;
    }
    public get MiddleNames(): string {
        return this.middleNames;
    }
    public get LastName(): string {
        return this.lastName;
    }
    public get Address(): Address {
        return this.Address;
    }
    public get Password(): string {
        return this.password;
    }
    public get Salt(): string {
        return this.salt;
    }
    @prop({ required: true, unique: true })
    @Form.RegisterProperty({
        regex: {
            pattern: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
            failString: "Please enter an email",
        },
        columnSpace: 8,
        overrideType: "email",
        minLength: User.MIN_EMAIL_LENGTH,
        maxLength: User.MAX_EMAIL_LENGTH,
        autocomplete: "email",
    })
    @Form.RegisterFormProperty({
        customValidators: [
            {
                validate: async (a: any) => {
                    if (typeof a == "string") {
                        let result = !(await User.EmailExists(a));
                        return result;
                    }
                    return false;
                },
                failureString: "Email is already used with another account",
            },
        ],
    })
    @Form.RegisterFormProperty(
        {
            columnSpace: 12,
            customValidators: [
                {
                    validate: async (a: any) => {
                        if (typeof a == "string") {
                            return await User.EmailExists(a);
                        }
                        return false;
                    },
                    failureString: "Email not found",
                },
            ],
        },
        "Login"
    )
    protected email: string;

    @prop({ required: true })
    @Form.RegisterProperty({
        displayName: "Date of Birth",
        // overrideType: "text",
        // autocomplete: "bday",
        // min: "",
        // regex: {
        //     pattern: /((0[1-9])|([12][0-9])|(3[01]))\/((0[1-9])|(1[0-2]))\/([0-9]{4})/,
        //     failString: "Date is not in correct format",
        // },
    })
    @Form.RegisterFormProperty({
        columnSpace: 4,
    })
    protected dob: Date;

    @prop({ required: true })
    @Form.RegisterProperty({ columnSpace: 4 })
    @Form.RegisterFormProperty()
    protected firstName: string;

    @prop({ required: true })
    @Form.RegisterProperty({ columnSpace: 4 })
    @Form.RegisterFormProperty()
    protected middleNames: string;

    @prop({ required: true })
    @Form.RegisterProperty({ columnSpace: 4 })
    @Form.RegisterFormProperty()
    protected lastName: string;
    @prop({ required: true })
    @Form.RegisterProperty({
        secret: true,
        columnSpace: 6,
    })
    @Form.RegisterFormProperty({
        autocomplete: "new-password",
        confirm: true,
    })
    @Form.RegisterFormProperty(
        {
            columnSpace: 12,
        },
        "Login"
    )
    protected password: string;
    @prop({ required: true })
    @Form.RegisterProperty()
    @Form.RegisterFormProperty()
    protected address: Address;

    @prop({ required: true })
    protected salt: string;

    constructor(userObj: any) {
        let {
            email,
            dob,
            firstName,
            middleNames,
            lastName,
            address,
            password,
            salt,
        } = userObj;
        this.email = email;
        this.dob = dob;
        this.firstName = firstName;
        this.middleNames = middleNames;
        this.lastName = lastName;
        this.address = address;
        this.password = password;
        this.salt = salt;
    }

    public toString() {
        return `User {email: '${this.email}'; dob: '${this.dob}'; firstName: '${this.firstName}'; middleNames: '${this.middleNames}'; lastName: '${this.lastName}'}`;
    }

    private static FromDocument(userObj: DocumentType<User>) {
        return new User(userObj);
    }

    /**
     * Creates a
     * @param user
     */
    public static async Create(
        userObject: any
    ): Promise<mongoose.Error | User> {
        let salt = Functions.randomString(32);
        userObject.password = Functions.passwordHash(userObject.password, salt);
        userObject.salt = salt;
        let user = new User.Model(userObject);
        try {
            await user.save();
            return User.FromDocument(user);
        } catch (e) {
            return e;
        }
    }
    public static async EmailExists(email: string) {
        let x = await this.GetByEmail(email);
        if (x instanceof User.UserError.NotFoundError.EmailError) {
            return false;
        }
        return true;
    }

    public static Get(id: string) {}
    public static async GetByEmail(email: string) {
        let user = await User.Model.findOne({
            email,
        });
        if (user) {
            return User.FromDocument(user);
        }
        return new User.UserError.NotFoundError.EmailError(email);
    }
    public static async Login(userObj: { email: string; password: string }) {
        let { email, password } = userObj;

        let user = await User.GetByEmail(email);
        if (!(user instanceof User.UserError)) {
            let hashedPass = Functions.passwordHash(password, user.Salt);
            if (hashedPass == user.Password) {
                return user;
            }
            return new User.UserError.VerificationError.PasswordError(email);
        }
        return user;
    }

    public static Model: ReturnModelType<typeof User, {}>;
}

User.Model = getModelForClass(User);

namespace User {
    export class UserError extends Error {
        name: string = "UserError";
        message: string = "User error occured";
    }
    export namespace UserError {
        export class VerificationError extends UserError {
            name = "UserVerificationError";
            message = "User verification error occured";
        }
        export namespace VerificationError {
            export class PasswordError extends VerificationError {
                name: string = "UserVerificationPasswordError";
                constructor(email: string) {
                    super(`Incorrect password for user with email '${email}'`);
                }
            }
        }
        export class NotFoundError extends UserError {
            name: string = "UserNotFoundError";
            message: string = "User could not be found";
        }
        export namespace NotFoundError {
            export class EmailError extends NotFoundError {
                name: string = "UserNotFoundWithEmailError";
                constructor(email: string) {
                    super(`User could not be found with email '${email}'`);
                }
            }
            export class IDError extends NotFoundError {
                name: string = "UserNotFoundWithIDError";
                constructor(id: string) {
                    super(`User could not be found with ID '${id}'`);
                }
            }
        }
    }
}

export default User;
