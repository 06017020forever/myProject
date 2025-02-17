
const pool = require('../utils/mysqlUtils')


// 参与空投逻辑
async function airDrop(address, email, timestamp,period,droperaddress) {

    // 1. 将 Unix 时间戳转换为 Date 对象（UTC 时间）
    const date = new Date(timestamp);

    // 2. 将 UTC 时间转换为北京时间（UTC + 8 小时）
    const beijingDate = new Date(date.getTime() + (8 * 60 * 60 * 1000)); // 加上 8 小时

    // 3. 格式化为 'YYYY-MM-DD HH:MM:SS' 格式
    const formattedDate = beijingDate.toISOString().slice(0, 19).replace('T', ' ');
    const values = [address, email, formattedDate,period,droperaddress];
    const query = 'SELECT * FROM airdrop WHERE address = ? and period = ? and droperaddress = ?';
    const valuesmysql = [address,period,droperaddress];
    try {
        const data = await new Promise((resolve, reject) => {
            pool.query(query, valuesmysql, function (err, data, fields) {
                if (err) {
                    reject(err);
                }
                resolve(data);
            });
        });

        if (data.length > 0) {
            return '您已经参与本次空投，请不要重复参与';
        } else {
            // Wrap the INSERT query inside a Promise to handle it asynchronously
            await new Promise((resolve, reject) => {
                pool.query('INSERT INTO airdrop (address, email, timestamp,period,droperaddress) VALUES (?, ?, ?,?,?)', values, (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                });
            });
            return "参与成功";
        }
    } catch (error) {
        throw error;
    }
}




// 注册逻辑
async function nftRegister(userEmail, password, userAddress) {


    const values = [userEmail, password, userAddress];
    const query = 'SELECT * FROM loginlist WHERE userEmail = ?';
    const valuesmysql = [userEmail];
    try {
        const data = await new Promise((resolve, reject) => {
            pool.query(query, valuesmysql, function (err, data, fields) {
                if (err) {
                    reject(err);
                }
                resolve(data);
            });
        });

        if (data.length > 0) {
            return '该邮箱已经注册，请不要重复注册';
        } else {
            // Wrap the INSERT query inside a Promise to handle it asynchronously
            await new Promise((resolve, reject) => {
                pool.query('INSERT INTO loginlist (userEmail, password, userAddress) VALUES (?, ?, ?)', values, (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results); // Resolving the promise after successful insertion
                    }
                });
            });

            // Now you can return the success message after the INSERT query is completed
            return "插入成功";
        }
    } catch (error) {
        throw error;
    }
}



// 记录卖家地址逻辑
async function nftSeller(name, address, headImage, backgroundImage, timestamp) {

    // 1. 将 Unix 时间戳转换为 Date 对象（UTC 时间）
    const date = new Date(timestamp);

    // 2. 将 UTC 时间转换为北京时间（UTC + 8 小时）
    const beijingDate = new Date(date.getTime() + (8 * 60 * 60 * 1000)); // 加上 8 小时

    // 3. 格式化为 'YYYY-MM-DD HH:MM:SS' 格式
    const formattedDate = beijingDate.toISOString().slice(0, 19).replace('T', ' ');
    const values = [name, address, headImage, backgroundImage, formattedDate];
    const query = 'SELECT * FROM sellers WHERE address = ?';
    const valuesmysql = [address];
    try {
        const data = await new Promise((resolve, reject) => {
            pool.query(query, valuesmysql, function (err, data, fields) {
                if (err) {
                    reject(err);
                }
                resolve(data);
            });
        });

        if (data.length > 0) {
            return '该地址已经创建，请不要重复创建';
        } else {
            // Wrap the INSERT query inside a Promise to handle it asynchronously
            await new Promise((resolve, reject) => {
                pool.query('INSERT INTO sellers (name,address, headImage, backgroundImage,timestamp) VALUES (?, ?, ?,? ,?)', values, (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results); // Resolving the promise after successful insertion
                    }
                });
            });

            // Now you can return the success message after the INSERT query is completed
            return "创建成功";
        }
    } catch (error) {
        throw error;
    }



}


// 获取卖家地址
async function sellerTotals() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM sellers'; // Query to get all columns from NewTable
        pool.query(query, (err, results) => {
            if (err) {
                return reject(err); // Reject the promise in case of error
            }
            // Return all the results (rows) from the query
            resolve(results); // `results` will be an array of rows with all columns
        });
    });
}




// 获取卖家信息
async function sellerData(address) {



    const query = 'SELECT * FROM sellers WHERE address = ?';
    const valuesmysql = [address];

    return new Promise((resolve, reject) => {
        pool.query(query, valuesmysql, function (err, data, fields) {
            if (err) {
                reject(err);
            }
            resolve(data);
        });
    });

}

