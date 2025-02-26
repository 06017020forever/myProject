var fs = require('fs');//内置模块，安装nodejs就已经存在了
var path = require('path');//内置模块，安装nodejs就已经存在了

function fsfile(file,response){
    fs.readFile(path.join(__dirname, '../','views', file), function (err, data) {
        if (err) {
            throw err;
        }
        //加上这个index.html不用加meta
        response.writeHead(200, { 'Content-Type': 'text/html ; charset=utf-8' });
        response.end(data);
    })
}

module.exports= fsfile;