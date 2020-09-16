import { NonFunctionKeys } from "utility-types";
import e from "express";
import Functions from "../functions";
import { fileURLToPath } from "url";
import User from "./User.class";

export interface IForm {}
interface ICustomValidator {
    validate: (a: any) => boolean | Promise<boolean>;
    failureString: string;
}
interface ICustomFormValidator extends ICustomValidator {
    relatedField?: string;
}
interface IFormDetails {
    function: (props: any) => any;
    customValidators?: Array<ICustomFormValidator>;
}
export interface FormsLookup {
    Create: IFormDetails;
    [k: string]: IFormDetails;
}
interface IFormBuilder {
    readonly Forms: FormsLookup;
    new (...args: any): any;
}
export enum HTTPMethod {
    Get = "GET",
    Post = "POST",
}

export interface IFormFieldOptions {
    /**
     * A custom ID to assign to the input field
     */
    customId?: string;

    /**
     * The additional classes to be added to the field
     */
    additionalClasses?: string;
    /**
     * If it is a required field or not
     */
    required?: boolean;
    /**
     * How much column space it should take up. Maximum 12.
     */
    columnSpace?: number;

    /**
     * A custom validator function - checking an email exists, for example. This is performed after all other validation is done
     */
    customValidators?: Array<ICustomValidator>;
    /**
     * The default value for the field
     */
    value?: any;
    /**
     * Whether or not the form should create a duplicate field for confirmation. e.g. Password or email confirmation
     */
    confirm?: boolean;
    /**
     * Whether or not the field should be a password/secret
     */
    secret?: boolean;
    /**
     * The text displayed next to the input
     */
    displayName?: string;
    /**
     * The autocomplete field - used for Chrome AutoFill
     */
    autocomplete?: string;
    /**
     * The minimum length to assign to the field
     */
    minLength?: number;
    /**
     * The maximum length to assign to the field
     */
    maxLength?: number;
    /**
     * The minimum value to assign to the field
     */
    min?: string | number;
    /**
     * The maximum length to assign to the field
     */
    max?: string | number;
    /**
     * The regular expression to validate the field
     */
    regex?: {
        /**
         * The pattern to validate the field
         */
        pattern: RegExp;

        /**
         * The string to display if the regex fails
         */
        failString: string;
    };
    /**
     * The enum to use for <select> inputs
     */
    enum?: {
        enumType: any;
        default?: any;
    };
    /**
     * The override 'type' field
     */
    overrideType?: string;
}

interface IFieldError {
    text: string;
}
interface IFormError {
    text: string;
    for: string;
}
interface IField {
    fieldOrSection: "field";
    name: string;
    type: string;
    options: IFormFieldOptions & {
        enum?: object;
        confirmErrors?: Array<IFieldError>;
    };
    errors?: Array<IFieldError>;
}
interface ISection {
    fieldOrSection: "section";
    name: string;
    displayName: string;
    forType: string;
    fields: Array<Field>;
    errors?: Array<IFormError>;
}
type Field = IField | ISection;
interface IFormOptions {
    method?: "GET" | "POST";
    action?: string;
}

export class Form {
    public static Metadata: {
        [key: string]: {
            forms: {
                [key: string]: {
                    fields: {
                        [k: string]: IFormFieldOptions;
                    };
                    options: IFormOptions;
                    formDetails: IFormDetails;
                };
            };
            types: {
                [key: string]: {
                    type: string | object;
                    options: IFormFieldOptions;
                };
            };
        };
    } = {};

