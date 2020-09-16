import { Group } from "./Group.class";
import File from "./File.class";
import User from "./User.class";

export default class Assignment {
    protected id: string;
    protected group: Group;
    protected title: string;
    protected description: string;
    protected files: Array<File>;
    protected completionFromAdminsRequired: boolean;

    constructor(
        id: string,
        group: Group,
        title: string,
        description: string,
        files: Array<File>,
        completionFromAdminsRequired = false
    ) {
        this.id = id;
        this.group = group;
        this.title = title;
        this.description = description;
        this.files = files;
        this.completionFromAdminsRequired = completionFromAdminsRequired;
    }
}
export enum AssignmentCompletionState {
    Assigned,
    Received,
    Viewed,
    Completed,
    Uploaded,
}
export class AssignmentUserCompletion {
    protected id: string;
    protected assignment: Assignment;
    protected user: User;
    protected uploads: Array<File>;

    constructor(
        id: string,
        assignment: Assignment,
        user: User,
        uploads: Array<File>
    ) {
        this.id = id;
        this.assignment = assignment;
        this.user = user;
        this.uploads = uploads;
    }

    public get ID() {
        return this.id;
    }
    public get Assignment() {
        return this.assignment;
    }
    public get User() {
        return this.user;
    }

    public get CurrentState(): AssignmentCompletionState {
        return AssignmentCompletionState.Assigned;
    }
    public SetState(state: AssignmentCompletionState): boolean {
        if (state > this.CurrentState) {
            return true;
        }
        return false;
    }
}

export class AssignmentCompletionLog {
    protected id: string;
    protected assignmentUserCompletion: AssignmentUserCompletion;
    protected state: AssignmentCompletionState;
    protected timestamp: Date;

    constructor(
        id: string,
        assignmentUserCompletion: AssignmentUserCompletion,
        state: AssignmentCompletionState,
        timestamp: Date
    ) {
        this.id = id;
        this.assignmentUserCompletion = assignmentUserCompletion;
        this.state = state;
        this.timestamp = timestamp;
    }
}
