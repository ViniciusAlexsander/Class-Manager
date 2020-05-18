const Teacher = require("../models/Teacher");
const { age, date } = require("../../lib/utils");

module.exports = {
  //index
  index(req, res) {
    Teacher.all(function (teachers) {
      return res.render(`teachers/index`, { teachers });
    });
  },
  //create mostrar pagina
  create(req, res) {
    return res.render("teachers/create");
  },
  //post aceitando a criação do professor
  post(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == "") {
        return res.send("Por favor, preencha todos os campos antes de enviar.");
      }
    }

    Teacher.create(req.body, function (teacher) {
      return res.redirect(`/teachers/${teacher.id}`);
    });
  },
  //mostrar um professor
  show(req, res) {
    Teacher.findOne(req.params.id, function (teacher) {
      if (!teacher) return res.send("Teacher Not Found");
      teacher.age = age(teacher.birth_date);
      teacher.subjects_taught = teacher.subjects_taught.split(",");
      teacher.created_at = date(teacher.created_at).format;

      return res.render("teachers/show", { teacher });
    });
  },
  //apenas mostrar a pagina que vai ser editada
  edit(req, res) {
    Teacher.findOne(req.params.id, function (teacher) {
      if (!teacher) return res.send("Teacher not found!");
      teacher.birth_date = date(teacher.birth_date).iso;

      return res.render(`teachers/edit`, { teacher });
    });
  },
  //rota q realmente irá editar td
  put(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == "") {
        return res.send("Please, fill all filds");
      }
    }
    Teacher.update(req.body, function () {
      return res.redirect(`/teachers/${req.body.id}`);
    });
  },
  delete(req, res) {
    Teacher.delete(req.body.id, function () {
      return res.redirect(`/teachers`);
    });
  },
};
