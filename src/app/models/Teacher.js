const { age, date } = require("../../lib/utils");
const db = require("../../config/db");

module.exports = {
  all(callback) {
    db.query(`SELECT * FROM teachers`, function (err, results) {
      if (err) throw `Database Error! ${err}`;

      callback(results.rows);
    });
  },
  create(dataFromBody, callback) {
    const query = `
    INSERT INTO teachers (
      avatar_url,
      name,
      birth_date,
      education_level,
      class_type,
      subjects_taught,
      created_at
    ) VALUES ( $1, $2, $3,$4,$5, $6, $7 )
    RETURNING id
  `;
    const values = [
      dataFromBody.avatar_url,
      dataFromBody.name,
      date(dataFromBody.birth_date).iso,
      dataFromBody.education_level,
      dataFromBody.class_type,
      dataFromBody.subjects_taught,
      date(Date.now()).iso,
    ];

    db.query(query, values, function (err, results) {
      callback(results.rows[0]);
    });
  },
  findOne(id, callback) {
    const query = `
      SELECT * 
      FROM teachers
      WHERE id = $1
    `;
    db.query(query, [id], function (err, results) {
      if (err) throw `Database Error! ${err}`;
      callback(results.rows[0]);
    });
  },
  update(dataFromBody, callback) {
    const query = `
      UPDATE teachers SET
      avatar_url=($1),
      name=($2),
      birth_date=($3),
      education_level=($4),
      class_type=($5),
      subjects_taught=($6)
      WHERE id = ($7)
    `;
    const values = [
      dataFromBody.avatar_url,
      dataFromBody.name,
      dataFromBody.birth_date,
      dataFromBody.education_level,
      dataFromBody.class_type,
      dataFromBody.subjects_taught,
      dataFromBody.id,
    ];
    db.query(query, values, function (err, results) {
      if (err) throw `Database Error! ${err}`;
      callback();
    });
  },
  delete(id, callback) {
    const query = `
      DELETE FROM teachers
      WHERE id = ($1)
    `;
    db.query(query, [id], function (err, results) {
      if (err) throw `Database ERROR! ${err}`;
      callback();
    });
  },
};
