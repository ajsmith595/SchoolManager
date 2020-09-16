import { Group } from "./Group.class";
import Teacher from "./Teacher.class";
import Pupil from "./Pupil.class";

export default class Class extends Group {
    admins: Array<Teacher>;
    otherMembers: Array<Pupil>;
    constructor(
        id: string,
        admins: Array<Teacher>,
        otherMembers: Array<Pupil>
    ) {
        super(id, admins, otherMembers);
        this.admins = admins;
        this.otherMembers = otherMembers;
    }
}
