var express = require('express');
var router = express.Router();
const register = require('../author/register.js');
const pagedata = require('../author/pageData.js');
const cardata = require('../author/carOwnerData.js');
const companydata = require('../author/CompanyData.js');
const buyRecorddata = require('../author/buyrecordList.js');

//购买保险
router.post('/shopInsurance', async function (req, res, next) {
    try { 
        var username = req.body.username; 
        var userId = req.body.userId; 
        var carId = req.body.carId; 
        var companyAddress = req.body.companyAddress; 
        var schemeId = req.body.schemeId;
        var schemePrice = req.body.schemePrice;
        var insurancePrice = parseInt(schemePrice); 
        const account = await cardata.getAccount(username)
        var carOwneraddress = await cardata.getcarOwnerAD(userId)
        // console.log(carId)
        // console.log(companyAddress)
        // console.log(schemeId)
        // console.log(insurancePrice)
        // console.log(account[0].privateKey)
        const result =  buyRecorddata.recordInsurance(carOwneraddress,carId,companyAddress,schemeId,'11',insurancePrice,account[0].privateKey);
        result.then((value) => {
            if (value === true) {
                res.send('购买保险成功')
            } else {
                res.send('购买保险失败')
            }
        })
    
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});

//查询车辆信息
router.get('/carData', async function (req, res, next) {
    try {
        var account = req.query.identifier; // 获取前端发送的 identifier 参数
        const caraddress = await cardata.getcarOwnerAD(account)
        const result = await cardata.getCarData(caraddress);
        // console.log(result)
        res.send(result); // 将结果发送给客户端
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});

//获取保险信息
router.get('/insuranceData', async function (req, res, next) {
    try {
        var account = req.query.identifier; // 获取前端发送的 identifier 参数
        // const account = await pagedata.logindata(username)
        const result = await companydata.getInsuranceData(account);
        // console.log(result)
        // console.log(result)
        res.send(result); // 将结果发送给客户端
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});

//添加保险
router.post('/addInsurance', async function (req, res, next) {
    var username = req.body.username; 
    var schemeName = req.body.schemeName;
    var lastTime = req.body.lastTime;   
    var price = req.body.price;
    var payOut = req.body.payOut;
    const account = await pagedata.logindata(username)
    console.log(account[0].privateKey)
    const result = companydata.addInsurance(account[0].privateKey,account[0].userId,schemeName, lastTime, price, payOut);
    result.then((value) => {
        if (value === true) {
            res.send('保险添加成功')
        } else {
            res.send('保险添加失败')
        }
    })

})

//注册公司
router.post('/registerCompany', async function (req, res, next) {
    var username = req.body.username; // 获取前端发送的 identifier 参数
    var userName = req.body.userName;
    var password = req.body.password;
    var phone = req.body.phone;
    var companyNo = req.body.companyNo;
    const account = await pagedata.logindata(username)
    console.log(account[0].privateKey)
    const result =  companydata.registerCompany(account[0].privateKey, userName, password, phone, companyNo);
    result.then((value) => {
        if (value === true) {
            res.send('公司注册成功')
        } else {
            res.send('公司注册失败')
        }
    })

})

//添加车辆
router.post('/addCar', async function (req, res, next) {
    // var username = req.query.identifier; // 获取前端发送的 identifier 参数
    var username = req.body.username;
    var carNumber = req.body.carNumber;
    var carName = req.body.carName;
    var carage = req.body.carAge;
    var carAge = parseInt(carage); // 将 carAge 转换为整数类型
    const account = await cardata.getAccount(username)
    const caraddress = await cardata.getcarOwnerAD(account[0].userId)
    const result = cardata.createCar(caraddress, account[0].privateKey, carNumber, carName, carAge);
    result.then((value) => {
        if (value === true) {
            res.send('添加成功');
        } else {
            res.send('添加失败');
        }
    })
});

router.post('/login', async function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    try {
        const result = await register.login(username, password);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.sendStatus(500); // 服务器错误
    }
});


router.get('/pageData', async function (req, res, next) {
    try {
        const result = await pagedata.pagedata();
        console.log(result);
        res.send(result); // 将结果发送给客户端
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});

//给车主信息返回到右上角
router.get('/loginData', async function (req, res, next) {
    var username = req.query.identifier; // 获取前端发送的 identifier 参数
    try {
        const result = await pagedata.logindata(username);
        res.send(result); // 将结果发送给客户端
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});

//注册
router.post('/register', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var gender = req.body.gender;
    if (gender === '男') {
        gender = true
    } else (
        gender = false
    );
    var phone = req.body.phone;
    const result = register.register(username, password, gender, phone);
    result.then((value) => {
        if (value === true) {
            res.send('注册成功');
        } else if (value === false) {
            res.send('注册失败');
        } else {
            res.send('用户已经存在,请重新输入')
        }
    })
});

module.exports = router;