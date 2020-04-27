const fs = require("fs");
const data = require("../data.json");
const { age, date } = require("../utils");

//index
exports.index = function (req, res) {
  return res.render("teachers/index");
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
    atuacao,
  } = req.body;

  const services = atuacao.split(",");
  nascimento = Date.parse(nascimento);
  const created_at = Date.now();
  const id = Number(data.teachers.length + 1);

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

  if (!foundTeacher) return res.send("Não foi encontrado nenhum professor");
  const teacher = {
    ...foundTeacher,
    nascimento: date(foundTeacher.nascimento).iso,
  };

  return res.render("teachers/edit", { teacher });
};
