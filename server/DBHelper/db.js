var mysql = require('mysql');
var pool = mysql.createPool({
    host : 'localhost',
	user : 'root',
	password : '123456',
	database : 'my_music',
	port : 3030
});

function query(sql, callback) {
    pool.getConnection(function (err, connection) {
        // Use the connection
        connection.query(sql, function (err, rows) {
            callback(err, rows);
            connection.release();//释放连接
        });
    });
}
exports.query = query;