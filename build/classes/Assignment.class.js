"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignmentCompletionLog = exports.AssignmentUserCompletion = exports.AssignmentCompletionState = void 0;
class Assignment {
    constructor(id, group, title, description, files, completionFromAdminsRequired = false) {
        this.id = id;
        this.group = group;
        this.title = title;
        this.description = description;
        this.files = files;
        this.completionFromAdminsRequired = completionFromAdminsRequired;
    }
}
exports.default = Assignment;
var AssignmentCompletionState;
(function (AssignmentCompletionState) {
    AssignmentCompletionState[AssignmentCompletionState["Assigned"] = 0] = "Assigned";
    AssignmentCompletionState[AssignmentCompletionState["Received"] = 1] = "Received";
    AssignmentCompletionState[AssignmentCompletionState["Viewed"] = 2] = "Viewed";
    AssignmentCompletionState[AssignmentCompletionState["Completed"] = 3] = "Completed";
    AssignmentCompletionState[AssignmentCompletionState["Uploaded"] = 4] = "Uploaded";
})(AssignmentCompletionState = exports.AssignmentCompletionState || (exports.AssignmentCompletionState = {}));
class AssignmentUserCompletion {
    constructor(id, assignment, user, uploads) {
        this.id = id;
        this.assignment = assignment;
        this.user = user;
        this.uploads = uploads;
    }
    get ID() {
        return this.id;
    }
    get Assignment() {
        return this.assignment;
    }
    get User() {
        return this.user;
    }
    get CurrentState() {
        return AssignmentCompletionState.Assigned;
    }
    SetState(state) {
        if (state > this.CurrentState) {
            return true;
        }
        return false;
    }
}
exports.AssignmentUserCompletion = AssignmentUserCompletion;
class AssignmentCompletionLog {
    constructor(id, assignmentUserCompletion, state, timestamp) {
        this.id = id;
        this.assignmentUserCompletion = assignmentUserCompletion;
        this.state = state;
        this.timestamp = timestamp;
    }
}
exports.AssignmentCompletionLog = AssignmentCompletionLog;