    private static RegisterClass(type: string) {
        if (!this.Metadata[type]) {
            this.Metadata[type] = { types: {}, forms: {} };
        }
    }
    private static RegisterForm(type: string, form: string) {
        this.RegisterClass(type);
        if (!this.Metadata[type]["forms"][form]) {
            this.Metadata[type]["forms"][form] = {
                fields: {},
                options: {},
                formDetails: {
                    function: () => {
                        throw new Error(
                            `Method not set for form ${form} for type ${type}`
                        );
                    },
                },
            };
        }
    }
    public static RegisterFormClass(name: string) {
        return (target: IFormBuilder) => {
            for (let form in target.Forms) {
                this.RegisterForm(name, form);
                this.Metadata[name]["forms"][form]["formDetails"] =
                    target.Forms[form];
                // console.log(this.Metadata);
            }
        };
    }
    public static RegisterProperty(options: IFormFieldOptions = {}) {
        return (target: IForm, key: string) => {
            this.RegisterClass(target.constructor.name);
            let typeName = Reflect.getMetadata("design:type", target, key).name;
            if (options.enum) {
                let arr: { [k: string]: any } = {};
                for (let x in options.enum.enumType) {
                    if (isNaN(Number(x))) {
                        arr[x] = options.enum.enumType[x];
                    }
                }
                typeName = arr;
                options.enum.enumType = arr;
            }
            let targetType = target.constructor.name;
            this.Metadata[targetType]["types"][key] = {
                type: typeName,
                options,
            };
        };
    }
    public static RegisterFormProperty(
        options: Omit<IFormFieldOptions, "enum"> = {},
        form = "Create"
    ) {
        return (target: IForm, key: string) => {
            let targetType = target.constructor.name;
            this.RegisterForm(targetType, form);
            this.Metadata[targetType]["forms"][form]["fields"][key] = options;
        };
    }