//获取空投用户
// async function airDropUser(distributeAmount,period) {
//     return new Promise((resolve, reject) => {
//         console.log(distributeAmount)
//         const limit = !isNaN(distributeAmount) && Number(distributeAmount) > 0 ? Number(distributeAmount) : 1;
//         console.log("limit:", limit);
//         const query = `SELECT * FROM airdrop ORDER BY RAND() LIMIT ?`;
//         pool.query(query, [limit], (err, results) => {
//             if (err) {
//                 return reject(err); // Reject the promise in case of error
//             }
//             // Return all the results (rows) from the query
//             resolve(results); // `results` will be an array of rows with all columns
//             console.log(results)
//         });
//     });
// }
async function airDropUser(distributeAmount, period,droperaddress) {
    return new Promise((resolve, reject) => {
       
        const limit = !isNaN(distributeAmount) && Number(distributeAmount) > 0 ? Number(distributeAmount) : 1;

        // Modify the query to filter by the period field
        const query = `SELECT * FROM airdrop WHERE period = ? AND droperaddress=? ORDER BY RAND() LIMIT ?`;

        pool.query(query, [period,droperaddress,limit], (err, results) => {
            if (err) {
                return reject(err); // Reject the promise in case of error
            }
            // Resolve with the results
            resolve(results); // `results` will be an array of rows with all columns
            console.log(results);
        });
    });
}




// Helper function to convert Unix timestamp to Beijing time and format it as 'YYYY-MM-DD HH:MM:SS'
function convertToBeijingTime(timestamp) {
    // 1. 将 Unix 时间戳转换为 Date 对象（UTC 时间）
    const date = new Date(timestamp);

    // 2. 将 UTC 时间转换为北京时间（UTC + 8 小时）
    const beijingDate = new Date(date.getTime() + (8 * 60 * 60 * 1000)); // 加上 8 小时

    // 3. 格式化为 'YYYY-MM-DD HH:MM:SS' 格式
    return beijingDate.toISOString().slice(0, 19).replace('T', ' ');
}


// 记录空投时间
async function nftairTime(startTime,dropTime,endTime,period,droperaddress) {

    const formattedStartTime = convertToBeijingTime(startTime);
    const formattedDropTime = convertToBeijingTime(dropTime);
    const formattedEndTime = convertToBeijingTime(endTime);

    const values = [formattedStartTime, formattedDropTime, formattedEndTime,period,droperaddress];
            await new Promise((resolve, reject) => {
                pool.query('INSERT INTO airtime (startTime,dropTime, endTime,period,droperaddress) VALUES (?, ?, ?,?,?)', values, (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results); // Resolving the promise after successful insertion
                    }
                });
            });

        
            return "设置成功";
  




}


// 获取空投设置时间
async function getNftAirTime(droperaddress) {
    // return new Promise((resolve, reject) => {
    //     const query = 'SELECT * FROM airtime'; // Query to get all columns from NewTable
    //     pool.query(query, (err, results) => {
    //         if (err) {
    //             return reject(err); // Reject the promise in case of error
    //         }
    //         // Return all the results (rows) from the query
    //         resolve(results); // `results` will be an array of rows with all columns
    //     });
    // });
    return new Promise((resolve, reject) => {
        // 查询所有 period 列值为最大值的记录
      
        const query = `
            SELECT * FROM airtime
            WHERE period = (SELECT MAX(period) FROM airtime) AND droperaddress= ?`;
        
        pool.query(query, [[droperaddress]],(err, results) => {
            if (err) {
                return reject(err); // 如果查询出错，返回错误
            }
            // 返回所有期数等于最大值的记录
            resolve(results); // `results` 是一个包含所有符合条件的记录的数组
        });
    });
}


// 记录空投名单
async function nftairList(address,tokenId,leafHash,merkleProof,period,droperaddress) {
    const merkleProofString = merkleProof.join(',');
    const values = [address, tokenId, leafHash,merkleProofString,period,droperaddress];
 
            await new Promise((resolve, reject) => {
                pool.query('INSERT INTO airuserlist (address,tokenId, leafHash,merkleProof,period,droperaddress) VALUES (?, ?, ?,?,?,?)', values, (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results); 
                    }
                });
            });

        
            return "添加成功";
  

            


}



// 获取空投名单
// async function getAirDropList(period) {
//     return new Promise((resolve, reject) => {
//         const query = 'SELECT * FROM airuserlist'; // Query to get all columns from NewTable
//         pool.query(query, (err, results) => {
//             if (err) {
//                 return reject(err); // Reject the promise in case of error
//             }
//             // Return all the results (rows) from the query
//             resolve(results); // `results` will be an array of rows with all columns
//         });
//     });
// }
async function getAirDropList(period,droperaddress) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM airuserlist WHERE period = ? AND droperaddress = ?'; // Filter by period
        pool.query(query, [period,droperaddress], (err, results) => {
            if (err) {
                return reject(err); // Reject the promise in case of error
            }
            resolve(results); // `results` will be an array of rows with all columns
        });
    });
}


module.exports = {
    nftRegister, nftSeller, sellerTotals, sellerData, airDrop, airDropUser,nftairTime,getNftAirTime,nftairList,getAirDropList
}