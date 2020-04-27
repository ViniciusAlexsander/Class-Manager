const express = require("express");
const routes = express.Router();
const teachers = require("./controllers/teachers");
const students = require("./controllers/students");

routes.get("/", function (req, res) {
  return res.redirect("/teachers");
});

routes.get("/teachers", teachers.index);
routes.get("/teachers/create", teachers.create);
routes.get("/teachers/:id", teachers.show);
routes.get("/teachers/:id/edit", teachers.edit);
routes.post("/teachers", teachers.post);

module.exports = routes;
