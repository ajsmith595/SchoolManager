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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typegoose_1 = require("@typegoose/typegoose");
const Address_class_1 = __importDefault(require("./Address.class"));
const Form_class_1 = require("./Form.class");
let School = /** @class */ (() => {
    var School_1;
    let School = School_1 = class School {
        constructor(id, urn, name, website, address, staff, pupils) {
            this.id = id;
            this.urn = urn;
            this.name = name;
            this.website = website;
            this.address = address;
            this.staff = staff;
            this.pupils = pupils;
        }
        static Create(props) { }
        static FromDocument(x) {
            return new School_1(x.id, x.urn, x.name, x.website, x.address, x.staff, x.pupils);
        }
        static async GetByURN(urn) {
            let school = await School_1.Model.findOne({
                urn,
            });
            if (school) {
                return School_1.FromDocument(school);
            }
            return new School_1.SchoolError.NotFoundError.URNError(urn);
        }
        static Get(id) { }
    };
    School.Forms = {
        Create: {
            function: School_1.Create,
        },
    };
    __decorate([
        typegoose_1.prop({ required: true, unique: true }),
        Form_class_1.Form.RegisterProperty({
            displayName: "URN",
        }),
        Form_class_1.Form.RegisterFormProperty(),
        __metadata("design:type", Number)
    ], School.prototype, "urn", void 0);
    __decorate([
        typegoose_1.prop({ required: true }),
        Form_class_1.Form.RegisterProperty(),
        Form_class_1.Form.RegisterFormProperty(),
        __metadata("design:type", String)
    ], School.prototype, "name", void 0);
    __decorate([
        typegoose_1.prop({ required: true }),
        Form_class_1.Form.RegisterProperty(),
        Form_class_1.Form.RegisterFormProperty(),
        __metadata("design:type", String)
    ], School.prototype, "website", void 0);
    __decorate([
        typegoose_1.prop(),
        Form_class_1.Form.RegisterProperty(),
        Form_class_1.Form.RegisterFormProperty(),
        __metadata("design:type", Address_class_1.default)
    ], School.prototype, "address", void 0);
    School = School_1 = __decorate([
        Form_class_1.Form.RegisterFormClass("School"),
        __metadata("design:paramtypes", [String, Number, String, String, Address_class_1.default,
            Array,
            Array])
    ], School);
    return School;
})();
School.Model = typegoose_1.getModelForClass(School);
(function (School) {
    class SchoolError extends Error {
        constructor() {
            super(...arguments);
            this.name = "SchoolError";
            this.message = "School error occured";
        }
    }
    School.SchoolError = SchoolError;
    (function (SchoolError) {
        class VerificationError extends SchoolError {
            constructor() {
                super(...arguments);
                this.name = "SchoolVerificationError";
                this.message = "School verification error occured";
            }
        }
        SchoolError.VerificationError = VerificationError;
        class NotFoundError extends SchoolError {
            constructor() {
                super(...arguments);
                this.name = "SchoolNotFoundError";
                this.message = "School could not be found";
            }
        }
        SchoolError.NotFoundError = NotFoundError;
        (function (NotFoundError) {
            class URNError extends NotFoundError {
                constructor(urn) {
                    super(`School could not be found with URN '${urn}'`);
                    this.name = "SchoolNotFoundWithEmailError";
                }
            }
            NotFoundError.URNError = URNError;
            class IDError extends NotFoundError {
                constructor(id) {
                    super(`School could not be found with ID '${id}'`);
                    this.name = "SchoolNotFoundWithIDError";
                }
            }
            NotFoundError.IDError = IDError;
        })(NotFoundError = SchoolError.NotFoundError || (SchoolError.NotFoundError = {}));
    })(SchoolError = School.SchoolError || (School.SchoolError = {}));
})(School || (School = {}));
exports.default = School;
