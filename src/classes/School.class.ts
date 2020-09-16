import {
    DocumentType,
    getModelForClass,
    prop,
    ReturnModelType,
} from "@typegoose/typegoose";
import Address from "./Address.class";
import { Form, FormsLookup } from "./Form.class";
import Pupil from "./Pupil.class";
import Staff from "./Staff.class";
@Form.RegisterFormClass("School")
class School {
    public static Forms: FormsLookup = {
        Create: {
            function: School.Create,
        },
    };
    public static Create(props: any) {}

    protected id: string;
    @prop({ required: true, unique: true })
    @Form.RegisterProperty({
        displayName: "URN",
    })
    @Form.RegisterFormProperty()
    protected urn: number; // Used for accessing data via gov.uk
    @prop({ required: true })
    @Form.RegisterProperty()
    @Form.RegisterFormProperty()
    protected name: string;
    @prop({ required: true })
    @Form.RegisterProperty()
    @Form.RegisterFormProperty()
    protected website: string;
    @prop()
    @Form.RegisterProperty()
    @Form.RegisterFormProperty()
    protected address: Address;
    protected staff: Array<Staff>;
    protected pupils: Array<Pupil>;
    constructor(
        id: string,
        urn: number,
        name: string,
        website: string,
        address: Address,
        staff: Array<Staff>,
        pupils: Array<Pupil>
    ) {
        this.id = id;
        this.urn = urn;
        this.name = name;
        this.website = website;
        this.address = address;
        this.staff = staff;
        this.pupils = pupils;
    }

    private static FromDocument(x: DocumentType<School>) {
        return new School(
            x.id,
            x.urn,
            x.name,
            x.website,
            x.address,
            x.staff,
            x.pupils
        );
    }

    public static async GetByURN(urn: number) {
        let school = await School.Model.findOne({
            urn,
        });
        if (school) {
            return School.FromDocument(school);
        }
        return new School.SchoolError.NotFoundError.URNError(urn);
    }
    public static Get(id: string) {}

    public static Model: ReturnModelType<typeof School, {}>;
}

School.Model = getModelForClass(School);

namespace School {
    export class SchoolError extends Error {
        name: string = "SchoolError";
        message: string = "School error occured";
    }
    export namespace SchoolError {
        export class VerificationError extends SchoolError {
            name = "SchoolVerificationError";
            message = "School verification error occured";
        }
        export class NotFoundError extends SchoolError {
            name: string = "SchoolNotFoundError";
            message: string = "School could not be found";
        }
        export namespace NotFoundError {
            export class URNError extends NotFoundError {
                name: string = "SchoolNotFoundWithEmailError";
                constructor(urn: number) {
                    super(`School could not be found with URN '${urn}'`);
                }
            }
            export class IDError extends NotFoundError {
                name: string = "SchoolNotFoundWithIDError";
                constructor(id: string) {
                    super(`School could not be found with ID '${id}'`);
                }
            }
        }
    }
}

export default School;
