const express = require('express');
const bodyParser = require('body-parser');
const userRouter = require('./router/BlockData.js');
const cors = require('cors');
const app = express();
// const expressJWT = require('express-jwt')
// const jwt = require('jsonwebtoken')
app.use(express.urlencoded({extended:false}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
// secret 密钥的本质:就是一个字符串2 
// const secretKey='123456 No1 ^^'
// 使用 app.use()来注册中间件
// expressJWT({ secret:secretKey })就是用来解析 Token 的中间件
//.unless({ path:[/^\/api\//]})用来指定哪些接口不需要访问权限
// app.use(expressJWT.expressjwt({ secret: secretKey,algorithms: ["HS256"]}).unless({ path: [/^\/user\//] }))

app.use('/blockData', userRouter)

app.use(
    function (err, req, res, next) {
        console.log(err)
        res.send("服务在维护中，请稍等，我们正在抢修！")

    }
)
app.listen(8080, () => {
    console.log('express server runing at http://127.0.0.1:8080/')
})