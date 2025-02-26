const pool = require('../utils/mysqlUtils')
const { merchantListContract, merchantABI } = require('../contract/secondeContract')
const Web3 = require('web3');
let web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:8545");



function convertTimestampToDateTime(timestamp) {
    const currentDate = new Date(timestamp * 1000); // 将秒转换为毫秒
    const time = currentDate.getFullYear() + '-' +
        ('0' + (currentDate.getMonth() + 1)).slice(-2) + '-' +
        ('0' + currentDate.getDate()).slice(-2) + ' ' +
        ('0' + currentDate.getHours()).slice(-2) + ':' +
        ('0' + currentDate.getMinutes()).slice(-2) + ':' +
        ('0' + currentDate.getSeconds()).slice(-2);
    return time
}

//购买商品
async function purchaseProduct(recordId, client, merchant, merchantName, productId, productName, category, buyTime1, number, price, orderNumber, isDelivered,  isReceived, imageHash,transactionTime1,operation,nonce,transactionHash,blockNumber) {
    // const currentDate = new Date(buyTime1 * 1000); // 将秒转换为毫秒
    // const buyTime = currentDate.getFullYear() + '-' +
    //     ('0' + (currentDate.getMonth() + 1)).slice(-2) + '-' +
    //     ('0' + currentDate.getDate()).slice(-2) + ' ' +
    //     ('0' + currentDate.getHours()).slice(-2) + ':' +
    //     ('0' + currentDate.getMinutes()).slice(-2) + ':' +
    //     ('0' + currentDate.getSeconds()).slice(-2);

    isDelivered === 'false' ? "未发货" : "已发货";
    isReceived === 'false' ? "未确认收货" : "已确认收货";
    const buyTime =  convertTimestampToDateTime(buyTime1)
    const totalPrice = price * number;
    const values = [recordId, client, merchant, merchantName, productId, productName, category, buyTime, number, totalPrice, orderNumber, isDelivered, isReceived,  imageHash];
    //计入数据库
    pool.query('INSERT INTO orderlist (recordId, client, merchant,merchantName, productId, productName,category, buyTime, number, price, orderNumber, isDelivered,  isReceived,  imageHash) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', values, (error, results) => {
        if (error) {
            console.log(error)
            return;
        }
        // 更新库存数量
        pool.query('UPDATE productinfo SET number = number - ? WHERE productId = ? AND productName=? AND merchantAddress=? ', [number, productId, productName, merchant], (updateError, updateResults) => {
            if (updateError) {
                console.log(updateError);
                return;
            }
            console.log('库存更新成功');
            const transactionTime =  convertTimestampToDateTime(transactionTime1)
            const traceValues = [productId, merchant, client,productName, operation, nonce, blockNumber, transactionHash, transactionTime];
            pool.query('INSERT INTO traceability (productId,merchantAddress, address, productName, operation, nonce, blockNumber, transactionHash, transactionTime) VALUES (?,?,?,?,?,?,?,?,?)', traceValues, (error, results) => {
                if (error) {
                    console.log(error);
                    return;
                }
            });
        });

    });
    return '购买成功';

}

// 用户订单
async function UserOrderNumberProductIdInfo(filters) {
    return new Promise((resolve, reject) => {
        let query = 'SELECT * FROM orderlist WHERE 1=1';
        let queryParams = [];
        if (filters.client) {
            query += ' AND client = ?';
            queryParams.push(filters.client);
        }
        // 分页
        const offset = (filters.page - 1) * filters.pageSize;
        query += ' LIMIT ? OFFSET ?';
        queryParams.push(filters.pageSize, offset);

        pool.query(query, queryParams, (error, results) => {
            if (error) {
                return reject(error);
            }

            let countQuery = 'SELECT COUNT(*) AS total FROM orderlist WHERE 1=1';
            let countParams = queryParams.slice(0, -2); // Remove LIMIT and OFFSET parameters for count query
            if (filters.client) {
                countQuery += ' AND client = ?';
                countParams.push(filters.client);
            }

            pool.query(countQuery, countParams, (countError, countResults) => {
                if (countError) {
                    return reject(countError);
                }
                resolve({ data: results, total: countResults[0].total });
            });
        });
    });
}

