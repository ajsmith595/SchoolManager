import express, { Request, Response } from "express";
import crypto from "crypto";
import e from "express";
namespace Functions {
    export function verifyFormPost(
        req: Request,
        res: Response,
        requiredFields: Array<string>
    ) {
        for (let field of requiredFields)
            if (req.body[field] == null) return false;
        return true;
    }
    export function getMissingFormFields(
        req: Request,
        res: Response,
        requiredFields: Array<string>
    ) {
        let missing = [];
        for (let field of requiredFields) {
            if (req.body[field] == null) {
                missing.push(field);
            }
        }
        return missing;
    }
    export function randomString(len: number = 32) {
        let chars =
            "abcdefghijklmnopqrstuvyxyzABCDEFGHIJKLMNOPQRSTUVYXYZ0123456789";
        let str = "";
        for (let i = 0; i < len; i++)
            str += chars[Math.floor(Math.random() * chars.length)];
        return str;
    }
    export function passwordHash(password: string, salt: string) {
        return crypto
            .createHash("sha512")
            .update(password + salt)
            .digest("hex");
    }
    export function transformObjectToUpperCase(obj: { [key: string]: any }) {
        let newObj: { [key: string]: any } = {};
        for (let prop in obj) {
            let newPropName = prop.charAt(0).toUpperCase() + prop.slice(1);
            newObj[newPropName] = obj[prop];
        }
        return newObj;
    }
    export function transformObjectToLowerCase(obj: { [key: string]: any }) {
        let newObj: { [key: string]: any } = {};
        for (let prop in obj) {
            let newPropName = prop.charAt(0).toLowerCase() + prop.slice(1);
            newObj[newPropName] = obj[prop];
        }
        return newObj;
    }
    export function camelCaseToDisplayName(input: string) {
        let str = "";
        for (let x of input) {
            if (x.toUpperCase() == x) {
                str += " ";
            }
            if (str == "") {
                str += x.toUpperCase();
            } else {
                str += x;
            }
        }
        return str;
    }
    /**
     * Deep copy function for TypeScript.
     * @param T Generic type of target/copied value.
     * @param target Target value to be copied.
     * @see Source project, ts-deepcopy https://github.com/ykdr2017/ts-deepcopy
     * @see Code pen https://codepen.io/erikvullings/pen/ejyBYg
     */
    export const deepCopy = <T>(target: T): T => {
        if (target === null) {
            return target;
        }
        if (target instanceof Date) {
            return new Date(target.getTime()) as any;
        }
        if (target instanceof RegExp) {
            return target;
        }
        if (target instanceof Array) {
            const cp = [] as any[];
            (target as any[]).forEach((v) => {
                cp.push(v);
            });
            return cp.map((n: any) => deepCopy<any>(n)) as any;
        }
        if (typeof target === "object" && target !== {}) {
            const cp = { ...(target as { [key: string]: any }) } as {
                [key: string]: any;
            };
            Object.keys(cp).forEach((k) => {
                cp[k] = deepCopy<any>(cp[k]);
            });
            return cp as T;
        }
        return target;
    };
    export function merge(original: any, override: any) {
        if (typeof original == typeof override) {
            if (original instanceof Array && override instanceof Array) {
                let newArray = original.concat(override);
                return newArray;
            }
            let type = typeof original;

            if (type == "object") {
                let x = deepCopy(original);
                for (let prop in override) {
                    if (x[prop]) {
                        x[prop] = merge(x[prop], override[prop]);
                    } else {
                        x[prop] = override[prop];
                    }
                }
            } else {
                return override;
            }
        } else {
            console.error(
                `Invalid type merging between original (typeof ${typeof original}) = ${JSON.stringify(
                    original
                )}; and override (typeof ${typeof override}) = ${JSON.stringify(
                    override
                )}`
            );
            return null;
        }
    }
}
export default Functions;
