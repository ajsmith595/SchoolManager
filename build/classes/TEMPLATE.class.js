"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const Form_class_1 = require("./Form.class");
var TestEnum;
(function (TestEnum) {
    TestEnum[TestEnum["First"] = 0] = "First";
    TestEnum[TestEnum["Second"] = 1] = "Second";
    TestEnum[TestEnum["Third"] = 2] = "Third";
})(TestEnum || (TestEnum = {}));
let Template = /** @class */ (() => {
    var Template_1;
    let Template = Template_1 = class Template {
        constructor() {
            this.property = "";
            this.enumProperty = TestEnum.Second;
        }
        static Create(props) {
            // Create code
        }
    };
    Template.Forms = {
        Create: {
            function: Template_1.Create,
            customValidators: [],
        },
    };
    __decorate([
        Form_class_1.Form.RegisterProperty({
        // options
        }),
        Form_class_1.Form.RegisterFormProperty({
        // form override options
        }),
        __metadata("design:type", String)
    ], Template.prototype, "property", void 0);
    __decorate([
        Form_class_1.Form.RegisterProperty({
            enum: {
                enumType: TestEnum,
                default: TestEnum.Second,
            },
        }),
        Form_class_1.Form.RegisterFormProperty() // Default => Create
        ,
        Form_class_1.Form.RegisterFormProperty({}, "SomeOtherForm"),
        __metadata("design:type", Number)
    ], Template.prototype, "enumProperty", void 0);
    Template = Template_1 = __decorate([
        Form_class_1.Form.RegisterFormClass("Template"),
        __metadata("design:paramtypes", [])
    ], Template);
    return Template;
})();
