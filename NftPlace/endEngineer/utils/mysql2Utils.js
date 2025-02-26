const mysql = require('mysql2');

// 创建连接池
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'carinsurance',
    connectionLimit: 10
});

// // 封装查询函数
// function query(sql) {
//     return new Promise((resolve, reject) => {
//         pool.query(sql, function(err, results, fields) {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(results);
//             }
//         });
//     });
// }

// 使用async/await进行数据库操作
async function fetchData() {
    let connection;
    try {
        connection = await pool.promise().getConnection();
        const results = await connection.query('SELECT * FROM userinfo');
        console.log(results);
    } catch (err) {
        console.log('[QUERY ERROR] - ', err.message);
    } finally {
        if (connection) {
            connection.release();
        }
        pool.end();
    }
}

fetchData();



