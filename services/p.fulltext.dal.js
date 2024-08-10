const dal = require("./p.db");

var getFullText = function (text) {
  if (DEBUG) console.log("postgres.dal.getFullText()");
  return new Promise(function (resolve, reject) {
    const sql = `SELECT movie_name, movie_genre, movie_runtime, director FROM movies \
    WHERE director iLIKE '%'||$1||'%' \
        OR movie_name iLIKE '%'||$1||'%' \
        OR movie_genre iLIKE '%'||$1||'%'\
        OR CAST(movie_runtime AS VARCHAR) iLIKE '%'||$1||'%'`;

    //  const sql = `SELECT movie_name, director FROM movies \
    //     WHERE director iLIKE '%'||$1||'%' \
    //     OR movie_name iLIKE '%'||$1||'%'`;

    if (DEBUG) console.log(sql);
    dal.query(sql, [text], (err, result) => {
      if (err) {
        // logging should go here
        if (DEBUG) console.log(err);
        reject(err);
      } else {
        if (DEBUG) console.log(`Row count: ${result.rowCount}`);
        resolve(result.rows);
      }
    });
  });
};

module.exports = {
  getFullText,
};
