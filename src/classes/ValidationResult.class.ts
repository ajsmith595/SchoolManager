import fs from "fs";
import { nextTick } from "process";

enum ValidationResults {
    OK,
    USER_USERNAME_LENGTH,
    USER_USERNAME_CHARS,
    USER_USERNAME_PROFANITY,

    USER_FIRST_NAME_LENGTH,
    USER_FIRST_NAME_CHARS,
}
const lookup = {
    [ValidationResults.OK]:
        "Everything's all good. If you don't get redirected, there's a problem with the server",
    [ValidationResults.USER_USERNAME_LENGTH]:
        "Username must be between {User.MIN_USERNAME_LENGTH} and {User.MAX_USERNAME_LENGTH} characters long",
    [ValidationResults.USER_USERNAME_CHARS]:
        "Username can only contain alphanumeric and underscore characters",
    [ValidationResults.USER_USERNAME_PROFANITY]:
        "Username cannot contain profanity",
    [ValidationResults.USER_FIRST_NAME_LENGTH]:
        "First name must be between {User.MIN_FIRST_NAME_LENGTH} and {User.MAX_FIRST_NAME_LENGTH} characters long",
    [ValidationResults.USER_FIRST_NAME_CHARS]:
        "First name can only contain letters, accented characters, and hyphens",
};
namespace ValidationResults {
    let importedClasses: { [key: string]: any } = [];

    export function GetMessage(result: ValidationResults) {
        let text = lookup[result] as string;
        let regex = /{([A-Za-z0-9_]+)(\.([A-Za-z0-9_]+))+}/g;
        let newText = text;
        let res;
        while ((res = regex.exec(text) as RegExpExecArray) !== null) {
            let className = res[1];
            if (!importedClasses[className]) {
                importedClasses[className] = require("./" +
                    className +
                    ".class.js").default;
            }
            let current = importedClasses[className];
            if (!current) continue;
            let fail = false;
            for (let i = 3; i < res.length; i += 2) {
                if (!current[res[i]]) {
                    fail = true;
                    break;
                }
                current = current[res[i]];
            }
            if (!fail) newText = newText.replace(res[0], current);
        }

        return newText;
    }
}

export default ValidationResults;
