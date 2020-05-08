var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',   // 服务器地址
  user     : 'root',        // 用户名
  password : 'root',        // 密码
  database : 'test'         // 数据库名
});

connection.connect();

function exec (sql) {
  const promise = new Promise((resolve, reject) => {
    connection.query(sql, (err, res) => {
      if (err) {
        reject(err)
        return
      }
      resolve(res)
    })
  })

  return promise
}

module.exports = {
  exec,
  escape: mysql.escape
}
