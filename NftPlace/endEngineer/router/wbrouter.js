var express = require('express');
var router = express.Router();

const crypto = require('crypto');
const regLOgin = require('../author/wbregister.js');
const MerchantMangerOperation = require('../author/MerchantMange.js');
const UserMangeOperation = require('../author/UserMange.js');
const { web3, merchantListContract, merchantABI } = require('../contract/secondeContract');

//用户注册
router.post('/registerClient', async function (req, res, next) {

    var username = req.body.username;
    var password = req.body.password;
    var hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    var client = req.body.client;
    // console.log(req.body.gender)
    const gender = req.body.gender === 'true' ? '男' : '女';
    // console.log(gender)
    var phone = req.body.phone;
    var mailbox = req.body.mailbox;
    const result = regLOgin.registerClient(username, hashedPassword, client, gender, phone, mailbox);
    result.then((value) => {
        if (value === '插入成功') {
            res.send('注册成功');
        } else if (value === '‘插入失败') {
            res.send('注册失败');
        } else {
            res.send('用户已经存在,请重新输入')
        }
    })

});

//用户登录
router.post('/loginClient', async function (req, res, next) {
   
    var username = req.body.username;
    var password = req.body.password;
    var account = req.body.account;

    try {
        const result = await regLOgin.loginClient(username, password, account);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.sendStatus(500); // 服务器错误
    }
});

//商家注册
router.post('/registerMerchant', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    var hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    var merchant = req.body.merchant;
    var phone = req.body.phone;
    var storeStar = req.body.storeStar;
    var storedescription = req.body.storedescription;
    var fans = req.body.fans;
    const result = regLOgin.registerMerchant(username, hashedPassword, merchant, phone, storeStar, storedescription, fans);
    result.then((value) => {
        if (value === '插入成功') {
            res.send('注册成功');
        } else if (value === '‘插入失败') {
            res.send('注册失败');
        } else {
            res.send('用户已经存在,请重新输入')
        }
    })

});

//商家登录
router.post('/loginMerchant', async function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var account = req.body.account;
    try {
        const result = await regLOgin.loginMerchant(username, password, account);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.sendStatus(500); // 服务器错误
    }
});

//商家发货
router.post('/deliverProduct', async function (req, res, next) {
    var merchant = req.body.merchantAddress;
    var productName = req.body.productName;
    var orderNumber = req.body.orderNumber;
    var deliveredTime = req.body.currentTime;
    var isDelivered = req.body.isDelivered;
    var client = req.body.clientAddress;
    var productId = req.body.productId;
    try {
        const result = await MerchantMangerOperation.DeliverProduct(merchant, orderNumber, productName, deliveredTime, isDelivered, client, productId);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.sendStatus(500); // 服务器错误
    }
});

//商家上架商品
router.post('/addProduct', async function (req, res, next) {
    var productName = req.body.productName;
    var category = req.body.category;
    var merchantAdd = req.body.merchantAdd;
    var price = req.body.price;
    var number = req.body.number;
    var description = req.body.description;
    var imageHash = req.body.imageHash;
    var currentTime = req.body.currentTime;
    var transactionTime = currentTime;
    var operation = req.body.operation;
    var nonce = req.body.nonce;
    var transactionHash = req.body.transactionHash;
    var blockNumber = req.body.blockNumber;
    try {
        const result = await MerchantMangerOperation.AddProduct(productName, category, price, number, description, imageHash, currentTime, merchantAdd, transactionTime, operation, nonce, blockNumber, transactionHash);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.sendStatus(500); // 服务器错误
    }
});

//所有商品信息展示
router.get('/productinfo', async function (req, res, next) {

    try {
        const filters = {
            productId: req.query.productId,
            category: req.query.category,
            productName: req.query.productName,
            minPrice: req.query.minPrice,
            maxPrice: req.query.maxPrice,
            page: parseInt(req.query.page) || 1,
            pageSize: parseInt(req.query.pageSize) || 4,
        };
        const result = await MerchantMangerOperation.ProductInfo(filters);
        console.log(result.data)
        console.log(result.total)
        res.json({ data: result.data, total: result.total });
    } catch (error) {
        console.error(error);
        res.sendStatus(500); // 服务器错误
    }
});

