const Web3 = require('web3');
const pool = require('../utils/mysqlUtils')


//获取数据逻辑逻辑
async function pagedata() {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM userinfo", function (error,result) {
          if (error) {
            reject(error);
          }
          console.log(result)
          resolve(result);
        });
      });
}

//返回车主信息
async function logindata(username) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM userinfo WHERE username = ?";
    pool.query(sql, [username], function (error, result) {
      if (error) {
        reject(error);
      }
    //   console.log(result);
      resolve(result);
    });
      });
}

module.exports = {
    pagedata,logindata
}