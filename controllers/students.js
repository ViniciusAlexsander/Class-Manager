const fs = require("fs");
const data = require("../data.json");
const { age, date } = require("../utils");

//index
exports.index = function (req, res) {
  return res.render("students/index", { students: data.students });
};

//create mostrar pagina
exports.create = function (req, res) {
  return res.render("students/create");
};

//post aceitando a criação do estudante
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
    email,
    nascimento,
    escolaridade,
    cargaHoraria,
  } = req.body;

  nascimento = Date.parse(nascimento);
  const created_at = Date.now();
  const id = Number(data.students[data.students.length - 1].id + 1);

  data.students.push({
    id,
    avatar_url,
    nome,
    nascimento,
    email,
    escolaridade,
    cargaHoraria,
    created_at,
  });

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {
    if (err) return res.send("write file error");

    return res.redirect(`students/${id}`);
  });
};

//mostrar um estudante
exports.show = function (req, res) {
  const { id } = req.params;
  const foundStudent = data.students.find(function (student) {
    return id == student.id;
  });

  if (!foundStudent) return res.send(" Não foi encontrado nenhum ALUNO");

  const student = {
    ...foundStudent,
    age: age(foundStudent.nascimento),
    birthday: date(foundStudent.nascimento).birthDay,
    created_at: Intl.DateTimeFormat("pt-BR").format(foundStudent.created_at),
  };

  return res.render("students/show", { student });
};

//apenas mostrar a pagina que vai ser editada
exports.edit = function (req, res) {
  const { id } = req.params;
  const foundStudent = data.students.find(function (student) {
    return id == student.id;
  });

  if (!foundStudent) return res.send(" Não foi encontrado nenhum ALUNO");

  const student = {
    ...foundStudent,
    nascimento: date(foundStudent.nascimento).iso,
  };

  return res.render("students/edit", { student });
};

//rota q realmente irá editar td
exports.put = function (req, res) {
  const { id } = req.body;

  let foundStudent;

  for (let i = 0; i < data.students.length; i++) {
    if (data.students[i].id == id) {
      foundStudent = data.students[i];
    }
  }

  const student = {
    ...foundStudent,
    ...req.body,
    nascimento: Date.parse(req.body.nascimento),
    id: Number(id),
  };

  for (let i = 0; i < data.students.length; i++) {
    if (data.students[i].id == id) {
      data.students[i] = student;
    }
  }

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {
    if (err) return res.send("write error");

    return res.redirect(`/students/${id}`);
  });
};

exports.delete = function (req, res) {
  const { id } = req.body;

  const filteredStudent = data.students.filter(function (student) {
    return student.id != id;
  });

  data.students = filteredStudent;

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {
    if (err) return res.send("write file error");

    return res.redirect("/students");
  });
};
