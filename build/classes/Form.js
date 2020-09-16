"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Form = void 0;
const EmailValidator = __importStar(require("email-validator"));
class Form {
    constructor(fields, buttonText, method = Form.FormMethods.Post, errors, action = undefined, fieldExistsString, fieldNotExistsString) {
        this.fields = fields;
        this.buttonText = buttonText;
        this.method = method;
        this.errors = errors;
        this.action = action;
        this.fieldExistsString = fieldExistsString;
        this.fieldNotExistsString = fieldNotExistsString;
    }
    static Create(fields, buttonText, fieldExistsString = (b) => b + " already exists", fieldNotExistsString = (b) => b + " does not exist", method = Form.FormMethods.Post, action = undefined) {
        return new Form(fields, buttonText, method, [], action, fieldExistsString, fieldNotExistsString);
    }
    static ValidateType(type, value) {
        switch (type) {
            case "text":
                return true;
            case "email":
                return EmailValidator.validate(value);
            case "password":
                return true;
            case "date":
                let d = new Date(value);
                if (d && d.getTime() === d.getTime()) {
                    return true;
                }
                return false;
            default:
                return true;
        }
    }
    get Fields() {
        return this.fields.slice();
    }
    GetField(field) {
        for (let f of this.fields) {
            if (f.name == field)
                return f;
        }
        return null;
    }
    get Method() {
        return this.method;
    }
    get Errors() {
        return this.errors;
    }
    get ButtonText() {
        return this.buttonText;
    }
    get Action() {
        return this.action;
    }
    get FieldExistsString() {
        return this.fieldExistsString;
    }
    get FieldNotExistsString() {
        return this.fieldNotExistsString;
    }
    Validate(fields) {
        let fieldErrors = [];
        for (let field of this.fields) {
            field.value = fields[field.name] || "";
            if (fields[field.name] == "" || fields[field.name] == null) {
                if (field.required) {
                    fieldErrors.push({
                        name: field.name,
                        errors: ["required"],
                    });
                }
                continue;
            }
            let errors = [];
            if (field.max && fields[field.name] > field.max) {
                errors.push("max");
            }
            else if (field.min && fields[field.name] < field.min) {
                errors.push("min");
            }
            if (field.maxLength &&
                fields[field.name].toString().length > field.maxLength) {
                errors.push("maxLength");
            }
            else if (field.minLength &&
                fields[field.name].toString().length < field.minLength) {
                errors.push("minLength");
            }
            if (!Form.ValidateType(field.type, fields[field.name])) {
                errors.push("type");
            }
            else if (field.regex &&
                !field.regex.pattern.test(fields[field.name])) {
                errors.push("regex");
            }
            if (field.mustMatch &&
                fields[field.name] != fields[field.mustMatch]) {
                errors.push("mustMatch");
            }
            if (errors.length > 0) {
                fieldErrors.push({
                    name: field.name,
                    errors,
                });
            }
        }
        return new Form(this.fields, this.buttonText, this.method, fieldErrors, undefined, this.fieldExistsString, this.fieldNotExistsString);
    }
    FieldsExist(failedFields) {
        let fieldErrors = [];
        for (let field of failedFields) {
            let object = {
                name: field,
                errors: ["exists"],
            };
            fieldErrors.push(object);
        }
        return new Form(this.fields, this.buttonText, this.method, fieldErrors, undefined, this.fieldExistsString, this.fieldNotExistsString);
    }
    FieldsNotExist(failedFields) {
        let fieldErrors = [];
        for (let field of failedFields) {
            let object = {
                name: field,
                errors: ["notExists"],
            };
            fieldErrors.push(object);
        }
        return new Form(this.fields, this.buttonText, this.method, fieldErrors, undefined, this.fieldExistsString, this.fieldNotExistsString);
    }
}
exports.Form = Form;
(function (Form) {
    let FormMethods;
    (function (FormMethods) {
        FormMethods["Get"] = "GET";
        FormMethods["Post"] = "POST";
    })(FormMethods = Form.FormMethods || (Form.FormMethods = {}));
})(Form = exports.Form || (exports.Form = {}));
exports.default = Form;
