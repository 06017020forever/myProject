const pool = require('../utils/mysqlUtils')
const { merchantListContract, merchantABI } = require('../contract/secondeContract')
const Web3 = require('web3');
let web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:8545");



//自己的商品信息//商品详细信息
async function ProductIdInfo(productId, merchantName) {
    return new Promise((resolve, reject) => {
        let query = 'SELECT * FROM productinfo WHERE productId= ? AND merchantName=?';
        let queryParams = [productId, merchantName];
        pool.query(query, queryParams, function (error, results) {
            if (error) {
                reject(error); // 如果查询出现错误，拒绝Promise并传递错误信息
            } else {
                resolve({ data: results });

            }
        });

    });
}

//商品上架逻辑
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

//添加商品
// const currentDate = new Date(currentTime * 1000); // 将秒转换为毫秒
// const formattedDate = currentDate.getFullYear() + '-' + 
//                   ('0' + (currentDate.getMonth() + 1)).slice(-2) + '-' + 
//                   ('0' + currentDate.getDate()).slice(-2) + ' ' + 
//                   ('0' + currentDate.getHours()).slice(-2) + ':' + 
//                   ('0' + currentDate.getMinutes()).slice(-2) + ':' + 
//                   ('0' + currentDate.getSeconds()).slice(-2);
// async function AddProduct(productName, category, price, number, description, imageHash, account,currentTime,merchantAdd,transactionTime,productId,operation,nonce,blockNumber,transactionHash) {

//                       merchantAdd,transactionTime,productId,operation,nonce,blockNumber,transactionHash
//     const  formattedDate =  convertTimestampToDateTime(currentTime);
//     const merchantAddress = await merchantListContract.methods.creatorMerchantMap(account).call();
//     const merchantContract = new web3.eth.Contract(merchantABI, merchantAddress);   // const result = merchantContract.methods.getProductInfoByName(productName).call();
//     const result = await merchantContract.methods.getProductInfoByName(productName).call();
//     console.log(result[6]);
//     const merchantName = await merchantContract.methods.userName().call();
//     const onSale = result[6] === 'true' || result[6] === true ? "售卖中" : "停止售卖";
//     const values = [result[0], productName, merchantName, merchantAddress, category, price, number, description, onSale, imageHash, formattedDate];
//     //计入数据库
//     pool.query('INSERT INTO productinfo (productId,productName,merchantName,merchantAddress,category,price,number,description,onSale,imageHash,timestamp) VALUES (?,?,?,?,?,?,?,?,?,?,?)', values, (error, results) => {
//         if (error) {
//             console.log(error)
//             return;
//         }
//     });
//     return '添加成功';

// }
async function AddProduct(productName, category, price, number, description, imageHash, currentTime,merchantAdd,transactionTime,operation,nonce,blockNumber,transactionHash) {
   
        try {
            const formattedDate = convertTimestampToDateTime(currentTime);
            // const merchantAddress = await merchantListContract.methods.creatorMerchantMap(account).call();
            const merchantContract = new web3.eth.Contract(merchantABI, merchantAdd);
            const result = await merchantContract.methods.getProductInfoByName(productName).call();
            const merchantName = await merchantContract.methods.userName().call();
            const onSale = result[6] === 'true' || result[6] === true ? "售卖中" : "停止售卖";
            const values = [result[0], productName, merchantName, merchantAdd, category, price, number, description, onSale, imageHash, formattedDate];

            // 插入 productinfo 表
            pool.query('INSERT INTO productinfo (productId, productName, merchantName, merchantAddress, category, price, number, description, onSale, imageHash, timestamp) VALUES (?,?,?,?,?,?,?,?,?,?,?)', values, (error, results) => {
                if (error) {
                    console.log(error);
              
                    return;
                }
                console.log('Product info added successfully.');

                // 插入 traceability 表
                const formattedDate1 = convertTimestampToDateTime(transactionTime);
                const traceValues = [result[0], merchantAdd, merchantAdd,productName, operation, nonce, blockNumber, transactionHash, formattedDate1];
                pool.query('INSERT INTO traceability (productId,merchantAddress, address, productName, operation, nonce, blockNumber, transactionHash, transactionTime) VALUES (?,?,?,?,?,?,?,?,?)', traceValues, (error, results) => {
                    if (error) {
                        console.log(error);
                        return;
                    }
                });
               
            });
            return '添加成功';
        } catch (error) {
            console.log(error);
          
        }
    


}


//商品下架逻辑
async function removerProduct(productId, merchantAddress, productName) {
    const values = [productId, merchantAddress, productName];
    return new Promise((resolve, reject) => {
        // 查询数据库中是否存在该商品
        pool.query('SELECT * FROM productinfo WHERE productId = ? AND merchantAddress = ? AND productName = ?', values, (error, results) => {
            if (error) {
                console.log(error);
                return resolve('下架失败');
            }
            if (results.length > 0) {
                // 存在该商品，执行删除操作
                pool.query('DELETE FROM productinfo WHERE productId = ? AND merchantAddress = ? AND productName = ?', values, (error, results) => {
                    if (error) {
                        console.log(error);
                        return resolve('下架失败');
                    }
                    return resolve('下架成功');
                });
            } else {
                // 不存在该商品
                return resolve('下架失败');
            }
        });
    });

}