    private static GetFormFromType(
        typeName: string,
        form: string,
        url: string = "",
        action: HTTPMethod = HTTPMethod.Post
    ): Form {
        if (this.Metadata[typeName]) {
            if (this.Metadata[typeName]["forms"][form]) {
                let fields: Array<Field> = [];
                for (let field in this.Metadata[typeName]["forms"][form][
                    "fields"
                ]) {
                    if (this.Metadata[typeName]["types"][field]) {
                        let type = this.Metadata[typeName]["types"][field][
                            "type"
                        ];
                        let options: IFormFieldOptions = {
                            ...this.Metadata[typeName]["types"][field].options,
                        };
                        for (let option in this.Metadata[typeName]["forms"][
                            form
                        ]["fields"][field]) {
                            if ((options as any)[option]) {
                                (options as any)[option] = Functions.merge(
                                    (options as any)[option],
                                    (this.Metadata[typeName]["forms"][form][
                                        "fields"
                                    ][field] as any)[option]
                                );
                            } else {
                                (options as any)[option] = (this.Metadata[
                                    typeName
                                ]["forms"][form]["fields"][field] as any)[
                                    option
                                ];
                            }
                        }
                        options.displayName =
                            options.displayName ||
                            Functions.camelCaseToDisplayName(field);
                        options.required =
                            options.required === undefined
                                ? true
                                : options.required;
                        if (typeof type == "object") {
                            type = "enum";
                        } else {
                            if (options.secret) {
                                type = "password";
                            } else if (options.overrideType) {
                                type = options.overrideType;
                            } else {
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
                                        let subform = this.GetFormFromType(
                                            type,
                                            "Create"
                                        ).fields;
                                        let section: ISection = {
                                            fieldOrSection: "section",
                                            displayName:
                                                options.displayName ||
                                                Functions.camelCaseToDisplayName(
                                                    field
                                                ),
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
                    } else {
                        throw new Error(
                            `Property '${field}' has not been registered properly for type ${typeName}`
                        );
                    }
                }
                return new Form(fields, typeName, form, url, action);
            } else {
                throw new Error(
                    `Type ${typeName} has no form registered named '${form}'`
                );
            }
        } else {
            throw new Error(
                `Type ${typeName} has not been registered to be used for forms!`
            );
        }
    }

    public static GetForm(
        props: IFormBuilder,
        form: string = "Create",
        url: string = "",
        action: HTTPMethod = HTTPMethod.Post
    ) {
        return this.GetFormFromType(props.name, form, url, action);
    }

    protected fields: Array<Field>;
    protected forType: string;
    protected hasErrors: boolean;
    protected formName: string;
    protected url: string;
    protected method: HTTPMethod;
    protected errors: Array<IFormError>;
    private constructor(
        fields: Array<Field>,
        type: string,
        formName: string,
        url: string = "",
        method: HTTPMethod = HTTPMethod.Post,
        errors: Array<IFormError> = [],
        hasErrors = true
    ) {
        this.fields = fields;
        this.forType = type;
        this.hasErrors = hasErrors;
        this.formName = formName;
        this.url = url;
        this.method = method;
        this.errors = errors;
    }
    public get Fields() {
        return this.fields;
    }
    public get HasErrors() {
        return this.hasErrors;
    }
    public get URL() {
        return this.url;
    }
    public get Method() {
        return this.method;
    }
    public get Errors() {
        return this.errors;
    }

    public async Validate(vals: { [k: string]: any }): Promise<Form> {
        console.log(vals);
        let hasErrors = false;
        let newFields: Array<Field> = [];
        for (let field of this.fields) {
            if (field.fieldOrSection == "field") {
                let newField = Functions.deepCopy(field);
                newField.errors = [];
                if (
                    vals[newField.name] &&
                    vals[newField.name] != "" &&
                    !(newField.type == "enum" && vals[newField.name] == -1)
                ) {
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
                    } else {
                        if (newField.options.max) {
                            if (f.value > newField.options.max) {
                                f.errorPath.push({
                                    text: `This is larger than the max value of ${newField.options.max}`,
                                });
                            }
                        }
                        if (newField.options.maxLength) {
                            if (
                                f.value.toString().length >
                                newField.options.maxLength
                            ) {
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
                            if (
                                f.value.toString().length <
                                newField.options.minLength
                            ) {
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
                } else {
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
            } else if (field.fieldOrSection == "section") {
                let form = Form.GetFormFromType(field.forType, "Create");
                let formVals: { [k: string]: any } = {};
                for (let prop in vals) {
                    let split = prop.split(".");
                    if (split[0] == field.name && typeof split[1] == "string") {
                        split.splice(0, 1);
                        formVals[split.join(".")] = vals[prop];
                    }
                }
                let newForm = await form.Validate(formVals);
                this.hasErrors = this.hasErrors || form.hasErrors;
                let newSection: ISection = {
                    fieldOrSection: "section",
                    displayName: field.displayName,
                    name: field.name,
                    forType: field.forType,
                    fields: newForm.fields,
                };
                newFields.push(newSection);
            }
        }
        let formErrors: Array<IFormError> = [];
        if (!hasErrors) {
            let validators =
                Form.Metadata[this.forType]["forms"][this.formName][
                    "formDetails"
                ].customValidators;
            if (validators) {
                let simpleObject = await Form.GetFieldsAsSimpleObject(
                    newFields
                );
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
        return new Form(
            newFields,
            this.forType,
            this.formName,
            this.url,
            this.method,
            formErrors,
            hasErrors
        );
    }
    public async PassValues(vals: Array<Field>): Promise<Form> {
        let hasErrors = false;
        return new Form(
            vals,
            this.forType,
            this.formName,
            this.url,
            this.method,
            [],
            hasErrors
        );
    }

    private static async GetFieldsAsSimpleObject(fields: Array<Field>) {
        let props: { [k: string]: any } = {};
        for (let field of fields) {
            if (field.fieldOrSection == "field") {
                props[field.name] = field.options.value;
            } else if (field.fieldOrSection == "section") {
                let formWithVals = await Form.GetFormFromType(
                    field.forType,
                    "Create"
                ).PassValues(field.fields);
                let val = await formWithVals.Compile();
                props[field.name] = val;
            }
        }
        return props;
    }

    public async Compile() {
        if (this.hasErrors) {
            throw new Error(
                `Cannot compile a form when it has errors! Form: ${this.forType}`
            );
        }
        let props = await Form.GetFieldsAsSimpleObject(this.fields);
        let formName =
            Form.Metadata[this.forType]["forms"][this.formName]["formDetails"];

        return formName.function(props);
    }
}
