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
const typegoose_1 = require("@typegoose/typegoose");
let Address = /** @class */ (() => {
    var Address_1;
    let Address = Address_1 = class Address {
        constructor(postcode, firstLine, secondLine = "", thirdLine = "") {
            this.postcode = postcode;
            this.firstLine = firstLine;
            this.secondLine = secondLine;
            this.thirdLine = thirdLine;
        }
        static FormCreate(props) {
            let address = new Address_1(props.postcode, props.firstLine, props.secondLine, props.thirdLine);
            return address;
        }
        get Postcode() {
            return this.postcode;
        }
        get FirstLine() {
            return this.firstLine;
        }
        get SecondLine() {
            return this.secondLine;
        }
        get ThirdLine() {
            return this.thirdLine;
        }
        toString() {
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
    };
    Address.Forms = {
        Create: { function: Address_1.FormCreate },
    };
    __decorate([
        typegoose_1.prop(),
        Form_class_1.Form.RegisterProperty({
            regex: {
                pattern: /^(([A-Z]{1,2}[0-9][A-Z0-9]?|ASCN|STHL|TDCU|BBND|[BFS]IQQ|PCRN|TKCA) ?[0-9][A-Z]{2}|BFPO ?[0-9]{1,4}|(KY[0-9]|MSR|VG|AI)[ -]?[0-9]{4}|[A-Z]{2} ?[0-9]{2}|GE ?CX|GIR ?0A{2}|SAN ?TA1)$/,
                failString: "Must be a valid postcode",
            },
            autocomplete: "postal-code",
        }),
        Form_class_1.Form.RegisterFormProperty(),
        __metadata("design:type", String)
    ], Address.prototype, "postcode", void 0);
    __decorate([
        typegoose_1.prop(),
        Form_class_1.Form.RegisterProperty({
            autocomplete: "address-line1",
        }),
        Form_class_1.Form.RegisterFormProperty(),
        __metadata("design:type", String)
    ], Address.prototype, "firstLine", void 0);
    __decorate([
        typegoose_1.prop(),
        Form_class_1.Form.RegisterProperty(),
        Form_class_1.Form.RegisterFormProperty({
            required: false,
            autocomplete: "address-line2",
        }),
        __metadata("design:type", String)
    ], Address.prototype, "secondLine", void 0);
    __decorate([
        typegoose_1.prop(),
        Form_class_1.Form.RegisterProperty(),
        Form_class_1.Form.RegisterFormProperty({
            required: false,
            autocomplete: "address-line3",
        }),
        __metadata("design:type", String)
    ], Address.prototype, "thirdLine", void 0);
    Address = Address_1 = __decorate([
        Form_class_1.Form.RegisterFormClass("Address"),
        __metadata("design:paramtypes", [String, String, String, String])
    ], Address);
    return Address;
})();
exports.default = Address;
Address.Model = typegoose_1.getModelForClass(Address);
