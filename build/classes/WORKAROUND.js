"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Form = exports.HTTPMethod = void 0;
const functions_1 = __importDefault(require("../functions"));
var HTTPMethod;
(function (HTTPMethod) {
    HTTPMethod["Get"] = "GET";
    HTTPMethod["Post"] = "POST";
})(HTTPMethod = exports.HTTPMethod || (exports.HTTPMethod = {}));
let Form = /** @class */ (() => {
    class Form {
        constructor(fields, type, formName, url = "", method = HTTPMethod.Post, errors = [], hasErrors = true) {
            this.fields = fields;
            this.forType = type;
            this.hasErrors = hasErrors;
            this.formName = formName;
            this.url = url;
            this.method = method;
            this.errors = errors;
        }
        static RegisterClass(type) {
            if (!this.Metadata[type]) {
                this.Metadata[type] = { types: {}, forms: {} };
            }
        }
        static RegisterForm(type, form) {
            this.RegisterClass(type);
            if (!this.Metadata[type]["forms"][form]) {
                this.Metadata[type]["forms"][form] = {
                    fields: {},
                    options: {},
                    formDetails: {
                        function: () => {
                            throw new Error(`Method not set for form ${form} for type ${type}`);
                        },
                    },
                };
            }
        }
        static RegisterFormClass(name) {
            return (target) => {
                for (let form in target.Forms) {
                    this.RegisterForm(name, form);
                    this.Metadata[name]["forms"][form]["formDetails"] =
                        target.Forms[form];
                    // console.log(this.Metadata);
                }
            };
        }
        static RegisterProperty(options = {}) {
            return (target, key) => {
                this.RegisterClass(target.constructor.name);
                let typeName = Reflect.getMetadata("design:type", target, key).name;
                if (options.enum) {
                    let arr = {};
                    for (let x in options.enum.enumType) {
                        if (isNaN(Number(x))) {
                            arr[x] = options.enum.enumType[x];
                        }
                    }
                    typeName = arr;
                }
                let targetType = target.constructor.name;
                this.Metadata[targetType]["types"][key] = {
                    type: typeName,
                    options,
                };
            };
        }
        static RegisterFormProperty(options = {}, form = "Create") {
            return (target, key) => {
                let targetType = target.constructor.name;
                this.RegisterForm(targetType, form);
                this.Metadata[targetType]["forms"][form]["fields"][key] = options;
            };
        }
        static GetFormFromType(typeName, form, url = "", action = HTTPMethod.Post) {
            if (this.Metadata[typeName]) {
                if (this.Metadata[typeName]["forms"][form]) {
                    let fields = [];
                    for (let field in this.Metadata[typeName]["forms"][form]["fields"]) {
                        if (this.Metadata[typeName]["types"][field]) {
                            let type = this.Metadata[typeName]["types"][field]["type"];
                            let options = Object.assign({}, this.Metadata[typeName]["types"][field].options);
                            for (let option in this.Metadata[typeName]["forms"][form]["fields"][field]) {
                                if (options[option]) {
                                    options[option] = functions_1.default.merge(options[option], this.Metadata[typeName]["forms"][form]["fields"][field][option]);
                                }
                                else {
                                    options[option] = this.Metadata[typeName]["forms"][form]["fields"][field][option];
                                }
                            }
                            options.displayName =
                                options.displayName ||
                                    functions_1.default.camelCaseToDisplayName(field);
                            options.required =
                                options.required === undefined
                                    ? true
                                    : options.required;
                            if (typeof type == "object") {
                                type = "enum";
                            }
                            else {
                                if (options.secret) {
                                    type = "password";
                                }
                                else if (options.overrideType) {
                                    type = options.overrideType;
                                }
                                else {
                                    switch (type) {
                                        case "Number":
                                            type = "number";
                                            break;
                                        case "String":
                                            type = "text";
                                            break;
                                        case "Date":
                                            type = "date";
                                            break;
                                        default:
                                            let subform = this.GetFormFromType(type, "Create").fields;
                                            let section = {
                                                fieldOrSection: "section",
                                                displayName: options.displayName ||
                                                    functions_1.default.camelCaseToDisplayName(field),
                                                fields: subform,
                                                forType: type,
                                                name: field,
                                            };
                                            fields.push(section);
                                            continue;
                                    }
                                }
                            }
                            delete options.overrideType;
                            // delete options.secret;
                            fields.push({
                                fieldOrSection: "field",
                                name: field,
                                type: type.toString(),
                                options,
                            });
                        }
                        else {
                            throw new Error(`Property '${field}' has not been registered properly for type ${typeName}`);
                        }
                    }
                    return new Form(fields, typeName, form, url, action);
                }
                else {
                    throw new Error(`Type ${typeName} has no form registered named '${form}'`);
                }
            }
            else {
                throw new Error(`Type ${typeName} has not been registered to be used for forms!`);
            }
        }
        static GetForm(props, form = "Create", url = "", action = HTTPMethod.Post) {
            return this.GetFormFromType(props.name, form, url, action);
        }
        get Fields() {
            return this.fields;
        }
        get HasErrors() {
            return this.hasErrors;
        }
        get URL() {
            return this.url;
        }
        get Method() {
            return this.method;
        }
        get Errors() {
            return this.errors;
        }
        async Validate(vals) {
            console.log(vals);
            let hasErrors = false;
            let newFields = [];
            for (let field of this.fields) {
                if (field.fieldOrSection == "field") {
                    let newField = functions_1.default.deepCopy(field);
                    newField.errors = [];
                    if (vals[newField.name] &&
                        vals[newField.name] != "" &&
                        !(newField.type == "enum" && vals[newField.name] == -1)) {
                        newField.options.value = vals[newField.name];
                        let f = {
                            value: vals[newField.name],
                            errorPath: newField.errors,
                        };
                        if (newField.options.enum) {
                            if (!newField.options.enum.enumType[f.value]) {
                                f.errorPath.push({
                                    text: "This is not a valid option",
                                });
                            }
                        }
                        else {
                            if (newField.options.max) {
                                if (f.value > newField.options.max) {
                                    f.errorPath.push({
                                        text: `This is larger than the max value of ${newField.options.max}`,
                                    });
                                }
                            }
                            if (newField.options.maxLength) {
                                if (f.value.toString().length >
                                    newField.options.maxLength) {
                                    f.errorPath.push({
                                        text: `This is longer than the max length of ${newField.options.maxLength}`,
                                    });
                                }
                            }
                            if (newField.options.min) {
                                if (f.value < newField.options.min) {
                                    f.errorPath.push({
                                        text: `This is smaller than the min value of ${newField.options.min}`,
                                    });
                                }
                            }
                            if (newField.options.minLength) {
                                if (f.value.toString().length <
                                    newField.options.minLength) {
                                    f.errorPath.push({
                                        text: `This is shorter than the min length of ${newField.options.minLength}`,
                                    });
                                }
                            }
                            if (newField.options.regex) {
                                if (!newField.options.regex.pattern.test(f.value)) {
                                    f.errorPath.push({
                                        text: newField.options.regex.failString,
                                    });
                                }
                            }
                        }
                        let errorOccured = f.errorPath.length > 0;
                        if (!errorOccured) {
                            if (newField.options.confirm) {
                                newField.options.confirmErrors = [];
                                if (vals[newField.name + ".confirm"] !== f.value) {
                                    newField.options.confirmErrors.push({
                                        text: "The value does not match",
                                    });
                                    errorOccured = true;
                                }
                            }
                        }
                        if (!errorOccured && newField.options.customValidators) {
                            for (let validator of newField.options
                                .customValidators) {
                                let result = validator.validate(f.value);
                                if (typeof result != "boolean") {
                                    result = await result;
                                }
                                if (!result) {
                                    f.errorPath.push({
                                        text: validator.failureString,
                                    });
                                    errorOccured = true;
                                    break;
                                }
                            }
                        }
                        hasErrors = hasErrors || errorOccured;
                    }
                    else {
                        if (newField.options.required) {
                            newField.errors = [
                                {
                                    text: "This field is required",
                                },
                            ];
                            hasErrors = true;
                        }
                    }
                    newFields.push(newField);
                }
                else if (field.fieldOrSection == "section") {
                    let form = Form.GetFormFromType(field.forType, "Create");
                    let formVals = {};
                    for (let prop in vals) {
                        let split = prop.split(".");
                        if (split[0] == field.name && typeof split[1] == "string") {
                            split.splice(0, 1);
                            formVals[split.join(".")] = vals[prop];
                        }
                    }
                    let newForm = await form.Validate(formVals);
                    this.hasErrors = this.hasErrors || form.hasErrors;
                    let newSection = {
                        fieldOrSection: "section",
                        displayName: field.displayName,
                        name: field.name,
                        forType: field.forType,
                        fields: newForm.fields,
                    };
                    newFields.push(newSection);
                }
            }
            let formErrors = [];
            if (!hasErrors) {
                let validators = Form.Metadata[this.forType]["forms"][this.formName]["formDetails"].customValidators;
                if (validators) {
                    let simpleObject = await Form.GetFieldsAsSimpleObject(newFields);
                    for (let validator of validators) {
                        let result = validator.validate(simpleObject);
                        if (typeof result != "boolean") {
                            result = await result;
                        }
                        if (!result) {
                            formErrors.push({
                                text: validator.failureString,
                                for: validator.relatedField || "",
                            });
                            hasErrors = true;
                            break;
                        }
                    }
                }
            }
            return new Form(newFields, this.forType, this.formName, this.url, this.method, formErrors, hasErrors);
        }
        async PassValues(vals) {
            let hasErrors = false;
            return new Form(vals, this.forType, this.formName, this.url, this.method, [], hasErrors);
        }
        static async GetFieldsAsSimpleObject(fields) {
            let props = {};
            for (let field of fields) {
                if (field.fieldOrSection == "field") {
                    props[field.name] = field.options.value;
                }
                else if (field.fieldOrSection == "section") {
                    let formWithVals = await Form.GetFormFromType(field.forType, "Create").PassValues(field.fields);
                    let val = await formWithVals.Compile();
                    props[field.name] = val;
                }
            }
            return props;
        }
        async Compile() {
            if (this.hasErrors) {
                throw new Error(`Cannot compile a form when it has errors! Form: ${this.forType}`);
            }
            let props = await Form.GetFieldsAsSimpleObject(this.fields);
            let formName = Form.Metadata[this.forType]["forms"][this.formName]["formDetails"];
            return formName.function(props);
        }
    }
    Form.Metadata = {};
    return Form;
})();
exports.Form = Form;