//确认用户收藏信息
router.get('/productinfo/productId/productFavorite', async function (req, res, next) {
    try {
        merchantAddress = req.Q.merchantAddress;
        productName = req.query.merchantName;
        productID = req.query.productID;
        const result = await UserMangeOperation.productFavorite(merchantAddress, productName, productID);
        console.log(result.data)
        console.log(result.total)
        res.json({ data: result.data, total: result.total });
    } catch (error) {
        console.error(error);
        res.sendStatus(500); // 服务器错误
    }
});

//商家商品信息展示
router.get('/MerchantProductinfo', async function (req, res, next) {

    try {

        account = req.query.account;
        const merchantAddress = await merchantListContract.methods.creatorMerchantMap(account).call();
        const merchantContract = new web3.eth.Contract(merchantABI, merchantAddress);
        const merchantName = await merchantContract.methods.userName().call();
        const filters = {
            account: account,
            merchantAddress: merchantAddress,
            merchantName: merchantName,
            page: parseInt(req.query.page) || 1,
            pageSize: parseInt(req.query.pageSize) || 4,
        };
        const result = await MerchantMangerOperation.MerchantProductInfo(filters);
        // console.log(result.data)
        // console.log(result.total)
        res.json({ data: result.data, total: result.total });
    } catch (error) {
        console.error(error);
        res.sendStatus(500); // 服务器错误
    }
});

//商品详细信息
router.get('/productinfo/productId', async function (req, res, next) {

    try {
        const productId = req.query.productID;
        const merchantName = req.query.merchantName;
        const result = await MerchantMangerOperation.ProductIdInfo(productId, merchantName);
        console.log(result)
        res.json({ data: result.data });
    } catch (error) {
        console.error(error);
        res.sendStatus(500); // 服务器错误
    }
});

//用户购买商品
router.post('/purchaseProduct', async function (req, res, next) {

    var operation = req.body.operation;
    var nonce = req.body.nonce;
    var transactionHash = req.body.transactionHash;
    var blockNumber = req.body.blockNumber;
    var recordId = req.body.recordId;
    var client = req.body.ClientAddress;
    var merchant = req.body.merchantAddress;
    var productId = req.body.productId;
    var merchantName = req.body.merchantName;
    var productName = req.body.productName;
    var category = req.body.category;
    var number = req.body.number;
    var price = req.body.price;
    var orderNumber = req.body.orderNumber;
    var isDelivered = req.body.isDelivered;
    // var deliveredTime = req.body.deliveredTime;
    var isReceived = req.body.isReceived;
    // var receivedTime = req.body.receivedTime;
    var imageHash = req.body.imageHash;
    var buyTime = req.body.currentTime;
    var transactionTime = buyTime;

    try {
        const result = await UserMangeOperation.purchaseProduct(recordId, client, merchant, merchantName, productId, productName, category, buyTime, number, price, orderNumber, isDelivered, isReceived, imageHash, transactionTime, operation, nonce, transactionHash, blockNumber);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.sendStatus(500); // 服务器错误
    }
});

//用户订单
router.get('/userProductinfo', async function (req, res, next) {

    try {
        const filters = {
            client: req.query.client,
            page: parseInt(req.query.page) || 1,
            pageSize: parseInt(req.query.pageSize) || 4,
        };
        const result = await UserMangeOperation.UserOrderNumberProductIdInfo(filters);
        console.log(result)
        res.json({ data: result.data, total: result.total });
    } catch (error) {
        console.error(error);
        res.sendStatus(500); // 服务器错误
    }
});

//确认收货
router.post('/receiveProduct', async function (req, res, next) {
    var client = req.body.clientAddress;
    var merchant = req.body.merchantAddress;
    var orderNumber = req.body.orderNumber;
    var productName = req.body.productName;
    var currentTime = req.body.currentTime;
    var isReceived = req.body.isReceived;
    var productId = req.body.productId;
    try {
        const result = await UserMangeOperation.ReceivedProduct(client, merchant, orderNumber, productName, currentTime, isReceived, productId);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.sendStatus(500); // 服务器错误
    }
});

