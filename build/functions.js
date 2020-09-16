"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
var Functions;
(function (Functions) {
    function verifyFormPost(req, res, requiredFields) {
        for (let field of requiredFields)
            if (req.body[field] == null)
                return false;
        return true;
    }
    Functions.verifyFormPost = verifyFormPost;
    function getMissingFormFields(req, res, requiredFields) {
        let missing = [];
        for (let field of requiredFields) {
            if (req.body[field] == null) {
                missing.push(field);
            }
        }
        return missing;
    }
    Functions.getMissingFormFields = getMissingFormFields;
    function randomString(len = 32) {
        let chars = "abcdefghijklmnopqrstuvyxyzABCDEFGHIJKLMNOPQRSTUVYXYZ0123456789";
        let str = "";
        for (let i = 0; i < len; i++)
            str += chars[Math.floor(Math.random() * chars.length)];
        return str;
    }
    Functions.randomString = randomString;
    function passwordHash(password, salt) {
        return crypto_1.default
            .createHash("sha512")
            .update(password + salt)
            .digest("hex");
    }
    Functions.passwordHash = passwordHash;
    function transformObjectToUpperCase(obj) {
        let newObj = {};
        for (let prop in obj) {
            let newPropName = prop.charAt(0).toUpperCase() + prop.slice(1);
            newObj[newPropName] = obj[prop];
        }
        return newObj;
    }
    Functions.transformObjectToUpperCase = transformObjectToUpperCase;
    function transformObjectToLowerCase(obj) {
        let newObj = {};
        for (let prop in obj) {
            let newPropName = prop.charAt(0).toLowerCase() + prop.slice(1);
            newObj[newPropName] = obj[prop];
        }
        return newObj;
    }
    Functions.transformObjectToLowerCase = transformObjectToLowerCase;
    function camelCaseToDisplayName(input) {
        let str = "";
        for (let x of input) {
            if (x.toUpperCase() == x) {
                str += " ";
            }
            if (str == "") {
                str += x.toUpperCase();
            }
            else {
                str += x;
            }
        }
        return str;
    }
    Functions.camelCaseToDisplayName = camelCaseToDisplayName;
    /**
     * Deep copy function for TypeScript.
     * @param T Generic type of target/copied value.
     * @param target Target value to be copied.
     * @see Source project, ts-deepcopy https://github.com/ykdr2017/ts-deepcopy
     * @see Code pen https://codepen.io/erikvullings/pen/ejyBYg
     */
    Functions.deepCopy = (target) => {
        if (target === null) {
            return target;
        }
        if (target instanceof Date) {
            return new Date(target.getTime());
        }
        if (target instanceof RegExp) {
            return target;
        }
        if (target instanceof Array) {
            const cp = [];
            target.forEach((v) => {
                cp.push(v);
            });
            return cp.map((n) => Functions.deepCopy(n));
        }
        if (typeof target === "object" && target !== {}) {
            const cp = Object.assign({}, target);
            Object.keys(cp).forEach((k) => {
                cp[k] = Functions.deepCopy(cp[k]);
            });
            return cp;
        }
        return target;
    };
    function merge(original, override) {
        if (typeof original == typeof override) {
            if (original instanceof Array && override instanceof Array) {
                let newArray = original.concat(override);
                return newArray;
            }
            let type = typeof original;
            if (type == "object") {
                let x = Functions.deepCopy(original);
                for (let prop in override) {
                    if (x[prop]) {
                        x[prop] = merge(x[prop], override[prop]);
                    }
                    else {
                        x[prop] = override[prop];
                    }
                }
            }
            else {
                return override;
            }
        }
        else {
            console.error(`Invalid type merging between original (typeof ${typeof original}) = ${JSON.stringify(original)}; and override (typeof ${typeof override}) = ${JSON.stringify(override)}`);
            return null;
        }
    }
    Functions.merge = merge;
})(Functions || (Functions = {}));
exports.default = Functions;
