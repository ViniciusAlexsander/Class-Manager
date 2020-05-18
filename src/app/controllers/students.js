const fs = require("fs");
const data = require("../../../data.json");
const { age, date } = require("../../lib/utils");

module.exports = {
  //index
  index(req, res) {
    return res.render("students/index", { students: data.students });
  },
  //create mostrar pagina
  create(req, res) {
    return res.render("students/create");
  },
  //post aceitando a criação do estudante
  post(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == "") {
        return res.send("Por favor, preencha todos os campos antes de enviar.");
      }
    }

    let { avatar_url, name, email, birth, schooling, workload } = req.body;

    let lastId;

    if (data.students[0] == undefined) {
      lastId = 0;
    } else {
      lastId = data.students[data.students.length - 1].id;
    }

    birth = Date.parse(birth);
    const created_at = Date.now();
    const id = Number(lastId + 1);

    data.students.push({
      id,
      avatar_url,
      name,
      birth,
      email,
      schooling,
      workload,
      created_at,
    });

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {
      if (err) return res.send("write file error");

      return res.redirect(`students/${id}`);
    });
  },
  //mostrar um estudante
  show(req, res) {
    const { id } = req.params;
    const foundStudent = data.students.find(function (student) {
      return id == student.id;
    });

    if (!foundStudent) return res.send(" Não foi encontrado nenhum ALUNO");

    const student = {
      ...foundStudent,
      age: age(foundStudent.birth),
      birthday: date(foundStudent.birth).birthDay,
      created_at: Intl.DateTimeFormat("pt-BR").format(foundStudent.created_at),
    };

    return res.render("students/show", { student });
  },
  //apenas mostrar a pagina que vai ser editada
  edit(req, res) {
    const { id } = req.params;
    const foundStudent = data.students.find(function (student) {
      return id == student.id;
    });

    if (!foundStudent) return res.send(" Não foi encontrado nenhum ALUNO");

    const student = {
      ...foundStudent,
      birth: date(foundStudent.birth).iso,
    };

    return res.render("students/edit", { student });
  },
  //rota q realmente irá editar td
  put(req, res) {
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
      birth: Date.parse(req.body.birth),
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
  },
  delete(req, res) {
    const { id } = req.body;

    const filteredStudent = data.students.filter(function (student) {
      return student.id != id;
    });

    data.students = filteredStudent;

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {
      if (err) return res.send("write file error");

      return res.redirect("/students");
    });
  },
};
