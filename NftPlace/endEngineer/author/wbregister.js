const pool = require('../utils/mysqlUtils')
const { clientListContract,merchantListContract } = require( '../contract/secondeContract')
const Web3 = require('web3');
const crypto = require('crypto');
//用户注册逻辑
async function registerClient(username, password,client, gender, phone,mailbox) {
    //3、注册账号,先计入数据库

    const values = [username, password,client, gender, phone,mailbox];
    const query = 'SELECT * FROM userinfo WHERE username = ?';
    const valuesmysql = [username];
    try {
        const data = await new Promise((resolve, reject) => {
            pool.query(query, valuesmysql, function (err, data, fields) {
                if (err) {
                    reject(err);
                }
                resolve(data);
                console.log(data);
            });
        });
        if (data.length > 0) {
            return '用户名已经存在,请重新输入';
        } else {
            //再记录链
            pool.query('INSERT INTO userinfo (username, password,client,gender,phone,mailbox) VALUES (?, ?, ?,?, ?,?)', values, (error, results) => {
                if (error) {
                    return;
                }
            });
            return '插入成功';

        }
    } catch (error) {
        throw error;
    }


}

//用户登录逻辑
async function loginClient(username, password,account) {

    // try {
    //     const data = await new Promise((resolve, reject) => {
          
    //         pool.query(query, values, function (err, data, fields) {
    //             if (err) {
    //                 reject(err);
    //             }
    //             // console.log(data[0])
    //             resolve(data);
    //         });
    //     });
    //     var isLogin = await clientListContract.methods.verifyPwd(username, password).call({ from: account })
    //     if (data.length > 0 && isLogin===true) {
    //         return '登录成功';
    //     } else {
    //         return '用户名或密码错误';
    //     }
    // } catch (error) {
    //     throw error;
    // }
    try {
        // Verify password with the contract first
        const isLogin = await clientListContract.methods.verifyPwd(username, password).call({ from: account });
        if (!isLogin) {
            return ('用户名或密码错误');
        }
        
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        const values = [username, hashedPassword];
        const query = 'SELECT * FROM userinfo WHERE username = ? and password = ?';
        const data = await new Promise((resolve, reject) => {
            pool.query(query, values, function (err, data, fields) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        if (data.length > 0) {
            // Optionally, you can add further checks or return user information
            return ('登录成功');
        } else {
            return ('用户名或密码错误');
        }
    } catch (error) {
        console.error(error);

    }

}

//商家注册逻辑
async function registerMerchant(username, password, merchant,phone, storeStar,storedescription,fans) {
    //3、注册账号,先计入数据库
    const values = [username, password, merchant,phone,storeStar,storedescription,fans];
    const query = 'SELECT * FROM merchantinfo WHERE username = ?';
    const valuesmysql = [username];
    try {
        const data = await new Promise((resolve, reject) => {
            pool.query(query, valuesmysql, function (err, data, fields) {
                if (err) {
                    reject(err);
                }
                resolve(data);
                console.log(data);
            });
        });
        if (data.length > 0) {
            return '用户名已经存在,请重新输入';
        } else {
            pool.query('INSERT INTO merchantinfo (username, password,merchant, phone,storeStar,storedescription,fans) VALUES (?,?,?,?,?,?,?)', values, (error, results) => {
                if (error) {
                    return;
                }
            });
            return '插入成功';

        }
    } catch (error) {
        throw error;
    }
}

//商家登录逻辑
async function loginMerchant(username, password,account) {
    // const query = 'SELECT * FROM merchantinfo WHERE username = ? and password = ?';
    // const values = [username, password];
    // try {
    //     const data = await new Promise((resolve, reject) => {
    //         pool.query(query, values, function (err, data, fields) {
    //             if (err) {
    //                 reject(err);
    //             }
    //             // console.log(data[0])
    //             resolve(data);
    //         });
    //     });
    //     var isLogin = await merchantListContract.methods.verifyPwd(username, password).call({ from: account })
    //     if (data.length > 0 && isLogin===true) {
    //         return '登录成功';
    //     } else {
    //         return '用户名或密码错误';
    //     }
    // } catch (error) {
    //     throw error;
    // }
    try {
        // Verify password with the contract first
        var isLogin = await merchantListContract.methods.verifyPwd(username, password).call({ from: account })
        if (!isLogin) {
            return ('用户名或密码错误');
        }
        
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        const values = [username, hashedPassword];
        const query = 'SELECT * FROM merchantinfo WHERE username = ? and password = ?';
        const data = await new Promise((resolve, reject) => {
            pool.query(query, values, function (err, data, fields) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });

        if (data.length > 0) {
            // Optionally, you can add further checks or return user information
            return ('登录成功');
        } else {
            return ('用户名或密码错误');
        }
    } catch (error) {
        console.error(error);

    }

}

module.exports = {
    registerClient, loginClient,registerMerchant,loginMerchant
}