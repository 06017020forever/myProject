const Web3 = require('web3');
const carOwnerListABI = require('../contractAbI/carOwnerList.json');
// const carOwnerABI = require('../contractAbi/carOwnerABI.json');
const sendTran = require('../utils/sendTran');
const pool = require('../utils/mysqlUtils')

//连接区块链
let web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:8545");

// 合约的地址 
const CarOwnerListContractAddress = '0x35f7aa64e878b48E85D84b1F9D702FC5bF703943';
const _AccidentRecordList = "0xD6D8A7F26B84EFB80787C9E48000E5E43F52e448";
const _BuyRecordList = "0xf223a3380f1dB6894CD76Ec045b77aC4Bf1484D6";

//abi和合约地址创建合约对象
const carOwnerListContract = new web3.eth.Contract(carOwnerListABI, CarOwnerListContractAddress);

async function signedSendETH(toAccount) {
    const transaction = {
        to: toAccount,
        gas: 5000000,
        value: web3.utils.toWei('1', 'ether'),
    };
    const signedTransaction = await web3.eth.accounts.signTransaction(transaction, 'aa0fe00466dae1bfc27c2dfbd0384ccc912b7e1d27a612c79ba63844576708d1');
    const receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
    console.log(receipt)
    if (receipt.status === false) {
        throw new Error("发送交易币失败！")
    }
}

async function createAccount() {
    //1、创建账号
    var accout = await web3.eth.accounts.create();
    //2、发送交易，所需币
    await signedSendETH(accout.address)
    return accout;
}

// 注册逻辑
async function register(username, password, gender, phone) {
    //3、注册账号,先计入数据库
    //记录私钥到中心化数据库中
    const account = await createAccount();
    const values = [account.address, username, username, password, account.privateKey];
    const query = 'SELECT * FROM userinfo WHERE username = ?';
    const valuesmysql = [username];
    try {
        const data =  await new Promise((resolve, reject) => {
            pool.query(query, valuesmysql, function (err, data, fields) {
                if (err) {
                    reject(err);
                }
                resolve(data);
            });
        });
        if (data.length > 0) {
            return '用户已经存在,请重新输入';
        } else {
            //再记录链
            const contractMethods = await carOwnerListContract.methods.createCarOwner(_AccidentRecordList, _BuyRecordList, username, password, gender, phone)
            const receipt = await sendTran(account.privateKey, contractMethods, CarOwnerListContractAddress)
            return new Promise((resolve, reject) => {
                pool.query('INSERT INTO userinfo (userId, loginusername, username, password, privateKey) VALUES (?, ?, ?, ?, ?)', values, (error, results) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    // 使用查询结果
                    console.log(results);
                    if (receipt.status == true) {
                        resolve(true);
                    } else {
                        reject(false);
                    }
                });
            })
        }
    } catch (error) {
        throw error;
    }


}

//登录逻辑
async function login(username, password) { 
    const query = 'SELECT * FROM userinfo WHERE username = ? and password = ?';
    const values = [username, password];
    try {
        const data = await new Promise((resolve, reject) => {
            pool.query(query, values, function (err, data, fields) {
                if (err) {
                    reject(err);
                }
                console.log(data[0])
                resolve(data);
            });
        });
        if (data.length > 0) {
            return '登录成功';
        } else {
            return '用户名或密码错误';
        }
    } catch (error) {
        throw error;
    }

}


module.exports = {
    register, createAccount, login
}