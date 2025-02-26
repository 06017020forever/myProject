var express = require('express');
var router = express.Router();

const nft = require('../author/nftRegister');


//用户注册
router.post('/nftRegister', async function (req, res, next) {

    var userEmail = req.body.userEmail;
    var password = req.body.password;
    var userAddress = req.body.userAddress;
    const result = nft.nftRegister(userEmail, password, userAddress);
    result.then((value) => {
        console.log(value)
        if (value === '插入成功') {
            res.send('注册成功');
        } else {
            res.send('该邮箱已经注册，请不要重复注册');

        }
    })

});

//记录卖家
router.post('/nftSeller', async function (req, res, next) {
    var name = req.body.name;
    var address = req.body.address;
    var headImage = req.body.headImage;
    var backgroundImage = req.body.backgroundImage;
    var timestamp = req.body.timestamp;
    const result = nft.nftSeller(name, address, headImage, backgroundImage, timestamp);
    result.then((value) => {
        console.log(value)
        if (value === '创建成功') {
            res.send('创建成功');
        } else {
            res.send('该地址已经创建了，请不要重复创建');

        }
    })

});

//商家商品信息展示
router.get('/sellerTotal', async function (req, res, next) {

    try {

        const result = await nft.sellerTotals();

        res.send(result);

    } catch (error) {
        console.error(error);
        res.sendStatus(500); // 服务器错误
    }
});

//获取卖家信息展示
router.post('/sellerData', async function (req, res, next) {

    try {
        var address = req.body.address;
        console.log(address)
        const result = await nft.sellerData(address);
        console.log(result)
        res.send(result);

    } catch (error) {
        console.error(error);
        res.sendStatus(500); // 服务器错误
    }
});

//用户参与空投
router.post('/airDrop', async function (req, res, next) {
    var address = req.body.address;
    var email = req.body.email;
    var timestamp = req.body.timestamp;
    var period = req.body.period;
    var droperaddress = req.body.droperaddress;
    console.log("11",period)
    const result = nft.airDrop(address, email, timestamp,period,droperaddress);
    result.then((value) => {
        console.log(value)
        if (value === '参与成功') {
            res.send('参与成功');
        } else {
            res.send('您已经参与本次空投，请不要重复参与');

        }
    })

});

//获取空投用户
router.post('/airDropUser', async function (req, res, next) {
    try {
        var distributeAmount = req.body.distributeAmount;
        var period = req.body.period;
        var droperaddress = req.body.droperaddress;
        const result = await nft.airDropUser(distributeAmount,period,droperaddress);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.sendStatus(500); // 服务器错误
    }
});

//设置空投时间
router.post('/airDropTime', async function (req, res, next) {
    var startTmie = req.body.startTmie;
    var dropTime = req.body.dropTime;
    var endTime = req.body.endTime;
    var period = req.body.period;
    var droperaddress = req.body.droperaddress;
    const result = nft.nftairTime(startTmie, dropTime, endTime,period,droperaddress);
    result.then((value) => {
        console.log(value)
        if (value === '设置成功') {
            res.send('设置成功');
        } 
    })

});

//获取空投时间
router.post('/getAirDropSetTime', async function (req, res, next) {
    var droperaddress = req.body.droperaddress;
    try {
        const result = await nft.getNftAirTime(droperaddress);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.sendStatus(500); // 服务器错误
    }
});

//存储空投名单
router.post('/addAirList', async function (req, res, next) {
    var address = req.body.address;
    var tokenId = req.body.tokenId;
    var leafHash = req.body.leafHash;
    var merkleProof = req.body.merkleProof;
    var period = req.body.period;
    var droperaddress = req.body.droperaddress;
    console.log(address);
    console.log(tokenId)
    console.log(leafHash)
    console.log(merkleProof)
    console.log(period)
    console.log(droperaddress)
    const result = nft.nftairList(address, tokenId, leafHash,merkleProof,period,droperaddress);
    result.then((value) => {
        console.log(value)
        if (value === '添加成功') {
            res.send('添加成功');
        } 
    })

});

//获取空投用户
router.post('/getAirDropList', async function (req, res, next) {
    try {
        var droperaddress = req.body.droperaddress;
        var period = req.body.period;
        const result = await nft.getAirDropList(period,droperaddress);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.sendStatus(500); // 服务器错误
    }
});

module.exports = router;