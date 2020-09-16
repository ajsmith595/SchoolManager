import express from "express";
import { Form } from "../classes/Form.class";
import School from "../classes/School.class";

let SchoolRouter = express.Router();

SchoolRouter.get("/", (req, res) => {
    res.render("School/List");
});
const SchoolCreateForm = Form.GetForm(School);
SchoolRouter.get("/create", (req, res) => {
    res.render("School/Create", {
        form: SchoolCreateForm,
    });
});

export default SchoolRouter;
