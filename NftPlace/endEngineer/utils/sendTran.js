const Web3 = require('web3');

//连接区块链
//const web3 = new Web3('https://sepolia.infura.io/v3/b21679fde92f438dbd4be2b70fb2bfcb');
let web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:8545");
/**
 * 
 * @param {*} pkey  私钥
 * @param {*} contractMethods  合约方法,列如 contractMethods = carOwnerListContract.methods.createCarOwner(_AccidentRecordList, _BuyRecordList, username, password, gender, phone)
 * @param {*} contractAddress 合约地址
 */
//
async function creatCarOwnerSignedT(pkey, contractMethods, contractAddress) {
    const fromAddress = web3.eth.accounts.privateKeyToAccount(pkey).address;
    var data = contractMethods.encodeABI();
    const creatCarOwnerTransactionData = {
        from: fromAddress,
        to: contractAddress,
        gas: 5000000,
        data: data
    };

    const signedTransaction = await web3.eth.accounts.signTransaction(creatCarOwnerTransactionData, pkey);

    return receipt
}

module.exports = creatCarOwnerSignedT
