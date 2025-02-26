var fs = require('fs');//内置模块，安装nodejs就已经存在了
var path = require('path');//内置模块，安装nodejs就已经存在了
function expressfsfile(expressfile,res){
    fs.readFile(path.join(__dirname, '../','views', expressfile),'utf8', function (err, data) {
        if (err) {
            throw err;
        }
        res.send(data)
        console.log('data')
    })
}
module.exports= expressfsfile;