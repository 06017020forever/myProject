const Web3 = require('web3');
//连接区块链
let web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:8545");
const sendTran = require('../utils/sendTran');
const buyRecordListABI = require('../contractAbI/buyRecordList.json');
// const carOwnerABI = require('../contractAbI/carOwner.json');


//合约的地址 
const CarOwnerListContractAddress = '0x35f7aa64e878b48E85D84b1F9D702FC5bF703943';
const BuyRecordListAddress = "0xf223a3380f1dB6894CD76Ec045b77aC4Bf1484D6";
async function recordInsurance(carOwneraddress, carId, insuranceCompanyaddress, insuranceId, insuranceStarTime, insurancePrice,carownerPrivatekey) {
    const BuyRecordListcontract = new web3.eth.Contract(buyRecordListABI, BuyRecordListAddress);
    const contractMethods = await BuyRecordListcontract.methods.addBuyRecord(CarOwnerListContractAddress, carOwneraddress, carId, insuranceCompanyaddress, insuranceId, insuranceStarTime, insurancePrice);
    const receipt = await sendTran(carownerPrivatekey, contractMethods, BuyRecordListAddress)
    if(receipt.status == true){
       return true;
    }else{
        return false;
    }
}


module.exports = {
    recordInsurance
}