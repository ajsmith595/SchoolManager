import User from "./User.class";

export class Group {
    protected id: string;
    protected admins: Array<User>;
    protected otherMembers: Array<User>;

    constructor(id: string, admins: Array<User>, otherMembers: Array<User>) {
        this.id = id;
        this.admins = admins;
        this.otherMembers = otherMembers;
    }
}
