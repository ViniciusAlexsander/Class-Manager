const fs = require("fs");
const data = require("../data.json");
const { age, date } = require("../utils");

//index
exports.index = function (req, res) {
  return res.render("teachers/index", { teachers: data.teachers });
};

//create mostrar pagina
exports.create = function (req, res) {
  return res.render("teachers/create");
};

//post aceitando a criação do professor
exports.post = function (req, res) {
  const keys = Object.keys(req.body);

  for (key of keys) {
    if (req.body[key] == "") {
      return res.send("Por favor, preencha todos os campos antes de enviar.");
    }
  }

  let {
    avatar_url,
    nome,
    nascimento,
    escolaridade,
    tipoAula,
    services,
  } = req.body;

  let lastId;

  if (data.teachers[0] == undefined) {
    lastId = 0;
  } else {
    lastId = data.teachers[data.teachers.length - 1].id;
  }
  services = services.split(",");
  nascimento = Date.parse(nascimento);
  const created_at = Date.now();
  const id = Number(lastId + 1);

  data.teachers.push({
    id,
    avatar_url,
    nome,
    nascimento,
    escolaridade,
    tipoAula,
    services,
    created_at,
  });

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {
    if (err) return res.send("write file error");

    return res.redirect(`teachers/${id}`);
  });
};

//mostrar um professor
exports.show = function (req, res) {
  const { id } = req.params;
  const foundTeacher = data.teachers.find(function (teacher) {
    return id == teacher.id;
  });

  if (!foundTeacher) return res.send(" Não foi encontrado nenhum professor");

  const teacher = {
    ...foundTeacher,
    age: age(foundTeacher.nascimento),
    created_at: Intl.DateTimeFormat("pt-BR").format(foundTeacher.created_at),
  };

  return res.render("teachers/show", { teacher });
};

//apenas mostrar a pagina que vai ser editada
exports.edit = function (req, res) {
  const { id } = req.params;
  const foundTeacher = data.teachers.find(function (teacher) {
    return id == teacher.id;
  });

  if (!foundTeacher) return res.send(" Não foi encontrado nenhum professor");

  const teacher = {
    ...foundTeacher,
    nascimento: date(foundTeacher.nascimento).iso,
  };

  return res.render("teachers/edit", { teacher });
};

//rota q realmente irá editar td
exports.put = function (req, res) {
  const { id } = req.body;

  let foundTeacher;

  for (let i = 0; i < data.teachers.length; i++) {
    if (data.teachers[i].id == id) {
      foundTeacher = data.teachers[i];
    }
  }

  const teacher = {
    ...foundTeacher,
    ...req.body,
    nascimento: Date.parse(req.body.nascimento),
    id: Number(id),
    services: req.body.services.split(","),
  };

  for (let i = 0; i < data.teachers.length; i++) {
    if (data.teachers[i].id == id) {
      data.teachers[i] = teacher;
    }
  }

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {
    if (err) return res.send("write error");

    return res.redirect(`/teachers/${id}`);
  });
};

exports.delete = function (req, res) {
  const { id } = req.body;

  const filteredTeacher = data.teachers.filter(function (teacher) {
    return teacher.id != id;
  });

  data.teachers = filteredTeacher;

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {
    if (err) return res.send("write file error");

    return res.redirect("/teachers");
  });
};
