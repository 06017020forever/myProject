var express = require('express');
var router = express.Router();
router.get('/index', function (req, res) {
    res.send('index');//render渲染，会把index拼接.html,fs.readfile
 })
 
 //路由，处理业务逻辑
 router.get('/users/login', function (req, res) {
     
     var token =  jwt.sign({ username: req.query.username },secretKey, { expiresIn: '3000s'})
     res.send({status:200,message:"登录成功",token:token});
    //res.send('login');//render渲染，会把index拼接.html,fs.readfile
 })
 module.exports = router;