//所有的展示商品信息
async function ProductInfo(filters) {
    return new Promise((resolve, reject) => {
        let query = 'SELECT * FROM productinfo WHERE 1=1';
        let queryParams = [];



        if (filters.category) {
            query += ' AND category = ?';
            queryParams.push(filters.category);
        }
        if (filters.productName) {
            query += ' AND productName LIKE ?';
            queryParams.push(`%${filters.productName}%`);
        }
        if (filters.minPrice) {
            query += ' AND price >= ?';
            queryParams.push(Number(filters.minPrice));
        }
        if (filters.maxPrice) {
            query += ' AND price <= ?';
            queryParams.push(Number(filters.maxPrice));
        }

        // 分页
        const offset = (filters.page - 1) * filters.pageSize;
        query += ' LIMIT ? OFFSET ?';
        queryParams.push(filters.pageSize, offset);

        pool.query(query, queryParams, (error, results) => {
            if (error) {
                return reject(error);
            }
            pool.query('SELECT COUNT(*) AS total FROM productinfo WHERE 1=1', queryParams.slice(0, -2), (countError, countResults) => {
                if (countError) {
                    return reject(countError);
                }
                resolve({ data: results, total: countResults[0].total });
            });

        });

    });
}

//商家展示商品信息
async function MerchantProductInfo(filters) {
    // return new Promise((resolve, reject) => {

    //     let query = 'SELECT * FROM productinfo WHERE 1=1';
    //     let queryParams = [];

    //     if (filters.merchantName) {
    //         query += ' AND merchantName = ?';
    //         queryParams.push(`%${filters.merchantName}%`);
    //     }
    //     if (filters.merchantAddress) {
    //         query += 'AND merchantAddress = ?';
    //         queryParams.push(`%${filters.merchantAddress}%`);
    //     }
    //     // // 分页
    //     const offset = (filters.page - 1) * filters.pageSize;
    //     query += ' LIMIT ? OFFSET ?';
    //     queryParams.push(filters.pageSize, offset);

    //     // 复制过滤条件的参数用于计数查询
    //     let countQuery = 'SELECT COUNT(*) AS total FROM productinfo WHERE 1=1';
    //     let countQueryParams = [];

    //     if (filters.merchantName) {
    //         countQuery += ' AND merchantName = ?';
    //         countQueryParams.push(filters.merchantName);
    //     }
    //     if (filters.merchantAddress) {
    //         countQuery += ' AND merchantAddress = ?';
    //         countQueryParams.push(filters.merchantAddress);
    //     }

    //     pool.query(query, queryParams, (error, results) => {
    //         if (error) {
    //             return reject(error);
    //         }
    //         pool.query(countQuery, countQueryParams, (countError, countResults) => {
    //             if (countError) {
    //                 return reject(countError);
    //             }
    //             console.log(results);
    //             resolve({ data: results, total: countResults[0].total });
    //         });
    //     });

    // });
    //商家展示商品信息

    return new Promise((resolve, reject) => {

        let query = 'SELECT * FROM productinfo WHERE 1=1';
        let queryParams = [];

        if (filters.merchantName) {
            query += ' AND merchantName = ?';
            queryParams.push(filters.merchantName);
        }
        if (filters.merchantAddress) {
            query += ' AND merchantAddress = ?';
            queryParams.push(filters.merchantAddress);
        }
        // 分页
        const offset = (filters.page - 1) * filters.pageSize;
        query += ' LIMIT ? OFFSET ?';
        queryParams.push(filters.pageSize, offset);

        // 复制过滤条件的参数用于计数查询
        let countQuery = 'SELECT COUNT(*) AS total FROM productinfo WHERE 1=1';
        let countQueryParams = [];

        if (filters.merchantName) {
            countQuery += ' AND merchantName = ?';
            countQueryParams.push(filters.merchantName);
        }
        if (filters.merchantAddress) {
            countQuery += ' AND merchantAddress = ?';
            countQueryParams.push(filters.merchantAddress);
        }

        pool.query(query, queryParams, (error, results) => {
            if (error) {
                return reject(error);
            }
            pool.query(countQuery, countQueryParams, (countError, countResults) => {
                if (countError) {
                    return reject(countError);
                }
                console.log(results);
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

//商品发货逻辑
async function DeliverProduct(merchant, orderNumber, productName, deliveredTime1, isDelivered, client, productId) {


    const deliveredTime = convertTimestampToDateTime(deliveredTime1)
    const values = [isDelivered, deliveredTime, client, merchant, productId, productName, orderNumber];

    //更新发货时间已经发货状态
    pool.query('UPDATE orderlist SET isDelivered =  ?, deliveredTime = ?  WHERE client = ? AND merchant=? AND productId=? AND productName=? AND orderNumber=? ', values, (updateError, updateResults) => {
        if (updateError) {
            console.log(updateError);
            return;
        }
        console.log('发货成功');
    });

    return '发货成功';

}


//获取商品对应追溯信息

//商品发货逻辑
async function getProductTraceability(productId,merchantAddress) {
    return new Promise((resolve, reject) => {
        let query = 'SELECT * FROM traceability WHERE productId= ? AND merchantAddress=?';
        let queryParams = [productId, merchantAddress];
        pool.query(query, queryParams, function (error, results) {
            if (error) {
                reject(error); // 如果查询出现错误，拒绝Promise并传递错误信息
            } else {
                resolve({ data: results });

            }
        });

    });

}


module.exports = {
    AddProduct, ProductInfo, ProductIdInfo, MerchantProductInfo, DeliverProduct, removerProduct,getProductTraceability
}