function convertTimestampToDateTime(timestamp) {
    const date = new Date(timestamp * 1000); // 将秒转换为毫秒
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // 补零
    const day = ('0' + date.getDate()).slice(-2); // 补零
    const hours = ('0' + date.getHours()).slice(-2); // 补零
    const minutes = ('0' + date.getMinutes()).slice(-2); // 补零
    const seconds = ('0' + date.getSeconds()).slice(-2); // 补零
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
//用户确认
async function ReceivedProduct(client, merchant,orderNumber,productName,receivedTime1,isReceived,productId) {
    const receivedTime = convertTimestampToDateTime(receivedTime1)
    const values = [isReceived,receivedTime,client, merchant, productId, productName,orderNumber];
   
        //更新确认收货时间已经确认状态
        pool.query('UPDATE orderlist SET isReceived =  ?, receivedTime = ?  WHERE client = ? AND merchant=? AND productId=? AND productName=? AND orderNumber=? ', values, (updateError, updateResults) => {
            if (updateError) {
                console.log(updateError);
                return;
            }
            console.log('确认收货成功');
        });

    return '确认收货成功';

}

//用户收藏
async function UpdateFavorite(client, merchant, productName, isFavorite) {
    const values = [client, merchant, productName, isFavorite];

    // 包装查询操作为 Promise
    const query = (sql, params) => {
        return new Promise((resolve, reject) => {
            pool.query(sql, params, (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });
    };

    try {
        // 查询是否存在该记录
        const results = await query('SELECT * FROM collection WHERE client = ? AND merchant = ? AND productName = ?', [client, merchant, productName]);

        if (results.length > 0) {
            // 记录存在，删除记录
            await query('DELETE FROM collection WHERE client = ? AND merchant = ? AND productName = ?', [client, merchant, productName]);
            return '取消收藏';
        } else {
            // 记录不存在，插入新数据
            await query('INSERT INTO collection (client, merchant, productName, isFavorite) VALUES (?, ?, ?, ?)', values);
            return '收藏成功';
        }
    } catch (error) {
        console.log(error);
        return '操作失败';
    }
}

//用户点赞
async function UpdateLiked(client, merchant, productName, isLiked) {
    const values = [client, merchant, productName, isLiked];

    // 包装查询操作为 Promise
    const query = (sql, params) => {
        return new Promise((resolve, reject) => {
            pool.query(sql, params, (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });
    };

    try {
        // 查询是否存在该记录
        const results = await query('SELECT * FROM liked WHERE client = ? AND merchant = ? AND productName = ?', [client, merchant, productName]);

        if (results.length > 0) {
            // 记录存在，删除记录
            await query('DELETE FROM liked WHERE client = ? AND merchant = ? AND productName = ?', [client, merchant, productName]);
            return '取消点赞';
        } else {
            // 记录不存在，插入新数据
            await query('INSERT INTO liked (client, merchant, productName, isLiked) VALUES (?, ?, ?, ?)', values);
            return '点赞成功';
        }
    } catch (error) {
        console.log(error);
        return '收藏失败';
    }
}


//获取收藏商品
async function FavoriteProduct(filters) {
    return new Promise((resolve, reject) => {
        const offset = (filters.page - 1) * filters.pageSize; // 计算分页的起始位置
        const queryParams = [filters.client, filters.pageSize, offset];
        
        let query = `
            SELECT p.*
            FROM collection c
            JOIN productinfo p ON c.merchant = p.merchantAddress AND c.productName = p.productName
            WHERE c.client = ?
            LIMIT ? OFFSET ?
        `;

        // 执行查询获取收藏商品的详情
        pool.query(query, queryParams, (error, results) => {
            if (error) {
                return reject(error);
            }
            // 查询收藏商品的总数
            const countQuery = `
                SELECT COUNT(*) AS total
                FROM collection c
                WHERE c.client = ?
            `;
            pool.query(countQuery, [filters.client], (countError, countResults) => {
                if (countError) {
                    return reject(countError);
                }
                // 返回包含分页信息和商品详情的结果
                resolve({
                    data: results, // 当前页的商品列表
                    total: countResults[0].total, // 总条目数

                });
            });
        });
    });
       
       
}

//获取点赞商品
async function LikedProduct(filters) {
    return new Promise((resolve, reject) => {
        const offset = (filters.page - 1) * filters.pageSize; // 计算分页的起始位置
        const queryParams = [filters.client, filters.pageSize, offset];
        
        let query = `
            SELECT p.*
            FROM liked c
            JOIN productinfo p ON c.merchant = p.merchantAddress AND c.productName = p.productName
            WHERE c.client = ?
            LIMIT ? OFFSET ?
        `;

        // 执行查询获取收藏商品的详情
        pool.query(query, queryParams, (error, results) => {
            if (error) {
                return reject(error);
            }
            // 查询收藏商品的总数
            const countQuery = `
                SELECT COUNT(*) AS total
                FROM liked c
                WHERE c.client = ?
            `;
            pool.query(countQuery, [filters.client], (countError, countResults) => {
                if (countError) {
                    return reject(countError);
                }
                // 返回包含分页信息和商品详情的结果
                resolve({
                    data: results, // 当前页的商品列表
                    total: countResults[0].total, // 总条目数

                });
            });
        });
    });
       
       
}




//所有商品信息
// async function productFavorite(client,merchantAddress,productId,productName) {
   
//         // return new Promise((resolve, reject) => {
//         //     let query = `
//         //         SELECT p.*, 
//         //                IFNULL(c.isFavorite, 0) AS isFavorite 
//         //         FROM productinfo p
//         //         LEFT JOIN collection c 
//         //         ON p.productName = c.productName 
//         //         AND p.merchantAddress = c.merchant 
//         //         AND c.client = ? 
//         //         WHERE p.productId = ? 
//         //         AND p.merchantAddress = ? 
//         //         AND p.productName = ?
//         //     `;
//         //     console.log(query);
//         //     let queryParams = [client,productId,merchantAddress,productName];
//         //     pool.query(query, queryParams, function (error, results) {
//         //         if (error) {
//         //             reject(error); // 如果查询出现错误，拒绝Promise并传递错误信息
//         //         } else {
//         //             console.log()
//         //             resolve({ data: results });  
//         //         }
//         //     });
//         // });

//           return new Promise((resolve, reject) => {
//             let query = `
//                 SELECT p.*, 
//                        IFNULL(c.isFavorite, 0) AS isFavorite 
//                 FROM productinfo p
//                 LEFT JOIN collection c 
//                 ON p.productName = c.productName 
//                 AND p.merchantAddress = c.merchant 
//                 AND c.client = ? 
//                 WHERE p.productId = ? 
//                 AND p.merchantAddress = ? 
//                 AND p.productName = ?
//             `;
//             console.log(query);
//             let queryParams = [client,productId,merchantAddress,productName];
//             pool.query(query, queryParams, function (error, results) {
//                 if (error) {
//                     reject(error); // 如果查询出现错误，拒绝Promise并传递错误信息
//                 } else {
//                     console.log()
//                     resolve({ data: results });  
//                 }
//             });
//         });
// }
//所有收藏商品信息
async function productFavorite(client,merchantAddress,productId,productName) {
        //   return new Promise((resolve, reject) => {
        //     let query = `
        //         SELECT p.*, 
        //                IFNULL(c.isFavorite, 0) AS isFavorite
        //         FROM productinfo p
        //         LEFT JOIN collection c 
        //         ON p.productName = c.productName 
        //         AND p.merchantAddress = c.merchant 
        //         AND c.client = ? 
        //         WHERE p.productId = ? 
        //         AND p.merchantAddress = ? 
        //         AND p.productName = ?
        //     `;
        //     console.log(query);
        //     let queryParams = [client,productId,merchantAddress,productName];
        //     pool.query(query, queryParams, function (error, results) {
        //         if (error) {
        //             reject(error); // 如果查询出现错误，拒绝Promise并传递错误信息
        //         } else {
        //             console.log(results)
        //             resolve({ data: results });  
        //         }
        //     });
        // });
        return new Promise((resolve, reject) => {
            let query = `
                SELECT p.*, 
                       IFNULL(c.isFavorite, 0) AS isFavorite,
                       IFNULL(l.isLiked, 0) AS isLiked
                FROM productinfo p
                LEFT JOIN collection c 
                ON p.productName = c.productName 
                AND p.merchantAddress = c.merchant 
                AND c.client = ? 
                LEFT JOIN liked l
                ON p.productName = l.productName 
                AND p.merchantAddress = l.merchant 
                AND l.client = ?
                WHERE p.productId = ? 
                AND p.merchantAddress = ? 
                AND p.productName = ?
            `;
            console.log(query);
            let queryParams = [client, client, productId, merchantAddress, productName];
            pool.query(query, queryParams, function (error, results) {
                if (error) {
                    reject(error); // 如果查询出现错误，拒绝Promise并传递错误信息
                } else {
                    console.log(results);
                    resolve({ data: results });
                }
            });
        });
}


// // //所有点赞商品信息
// async function productLiked(client,merchantAddress,productId,productName) {
//     return new Promise((resolve, reject) => {
//       let query = `
//           SELECT p.*, 
//                  IFNULL(c.isLiked, 0) AS isLiked
//           FROM productinfo p
//           LEFT JOIN liked c 
//           ON p.productName = c.productName 
//           AND p.merchantAddress = c.merchant 
//           AND c.client = ? 
//           WHERE p.productId = ? 
//           AND p.merchantAddress = ? 
//           AND p.productName = ?
//       `;
//       console.log(query);
//       let queryParams = [client,productId,merchantAddress,productName];
//       pool.query(query, queryParams, function (error, results) {
//           if (error) {
//               reject(error); // 如果查询出现错误，拒绝Promise并传递错误信息
//           } else {
//               console.log(results)
//               resolve({ data: results });  
//           }
//       });
//   });
// }

module.exports = {
    purchaseProduct, UserOrderNumberProductIdInfo,ReceivedProduct,UpdateFavorite,FavoriteProduct,productFavorite,LikedProduct,UpdateLiked

}
