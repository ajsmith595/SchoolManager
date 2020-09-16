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
exports.CustomDate = void 0;
const Form_class_1 = require("./Form.class");
var Month;
(function (Month) {
    Month[Month["January"] = 1] = "January";
    Month[Month["February"] = 2] = "February";
    Month[Month["March"] = 3] = "March";
    Month[Month["April"] = 4] = "April";
    Month[Month["May"] = 5] = "May";
    Month[Month["June"] = 6] = "June";
    Month[Month["July"] = 7] = "July";
    Month[Month["August"] = 8] = "August";
    Month[Month["September"] = 9] = "September";
    Month[Month["October"] = 10] = "October";
    Month[Month["November"] = 11] = "November";
    Month[Month["December"] = 12] = "December";
})(Month || (Month = {}));
let CustomDate = /** @class */ (() => {
    var CustomDate_1;
    let CustomDate = CustomDate_1 = class CustomDate {
        constructor(day, month, year) {
            this.day = day;
            this.month = month;
            this.year = year;
        }
        static Create(a) {
            return new CustomDate_1(a.day, a.month, a.year);
        }
        get Year() {
            return this.year;
        }
        get Month() {
            return this.month;
        }
        get Day() {
            return this.day;
        }
    };
    CustomDate.Forms = {
        Create: {
            function: CustomDate_1.Create,
        },
    };
    __decorate([
        Form_class_1.Form.RegisterProperty({
            min: 1,
            max: 31,
            autocomplete: "bday-day",
        }),
        Form_class_1.Form.RegisterFormProperty(),
        __metadata("design:type", Number)
    ], CustomDate.prototype, "day", void 0);
    __decorate([
        Form_class_1.Form.RegisterProperty({
            enum: {
                enumType: Month,
            },
            autocomplete: "bday-month",
        }),
        Form_class_1.Form.RegisterFormProperty(),
        __metadata("design:type", Number)
    ], CustomDate.prototype, "month", void 0);
    __decorate([
        Form_class_1.Form.RegisterProperty({
            min: 0,
            max: 3000,
            autocomplete: "bday-year",
        }),
        Form_class_1.Form.RegisterFormProperty(),
        __metadata("design:type", Number)
    ], CustomDate.prototype, "year", void 0);
    CustomDate = CustomDate_1 = __decorate([
        Form_class_1.Form.RegisterFormClass("CustomDate"),
        __metadata("design:paramtypes", [Number, Number, Number])
    ], CustomDate);
    return CustomDate;
})();
exports.CustomDate = CustomDate;
