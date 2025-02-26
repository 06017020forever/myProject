const express = require('express')
var fs = require('fs');//内置模块，安装nodejs就已经存在了
var path = require('path');//内置模块，安装nodejs就已经存在了
const app = express()
var Web3 = require('web3');
// const CarOwnerListABI = require('./contractABI/carOwnerList.json')
var expressfsfile = require('./fsfile/expressfsfile');//内置模块，安装nodejs就已经存在了
var cors = require('cors');
//get接口
// app.use('/login',express.static('views'));
app.use(express.urlencoded({extended:false}))
app.use(cors());
app.get('/', (req, res) => {
//   fs.readFile(path.join(__dirname,'views','register.html'),'utf8',function(err,data){
//     res.send(data)
//     console.log('data')
//  })
expressfsfile('register.html',res)
  
})
 
app.post('/doregister', async(req, res) => {
  const postParams = req.body
  if (postParams.gender === '男') {
    postParams.gender = true
  } else {
    postParams.gender = false
  }
  let web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:8545");
  const CarOwnerListContract = CarOwnerListABI; // 合约的 ABI  
     
  var carOwnerList = "0x27eEDcAA9De5FE1c4938a933e14C1Ea8fD328399";
//  await web3.eth.personal.unlockAccount(postParams.account, "1234567890", 600000).then((console.log('Account unlocked!')))
   
    const _AccidentRecordList = "0x8C61e7dC382FB4Fe88Bf2b1eC4CBC76179982C85";
    const _BuyRecordList = "0x0bf8631F5ea1b785B16292ca2e603796386B6c6e";
    const myCarOwnerListContract = new web3.eth.Contract(CarOwnerListContract, carOwnerList);
    myCarOwnerListContract.methods.createCarOwner(_AccidentRecordList, _BuyRecordList, postParams.username, postParams.password, postParams.gender, postParams.phone)
        .send({ from: postParams.account, gas: '6000000' })
        .on('receipt', function (receipt) {
            // receipt example
            if (receipt.status == true) {
                console.log('注册成功')
                expressfsfile('login.html', res)
            } else {
                response.end('404,page not found');
            }
        
       
        });
    
    });

  
app.listen(8080,()=>{
  console.log('express server runing at http://127.0.0.1:8080')
})
  // web3.eth.personal.unlockAccount(postParams.account, "1234567890", 600000).then(()=>{
  // console.log('Account unlocked!')
  // const _AccidentRecordList = "0xA227BD56dEbbB712D8A9B3Ac992E5182E70c8C7B";
  // const _BuyRecordList = "0xB6502f71f99B109A708781EC09c6e8BcC98ff1D6";
  // const myCarOwnerListContract = new web3.eth.Contract(CarOwnerListContract, carOwnerList);
  // myCarOwnerListContract.methods.createCarOwner(_AccidentRecordList, _BuyRecordList, postParams.username, postParams.password, postParams.gender, postParams.phone)
  //     .send({ from: postParams.account, gas: '6000000' })
  //     .on('receipt', function (receipt) {
  //         // receipt example
  //         if (receipt.status == true) {
  //             console.log('注册成功')
  //             fsfile('login.html', response)
  //         } else {
  //             response.end('404,page not found');
  //         }
  //     })
  //     .on('error', function (error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
  //         console.error('Error sending transaction:', error);
  //     });
  
  // });