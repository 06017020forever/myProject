var express = require('express');
var router = express.Router();
var axios = require('axios');

//graphl接口调用
//可视化
router.get('/graphl', async function (req, res, next) {
    let data = JSON.stringify({
        query: `{
            blocks (from: 1, to: 14000) {
                number
                transactions {
                    hash
                    from {
                        address
                    }
                    to {
                        address
                    }
                    value
                }
            }
        }`,
        variables: {}
    });


    let config = {
        method: 'get', // 使用 get 方法发送 GraphQL 查询
        maxBodyLength: Infinity,
        url: 'http://127.0.0.1:8545/graphql', // Geth 节点的 GraphQL 接口 URL
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    axios.request(config)
        .then((response) => {
            console.log(response.data)
            res.json(response.data); // 将获取的数据发送给前端
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send('Internal Server Error'); // 发生错误时返回 500 错误
        });
});



// 每页返回的交易记录数量







const PAGE_SIZE = 10;
//交易记录
router.post('/transaction', async function (req, res, next) {
    try {
        // 获取从前端传来的页码参数，默认为第一页
        const page = parseInt(req.body.page) || 1;

        // 计算区块范围，每次查询10个交易记录
        const fromBlock = 1; // 假设从区块1开始
        const toBlock = 14000; // 假设结束在区块14000

        // // // 设置区块范围，只获取交易记录
        // const data = JSON.stringify({
        //     query: `{
        //         blocks (from: ${fromBlock}, to: ${toBlock}) {
        //             number
        //             transactions {
        //                 hash
        //                 from {
        //                     address
        //                 }
        //                 to {
        //                     address
        //                 }
        //                 value
        //             }
        //         }
        //     }`,
        //     variables: {}
        // });
        const data = JSON.stringify({
            query: `{
                blocks (from: ${fromBlock}, to: ${toBlock}) {
                    number
                    timestamp   // 区块时间戳
                    transactions {
                        hash
                        from {
                            address
                        }
                        to {
                            address
                        }
                        value       // 交易金额
                    gasUsed     // 消耗的 gas
                    gasPrice    // 每个 gas 的价格
                    }
                }
            }`,
            variables: {}
        });

        //graphl接口调用
        const config = {
            method: 'post', // 使用 post 方法发送 GraphQL 查询
            maxBodyLength: Infinity,
            url: 'http://127.0.0.1:8545/graphql', // Geth 节点的 GraphQL 接口 URL
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        // 请求区块数据
        const response = await axios.request(config);
        // 获取所有的交易数据
        // const allTransactions = response.data.data.blocks.flatMap(block => block.transactions);
        // 获取所有的交易数据，提取需要的字段
        // const allTransactions = response.data.data.blocks.flatMap(block =>
        //     block.transactions.map(tx => ({

        //         hash: tx.hash,
        //         blockNumber: tx.blockNumber || block.number,  // 交易所在的区块号
        //         timestamp: block.timestamp,   // 交易时间
        //         from: tx.from.address,
        //         to: tx.to?.address || null,   // 有时交易可能没有接收地址
        //         value: tx.value,              // 交易金额
        //         txnFee: txnFee,                // 交易费用
        //     }))
        // );
        // 获取所有的交易数据，提取需要的字段
        const allTransactions = response.data.data.blocks.flatMap(block =>
            block.transactions.map(tx => {
                // 计算交易费用
                const txnFeeWei = tx.gasUsed * tx.gasPrice;
                // 转换为 Ether
                const txnFee = txnFeeWei / 1e18;

                return {
                    hash: tx.hash,
                    blockNumber: tx.blockNumber || block.number,  // 交易所在的区块号
                    timestamp: block.timestamp,   // 交易时间
                    from: tx.from.address,
                    to: tx.to?.address || null,   // 有时交易可能没有接收地址
                    value: tx.value,              // 交易金额
                    txnFee: txnFee                // 交易费用
                };
            })
        );
        // 分页处理，根据 page 和 PAGE_SIZE 返回部分数据
        const startIndex = (page - 1) * PAGE_SIZE;
        const paginatedTransactions = allTransactions.slice(startIndex, startIndex + PAGE_SIZE);
        res.json({
            page,
            totalTransactions: allTransactions.length,
            transactions: paginatedTransactions
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

//搜索
router.post('/search', async function (req, res, next) {
    try {
        const page = parseInt(req.body.page) || 1;
        const searchHash = req.body.hash ? req.body.hash.toLowerCase() : ''; // 获取前端传来的交易哈希

        // 区块范围设置
        const fromBlock = 1; // 假设从区块1开始
        const toBlock = 14000; // 假设结束在区块14000

        // 构建 GraphQL 查询
        const data = JSON.stringify({
            query: `{
                blocks (from: ${fromBlock}, to: ${toBlock}) {
                    number
                    timestamp   // 区块时间戳
                    transactions {
                        hash
                        from {
                            address
                        }
                        to {
                            address
                        }
                        value       // 交易金额
                        gasUsed     // 消耗的 gas
                        gasPrice    // 每个 gas 的价格
                    }
                }
            }`,
            variables: {}
        });

        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://127.0.0.1:8545/graphql',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        // 请求区块数据
        const response = await axios.request(config);

        // 获取所有的交易数据
        // const allTransactions = response.data.data.blocks.flatMap(block => block.transactions);
        // 获取所有的交易数据，提取需要的字段
        // const allTransactions = response.data.data.blocks.flatMap(block =>
        //     block.transactions.map(tx => ({
        //         hash: tx.hash,
        //         blockNumber: tx.blockNumber || block.number,  // 交易所在的区块号
        //         timestamp: block.timestamp,   // 交易时间
        //         from: tx.from.address,
        //         to: tx.to?.address || null,   // 有时交易可能没有接收地址
        //         value: tx.value,              // 交易金额
        //         txnFee: txnFee,    
        //     }))
        // );
        // 获取所有的交易数据，提取需要的字段
        const allTransactions = response.data.data.blocks.flatMap(block =>
            block.transactions.map(tx => {
                // 计算交易费用
                const txnFeeWei = tx.gasUsed * tx.gasPrice;
                // 转换为 Ether
                const txnFee = txnFeeWei / 1e18;

                return {
                    hash: tx.hash,
                    blockNumber: tx.blockNumber || block.number,  // 交易所在的区块号
                    timestamp: block.timestamp,   // 交易时间
                    from: tx.from.address,
                    to: tx.to?.address || null,   // 有时交易可能没有接收地址
                    value: tx.value,              // 交易金额
                    txnFee: txnFee                // 交易费用
                };
            })
        );

        // 过滤匹配的交易记录
        const filteredTransactions = searchHash
            ? allTransactions.filter(transaction => transaction.hash.toLowerCase().includes(searchHash))
            : allTransactions;

        // 分页处理
        const startIndex = (page - 1) * PAGE_SIZE;
        const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + PAGE_SIZE);

        res.json({
            page,
            totalTransactions: filteredTransactions.length,
            transactions: paginatedTransactions
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});



module.exports = router;































































// var express = require('express');
// var router = express.Router();
// var axios = require('axios');

// // Function to get the latest block number
// async function getLatestBlockNumber() {
//     try {
//         const response = await axios.post('http://127.0.0.1:8545', {
//             jsonrpc: "2.0",
//             method: "eth_blockNumber",
//             params: [],
//             id: 1
//         });
//         return parseInt(response.data.result, 16); // Convert hex to decimal
//     } catch (error) {
//         console.error('Error fetching latest block number:', error);
//         return null;
//     }
// }

// // GraphQL API call
// router.get('/graphl', async function (req, res, next) {
//     const latestBlockNumber = await getLatestBlockNumber();

//     if (!latestBlockNumber) {
//         return res.status(500).send('Unable to fetch the latest block number');
//     }

//     let data = JSON.stringify({
//         query: `{
//             blocks (from: 1, to: ${latestBlockNumber}) {
//                 number
//                 transactions {
//                     hash
//                     from {
//                         address
//                     }
//                     to {
//                         address
//                     }
//                     value
//                 }
//             }
//         }`,
//         variables: {}
//     });

//     let config = {
//         method: 'get',
//         maxBodyLength: Infinity,
//         url: 'http://127.0.0.1:8545/graphql',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         data: data
//     };

//     axios.request(config)
//         .then((response) => {
//             res.json(response.data);
//         })
//         .catch((error) => {
//             console.error(error);
//             res.status(500).send('Internal Server Error');
//         });
// });

// module.exports = router;