//收藏商品
router.post('/updateFavorite', async function (req, res, next) {
    try {
        var isFavorite = req.body.isFavorite ? 1 : 0;
        var client = req.body.client;
        var productName = req.body.productName;
        var merchant = req.body.merchantAddress;
        const result = await UserMangeOperation.UpdateFavorite(client, merchant, productName, isFavorite);
        console.log(result);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.sendStatus(500); // 服务器错误
    }
});

//点赞商品
router.post('/updateLiked', async function (req, res, next) {
    try {
        var isLiked = req.body.isLiked ? 1 : 0;
        var client = req.body.client;
        var productName = req.body.productName;
        var merchant = req.body.merchantAddress;
        const result = await UserMangeOperation.UpdateLiked(client, merchant, productName, isLiked);
        console.log(result);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.sendStatus(500); // 服务器错误
    }
});

//获取收藏商品
router.get('/getFavoriteProduct', async function (req, res, next) {
    try {
        const filters = {
            client: req.query.client,
            page: parseInt(req.query.page) || 1,
            pageSize: parseInt(req.query.pageSize) || 4,
        };
        const result = await UserMangeOperation.FavoriteProduct(filters);
        // console.log(result.data)
        // console.log(result.total)
        res.json({ data: result.data, total: result.total });
    } catch (error) {
        console.error(error);
        res.sendStatus(500); // 服务器错误
    }
});

//获取点赞商品
router.get('/getLikedProduct', async function (req, res, next) {
    try {
        const filters = {
            client: req.query.client,
            page: parseInt(req.query.page) || 1,
            pageSize: parseInt(req.query.pageSize) || 4,
        };
        const result = await UserMangeOperation.LikedProduct(filters);
        // console.log(result.data)
        // console.log(result.total)
        res.json({ data: result.data, total: result.total });
    } catch (error) {
        console.error(error);
        res.sendStatus(500); // 服务器错误
    }
});

//所有商品信息展示
router.get('/userinfo', async function (req, res, next) {

    try {
        const filters = {
            productId: req.query.productId,
            category: req.query.category,
            productName: req.query.productName,
            minPrice: req.query.minPrice,
            maxPrice: req.query.maxPrice,
            page: parseInt(req.query.page) || 1,
            pageSize: parseInt(req.query.pageSize) || 4,
        };
        const result = await MerchantMangerOperation.ProductInfo(filters);
        console.log(result.data)
        console.log(result.total)
        res.json({ data: result.data, total: result.total });
    } catch (error) {
        console.error(error);
        res.sendStatus(500); // 服务器错误
    }
});

//用户收藏商品详细信息
router.get('/productinfo/UserProduct', async function (req, res, next) {

    try {
        // console.log('===========================')
        const client = req.query.client;
        const productId = req.query.productId;

        const merchantAddress = req.query.merchantAddress;
        const productName = req.query.productName;
        const result = await UserMangeOperation.productFavorite(client, merchantAddress, productId, productName);

        console.log('dadadd', result)
        res.json({ data: result.data });
    } catch (error) {
        console.error(error);
        res.sendStatus(500); // 服务器错误
    }
});

//商品下架
router.post('/removeProduct', async function (req, res, next) {
    try {

        var productId = req.body.productId;
        var productName = req.body.productName;
        var merchantAddress = req.body.merchantAddress;
        const result = await MerchantMangerOperation.removerProduct(productId, merchantAddress, productName);
        console.log(result);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.sendStatus(500); // 服务器错误
    }
});

//获取追溯信息
router.get('/traceability', async function (req, res, next) {

    try {

        const productId = req.query.productId;
        const merchantAddress = req.query.merchantAddress;
        const result = await MerchantMangerOperation.getProductTraceability(productId, merchantAddress);
        res.json({ data: result.data });
    } catch (error) {
        console.error(error);
        res.sendStatus(500); // 服务器错误
    }
});


module.exports = router;