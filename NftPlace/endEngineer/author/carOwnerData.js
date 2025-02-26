const Web3 = require('web3');
const carOwnerABI = require('../contractAbI/carOwner.json');
const carOwnerListABI = require('../contractAbI/carOwnerList.json');
const pool = require('../utils/mysqlUtils')
//连接区块链
let web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:8545");
const sendTran = require('../utils/sendTran');



//合约的地址 
const CarOwnerListContractAddress = '0x35f7aa64e878b48E85D84b1F9D702FC5bF703943';
//abi和合约地址创建合约对象
const carOwnerListContract = new web3.eth.Contract(carOwnerListABI, CarOwnerListContractAddress);

//得到车主合约列表地址
async function getcarOwnerAD(address) {
    const caraddress = await carOwnerListContract.methods.creatorOwnerMap(address).call()
    return caraddress
}

//添加车辆
async function createCar(address,privateKey, carNumber, carName, carAge) {
    const CarOwnerContractAddress = address;
    const carOwnerContract = await new web3.eth.Contract(carOwnerABI, CarOwnerContractAddress);
    const contractMethods =  carOwnerContract.methods.addCar(carNumber, carName, carAge);
    const receipt = await sendTran(privateKey, contractMethods, CarOwnerContractAddress)
    if (receipt.status == true) {
        return true;
    } else {
        return false;
    }
}

//获取车主合约拥有者地址
async function getAccount(username) {
    const query = 'SELECT * FROM userinfo WHERE username = ?';
    const valuesmysql = [username];
    return await new Promise((resolve, reject) => {
        pool.query(query, valuesmysql, function (err, data, fields) {
            if (err) {
                reject(err);
            }
            resolve(data);
        });
    });

}

//获取车辆信息
async function getCarData(address){
    const CarOwnerContractAddress = address;
    const carOwnerContract = await new web3.eth.Contract(carOwnerABI, CarOwnerContractAddress);
    // const result =  carOwnerContract.methods.getCarIds();
    try {
        const carIds = await carOwnerContract.methods.getCarIds().call();
        const carData = [];

        for (let i = 0; i < carIds.length; i++) {
          const carId = carIds[i];
          const carInfo = await carOwnerContract.methods.getCarInfoById(carId).call(); // 假设有一个名为 getCarInfo 的函数用于获取车辆信息
          carData.push(carInfo);
        }
       
        // 在这里处理车辆信息并返回给前端
        return carData;
      } catch (error) {
        console.error("获取车辆信息失败:", error);
        // 处理错误情况
        return null;
      }
}

//添加购买保险记录
module.exports = {
    getcarOwnerAD, createCar, getAccount,getCarData
}