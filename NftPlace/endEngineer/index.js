//1.引入 required 模块：我们可以使用 require 指令来载入 Node.js 模块。
var http = require('http');
var fs = require('fs');//内置模块，安装nodejs就已经存在了
var path = require('path');//内置模块，安装nodejs就已经存在了
var fsfile = require('./fsfile/fsfile');//内置模块，安装nodejs就已经存在了
const querystring = require('querystring');
var Web3 = require('web3');
const CarOwnerListABI = require('./contractABI/CarOwnerList.json')
 function router(request, response) {
    console.log(request.url);
    console.log(__dirname); //__dirname 2个_,内置的变量
    // console.log(request);
    //3.接收请求与响应请求 服务器很容易创建，客户端可以使用浏览器或终端发送 HTTP 请求，服务器接收请求后返回响应数据。
    request.url = request.url.toLocaleLowerCase();
    request.method = request.method.toLocaleLowerCase();
    //1.路由页面
    if ((request.url === '/' || request.url === '/index') && request.method === 'get') {
        // fs.readFile(path.join(__dirname, 'views', 'login.html'), function (err, data) {
        //     if (err) {
        //         throw err;
        //     }
        //     //加上这个index.html不用加meta
        //     response.writeHead(200, { 'Content-Type': 'text/html ; charset=utf-8' });
        //     response.end(data);
        // })
        fsfile('login.html', response)
    } else if (request.url === '/login' && request.method === 'post') {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString(); // 转换为字符串
        });
        request.on('end', () => {
            const postParams = querystring.parse(body); // 解析POST参数
            console.log(postParams); // 输出POST参数
            if (postParams.username === "123" && postParams.password === "123") {
                // fs.readFile(path.join(__dirname, 'views', 'index.html'), function (err, data) {
                //     if (err) {
                //         throw err;
                //     }
                //     //加上这个index.html不用加meta
                //     response.writeHead(200, { 'Content-Type': 'text/html ; charset=utf-8' });
                //     response.end(data);
                // })
                fsfile('index.html', response)
            }
            // response.end('login success.......' );
        });

    } else if (request.url === '/register' && request.method === 'get') {
        fsfile('register.html', response)

    } else if (request.url === '/doregister' && request.method === 'post') {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString(); // 转换为字符串
        });
        request.on('end', async () => {
            const postParams = querystring.parse(body); // 解析POST参数
            console.log(postParams); // 输出POST参数
            var username = postParams.username
            var password = postParams.password
            var gender = postParams.gender
            if (gender === '男') {
                gender = true
            } else {
                gender = false
            }
            var phone = postParams.phone
            var account = postParams.account


            let web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:8545");
            const CarOwnerListContract = CarOwnerListABI; // 合约的 ABI  

            //var  accidentRecordList = "0x87c92252028bDb9C1F0CC183b5307c0A293a9938";
            //var  buyRecordList="0xc5962276d858D0D13340a00851492B61F4B408e4";
            var carOwnerList = "0xdc3BCbF0b1563BB331dD42E03d50aBc25BE04885";
            //var companyList="0x0200E20B4157cc01e09194cA0a3665251AD50E25"
            //var policerList="0xe7c871f933b15f9301C35cb9f585e8EDb156Cb71"

           await web3.eth.personal.unlockAccount(account, "1234567890", 600000).then(console.log('Account unlocked!'));
            const _AccidentRecordList = "0xbcaa4243048d3F80a6F89A400FcdF2bD2Cd4A630";
            const _BuyRecordList = "0x883BDB5cB7c5fd4F5207F92eBbfa7221451ca2e7";
            const myCarOwnerListContract = new web3.eth.Contract(CarOwnerListContract, carOwnerList);
            myCarOwnerListContract.methods.createCarOwner(_AccidentRecordList, _BuyRecordList, username, password, gender, phone)
                .send({ from: account, gas: '6000000' })
                .on('receipt', function (receipt) {
                    // receipt example
                    if (receipt.status == true) {
                        console.log('注册成功')
                        fsfile('login.html', response)
                    } else {
                        response.end('404,page not found');
                    }
                })
                .on('error', function (error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
                    console.error('Error sending transaction:', error);
                });

        });

    } else {
        response.writeHead(404, 'not found', { 'Content-Type': 'text/html ; charset=utf-8' });
        response.end('404,page not found');
    }
    //response.writeHead(200, {'Content-Type': 'text/plain ; charset=utf-8'});
    // 发送响应数据 "Hello World"
    //response.end('Hello World你好\n');
}

//2.创建服务器：服务器可以监听客户端的请求，类似于 Apache 、Nginx 等 HTTP 服务器。
http.createServer(router).listen(8888);
// 终端打印如下信息
console.log('Server running at http://127.0.0.1:8888/');




/*function createServer(router){
   var req ,res;
   //router(req ,res);
    ///sdfdsfadfadfafa
}

function r(request,response){
 ///sdfdsfadfadfafa
}

createServer(r);*/
