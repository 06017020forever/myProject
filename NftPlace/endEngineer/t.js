//1.引入 required 模块：我们可以使用 require 指令来载入 Node.js 模块。
var http = require('http');
var fs = require('fs');//内置模块，安装nodejs就已经存在了
var path = require('path');//内置模块，安装nodejs就已经存在了
const querystring = require('querystring');
var Web3 = require('web3');
const CarOwnerListABI=require('./contractABI/CarOwnerList.json')
const express = require('express');
const app = express();

app.engine('html', require('ejs').renderFile); // 渲染HTML文件。
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 创建一个简单的路由
app.get('/', (req, res) => {
    res.render('login.html');
});

// function router(request, response) {
//     console.log(request.url);
//     console.log(__dirname); //__dirname 2个_,内置的变量
//     // console.log(request);
//     //3.接收请求与响应请求 服务器很容易创建，客户端可以使用浏览器或终端发送 HTTP 请求，服务器接收请求后返回响应数据。
//     request.url = request.url.toLocaleLowerCase();
//     request.method = request.method.toLocaleLowerCase();
//     //1.路由页面
//     if ((request.url === '/' || request.url === '/index') && request.method === 'get') {
//         fs.readFile(path.join(__dirname, 'views', 'login.html'), function (err, data) {
//             if (err) {
//                 throw err;
//             }
//             //加上这个index.html不用加meta
//             response.writeHead(200, { 'Content-Type': 'text/html ; charset=utf-8' });
//             response.end(data);
//         })
//     } else if (request.url === '/login' && request.method === 'post') {
//         let body = '';
//         request.on('data', chunk => {
//             body += chunk.toString(); // 转换为字符串
//         });
//         request.on('end', () => {
//             const postParams = querystring.parse(body); // 解析POST参数
//             console.log(postParams); // 输出POST参数
//             if(postParams.usename===postParams.password){
//                 fs.readFile(path.join(__dirname,'views','i.html'),function(err,data){
        
//                     if(err){
//                         throw err;
//                     }
//                      //加上这个index.html不用加meta
//             response.writeHead(200, { 'Content-Type': 'text/html ; charset=utf-8' });
//             response.end(data);
//                 })
//             }
//             response.end('login success.......' );
//         });
       
//     } else if (request.url === '/register' && request.method === 'get') {
//         fs.readFile(path.join(__dirname,'views','register.html'),function(err,data){
        
//             if(err){
//                 throw err;
//             }
//                  //加上这个index.html不用加meta
//          response.writeHead(200, { 'Content-Type': 'text/html ; charset=utf-8' });
//          response.end(data);
//         })
//     } else if (request.url === '/doregister' && request.method === 'post') {
    app.post('/login', (req, res) => {//处理用户登录POST请求
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); // 转换为字符串
        });
        req.on('end', () => {
            const postParams = querystring.parse(body); // 解析POST参数
    
            if (postParams.usename ===  postParams.password) {
                res.render('index.html');
            } else {
                res.status(404).send('404, Page Not Found');
            }
        });
    });
    
    app.get('/register', (req, res) => {
        res.render('register.html');
    });
    
    app.post('/doregister', (req, res) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); // 转换为字符串
        });
        req.on('end', () => {
            const postParams = querystring.parse(body); // 解析POST参数
            console.log(postParams); // 输出POST参数
            // 处理注册逻辑
            var username = postParams.username;
            var password = postParams.password;
            var gender = postParams.gender;
            var phone = postParams.phone;
            var geth_account = postParams.geth_account;
    
            let web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:8545");
            const CarOwnerListContract = CarOwnerListABI; // 合约的 ABI  
            var carOwnerList = "0xA6184e7f9d43b66b910Cf7a232d0f382fA043efE"; // 合约地址
           
            // web3.eth.personal.unlockAccount(geth_account, "1234567890", 60000)
            //     .then(() => {
            
            const _AccidentRecordList = "0xedb2ABFcDb450d679D93320dcCA1A393B9E84f76";
            const _BuyRecordList = "0x439A0753ED8cD5738a2E558B42A9f8E7642c1740";
            const myCarOwnerListContract = new web3.eth.Contract(CarOwnerListContract, carOwnerList);
            myCarOwnerListContract.methods.createCarOwner(_AccidentRecordList, _BuyRecordList, username, password, gender, phone)
                .send({ from: account, gas: '6000000' })
                .on('receipt', function (receipt) {
                    // receipt example
                    if (receipt.status == true) {
                        fs.readFile(path.join(__dirname, 'views', 'index.html'), function (err, data) {
                            if (err) {
                                throw err;
                            }
                            //加上这个index.html不用加meta
                            response.writeHead(200, { 'Content-Type': 'text/html ; charset=utf-8' });
                            response.end(data);
        
                        })
                       
                    } else {
                        response.end('404,page not found');
                    }
                })
                .on('error', function (error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
                    console.error('Error sending transaction:', error);
                    response.end('404,page not found');
                });

          

        });
    });
              
    
        
    
     // 启动服务器
     const server = app.listen(8081, () => {
        const host = server.address().address;
        const port = server.address().port;
        console.log(`Server running at http://127.0.0.1:8081/`);
    });
//     response.writeHead(200, {'Content-Type': 'text/plain ; charset=utf-8'});
//     发送响应数据 "Hello World"
//     response.end('Hello World你好\n');
// }   

// //2.创建服务器：服务器可以监听客户端的请求，类似于 Apache 、Nginx 等 HTTP 服务器。
// http.createServer(router).listen(8888);
// 终端打印如下信息
// console.log('Server running at http://127.0.0.1:8888/');