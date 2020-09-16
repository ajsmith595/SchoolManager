import { Form, FormsLookup } from "./Form.class";
import {
    prop,
    ReturnModelType,
    getModelForClass,
    post,
} from "@typegoose/typegoose";

@Form.RegisterFormClass("Address")
export default class Address {
    public static FormCreate(props: any): Address {
        let address = new Address(
            props.postcode,
            props.firstLine,
            props.secondLine,
            props.thirdLine
        );
        return address;
    }
    public static readonly Forms: FormsLookup = {
        Create: { function: Address.FormCreate },
    };

    @prop()
    @Form.RegisterProperty({
        regex: {
            pattern: /^(([A-Z]{1,2}[0-9][A-Z0-9]?|ASCN|STHL|TDCU|BBND|[BFS]IQQ|PCRN|TKCA) ?[0-9][A-Z]{2}|BFPO ?[0-9]{1,4}|(KY[0-9]|MSR|VG|AI)[ -]?[0-9]{4}|[A-Z]{2} ?[0-9]{2}|GE ?CX|GIR ?0A{2}|SAN ?TA1)$/,
            failString: "Must be a valid postcode",
        },
        autocomplete: "postal-code",
    })
    @Form.RegisterFormProperty()
    protected postcode: string;
    @prop()
    @Form.RegisterProperty({
        autocomplete: "address-line1",
    })
    @Form.RegisterFormProperty()
    protected firstLine: string;
    @prop()
    @Form.RegisterProperty()
    @Form.RegisterFormProperty({
        required: false,
        autocomplete: "address-line2",
    })
    protected secondLine: string;
    @prop()
    @Form.RegisterProperty()
    @Form.RegisterFormProperty({
        required: false,
        autocomplete: "address-line3",
    })
    protected thirdLine: string;

    constructor(
        postcode: string,
        firstLine: string,
        secondLine: string = "",
        thirdLine: string = ""
    ) {
        this.postcode = postcode;
        this.firstLine = firstLine;
        this.secondLine = secondLine;
        this.thirdLine = thirdLine;
    }

    public get Postcode() {
        return this.postcode;
    }
    public get FirstLine() {
        return this.firstLine;
    }
    public get SecondLine() {
        return this.secondLine;
    }
    public get ThirdLine() {
        return this.thirdLine;
    }
    public toString() {
        let str = this.FirstLine;
        if (this.SecondLine != "") {
            str += "\n" + this.SecondLine;
            if (this.ThirdLine != "") {
                str += "\n" + this.ThirdLine;
            }
        }
        str += "\n" + this.Postcode;
        return str;
    }
    public static Model: ReturnModelType<typeof Address, {}>;
}
Address.Model = getModelForClass(Address);
