
const pool = require('../utils/mysqlUtils')
async function login(username, password, gender, phone) {

    const query = 'SELECT * FROM userinfo WHERE username = ?';
    pool.query(query, [username], function (err, data, fields) {
        if (err) {
            throw err;
        }
        if (data.length > 0) {
           
        } else {
            
          
        }
    });

}
module.exports = {
    login
}