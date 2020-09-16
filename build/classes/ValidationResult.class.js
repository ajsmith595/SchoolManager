"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ValidationResults;
(function (ValidationResults) {
    ValidationResults[ValidationResults["OK"] = 0] = "OK";
    ValidationResults[ValidationResults["USER_USERNAME_LENGTH"] = 1] = "USER_USERNAME_LENGTH";
    ValidationResults[ValidationResults["USER_USERNAME_CHARS"] = 2] = "USER_USERNAME_CHARS";
    ValidationResults[ValidationResults["USER_USERNAME_PROFANITY"] = 3] = "USER_USERNAME_PROFANITY";
    ValidationResults[ValidationResults["USER_FIRST_NAME_LENGTH"] = 4] = "USER_FIRST_NAME_LENGTH";
    ValidationResults[ValidationResults["USER_FIRST_NAME_CHARS"] = 5] = "USER_FIRST_NAME_CHARS";
})(ValidationResults || (ValidationResults = {}));
const lookup = {
    [ValidationResults.OK]: "Everything's all good. If you don't get redirected, there's a problem with the server",
    [ValidationResults.USER_USERNAME_LENGTH]: "Username must be between {User.MIN_USERNAME_LENGTH} and {User.MAX_USERNAME_LENGTH} characters long",
    [ValidationResults.USER_USERNAME_CHARS]: "Username can only contain alphanumeric and underscore characters",
    [ValidationResults.USER_USERNAME_PROFANITY]: "Username cannot contain profanity",
    [ValidationResults.USER_FIRST_NAME_LENGTH]: "First name must be between {User.MIN_FIRST_NAME_LENGTH} and {User.MAX_FIRST_NAME_LENGTH} characters long",
    [ValidationResults.USER_FIRST_NAME_CHARS]: "First name can only contain letters, accented characters, and hyphens",
};
(function (ValidationResults) {
    let importedClasses = [];
    function GetMessage(result) {
        let text = lookup[result];
        let regex = /{([A-Za-z0-9_]+)(\.([A-Za-z0-9_]+))+}/g;
        let newText = text;
        let res;
        while ((res = regex.exec(text)) !== null) {
            let className = res[1];
            if (!importedClasses[className]) {
                importedClasses[className] = require("./" +
                    className +
                    ".class.js").default;
            }
            let current = importedClasses[className];
            if (!current)
                continue;
            let fail = false;
            for (let i = 3; i < res.length; i += 2) {
                if (!current[res[i]]) {
                    fail = true;
                    break;
                }
                current = current[res[i]];
            }
            if (!fail)
                newText = newText.replace(res[0], current);
        }
        return newText;
    }
    ValidationResults.GetMessage = GetMessage;
})(ValidationResults || (ValidationResults = {}));
exports.default = ValidationResults;
