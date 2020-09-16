import { Form, FormsLookup } from "./Form.class";

enum TestEnum {
    First,
    Second,
    Third,
}

@Form.RegisterFormClass("Template")
class Template {
    public static Forms: FormsLookup = {
        Create: {
            function: Template.Create,
            customValidators: [],
        },
    };
    @Form.RegisterProperty({
        // options
    })
    @Form.RegisterFormProperty({
        // form override options
    })
    protected property: string;

    @Form.RegisterProperty({
        enum: {
            enumType: TestEnum,
            default: TestEnum.Second,
        },
    })
    @Form.RegisterFormProperty() // Default => Create
    @Form.RegisterFormProperty({}, "SomeOtherForm")
    protected enumProperty: TestEnum;

    public constructor() {
        this.property = "";
        this.enumProperty = TestEnum.Second;
    }

    public static Create(props: any) {
        // Create code
    }
}
