const Web3 = require('web3');
const pool = require('../utils/mysqlUtils')
//连接区块链
let web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:8545");
const sendTran = require('../utils/sendTran');
const companyListABI = require('../contractAbI/companyList.json');
const companyABI = require('../contractAbI/company.json');


// 合约的地址 
const CompanyListContractAddress = '0xA9f6c606E008Eb9eD2467bC08813dCaaeb2Ed4a1';
const _AccidentRecordList = "0xD6D8A7F26B84EFB80787C9E48000E5E43F52e448";
const _BuyRecordList = "0xf223a3380f1dB6894CD76Ec045b77aC4Bf1484D6";

//abi和合约地址创建合约对象
const companyListContract = new web3.eth.Contract(companyListABI, CompanyListContractAddress);

//公司注册逻辑
async function registerCompany(privateKey, userName, password, phone, companyNo) {
    const contractMethods = await companyListContract.methods.createCompany(_AccidentRecordList, _BuyRecordList, userName, password, phone, companyNo)
    const receipt = await sendTran(privateKey, contractMethods, CompanyListContractAddress)
    if (receipt.status == true) {
        return true;
    } else {
        return false;
    }
}

// 添加保险逻辑
async function addInsurance(privateKey, address, schemeName, lastTime, price, payOut) {
    const CompanyContractAddress = await companyListContract.methods.creatorCompanyMap(address).call()
    const companyContract = await new web3.eth.Contract(companyABI, CompanyContractAddress);
    const contractMethods = await companyContract.methods.addScheme(schemeName, lastTime, price, payOut)
    const receipt = await sendTran(privateKey, contractMethods, CompanyContractAddress)
    if (receipt.status == true) {
        return true;
    } else {
        return false;
    }

}

//获取保险信息
async function getInsuranceData(address) {
    try {
        // const CompanyContractAddress = await companyListContract.methods.creatorCompanyMap(address).call()
        // const companyContract = await new web3.eth.Contract(companyABI, CompanyContractAddress);
        const companyListDta = await companyListContract.methods.getCompanyList().call();
        const allCompanySchemeData =[];
        for (i = 0; i < companyListDta.length; i++) {
            // console.log(companyListDta.length)
            const companyContract = await new web3.eth.Contract(companyABI, companyListDta[i]);
            // const companyData = [];
            const CompanyInfo = await companyContract.methods.getCompanyInfo().call();
            CompanyInfo.companyAddress = companyListDta[i];
            CompanyInfo.schemeInfo = [];
            // console.log(CompanyInfo)
            // companyData.push(CompanyInfo);
            //const schemeData = [];
            const schemeIds = await companyContract.methods.getSchemeIds().call();
            for (let i = 0; i < schemeIds.length; i++) {
                const schemeId = schemeIds[i];
                const schemeInfo = await companyContract.methods.getSchemeInfoById(schemeId).call(); // 假设有一个名为 getCarInfo 的函数用于获取车辆信息
                //schemeData.push(schemeInfo);
                CompanyInfo.schemeInfo.push(schemeInfo)
            }
            // companyData.push(CompanyInfo);
            allCompanySchemeData.push(CompanyInfo);
          
        }
        // console.log(allCompanySchemeData)
        return  allCompanySchemeData

    } catch (error) {
        console.error("获取保险信息失败:", error);
        // 处理错误情况
        return null;
    }
}

module.exports = {
    registerCompany, addInsurance, getInsuranceData
}