var express = require('express');
const expressJWT = require('express-jwt')
const jwt = require('jsonwebtoken')
const indexRouter = require('./router/index.js');
var app = express();
const cors = require('cors');
app.use(cors());
//secret 密钥的本质:就是一个字符串2 
const secretKey='123456 No1 ^^'
// 使用 app.use()来注册中间件
// expressJWT({ secret:secretKey })就是用来解析 Token 的中间件
//.unless({ path:[/^\/api\//]})用来指定哪些接口不需要访问权限
app.get('/index', function (req, res) {
   res.send('index');//render渲染，会把index拼接.html,fs.readfile
})

//路由，处理业务逻辑
app.get('/users/login', function (req, res) {
    
    var token =  jwt.sign({ username: req.query.username },secretKey, { expiresIn: '3000s'})
    res.send({status:200,message:"登录成功",token:token});
   //res.send('login');//render渲染，会把index拼接.html,fs.readfile
})
app.use(expressJWT.expressjwt({ secret: secretKey,algorithms: ["HS256"]}).unless({ path: [/^\/users\//] }))
// app.use('/user', indexRouter)



var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("应用实例，访问地址为 http://%s:%s", host, port)

})